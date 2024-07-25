import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import HexGrid from "./components/hexGrid";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HexGrid />
  </React.StrictMode>
);
