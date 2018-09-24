import * as ReactDOM from "react-dom";
import * as React from "react";
import { Route, Router } from "react-router";
import createHashHistory from "history/createHashHistory";
import {App} from "./App";


const history = createHashHistory();

ReactDOM.render(
    <Router history={history}>
        <Route path={"/"} component={App}/>
    </Router>,
    document.getElementById("root")
);