import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import "./styles/app.scss";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route
          path="/:id"
          element={
            <>
              <Toolbar />
              <SettingBar />
              <Canvas />
            </>
          }
        ></Route>
        <Route
          path="*"
          element={<Navigate to={`f${(+new Date()).toString(16)}`} />}
        />
      </Routes>
    </div>
  );
}

export default App;
