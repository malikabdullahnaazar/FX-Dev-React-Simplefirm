import React, { useState, useRef, useEffect } from "react";
import "./DocumentSidebar.css";
import DocumentRenameComponent from "./DocumentRenameComponent";
import BottomContentSideBar from "./BottomContentSideBar";
import PropTypes from "prop-types";
import { getCaseId, mediaRoute } from "../../../Utils/helper";
import incidentIcon from "../../../assets/images/incident.svg";
import "./BottomContentSideBar.css";
import UploadIcon from "/public/bp_assets/img/cloud_icon.svg";
import RequestDocModal from "./RequestDocModal";
import api from "../../../api/api";
import LinkDocToTaskModal from "./LinkDocToTaskModal";
import ChatDocumentModal from "./ChatDocumentModal";

function UserProfile({ clientInfo }) {
  
  return (
    <>
      <div className="user-profile-document-popup-img m-r-5">
        {clientInfo?.profile_pic_29p ? (
          <img
            src={clientInfo.profile_pic_29p}
            alt="Profile avatar"
            className=""
          />
        ) : (
          <i className="ic ic-avatar ic-29 has-avatar-icon"></i>
        )}
      </div>
      {/* <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
        {clientInfo?.profile_pic_29p && (
          <img
            src={clientInfo.profile_pic_29p}
            alt="Profile avatar"
            className="invisible"
          />
        )}
      </span> */}
      <span className="text-black user_name">
        <span className="clientTabFont d-block">
          {clientInfo
            ? `${clientInfo.last_name}, ${clientInfo.first_name}`
            : "Client Info"}
        </span>
      </span>
    </>
  );
}

UserProfile.propTypes = {
  clientInfo: PropTypes.shape({
    profile_pic_29p: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
};

function PageInfo({ page }) {
  const { page_icon = "", name = "" } = page || {};

  return (
    <>
      {page_icon && <img src={mediaRoute(page_icon)} width="20" alt="" />}
      <p className="ml-1">{name}</p>
    </>
  );
}

PageInfo.propTypes = {
  page: PropTypes.shape({
    page_icon: PropTypes.string,
    name: PropTypes.string,
  }),
};

const DocumentModalSideBar = ({
  documentData,
  pages,
  slotsData,
  onRefetchSlotsData,
}) => {
  const {
    id: docId,
    for_client: clientInfo,
    for_case: caseInfo,
    file_name,
    docDate,
    attached_by: attachUser,
    document_slot: documentSlot,
  } = documentData;

  const clientId = clientInfo?.id;
  const caseId = caseInfo?.id;
  const userId = attachUser?.id ? attachUser.id : localStorage.getItem("loggedInUser") || null;
  
  const [showMenuBar, setShowMenuBar] = useState(false);
  const [panelMenuBar, setPanelMenuBar] = useState(false);

  const [showDocLinkModal, setShowDocLinkModal] = useState(false);
  const handShowDocLinkModal = () => setShowDocLinkModal(true);
  const handleShowDocLinkModalClose = () => setShowDocLinkModal(false);

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    chatDoc: false,
    taskLink: false,
    docReview: false,
  });
  const dropdownRefs = {
    chatDoc: useRef(null),
    taskLink: useRef(null),
    docReview: useRef(null),
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const toggleDropdown = (dropdownName) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(dropdownRefs).forEach(([key, ref]) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropdownOpen((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="right-sidebar d-flex flex-column" style={{ width: "17%" }}>
      <div className="bluish-effect"></div>
      <div className="d-flex flex-column justify-content-between h-100">
        <div className="top-content">
          <div
            className="client-name d-flex align-items-center side-bar-padding"
            style={{ height: "35px" }}
          >
            <UserProfile clientInfo={clientInfo} />
          </div>
          <div className="basic-info m-r-5 m-l-5">
            {/* Basic info content */}
            <div
              className="tile-row w-100 p-l-5 p-r-5"
              style={{ height: "50px" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ height: "25px" }}
              >
                {caseInfo?.case_type?.casetype_icon && (
                  <span
                    className="ic-avatar ic-19 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center"
                    style={{ marginRight: "10px" }}
                  >
                    <img
                      style={{
                        width: "19px",
                        height: "19px",
                      }}
                      src={caseInfo?.case_type?.casetype_icon}
                      alt="icon"
                    />
                  </span>
                )}

                <p className="text-black font-weight-semibold d-block">
                  {caseInfo?.case_type?.name || "N/A"}
                </p>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ height: "25px" }}
              >
                <span
                  className="ic-avatar ic-19 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center"
                  style={{ marginRight: "10px" }}
                >
                  <img
                    src={incidentIcon}
                    className=""
                    style={{
                      width: "19px",
                      height: "19px",
                    }}
                  />
                </span>

                <p className="font-weight-semibold">
                  {caseInfo?.incident_date || "N/A"}
                </p>
              </div>
            </div>
            {/* <div className="tile-row w-100 ">
              <div
                className="d-flex align-items-center "
                style={{ height: "25px" }}
              >
                <span className="ic-avatar ic-19 m-r-5">
                  <img
                    className=""
                    src={caseInfo?.case_type?.casetype_icon}
                    style={{ width: "19px", height: "19px" }}
                    alt="icon"
                  />
                </span>
                <span className="text-black font-weight-semibold d-block">
                  {caseInfo?.case_type?.name || "N/A"}
                </span>
              </div>
              <div
                className="d-flex align-items-center "
                style={{ height: "25px" }}
              >
                <span className="ic-avatar ic-19 m-r-5">
                  <img
                    src={incidentIcon}
                    className=""
                    alt="Incident icon"
                    style={{ width: "19px", height: "19px" }}
                  />
                </span>
                <span className="">{caseInfo?.incident_date || "N/A"}</span>
              </div>
            </div> */}
            <DocumentRenameComponent
              initialDocumentName={file_name}
              docId={docId}
            />
            {/* Other basic info fields */}
            <div
              className="tile-row d-flex flex-wrap w-100 p-r-5 p-l-5 justify-content-between m-t-5 align-items-center"
              style={{ height: "25px" }}
            >
              <span className="text-lightgray text-lg">Attached on:</span>
              <span className="text-black font-weight-semibold text-right pr-0">
                {docDate}
              </span>
            </div>
            <div
              className="tile-row d-flex align-items-center flex-wrap w-100  p-r-5 p-l-5 justify-content-between align-items-center"
              style={{ height: "25px" }}
            >
              <span className="text-lightgray text-lg">By:</span>
              <span className="text-black  font-weight-semibold text-right pr-0">
                <a
                  href="#"
                  className="d-flex align-items-center justify-content-end"
                >
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                    <img
                      src={attachUser?.profile_pic_29p}
                      alt="Profile avatar"
                      className="img-round"
                    />
                  </span>
                  <span className="ml-2 text-black">
                    {`${attachUser?.first_name || ""} ${attachUser?.last_name || ""}`}
                  </span>
                </a>
              </span>
            </div>
            <div
              className="tile-row d-flex align-items-center flex-wrap w-100 m-t-5 align-items-center"
              style={{ height: "25px" }}
            >
              <PageInfo page={documentSlot?.page || {}} />
            </div>
            <div className="tile-row d-flex flex-wrap w-100">
              {/* <p className="ml-4">{providerprofile_office_name}</p> */}
            </div>
            <div
              className="tile-row d-flex flex-wrap w-100 align-items-center"
              style={{ height: "25px" }}
            >
              <p className="doc-pop-margin-left-2-5rem m-l-5">
                <span className="counter">
                  {documentSlot?.slot_number || ""}.
                </span>
                {documentSlot?.slot_name || ""}
              </p>
            </div>
          </div>
          <div className="">
            <span
              className="color-main text-center text-color-heading d-flex align-items-center justify-content-center document-pop-up-menu-title"
              style={{
                fontSize: "14px",
                height: "25px",
                borderRadius: "0px",
              }}
            >
              CLICK TO MOVE DOCUMENT
            </span>
            <ul
              className="d-block document-pop-up-menu-sidebar"
              style={{ paddingLeft: "0px" }}
            >
              {pages &&
                pages.map((page, index) => {
                  // Find the corresponding slot data for the current page
                  const slotData = slotsData.find(
                    (slot) => slot.page.name === page.name
                  );

                  if (
                    page.show_on_sidebar &&
                    slotData &&
                    slotData.page_slots.length > 0
                  ) {
                    const { panels, page_slots } = slotData;

                    // If panels exist, show panels first
                    if (panels && panels.length > 0 && page_slots.length > 0) {
                      return (
                        <li
                          key={index}
                          className=""
                          onMouseEnter={() => setShowMenuBar(index)}
                          onMouseLeave={() => setShowMenuBar(null)}
                        >
                          <a
                            className="cursor-pointer d-flex align-items-center"
                            style={{ gap: "5px" }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: "17px",
                                height: "17px",
                                color: "#19395F",
                                transform: "rotate(180deg)",
                                backgroundImage:
                                  showMenuBar === index
                                    ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                    : "",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                              }}
                            ></span>
                            <img
                              src={page.page_icon ?? ""}
                              className="doc-pop-width-15px-height-15px mr-1"
                              alt=""
                            />
                            {page.name}
                            <span className="caret"></span>
                          </a>
                          <ul
                            className="document-pop-up-sidebar-menubar"
                            style={{
                              position: "absolute",
                              left: "auto",
                              top:
                                window.innerWidth < 1920
                                  ? `${index * 2 + 26}%`
                                  : page.name === "Defendants"
                                    ? `${5 + index * 2 + 3}%`
                                    : page.name === "Experts"
                                      ? `${index * 2}%`
                                      : `${5 + index * 2}%`,
                              minWidth: "217px",
                              transform:
                                window.innerWidth > 1920
                                  ? `translate(10px, -${index + 15}%)`
                                  : `translate(0px, -${index + 28}%)`,
                              right: "17.2%",
                              display: showMenuBar === index ? "block" : "",
                              width: "400px",
                            }}
                          >
                            {panels.map((panel, panelIndex) => (
                              <li
                                key={panelIndex}
                                className="d-flex align-items-center"
                                style={{
                                  padding: "5px 10px",
                                }}
                                onMouseEnter={() => setPanelMenuBar(panelIndex)}
                                onMouseLeave={() => setPanelMenuBar(null)}
                              >
                                <a
                                  className="cursor-pointer d-flex align-items-center color-grey-2"
                                  style={{ gap: "5px" }}
                                >
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: "17px",
                                      height: "17px",
                                      color: "#19395F",
                                      transform: "rotate(180deg)",
                                      backgroundImage:
                                        panelMenuBar === panelIndex
                                          ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                          : "",
                                      backgroundRepeat: "no-repeat",
                                      backgroundSize: "contain",
                                    }}
                                  ></span>
                                  <span className="ml-2">{panel.id}.</span>
                                  <span className="ml-2">
                                    {panel.specialty
                                      ? panel.specialty.name
                                      : panel.panel_name
                                        ? panel.panel_name
                                        : "No Name"}
                                  </span>
                                </a>
                                <ul
                                  className="document-pop-up-sidebar-menubar"
                                  style={{
                                    position: "absolute",
                                    left: "auto",
                                    top:
                                      window.innerWidth < 1920
                                        ? `${panelIndex * 2 + 18}%`
                                        : `${10 + panelIndex * 2}%`,
                                    minWidth: "217px",
                                    transform:
                                      window.innerWidth > 1920
                                        ? `translate(10px, -${panelIndex + 15}%)`
                                        : `translate(0px, -${panelIndex + 30}%)`,
                                    right: "17.2%",
                                    display:
                                      panelMenuBar === panelIndex
                                        ? "block"
                                        : "",
                                    width: "400px",
                                  }}
                                >
                                  {page_slots.map((slot, slotIndex) => {
                                    const docsInSlot = panel.documents?.filter(
                                      (doc) =>
                                        doc.document_slot?.slot_number ===
                                        slot?.slot_number
                                    );
                                    const handleClick = async () => {
                                      await api.post(
                                        "api/doc/attach/treatment/",
                                        {
                                          panel_id: panel.id,
                                          slot: slot.id,
                                          page_id: page.id,
                                          case_id: getCaseId(),
                                          panels: true,
                                          doc_id: docId,
                                        }
                                      );
                                      onRefetchSlotsData();
                                    };

                                    return (
                                      <li
                                        key={slotIndex}
                                        className="d-flex align-items-center"
                                        style={{
                                          padding: "5px 10px",
                                          cursor:
                                            docsInSlot.length > 0
                                              ? "default"
                                              : "pointer",
                                        }}
                                        onClick={handleClick}
                                      >
                                        {slot.slot_number !== 0 && (
                                          <span className="d-flex align-items-center justify-content-center">
                                            {docsInSlot.length > 0 ? (
                                              <i
                                                className="ic ic-23 ic-file-colored cursor-pointer document-icons-width"
                                                style={{
                                                  backgroundRepeat: "no-repeat",
                                                }}
                                              ></i>
                                            ) : (
                                              <img
                                                src={UploadIcon}
                                                className="document-icons-width cursor-pointer"
                                                style={{
                                                  backgroundRepeat: "no-repeat",
                                                }}
                                              />
                                            )}
                                          </span>
                                        )}

                                        {slot.slot_number === 0 && (
                                          <span className="d-flex align-items-center ml-2">
                                            <img
                                              src={page.page_icon ?? ""}
                                              className="document-icons-width  cursor-pointer m-r-5"
                                              alt=""
                                            />
                                            Attach to {page.name} Page generally
                                          </span>
                                        )}

                                        {slot.slot_number !== 0 && (
                                          <div
                                            className={`d-flex align-items-center  ${
                                              docsInSlot.length === 0
                                                ? "color-grey-2 hoverable-text"
                                                : ""
                                            }`}
                                          >
                                            <>
                                              <span className="ml-2">
                                                {slot.slot_number}.
                                              </span>
                                              <span className="ml-2">
                                                {docsInSlot.length > 0
                                                  ? docsInSlot[0].file_name
                                                  : slot.slot_name
                                                    ? slot.slot_name
                                                    : "Available"}
                                              </span>
                                            </>
                                          </div>
                                        )}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    }

                    // If no panels, show page slots directly
                    if (page_slots.length > 0 && !slotsData.panels) {
                      return (
                        <li
                          key={index}
                          className=""
                          onMouseEnter={() => setShowMenuBar(index)}
                          onMouseLeave={() => setShowMenuBar(null)}
                        >
                          <a
                            className="cursor-pointer d-flex align-items-center"
                            style={{ gap: "5px" }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: "17px",
                                height: "17px",
                                color: "#19395F",
                                transform: "rotate(180deg)",
                                backgroundImage:
                                  showMenuBar === index
                                    ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                    : "",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                              }}
                            ></span>
                            <img
                              src={page.page_icon ?? ""}
                              className="doc-pop-width-15px-height-15px mr-1"
                              alt=""
                            />
                            {page.name}
                            <span className="caret"></span>
                          </a>
                          <ul
                            className="document-pop-up-sidebar-menubar"
                            style={{
                              position: "absolute",
                              left: "auto",
                              top:
                                window.innerWidth < 1920
                                  ? `${index * 2 + 30}%`
                                  : `${10 + index * 1.5}%`,
                              minWidth: "217px",
                              transform:
                                window.innerWidth > 1920
                                  ? `translate(10px, -${index + 18}%)`
                                  : `translate(0px, -${index + 30}%)`,
                              right: "17.2%",
                              display: showMenuBar === index ? "block" : "",
                              width: "400px",
                            }}
                          >
                            {page_slots.map((slot, slotIndex) => {
                              const docsInSlot = slotData.page_docs?.filter(
                                (doc) =>
                                  doc.document_slot?.slot_number ===
                                  slot?.slot_number
                              );

                              const handleClick = async () => {
                                await api.post("api/doc/attach/treatment/", {
                                  slot: slot.id,
                                  page_id: page.id,
                                  case_id: getCaseId(),
                                  panels: false,
                                  doc_id: docId,
                                });
                                onRefetchSlotsData();
                              };

                              return (
                                <li
                                  key={slotIndex}
                                  className="d-flex align-items-center"
                                  style={{
                                    padding: "5px 10px",
                                    cursor:
                                      docsInSlot.length > 0
                                        ? "default"
                                        : "pointer",
                                  }}
                                  onClick={handleClick}
                                >
                                  {slot.slot_number !== 0 && (
                                    <span className="d-flex align-items-center justify-content-center">
                                      {docsInSlot.length > 0 ? (
                                        <i
                                          className="ic ic-23 ic-file-colored cursor-pointer document-icons-width"
                                          style={{
                                            backgroundRepeat: "no-repeat",
                                          }}
                                        ></i>
                                      ) : (
                                        <img
                                          src={UploadIcon}
                                          className="document-icons-width cursor-pointer"
                                          style={{
                                            backgroundRepeat: "no-repeat",
                                          }}
                                        />
                                      )}
                                    </span>
                                  )}

                                  {slot.slot_number === 0 && (
                                    <span className="d-flex align-items-center ml-2">
                                      <img
                                        src={page.page_icon ?? ""}
                                        className="document-icons-width d-flex align-items-center  cursor-pointer m-r-5"
                                        alt=""
                                      />
                                      Attach to {page.name} Page generally
                                    </span>
                                  )}

                                  {slot.slot_number !== 0 && (
                                    <div
                                      className={`d-flex align-items-center  ${
                                        docsInSlot.length === 0
                                          ? "color-grey-2 hoverable-text"
                                          : ""
                                      }`}
                                    >
                                      <>
                                        <span className="ml-2">
                                          {slot.slot_number}.
                                        </span>
                                        <span className="ml-2">
                                          {docsInSlot.length > 0
                                            ? docsInSlot[0].file_name
                                            : slot.slot_name
                                              ? slot.slot_name
                                              : "Available"}
                                        </span>
                                      </>
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    }
                  }

                  return null;
                })}
            </ul>
          </div>
        </div>
        <div
          className="d-flex flex-column"
          style={{ gap: window.innerWidth <= 1920 ? "0px" : "70px" }}
        >
          <div
            className="m-l-5 m-r-5"
            style={{
              display: window.innerWidth <= 1920 ? "flex" : "block",
              justifyContent:
                window.innerWidth <= 1920 ? "space-between" : "initial",
            }}
          >
            {/* Chat Document Link Dropdown */}

            <div className="tile-row w-100 m-b-5  center-content my-auto">
              <div className="dropdown  d-flex" ref={dropdownRefs.chatDoc}>
                <button
                  className={`btn height-25 dropdown-toggle position-relative d-flex align-items-center justify-content-center w-100 form-select has-no-bg position-relative doc-rev-btn rotate-btn ${dropdownOpen.chatDoc ? "show" : ""}`}
                  type="button"
                  // onClick={() => toggleDropdown("chatDoc")}
                  onClick={handleShow}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen.chatDoc}
                >
                  <span className="has-no-after ic-arrow text-primary width-17 m-r-10 mega-hover-btn align-mid">
                    <svg
                      width="17"
                      height="23"
                      className=" "
                      viewBox="0 0 34 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                  {window.innerWidth <= 1920
                    ? "Chat Doc"
                    : "Chat Document Link"}
                </button>
                {dropdownOpen.chatDoc && (
                  <div className="dropdown-menu show">
                    {/* Add dropdown items here */}
                  </div>
                )}
              </div>
            </div>

            {/* Link Doc to Task Dropdown */}

            <div className="tile-row w-100 m-b-5  center-content my-auto">
              <div className="dropdown d-flex" ref={dropdownRefs.taskLink}>
                <button
                  className={`btn height-25 dropdown-toggle position-relative d-flex align-items-center justify-content-center w-100 form-select has-no-bg position-relative doc-rev-btn rotate-btn ${dropdownOpen.taskLink ? "show" : ""}`}
                  type="button"
                  // onClick={() => toggleDropdown("taskLink")}
                  onClick={handShowDocLinkModal}
                >
                  <span className="has-no-after ic-arrow text-primary width-17 m-r-10 mega-hover-btn align-mid">
                    <svg
                      width="17"
                      height="23"
                      className=" "
                      viewBox="0 0 34 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                  {window.innerWidth <= 1920 ? "Task Link" : "Link Doc to Task"}
                </button>
                {dropdownOpen.taskLink && (
                  <div className="dropdown-menu show">
                    {/* Add dropdown items here */}
                  </div>
                )}
              </div>
            </div>

            {/* Request Document Review Button */}

            <div className="tile-row w-100 m-b-5 center-content my-auto">
              <div className="dropdown d-flex" ref={dropdownRefs.docReview}>
                <button
                  className={`btn height-25 dropdown-toggle position-relative d-flex align-items-center justify-content-center w-100 form-select has-no-bg position-relative doc-rev-btn rotate-btn ${dropdownOpen.docReview ? "show" : ""}`}
                  type="button"
                  onClick={toggleModal}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen.docReview}
                >
                  <span className="has-no-after ic-arrow text-primary width-17 m-r-10 mega-hover-btn align-mid">
                    <svg
                      width="17"
                      height="23"
                      className=" "
                      viewBox="0 0 34 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                  {window.innerWidth <= 1920
                    ? "Doc Rev"
                    : "Request Document Review"}
                </button>
              </div>
            </div>
          </div>
          <BottomContentSideBar docId={docId} caseId={caseId} clientId={clientId} />
        </div>
      </div>
      <RequestDocModal
        selectedDoc={docId}
        isOpen={isModalOpen}
        caseInfo={caseInfo}
        onConfirm={toggleModal}
        onClose={toggleModal}
      />
      <LinkDocToTaskModal
            showModal={showDocLinkModal}
            handleClose={handleShowDocLinkModalClose}
            userId={userId}
            caseId={caseId}
            docId={docId}
            clientId={clientId}
          />
        <ChatDocumentModal showModal={showModal} caseId={caseId} userId={userId} caseInfo={caseInfo} clientId={clientId} handleClose={handleClose} />
          
    </div>
  );
};

DocumentModalSideBar.propTypes = {
  documentData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    for_client: PropTypes.object,
    for_case: PropTypes.shape({
      case_type: PropTypes.shape({
        name: PropTypes.string,
        casetype_icon: PropTypes.string,
      }),
      incident_date: PropTypes.string,
    }),
    file_name: PropTypes.string,
    docDate: PropTypes.string,
    attached_by: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      profile_pic_29p: PropTypes.string,
    }),
    document_slot: PropTypes.object,
  }).isRequired,
  pages: PropTypes.array.isRequired,
  slotsData: PropTypes.array.isRequired,
};

export default DocumentModalSideBar;
