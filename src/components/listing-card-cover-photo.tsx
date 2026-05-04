"use client";

import { useEffect, useState } from "react";

import {
  getListingCoverPhoto,
  getListingPhotoBlob,
  getListingPhotoThumbnailBlob,
} from "@/lib/storage/photos";

type ListingCardCoverPhotoProps = Readonly<{
  listingId: string;
  title: string;
}>;

export function ListingCardCoverPhoto({
  listingId,
  title,
}: ListingCardCoverPhotoProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let objectUrl: string | null = null;

    async function loadCoverPhoto() {
      setPhotoUrl(null);

      try {
        const coverPhoto = await getListingCoverPhoto(listingId);

        if (!coverPhoto) {
          return;
        }

        const thumbnailBinary =
          await getListingPhotoThumbnailBlob(coverPhoto.id);
        const photoBinary =
          thumbnailBinary ?? (await getListingPhotoBlob(coverPhoto.id));

        if (!photoBinary) {
          return;
        }

        objectUrl = URL.createObjectURL(photoBinary.blob);

        if (isCancelled) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
          return;
        }

        setPhotoUrl(objectUrl);
      } catch {
        if (!isCancelled) {
          setPhotoUrl(null);
        }
      }
    }

    void loadCoverPhoto();

    return () => {
      isCancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [listingId]);

  if (!photoUrl) {
    return null;
  }

  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <img
        src={photoUrl}
        alt={title}
        className="h-40 w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}