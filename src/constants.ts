export enum MatchMode {
	FileNameOnly = 0,
	FileExtensionOnly,
	FileExtensionAndFileName,
}

export const matchModes: Record<MatchMode, string> = {
	[MatchMode.FileNameOnly]: "File Name Only",
	[MatchMode.FileExtensionOnly]: "File Extension Only",
	[MatchMode.FileExtensionAndFileName]: "File Extension + File Name",
};
