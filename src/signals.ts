import { signal } from "@preact/signals";
import { MatchMode } from "./constants";
import type { MatchFilters } from "./types";

export const matchFilters: MatchFilters = {
	matchString: signal<string>(""),
	regexEnabled: signal<boolean>(true),
	matchAll: signal<boolean>(true),
	matchMode: signal<MatchMode>(MatchMode.FileNameOnly),
};

export const loadedFiles = signal<string[]>([]);
