import "virtual:windi.css";
import "./index.css";

import { render } from "preact";
import { App } from "./app";

render(<App />, document.getElementById("app") as HTMLElement);