import React from 'react'
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import NotesSectionDashboard from '../Components/NotesSectionDashboard/main'

function NotesSectionPage() {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar flaggedPageName="Notes" />
        
        <div className="main-content p-t-130">
            <NotesSectionDashboard />
        </div>
      </div>
    </div>
  )
}

export default NotesSectionPage
