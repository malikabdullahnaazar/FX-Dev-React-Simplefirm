import React, { useState, useEffect } from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";

import CaseAccident from "../Components/CaseAccident/main";

const AccidentPage = () => {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar flaggedPageName="Accident" />
        <CaseAccident />
      </div>
    </div>
  );
};

export default AccidentPage;
