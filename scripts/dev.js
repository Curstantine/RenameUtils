import { cwd } from "process";
import { join, resolve } from "path";
import { fork, spawn } from "child_process";
import { context } from "esbuild";
import EventSource from "eventsource";

const vite = resolve("node_modules", ".bin", "vite");
spawn(vite, ["dev"], {
	cwd: cwd(),
	shell: true,
	stdio: "inherit",
});

const backendDist = resolve("dist", "backend");
const gluonIndex = join(backendDist, "index.js");

const backendContext = await context({
	outdir: backendDist,
	tsconfig: resolve("tsconfig.backend.json"),
	entryPoints: [resolve("backend", "index.ts")],
	minify: false,
	sourcemap: true,
});

await backendContext.watch();
const serve = await backendContext.serve({
	port: 5174,
	host: "localhost",
});

const source = new EventSource(`http://${serve.host}:${serve.port}/esbuild`);

/** @type {ChildProcess|null} */
let gluonInstance = null;
source.onopen = () => {
	gluonInstance = startGluon();
};

source.addEventListener("change", () => {
	if (gluonInstance) gluonInstance.kill();
	gluonInstance = startGluon();
});

const startGluon = () => {
	const gluon = fork(gluonIndex, ["start"], {
		cwd: backendDist,
		shell: true,
		stdio: "inherit",
	});

	return gluon;
};
