import { cwd } from "process";
import { join, resolve } from "path";
import { fork } from "child_process";
import { context } from "esbuild";
import EventSource from "eventsource";
import { createServer } from "vite";

/*
	For some reason, vite does not resolve hoisted dependencies correctly.
	To fix this, you need to hoist these phantom dependencies directly into the root package.json.
	https://pnpm.io/npmrc#public-hoist-pattern
*/

const vite = await createServer({
	root: cwd(),
	mode: "development",
	configFile: resolve("vite.config.ts"),
});

await vite.listen(5173);
vite.printUrls();

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
		env: {
			...process.env,
			NODE_ENV: "development",
		},
	});

	return gluon;
};
