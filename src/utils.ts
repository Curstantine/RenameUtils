import { invoke } from "@tauri-apps/api";
import { announcement, loadedFiles } from "./signals";
import { FileStruct, LocalError } from "./types";

export const selectFiles = async () => {
	try {
		const selected: FileStruct[] = await invoke("select_files");

		const oldFilePaths = loadedFiles.value.map((file) => file.path);
		const x = selected.filter((file) => !oldFilePaths.includes(file.path));

		loadedFiles.value = [...loadedFiles.value, ...x];
	} catch (e) {
		const err = e as LocalError;

		announcement.value = {
			message: err.message,
			sub: err.context,
			type: "error",
		};
	}
};
