import React, { useEffect } from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import LawFirmDirectoryDashboard from "./../Components/LawFirmDirectoryDashboard/main";
import CheckListsDashboard from "../Components/CheckLists/CheckListsDashboard";

function CheckListsPage() {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar flaggedPageName={"Check List"} />

        <div className="main-content" style={{ paddingTop: "129px" }}>
          <CheckListsDashboard />
        </div>
      </div>
    </div>
  );
}

export default CheckListsPage;
