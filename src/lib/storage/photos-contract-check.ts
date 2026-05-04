import type {
  ListingPhoto,
  ListingPhotoStorageSummary,
  SaveListingPhotoInput,
} from "@/types/listing-photo";
import {
  clearListingPhotos,
  deleteListingPhoto,
  getListingCoverPhoto,
  getListingPhotos,
  getListingPhotoStorageSummary,
  saveListingPhoto,
} from "@/lib/storage/photos";

async function assertPhotoStorageContract(input: SaveListingPhotoInput) {
  const savedPhoto: ListingPhoto = await saveListingPhoto(input);
  const listingPhotos: readonly ListingPhoto[] = await getListingPhotos(
    input.listingId,
  );
  const coverPhoto: ListingPhoto | null = await getListingCoverPhoto(
    input.listingId,
  );
  const summary: ListingPhotoStorageSummary =
    await getListingPhotoStorageSummary();

  await deleteListingPhoto(savedPhoto.id);
  await clearListingPhotos(input.listingId);

  return {
    savedPhoto,
    listingPhotos,
    coverPhoto,
    summary,
  };
}

void assertPhotoStorageContract;