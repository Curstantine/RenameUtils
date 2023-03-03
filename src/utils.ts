import { invoke } from "@tauri-apps/api";
import { loadedFiles } from "./signals";
import { FileStruct } from "./types";

export const selectFiles = async () => {
	const selected: FileStruct[] = await invoke("select_files");

	const x = selected.filter((file) => !loadedFiles.value.includes(file));
	loadedFiles.value = [...loadedFiles.value, ...x];
};
