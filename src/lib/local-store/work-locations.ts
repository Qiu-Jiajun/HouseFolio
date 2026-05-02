import type { WorkLocation } from "@/types/work-location";

export const WORK_LOCATIONS_STORAGE_KEY = "housefolio:work-locations";

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadWorkLocations(): WorkLocation[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(WORK_LOCATIONS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveWorkLocations(workLocations: WorkLocation[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    WORK_LOCATIONS_STORAGE_KEY,
    JSON.stringify(workLocations)
  );
}

export function addWorkLocation(
  input: Omit<WorkLocation, "id" | "createdAt" | "updatedAt">
): WorkLocation {
  const now = new Date().toISOString();

  const nextWorkLocation: WorkLocation = {
    id: `work-location-${Date.now()}`,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  const existingWorkLocations = loadWorkLocations();

  saveWorkLocations([nextWorkLocation, ...existingWorkLocations]);

  return nextWorkLocation;
}

export function deleteWorkLocation(workLocationId: string) {
  const existingWorkLocations = loadWorkLocations();

  saveWorkLocations(
    existingWorkLocations.filter(
      (workLocation) => workLocation.id !== workLocationId
    )
  );
}