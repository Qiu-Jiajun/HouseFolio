export function getStorageProviderName() {
  return "local-first";
}

export * from "@/lib/storage/photos";
export type {
  ListingPhotoStorageProvider,
  ListingPhotoStorageRegistry,
} from "@/lib/storage/provider";