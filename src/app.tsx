import { useRef, useEffect } from "preact/hooks";
import { selectFiles } from "./utils";
import { MatchMode, matchModes } from "./constants";
import { loadedFiles, matchFilters } from "./signals";

export function App() {
	return (
		<>
			<SideBar />
			{loadedFiles.value.length > 0 ? (
				<div class="flex w-full flex-col overflow-y-auto overflow-x-hidden px-4 pt-2 pb-4">
					<FileTable />
					<div class="mt-4 flex justify-end">
						<button onClick={selectFiles}>Add More Files</button>
					</div>
				</div>
			) : (
				<div class="flex w-full flex-col items-center justify-center">
					<span class="display-lg">No Files Found</span>
					<span class="label-md">
						Drag & drop files here, or add from the picker below.
					</span>
					<button class="mt-4" onClick={selectFiles}>
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

function FileTable() {
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const tableRef = useRef<HTMLTableElement | null>(null);

	useEffect(() => {
		if (!wrapperRef.current || !tableRef.current) return;

		// We already know that the table header exists.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const tableHeaderHeight = tableRef.current.querySelector("thead")!.clientHeight * 0.75;

		const onTablePageScroll = (e: Event) => {
			const table = tableRef.current;
			if (!table) return;

			const target = e.target as HTMLDivElement;
			const hasElevate = table.classList.contains("elevated");

			if (target.scrollTop > tableHeaderHeight && !hasElevate) {
				table.classList.add("elevated");
			} else if (target.scrollTop <= tableHeaderHeight && hasElevate) {
				table.classList.remove("elevated");
			}
		};

		wrapperRef.current.onscroll = onTablePageScroll;

		return () => {
			if (wrapperRef.current) {
				wrapperRef.current.onscroll = null;
			}
		};
	}, []);

	return (
		<div class="overflow-x-auto overflow-y-visible" ref={wrapperRef}>
			<table ref={tableRef}>
				<thead class="sticky top-0">
					<tr class="bg-neutral-60 z-10">
						<th>File Name</th>
					</tr>
					<div class="table_elevated_header" />
				</thead>
				<tbody>
					{loadedFiles.value.map(({ name, path }) => (
						<tr key={path}>
							<td>{name}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
