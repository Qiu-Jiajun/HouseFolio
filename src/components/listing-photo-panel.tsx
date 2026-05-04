"use client";

import { useEffect, useRef, useState } from "react";
import { zhCN } from "@/content/zh-cn";
import {
  deleteListingPhoto,
  getListingPhotoBlob,
  getListingPhotos,
  saveListingPhoto,
} from "@/lib/storage/photos";
import type { ListingPhoto } from "@/types/listing-photo";

type ListingPhotoPanelProps = {
  listingId: string;
  listingTitle: string;
};

type PhotoPreview = Readonly<{
  photo: ListingPhoto;
  objectUrl: string;
}>;

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxPhotoSizeBytes = 5 * 1024 * 1024;

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes >= 1024 * 1024) {
    return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`;
  }

  if (sizeBytes >= 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${sizeBytes} B`;
}

export function ListingPhotoPanel({
  listingId,
  listingTitle,
}: ListingPhotoPanelProps) {
  const [photos, setPhotos] = useState<readonly PhotoPreview[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  function revokePreviewUrls() {
    for (const objectUrl of objectUrlsRef.current) {
      URL.revokeObjectURL(objectUrl);
    }

    objectUrlsRef.current = [];
  }

  async function reloadPhotos() {
    setErrorMessage(null);

    const listingPhotos = await getListingPhotos(listingId);
    const nextPreviews: PhotoPreview[] = [];
    const nextObjectUrls: string[] = [];

    try {
      for (const photo of listingPhotos) {
        const binary = await getListingPhotoBlob(photo.id);

        if (!binary) {
          continue;
        }

        const objectUrl = URL.createObjectURL(binary.blob);
        nextObjectUrls.push(objectUrl);

        nextPreviews.push({
          photo,
          objectUrl,
        });
      }

      revokePreviewUrls();
      objectUrlsRef.current = nextObjectUrls;
      setPhotos(nextPreviews);
    } catch (error) {
      for (const objectUrl of nextObjectUrls) {
        URL.revokeObjectURL(objectUrl);
      }

      throw error;
    }
  }

  useEffect(() => {
    let isActive = true;

    async function loadInitialPhotos() {
      try {
        await reloadPhotos();

        if (isActive) {
          setIsLoaded(true);
        }
      } catch {
        if (isActive) {
          setErrorMessage(zhCN.listingPhotoPanel.errors.loadFailed);
          setIsLoaded(true);
        }
      }
    }

    void loadInitialPhotos();

    return () => {
      isActive = false;
      revokePreviewUrls();
    };
  }, [listingId]);

  async function handlePhotoSelected(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    setStatusMessage(null);
    setErrorMessage(null);

    if (!file) {
      return;
    }

    if (!allowedMimeTypes.has(file.type)) {
      setErrorMessage(zhCN.listingPhotoPanel.errors.unsupportedType);
      input.value = "";
      return;
    }

    if (file.size > maxPhotoSizeBytes) {
      setErrorMessage(zhCN.listingPhotoPanel.errors.fileTooLarge);
      input.value = "";
      return;
    }

    setIsSaving(true);

    try {
      await saveListingPhoto({
        listingId,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        sourceBlob: file,
      });

      await reloadPhotos();
      setStatusMessage(zhCN.listingPhotoPanel.messages.saved);
      input.value = "";
    } catch {
      setErrorMessage(zhCN.listingPhotoPanel.errors.saveFailed);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeletePhoto(photoId: string) {
    setStatusMessage(null);
    setErrorMessage(null);
    setDeletingPhotoId(photoId);

    try {
      await deleteListingPhoto(photoId);
      await reloadPhotos();
      setStatusMessage(zhCN.listingPhotoPanel.messages.deleted);
    } catch {
      setErrorMessage(zhCN.listingPhotoPanel.errors.deleteFailed);
    } finally {
      setDeletingPhotoId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            {zhCN.listingPhotoPanel.eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            {zhCN.listingPhotoPanel.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {zhCN.listingPhotoPanel.description}
          </p>
        </div>

        <label className="inline-flex cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200">
          {isSaving
            ? zhCN.listingPhotoPanel.actions.saving
            : zhCN.listingPhotoPanel.actions.addPhoto}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={isSaving}
            aria-label={`${zhCN.listingPhotoPanel.actions.addPhoto} - ${listingTitle}`}
            onChange={handlePhotoSelected}
          />
        </label>
      </div>

      <div className="mt-5 rounded-xl border border-amber-800/80 bg-amber-950/40 p-4">
        <p className="text-sm leading-6 text-amber-100">
          {zhCN.listingPhotoPanel.localOnlyNotice}
        </p>
      </div>

      {statusMessage ? (
        <p className="mt-4 text-sm text-emerald-300">{statusMessage}</p>
      ) : null}

      {errorMessage ? (
        <p className="mt-4 text-sm text-amber-300">{errorMessage}</p>
      ) : null}

      {!isLoaded ? (
        <p className="mt-5 text-sm text-slate-500">{zhCN.common.pending}</p>
      ) : photos.length > 0 ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map(({ photo, objectUrl }) => (
            <article
              key={photo.id}
              className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
            >
              <img
                src={objectUrl}
                alt={`${zhCN.listingPhotoPanel.photoAltPrefix}${photo.fileName}`}
                className="h-40 w-full object-cover"
              />

              <div className="space-y-3 p-4">
                <div>
                  <p className="truncate text-sm font-medium text-white">
                    {photo.fileName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatFileSize(photo.sizeBytes)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void handleDeletePhoto(photo.id);
                  }}
                  disabled={deletingPhotoId === photo.id}
                  className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:text-slate-600"
                >
                  {deletingPhotoId === photo.id
                    ? zhCN.listingPhotoPanel.actions.deleting
                    : zhCN.listingPhotoPanel.actions.deletePhoto}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-slate-700 bg-slate-950 p-5">
          <p className="text-sm font-medium text-white">
            {zhCN.listingPhotoPanel.empty.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {zhCN.listingPhotoPanel.empty.description}
          </p>
        </div>
      )}
    </div>
  );
}