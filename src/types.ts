import type { Signal } from "@preact/signals";
import type { MatchMode } from "./constants";

export interface MatchFilters {
	matchString: Signal<string>;
	regexEnabled: Signal<boolean>;
	matchAll: Signal<boolean>;
	matchMode: Signal<MatchMode>;
}

export interface FileStruct {
	name: string;
	path: string;
	extension: string;
}

export interface FileMatch {
	file: FileStruct;
	matches: boolean;
}

export interface Announcement {
	message: string;
	sub?: string;
	type: "success" | "error" | "warning";
	delay?: number;
}

export interface LocalError {
	message: string;
	context: string | null;
}
