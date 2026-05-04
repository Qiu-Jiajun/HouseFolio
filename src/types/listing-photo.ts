export type ListingPhotoStorageProviderKind = "localIndexedDb";

export type ListingPhoto = Readonly<{
  id: string;
  listingId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
  isCover: boolean;
  storageProvider: ListingPhotoStorageProviderKind;
  localObjectKey: string;
  thumbnailObjectKey?: string;
}>;

export type SaveListingPhotoInput = Readonly<{
  listingId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  sourceBlob: Blob;
  thumbnailBlob?: Blob;
  width?: number;
  height?: number;
  isCover?: boolean;
}>;

export type ListingPhotoStorageSummary = Readonly<{
  provider: ListingPhotoStorageProviderKind;
  photoCount: number;
  totalSizeBytes: number;
}>;

export type ListingPhotoBinary = Readonly<{
  photo: ListingPhoto;
  blob: Blob;
}>;