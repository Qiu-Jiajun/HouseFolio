import { createLocalPhotoProvider } from "@/lib/storage/local-photo-provider";
import type {
  ListingPhoto,
  ListingPhotoBinary,
  ListingPhotoStorageSummary,
  SaveListingPhotoInput,
} from "@/types/listing-photo";

const activePhotoProvider = createLocalPhotoProvider();

export async function saveListingPhoto(
  input: SaveListingPhotoInput,
): Promise<ListingPhoto> {
  return activePhotoProvider.savePhoto(input);
}

export async function getListingPhotos(
  listingId: string,
): Promise<readonly ListingPhoto[]> {
  return activePhotoProvider.getPhotos(listingId);
}

export async function getListingCoverPhoto(
  listingId: string,
): Promise<ListingPhoto | null> {
  return activePhotoProvider.getCoverPhoto(listingId);
}

export async function getListingPhotoBlob(
  photoId: string,
): Promise<ListingPhotoBinary | null> {
  return activePhotoProvider.getPhotoBlob(photoId);
}

export async function getListingPhotoThumbnailBlob(
  photoId: string,
): Promise<ListingPhotoBinary | null> {
  return activePhotoProvider.getThumbnailBlob(photoId);
}

export async function deleteListingPhoto(photoId: string): Promise<void> {
  return activePhotoProvider.deletePhoto(photoId);
}

export async function clearListingPhotos(listingId: string): Promise<void> {
  return activePhotoProvider.clearPhotosForListing(listingId);
}

export async function getListingPhotoStorageSummary(): Promise<ListingPhotoStorageSummary> {
  return activePhotoProvider.getStorageSummary();
}