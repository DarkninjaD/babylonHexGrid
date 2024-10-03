import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import HexGrid from "./components/hexGrid";
import InputSlider from "./components/InputSlider";

function App() {
  const [gridSize, setGridSize] = useState(3);
  const [hexLength, setHexLength] = useState(3);

  return (
    <div className="App">
      <InputSlider
        labelName={"Grid Size"}
        value={gridSize}
        setValue={setGridSize}
        max={10}
        min={3}
      />
      <InputSlider
        labelName={"Hex Lenght"}
        value={hexLength}
        setValue={setHexLength}
        max={10}
        min={3}
      />
      <HexGrid />
    </div>
  );
}

export default App;
