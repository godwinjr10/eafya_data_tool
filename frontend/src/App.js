import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import UpdateNotification from "./components/UpdateNotification";
import useAutoUpdate from "./hooks/useAutoUpdate";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/global.scss";

function App() {
  const { updateAvailable, isChecking, triggerUpdate, dismissUpdate } =
    useAutoUpdate(30 * 60 * 1000); // Check every 30 minutes

  return (
    <BrowserRouter>
      <AppRoutes />
      {/* <UpdateNotification
        show={updateAvailable}
        onUpdate={triggerUpdate}
        onDismiss={dismissUpdate}
        isUpdating={isChecking}
      /> */}
    </BrowserRouter>
  );
}

export default App;
