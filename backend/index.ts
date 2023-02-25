import * as Gluon from "@gluon-framework/gluon";

const isDev = process.env.NODE_ENV === "development";
const port = process.env.PORT || 5173;
const target = isDev ? `http://localhost:${port}` : "";

const window = await Gluon.open(target, {
	allowHTTP: isDev,
});
