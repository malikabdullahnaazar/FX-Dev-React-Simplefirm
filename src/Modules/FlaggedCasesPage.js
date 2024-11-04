import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import FlaggedCases from "../Components/FlaggedCases/main";
import {
  getCaseId,
  getClientId,
  setCaseId,
  setClientId,
} from "../Utils/helper";

const FlaggedCasesPage = () => {
  const [newFlags, setNewFlags] = useState([]);
  let location = useLocation();

  useEffect(() => {
    const newClientID = location.pathname.split("/")[2];
    const newCaseID = location.pathname.split("/")[3];
    const clientID = getClientId();
    const caseID = getCaseId();

    if (newClientID !== clientID || newCaseID !== caseID) {
      setClientId(newClientID);
      setCaseId(newCaseID);
    }
  }, [location]);

  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <div className="top-panel-wrapper"></div>
        <NavBar
          flaggedPageName="Case"
          newFlags={newFlags}
          setNewFlags={setNewFlags}
        />
        <FlaggedCases
          case_id={getCaseId()}
          client_id={getClientId()}
          newFlags={newFlags}
          setNewFlags={setNewFlags}
        />
      </div>
      <footer
          className="footer-directry"
          style={{ position: "fixed", bottom: "0", width: "100%", zIndex: 10 }}
        >
          <div className="fotter-content-directory"></div>
        </footer>
    </div>
  );
};

export default FlaggedCasesPage;
