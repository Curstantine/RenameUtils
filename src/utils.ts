import { open } from "@tauri-apps/api/dialog";
import { loadedFiles } from "./signals";

export const promptSelectFiles = async () => {
	const selected = await open({
		multiple: true,
	});

	if (!loadedFiles) return;

	if (typeof selected === "string" && !loadedFiles.value.includes(selected)) {
		loadedFiles.value.push(selected);
	}

	if (Array.isArray(selected)) {
		const x = selected.filter((file) => !loadedFiles.value.includes(file));
		loadedFiles.value.push(...x);
	}
};
