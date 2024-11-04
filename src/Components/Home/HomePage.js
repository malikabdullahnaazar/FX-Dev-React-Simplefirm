// import "../../../public/BP_resources/css/home-original.css";
import "../../../public/BP_resources/css/home_component.css";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebars/main";
import NavBar from "../Navbars/main";
import ActionBar from "./ActionBar";

import Chats from "./Chats";
import NewsFeed from "./NewsFeed";
import CaseDetails from "./CaseDetails";


const HomePage = ({}) => {
  

  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar />
        <ActionBar/>
      </div>

      <div className="container-fluid h-80 Home-ML5P" style={{marginTop:"165px"}}>
        <div className="row h-100">
            <div className="col-12 h-100">
                <div className="content-wrapper" >
                  <Chats/>
                  <NewsFeed />
                  <CaseDetails />
                    
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
