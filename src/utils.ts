import { invoke } from "@tauri-apps/api";
import { announcement, loadedFiles } from "./signals";
import { FileStruct, LocalError } from "./types";

export const prepareError = (e: unknown): LocalError => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if ((e?.message !== null || e?.message !== undefined) && e?.context !== undefined) {
		return e as LocalError;
	}

	if (e instanceof Error) {
		return {
			message: e.message,
			context: e.stack ?? null,
		};
	}

	if (typeof e === "string") return { message: e, context: null };

	return { message: "Unknown error", context: null };
};

export const selectFiles = async () => {
	try {
		const selected: FileStruct[] = await invoke("select_files");
		loadFilesToSignal(selected);
	} catch (e) {
		const err = prepareError(e);

		announcement.value = {
			message: err.message,
			sub: err.context ?? undefined,
			type: "error",
		};
	}
};

export const loadFilesToSignal = (files: FileStruct[]) => {
	const oldFilePaths = loadedFiles.value.map((file) => file.path);
	const x = files.filter((file) => !oldFilePaths.includes(file.path));

	loadedFiles.value = [...loadedFiles.value, ...x];
};

export const getFileInfo = async (path: string): Promise<FileStruct | null> => {
	try {
		return (await invoke("get_file_info", { path })) as FileStruct;
	} catch (e) {
		const err = prepareError(e);

		announcement.value = {
			message: err.message,
			sub: err.context ?? undefined,
			type: "error",
		};

		return null;
	}
};
