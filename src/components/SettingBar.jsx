import React from "react";
import toolState from "../store/toolState";

const SettingBar = () => {
  return (
    <div className="setting-bar">
      <label htmlFor="line-width">Line width</label>
      <input
        onChange={(e) => toolState.setLineWidth(e.target.value)}
        style={{ margin: "0 10px" }}
        type="number"
        min={1}
        defaultValue={1}
        max={50}
        id="line-width"
      />
      <label htmlFor="stroke-color">Stroke color</label>
      <input
        onChange={(e) => toolState.setStrokeColor(e.target.value)}
        style={{ margin: "0 10px" }}
        type="color"
        id="stroke-color"
      />
    </div>
  );
};

export default SettingBar;
