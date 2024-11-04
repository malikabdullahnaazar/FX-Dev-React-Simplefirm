import React, { useEffect } from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import LawFirmDirectoryDashboard from "./../Components/LawFirmDirectoryDashboard/main";
import { useDispatch } from "react-redux";
import { setHasNoData } from "../Redux/Directory/directorySlice";

function LawFirmDirectory({clientId, caseId}) {
  const dispatch = useDispatch()
  useEffect(()=>{
   dispatch(setHasNoData(false))
  },[])
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar  flaggedPageName={'Case'} />

        <div className="main-content" style={{paddingTop: "129px"}}>
          <LawFirmDirectoryDashboard />
        </div>
      </div>
    </div>
  );
}

export default LawFirmDirectory;
