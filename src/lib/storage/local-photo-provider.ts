import type {
  ListingPhoto,
  ListingPhotoBinary,
  ListingPhotoStorageSummary,
  SaveListingPhotoInput,
} from "@/types/listing-photo";
import type { ListingPhotoStorageProvider } from "@/lib/storage/provider";

const providerKind = "localIndexedDb" as const;
const databaseName = "housefolio-photo-storage";
const databaseVersion = 1;
const photosStoreName = "photos";
const blobsStoreName = "blobs";

type PhotoBlobKind = "original" | "thumbnail";

type StoredPhotoBlob = Readonly<{
  objectKey: string;
  photoId: string;
  kind: PhotoBlobKind;
  blob: Blob;
  createdAt: string;
}>;

function createUnavailableError(): Error {
  return new Error("IndexedDB is not available in this environment.");
}

function getIndexedDb(): IDBFactory {
  if (typeof indexedDB === "undefined") {
    throw createUnavailableError();
  }

  return indexedDB;
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onerror = () => {
      reject(request.error ?? new Error("IndexedDB request failed."));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.onerror = () => {
      reject(transaction.error ?? new Error("IndexedDB transaction failed."));
    };

    transaction.onabort = () => {
      reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
    };

    transaction.oncomplete = () => {
      resolve();
    };
  });
}

function ensurePhotosStoreIndexes(store: IDBObjectStore) {
  if (!store.indexNames.contains("listingId")) {
    store.createIndex("listingId", "listingId", { unique: false });
  }

  if (!store.indexNames.contains("isCover")) {
    store.createIndex("isCover", "isCover", { unique: false });
  }

  if (!store.indexNames.contains("createdAt")) {
    store.createIndex("createdAt", "createdAt", { unique: false });
  }
}

function openPhotoDatabase(): Promise<IDBDatabase> {
  const factory = getIndexedDb();

  return new Promise((resolve, reject) => {
    const request = factory.open(databaseName, databaseVersion);

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open photo database."));
    };

    request.onupgradeneeded = () => {
      const database = request.result;

      const photosStore = database.objectStoreNames.contains(photosStoreName)
        ? request.transaction?.objectStore(photosStoreName)
        : database.createObjectStore(photosStoreName, { keyPath: "id" });

      if (!photosStore) {
        throw new Error("Failed to initialize photos store.");
      }

      ensurePhotosStoreIndexes(photosStore);

      if (!database.objectStoreNames.contains(blobsStoreName)) {
        database.createObjectStore(blobsStoreName, { keyPath: "objectKey" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

function createPhotoId(): string {
  if (globalThis.crypto && "randomUUID" in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }

  return `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createObjectKey(photoId: string, kind: PhotoBlobKind): string {
  return `photo:${photoId}:${kind}`;
}

function sortPhotosByCreatedAt(
  photos: readonly ListingPhoto[],
): readonly ListingPhoto[] {
  return [...photos].sort((left, right) =>
    left.createdAt.localeCompare(right.createdAt),
  );
}

function getPhotosByListingId(
  store: IDBObjectStore,
  listingId: string,
): Promise<readonly ListingPhoto[]> {
  const index = store.index("listingId");

  return requestToPromise<ListingPhoto[]>(
    index.getAll(listingId) as IDBRequest<ListingPhoto[]>,
  ).then(sortPhotosByCreatedAt);
}

async function getPhotoById(
  store: IDBObjectStore,
  photoId: string,
): Promise<ListingPhoto | null> {
  const photo = await requestToPromise<ListingPhoto | undefined>(
    store.get(photoId) as IDBRequest<ListingPhoto | undefined>,
  );

  return photo ?? null;
}

async function getStoredBlobByObjectKey(
  store: IDBObjectStore,
  objectKey: string,
): Promise<StoredPhotoBlob | null> {
  const record = await requestToPromise<StoredPhotoBlob | undefined>(
    store.get(objectKey) as IDBRequest<StoredPhotoBlob | undefined>,
  );

  return record ?? null;
}

async function updateCoverPhotoIfNeeded(
  photosStore: IDBObjectStore,
  listingId: string,
  now: string,
) {
  const photos = await getPhotosByListingId(photosStore, listingId);

  if (photos.length === 0) {
    return;
  }

  if (photos.some((photo) => photo.isCover)) {
    return;
  }

  const firstPhoto = photos[0];

  await requestToPromise(
    photosStore.put({
      ...firstPhoto,
      isCover: true,
      updatedAt: now,
    }),
  );
}

export function createLocalPhotoProvider(): ListingPhotoStorageProvider {
  return {
    kind: providerKind,

    async savePhoto(input: SaveListingPhotoInput): Promise<ListingPhoto> {
      const database = await openPhotoDatabase();
      const now = new Date().toISOString();
      const photoId = createPhotoId();
      const originalObjectKey = createObjectKey(photoId, "original");
      const thumbnailObjectKey = input.thumbnailBlob
        ? createObjectKey(photoId, "thumbnail")
        : undefined;

      const transaction = database.transaction(
        [photosStoreName, blobsStoreName],
        "readwrite",
      );
      const photosStore = transaction.objectStore(photosStoreName);
      const blobsStore = transaction.objectStore(blobsStoreName);

      try {
        const existingPhotos = await getPhotosByListingId(
          photosStore,
          input.listingId,
        );
        const shouldSetAsCover = input.isCover ?? existingPhotos.length === 0;

        if (shouldSetAsCover) {
          for (const photo of existingPhotos) {
            if (photo.isCover) {
              await requestToPromise(
                photosStore.put({
                  ...photo,
                  isCover: false,
                  updatedAt: now,
                }),
              );
            }
          }
        }

        await requestToPromise(
          blobsStore.put({
            objectKey: originalObjectKey,
            photoId,
            kind: "original",
            blob: input.sourceBlob,
            createdAt: now,
          } satisfies StoredPhotoBlob),
        );

        if (input.thumbnailBlob && thumbnailObjectKey) {
          await requestToPromise(
            blobsStore.put({
              objectKey: thumbnailObjectKey,
              photoId,
              kind: "thumbnail",
              blob: input.thumbnailBlob,
              createdAt: now,
            } satisfies StoredPhotoBlob),
          );
        }

        const photo: ListingPhoto = {
          id: photoId,
          listingId: input.listingId,
          fileName: input.fileName,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          width: input.width,
          height: input.height,
          createdAt: now,
          updatedAt: now,
          isCover: shouldSetAsCover,
          storageProvider: providerKind,
          localObjectKey: originalObjectKey,
          thumbnailObjectKey,
        };

        await requestToPromise(photosStore.put(photo));
        await transactionToPromise(transaction);

        return photo;
      } finally {
        database.close();
      }
    },

    async getPhotos(listingId: string): Promise<readonly ListingPhoto[]> {
      const database = await openPhotoDatabase();
      const transaction = database.transaction(photosStoreName, "readonly");
      const photosStore = transaction.objectStore(photosStoreName);

      try {
        const photos = await getPhotosByListingId(photosStore, listingId);
        await transactionToPromise(transaction);

        return photos;
      } finally {
        database.close();
      }
    },

    async getCoverPhoto(listingId: string): Promise<ListingPhoto | null> {
      const database = await openPhotoDatabase();
      const transaction = database.transaction(photosStoreName, "readonly");
      const photosStore = transaction.objectStore(photosStoreName);

      try {
        const photos = await getPhotosByListingId(photosStore, listingId);
        await transactionToPromise(transaction);

        return (
          photos.find((photo) => photo.isCover) ??
          photos[0] ??
          null
        );
      } finally {
        database.close();
      }
    },

    async getPhotoBlob(photoId: string): Promise<ListingPhotoBinary | null> {
      const database = await openPhotoDatabase();
      const transaction = database.transaction(
        [photosStoreName, blobsStoreName],
        "readonly",
      );
      const photosStore = transaction.objectStore(photosStoreName);
      const blobsStore = transaction.objectStore(blobsStoreName);

      try {
        const photo = await getPhotoById(photosStore, photoId);

        if (!photo) {
          await transactionToPromise(transaction);
          return null;
        }

        const blobRecord = await getStoredBlobByObjectKey(
          blobsStore,
          photo.localObjectKey,
        );

        await transactionToPromise(transaction);

        if (!blobRecord) {
          return null;
        }

        return {
          photo,
          blob: blobRecord.blob,
        };
      } finally {
        database.close();
      }
    },

    async getThumbnailBlob(
      photoId: string,
    ): Promise<ListingPhotoBinary | null> {
      const database = await openPhotoDatabase();
      const transaction = database.transaction(
        [photosStoreName, blobsStoreName],
        "readonly",
      );
      const photosStore = transaction.objectStore(photosStoreName);
      const blobsStore = transaction.objectStore(blobsStoreName);

      try {
        const photo = await getPhotoById(photosStore, photoId);

        if (!photo || !photo.thumbnailObjectKey) {
          await transactionToPromise(transaction);
          return null;
        }

        const blobRecord = await getStoredBlobByObjectKey(
          blobsStore,
          photo.thumbnailObjectKey,
        );

        await transactionToPromise(transaction);

        if (!blobRecord) {
          return null;
        }

        return {
          photo,
          blob: blobRecord.blob,
        };
      } finally {
        database.close();
      }
    },

    async deletePhoto(photoId: string): Promise<void> {
      const database = await openPhotoDatabase();
      const now = new Date().toISOString();
      const transaction = database.transaction(
        [photosStoreName, blobsStoreName],
        "readwrite",
      );
      const photosStore = transaction.objectStore(photosStoreName);
      const blobsStore = transaction.objectStore(blobsStoreName);

      try {
        const photo = await getPhotoById(photosStore, photoId);

        if (!photo) {
          await transactionToPromise(transaction);
          return;
        }

        await requestToPromise(blobsStore.delete(photo.localObjectKey));

        if (photo.thumbnailObjectKey) {
          await requestToPromise(blobsStore.delete(photo.thumbnailObjectKey));
        }

        await requestToPromise(photosStore.delete(photo.id));

        if (photo.isCover) {
          await updateCoverPhotoIfNeeded(
            photosStore,
            photo.listingId,
            now,
          );
        }

        await transactionToPromise(transaction);
      } finally {
        database.close();
      }
    },

    async clearPhotosForListing(listingId: string): Promise<void> {
      const database = await openPhotoDatabase();
      const transaction = database.transaction(
        [photosStoreName, blobsStoreName],
        "readwrite",
      );
      const photosStore = transaction.objectStore(photosStoreName);
      const blobsStore = transaction.objectStore(blobsStoreName);

      try {
        const photos = await getPhotosByListingId(photosStore, listingId);

        for (const photo of photos) {
          await requestToPromise(blobsStore.delete(photo.localObjectKey));

          if (photo.thumbnailObjectKey) {
            await requestToPromise(
              blobsStore.delete(photo.thumbnailObjectKey),
            );
          }

          await requestToPromise(photosStore.delete(photo.id));
        }

        await transactionToPromise(transaction);
      } finally {
        database.close();
      }
    },

    async clearAllPhotos(): Promise<void> {
      const database = await openPhotoDatabase();
      const transaction = database.transaction(
        [photosStoreName, blobsStoreName],
        "readwrite",
      );
      const photosStore = transaction.objectStore(photosStoreName);
      const blobsStore = transaction.objectStore(blobsStoreName);

      try {
        await requestToPromise(photosStore.clear());
        await requestToPromise(blobsStore.clear());
        await transactionToPromise(transaction);
      } finally {
        database.close();
      }
    },

    async getStorageSummary(): Promise<ListingPhotoStorageSummary> {
      const database = await openPhotoDatabase();
      const transaction = database.transaction(photosStoreName, "readonly");
      const photosStore = transaction.objectStore(photosStoreName);

      try {
        const photos = await requestToPromise<ListingPhoto[]>(
          photosStore.getAll() as IDBRequest<ListingPhoto[]>,
        );
        await transactionToPromise(transaction);

        return {
          provider: providerKind,
          photoCount: photos.length,
          totalSizeBytes: photos.reduce(
            (total, photo) => total + photo.sizeBytes,
            0,
          ),
        };
      } finally {
        database.close();
      }
    },
  };
}
