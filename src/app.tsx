import { useRef, useEffect, Ref } from "preact/hooks";
import { MatchMode, matchModes } from "./constants";
import { matchFilters } from "./signals";
import { promptSelectFiles } from "./utils";
import type { FileStruct } from "./types";

export function App() {
	const pageRef = useRef<HTMLDivElement | null>(null);
	const files: FileStruct[] = [];

	return (
		<>
			<SideBar />
			{files.length > 0 && (
				<div class="flex w-full flex-col overflow-y-auto px-4 py-2" ref={pageRef}>
					<FileTable pageRef={pageRef} files={files} />
				</div>
			)}
			{files.length === 0 && (
				<div class="flex w-full flex-col items-center justify-center">
					<span class="display-lg">No Files Found</span>
					<span class="label-md">
						Drag & drop files here, or add from the picker below.
					</span>
					<button class="mt-4" onClick={promptSelectFiles}>
						Add Files
					</button>
				</div>
			)}
		</>
	);
}

export function SideBar() {
	return (
		<div class="side_bar">
			<label class="flex flex-col gap-1">
				<span class="label-sm">Match Pattern</span>
				<input
					placeholder="Supports regex and glob patterns!"
					type="text"
					value={matchFilters.matchString}
					onChange={(e) => {
						matchFilters.matchString.value = (e.target as HTMLInputElement).value;
					}}
				/>
			</label>
			<div class="mt-4 flex flex-col gap-1">
				<label class="flex h-6 items-center">
					<input
						type="checkbox"
						class="mr-2"
						checked={matchFilters.regexEnabled}
						onChange={(e) => {
							const checked = (e.target as HTMLInputElement).checked;
							matchFilters.regexEnabled.value = checked;
						}}
					/>
					<span class="label-sm">Enable Regular Expressions</span>
				</label>
				<label class="flex h-6 items-center">
					<input
						class="mr-2"
						type="checkbox"
						checked={matchFilters.matchAll}
						onChange={(e) => {
							matchFilters.matchAll.value = (e.target as HTMLInputElement).checked;
						}}
					/>
					<span class="label-sm">Match All</span>
				</label>
			</div>
			<label class="mt-4 flex flex-col justify-center gap-1">
				<span class="label-sm">Match Mode</span>
				<select
					onChange={(e) => {
						const mode = parseInt((e.target as HTMLOptionElement).value) as MatchMode;
						matchFilters.matchMode.value = mode;
					}}
				>
					{Object.entries(matchModes).map(([key, value]) => (
						<option key={key} value={key}>
							{value}
						</option>
					))}
				</select>
			</label>
		</div>
	);
}

type FileTableProps = {
	pageRef: Ref<HTMLDivElement>;
	files: FileStruct[];
};

function FileTable({ pageRef, files }: FileTableProps) {
	const tableRef = useRef<HTMLTableElement | null>(null);

	useEffect(() => {
		const onTablePageScroll = (e: Event) => {
			const tableHeader = tableRef.current;
			if (!tableHeader) return;

			const target = e.target as HTMLDivElement;
			const hasElevate = tableHeader.classList.contains("elevated");

			if (target.scrollTop > 50 && !hasElevate) {
				tableHeader.classList.add("elevated");
			} else if (target.scrollTop <= 50 && hasElevate) {
				tableHeader.classList.remove("elevated");
			}
		};

		if (pageRef.current) {
			pageRef.current.onscroll = onTablePageScroll;
		}

		return () => {
			if (pageRef.current) {
				pageRef.current.onscroll = null;
			}
		};
	}, []);

	return (
		<table ref={tableRef}>
			<thead class="sticky top-0">
				<tr class="bg-neutral-60 z-10">
					<th class="label-sm">File Name</th>
					<th class="label-sm">Matched</th>
				</tr>
				<div class="table_elevated_header" />
			</thead>
			<tbody>
				{files.map((_, i) => (
					<tr>
						<td>file{i}.txt</td>
						<td>Yes</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
