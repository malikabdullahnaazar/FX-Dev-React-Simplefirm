import React from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import Photo from "../Components/Photo/main";

function PhotoPage({ case_id, client_id }) {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar flaggedPageName="Photos" />
        <Photo client_id={client_id} case_id={case_id} />
      </div>
    </div>
  );
}

export default PhotoPage;
