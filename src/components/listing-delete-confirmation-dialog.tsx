"use client";

import { useEffect } from "react";
import { zhCN } from "@/content/zh-cn";

type ListingDeleteConfirmationDialogProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ListingDeleteConfirmationDialog({
  isOpen,
  isDeleting,
  onCancel,
  onConfirm,
}: ListingDeleteConfirmationDialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDeleting, isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label={zhCN.listingDeleteDialog.cancel}
        className="absolute inset-0 bg-[#17120d]/70"
        disabled={isDeleting}
        onClick={onCancel}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-delete-dialog-title"
        aria-describedby="listing-delete-dialog-description"
        className="relative z-10 w-full max-w-lg rounded-[1.5rem] border border-[#e3dacb] bg-[#fffaf2] p-6 shadow-[0_28px_90px_rgba(23,18,13,0.32)] sm:p-7"
      >
        <h2
          id="listing-delete-dialog-title"
          className="text-2xl font-semibold leading-8 text-[#241814]"
        >
          {zhCN.listingDeleteDialog.title}
        </h2>

        <p
          id="listing-delete-dialog-description"
          className="mt-4 text-sm leading-7 text-[#4b4037]"
        >
          {zhCN.listingDeleteDialog.description}
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-full border border-[#b9ab98] bg-white px-5 py-3 text-sm font-medium text-[#423a31] transition hover:bg-[#f3eadf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f5f4d] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {zhCN.listingDeleteDialog.cancel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-full bg-[#8f1f1b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#741713] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b63b31] disabled:cursor-not-allowed disabled:bg-[#6d3935]"
          >
            {isDeleting
              ? zhCN.listingDeleteDialog.deleting
              : zhCN.listingDeleteDialog.confirm}
          </button>
        </div>
      </section>
    </div>
  );
}
