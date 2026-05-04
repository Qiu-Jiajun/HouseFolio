import type {
  ListingPhoto,
  ListingPhotoBinary,
  ListingPhotoStorageProviderKind,
  ListingPhotoStorageSummary,
  SaveListingPhotoInput,
} from "@/types/listing-photo";

export type ListingPhotoStorageProvider = Readonly<{
  kind: ListingPhotoStorageProviderKind;
  savePhoto: (input: SaveListingPhotoInput) => Promise<ListingPhoto>;
  getPhotos: (listingId: string) => Promise<readonly ListingPhoto[]>;
  getCoverPhoto: (listingId: string) => Promise<ListingPhoto | null>;
  getPhotoBlob: (photoId: string) => Promise<ListingPhotoBinary | null>;
  getThumbnailBlob: (photoId: string) => Promise<ListingPhotoBinary | null>;
  deletePhoto: (photoId: string) => Promise<void>;
  clearPhotosForListing: (listingId: string) => Promise<void>;
  clearAllPhotos: () => Promise<void>;
  getStorageSummary: () => Promise<ListingPhotoStorageSummary>;
}>;

export type ListingPhotoStorageRegistry = Readonly<{
  activeProvider: ListingPhotoStorageProvider;
}>;