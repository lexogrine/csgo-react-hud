import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./fonts/Louis George Cafe.ttf";
import "./fonts/Rounded_Elegance.ttf";
import App from "./App";    
declare global {
	interface Window {
		ipcApi: {
			send: (channel: string, ...arg: any) => void;
			receive: (channel: string, func: (...arg: any) => void) => void;
		};
	}
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
