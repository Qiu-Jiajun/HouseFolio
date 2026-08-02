"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { zhCN } from "@/content/zh-cn";
import type { LocationSuggestion } from "@/lib/lbs/provider";
import type { LocationSuggestionResponseBody } from "@/types/location-suggestion-route";

type LocationSuggestionInputProps = {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  onSuggestionSelect?: (suggestion: LocationSuggestion) => void;
  placeholder: string;
  city?: string;
};

type SuggestionStatus = "idle" | "loading" | "empty" | "error";

export type LocationSelection = {
  name: string;
  district: string;
  address: string;
};

export function formatSuggestionValue(
  suggestion: LocationSelection,
): string {
  return Array.from(
    new Set(
      [suggestion.name, suggestion.district].filter(
        (value) => value.trim().length > 0,
      ),
    ),
  ).join(" ");
}

function formatSuggestionContext(suggestion: LocationSuggestion): string {
  return [suggestion.district, suggestion.address]
    .filter((value) => value.trim().length > 0)
    .join(" · ");
}

export function LocationSuggestionInput({
  id,
  value,
  onValueChange,
  onSuggestionSelect,
  placeholder,
  city = "010",
}: LocationSuggestionInputProps) {
  const reactId = useId().replaceAll(":", "");
  const listboxId = `${reactId}-location-suggestions`;
  const statusId = `${reactId}-location-suggestion-status`;
  const selectedValueRef = useRef<string | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const requestGenerationRef = useRef(0);
  const isFocusedRef = useRef(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [status, setStatus] = useState<SuggestionStatus>("idle");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    const keywords = value.trim();
    const requestGeneration = ++requestGenerationRef.current;

    if (selectedValueRef.current === value) {
      const resetId = window.setTimeout(() => {
        setSuggestions([]);
        setStatus("idle");
        setIsOpen(false);
      }, 0);

      return () => window.clearTimeout(resetId);
    }

    if (keywords.length < 2) {
      const resetId = window.setTimeout(() => {
        setSuggestions([]);
        setStatus("idle");
        setIsOpen(false);
        setIsMock(false);
      }, 0);

      return () => window.clearTimeout(resetId);
    }

    const controller = new AbortController();
    requestControllerRef.current = controller;
    const timeoutId = window.setTimeout(async () => {
      if (requestGeneration !== requestGenerationRef.current) {
        return;
      }

      setStatus("loading");

      try {
        const response = await fetch("/api/lbs/poi/tips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keywords,
            city,
          }),
          signal: controller.signal,
        });
        const payload =
          (await response.json()) as LocationSuggestionResponseBody;

        if (
          controller.signal.aborted ||
          requestGeneration !== requestGenerationRef.current
        ) {
          return;
        }

        if (!response.ok) {
          setSuggestions([]);
          setStatus("error");
          setIsOpen(false);
          setIsMock(false);
          return;
        }

        setSuggestions(payload.suggestions);
        setStatus(payload.suggestions.length > 0 ? "idle" : "empty");
        setIsOpen(
          isFocusedRef.current && payload.suggestions.length > 0,
        );
        setActiveIndex(0);
        setIsMock(payload.isMock === true);
      } catch (error) {
        if (
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }

        setSuggestions([]);
        setStatus("error");
        setIsOpen(false);
        setIsMock(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();

      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
      }
    };
  }, [city, value]);

  function selectSuggestion(suggestion: LocationSuggestion) {
    const nextValue = formatSuggestionValue(suggestion);
    requestGenerationRef.current += 1;
    requestControllerRef.current?.abort();
    selectedValueRef.current = nextValue;
    onValueChange(nextValue);
    onSuggestionSelect?.(suggestion);
    setSuggestions([]);
    setStatus("idle");
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (activeIndex + 1) % suggestions.length;
      setActiveIndex(nextIndex);
      window.requestAnimationFrame(() => {
        document
          .getElementById(`${listboxId}-option-${nextIndex}`)
          ?.scrollIntoView({ block: "nearest" });
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex =
        (activeIndex - 1 + suggestions.length) % suggestions.length;
      setActiveIndex(nextIndex);
      window.requestAnimationFrame(() => {
        document
          .getElementById(`${listboxId}-option-${nextIndex}`)
          ?.scrollIntoView({ block: "nearest" });
      });
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
    }
  }

  const activeOptionId =
    isOpen && suggestions.length > 0
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  return (
    <div className="relative mt-2">
      <input
        id={id}
        value={value}
        onChange={(event) => {
          requestGenerationRef.current += 1;
          requestControllerRef.current?.abort();
          selectedValueRef.current = null;
          setSuggestions([]);
          setStatus("idle");
          setIsOpen(false);
          setIsMock(false);
          setActiveIndex(0);
          onValueChange(event.target.value);
        }}
        onFocus={() => {
          isFocusedRef.current = true;

          if (suggestions.length > 0) {
            setIsOpen(true);
          }
        }}
        onBlur={() => {
          isFocusedRef.current = false;
          setIsOpen(false);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        aria-describedby={statusId}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-slate-400"
      />

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 p-2 shadow-2xl shadow-black/40"
        >
          {suggestions.map((suggestion, index) => {
            const context = formatSuggestionContext(suggestion);

            return (
              <button
                key={suggestion.id}
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectSuggestion(suggestion)}
                className={`block w-full rounded-lg px-3 py-2 text-left ${
                  index === activeIndex
                    ? "bg-slate-800"
                    : "hover:bg-slate-900"
                }`}
              >
                <span className="block text-sm font-medium text-white">
                  {suggestion.name}
                </span>
                {context ? (
                  <span className="mt-1 block text-xs leading-5 text-slate-400">
                    {context}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className="mt-2 text-xs leading-5 text-slate-500"
      >
        {status === "loading"
          ? zhCN.locationSuggestionInput.loading
          : status === "empty"
            ? zhCN.locationSuggestionInput.empty
            : status === "error"
              ? zhCN.locationSuggestionInput.unavailable
              : isMock
                ? zhCN.locationSuggestionInput.mockNotice
                : zhCN.locationSuggestionInput.hint}
      </p>
    </div>
  );
}
