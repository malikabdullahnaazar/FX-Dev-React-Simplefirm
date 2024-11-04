import React from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import FirmSettingsMain from "../Components/FirmSettings/main";

function FirmSetting() {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar flaggedPageName="Firm Settings" />
        <FirmSettingsMain />
      </div>
    </div>
  );
}

export default FirmSetting;
