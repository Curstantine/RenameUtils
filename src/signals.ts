import { signal } from "@preact/signals";
import { MatchMode } from "./constants";
import type { Announcement, FileStruct, MatchFilters } from "./types";

export const matchFilters: MatchFilters = {
	matchString: signal<string>(""),
	regexEnabled: signal<boolean>(true),
	matchAll: signal<boolean>(true),
	matchMode: signal<MatchMode>(MatchMode.FileNameOnly),
};

export const loadedFiles = signal<FileStruct[]>([]);

export const announcement = signal<Announcement | null>(null);
