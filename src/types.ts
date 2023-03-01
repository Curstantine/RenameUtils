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
