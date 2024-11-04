//LitigationAction Bar
import React, { useEffect, useState, useRef } from "react";
import ActionBarImg from "../../../public/BP_resources/images/icon/litigation-icon-color.svg";
import LitigationAddEventModal from "./Modals/AddLitigationEventModal";
import LitigationQuestionsModal from "./Modals/LitigationQuestionsModal";
import { useSelector } from "react-redux";
import ActionBarComponent from "../common/ActionBarComponent";

export default function ActionBarLitigation({LitigationDetail}) {
  const [showPopup, setShowPopup] = useState(false);
  const [showEventPopup, setShowEventPopup] = useState(false);

   const buttonsConfig = [
    {
      label: "Lit Template 1",
      icon: "",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "",
    },
    {
      label: "Lit Template 2",
      icon: "",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "",
    },
    {
      label: "Lit Template 3",
      icon: "",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "",
    },
    {
      label: "Generate Questions",
      icon: "",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "",
      onClick: () => setShowPopup(true),
    },
    {
      label: "Litigation Event",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addEvent",
      onClick: () => setShowEventPopup(true),
    },
  ];


  //const handleCaseClick = () => {setShowPopup(true);};

  const handleClosePopup = () => {
    if (showPopup === true) {
      setShowPopup(false);
    } else {
      setShowEventPopup(false);
    }
  };

  //const handleEventPopupClick = () => {setShowEventPopup(true);};

  const open = useSelector((state) => state?.open?.open);

  return (
    <>
      <ActionBarComponent
        src={ActionBarImg}
        page_name={"Litigation"}
        buttons={buttonsConfig}
        isChecklist={false}
      />
    
      {showPopup && (
        <LitigationQuestionsModal
          showPopup={showPopup}
          handleClose={handleClosePopup}
        />
      )}
      {showEventPopup && (
        <LitigationAddEventModal
          showPopup={showEventPopup}
          handleClose={handleClosePopup}
          litigationDetail={LitigationDetail}
        />
      )}
    </>
  );
}
