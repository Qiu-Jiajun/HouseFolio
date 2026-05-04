import type {
  ListingPhoto,
  ListingPhotoBinary,
  ListingPhotoStorageSummary,
  SaveListingPhotoInput,
} from "@/types/listing-photo";
import type { ListingPhotoStorageProvider } from "@/lib/storage/provider";

const providerKind = "localIndexedDb" as const;

function createNotImplementedError(methodName: string): Error {
  return new Error(
    `Local photo storage provider method is not implemented yet: ${methodName}`,
  );
}

export function createLocalPhotoProvider(): ListingPhotoStorageProvider {
  return {
    kind: providerKind,

    async savePhoto(_input: SaveListingPhotoInput): Promise<ListingPhoto> {
      throw createNotImplementedError("savePhoto");
    },

    async getPhotos(_listingId: string): Promise<readonly ListingPhoto[]> {
      return [];
    },

    async getCoverPhoto(_listingId: string): Promise<ListingPhoto | null> {
      return null;
    },

    async getPhotoBlob(_photoId: string): Promise<ListingPhotoBinary | null> {
      return null;
    },

    async getThumbnailBlob(
      _photoId: string,
    ): Promise<ListingPhotoBinary | null> {
      return null;
    },

    async deletePhoto(_photoId: string): Promise<void> {
      throw createNotImplementedError("deletePhoto");
    },

    async clearPhotosForListing(_listingId: string): Promise<void> {
      return;
    },

    async getStorageSummary(): Promise<ListingPhotoStorageSummary> {
      return {
        provider: providerKind,
        photoCount: 0,
        totalSizeBytes: 0,
      };
    },
  };
}