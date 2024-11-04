import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import axios from "axios";

import Specialities from "../Components/BP/Specialities";
import TreatmentCaseProvider from "../Components/BP/TreatmentCaseProvider";

import MedicalTreatmentIcon from "../assets/images/medical-treatment-icon.svg";
import SimpleIcon from "../assets/images/simple-icon.svg";
import DetailIcon from "../assets/images/detail.svg";
import DatesIcon from "../assets/images/dates.svg";
import Avatar from "../assets/images/avatar.png";
import { Link } from "react-router-dom";
import { debounce } from "lodash";

import { useDispatch, useSelector } from "react-redux";
import PageChecklist from "../Components/common/PageChecklist";
import { fetchShakespeareStatus } from "../Utils/helper";
import ActionBarComponent from "../Components/common/ActionBarComponent";

function TreatmentPage({ case_id }) {
  const dispatch = useDispatch();
  const [needsUpdate, setNeedsUpdate] = useState(false);

  const handleUpdate = () => {
    console.log("re render");
    setNeedsUpdate((prev) => !prev);
  };
  //

  const linkStyle = {
    color: "white", // Note camelCase instead of color: "white"
    textDecoration: "none", // textDecoration instead of text-decoration
  };

  const origin = process.env.REACT_APP_BACKEND_URL;

  const client = useSelector((state) => state.todos);
  const pages = useSelector((state) => state.todos);
  const currentCase = useSelector((state) => state.todos);
  const caseID = parseInt(localStorage.getItem("case_id"));
  const clientID = parseInt(localStorage.getItem("client_id"));

  const [specialitiesList, setSpecialitiesList] = useState([]);

  useEffect(() => {
    fetchShakespeareStatus(caseID, clientID, "Treatment", dispatch);
    async function fetchSpecialitiesList() {
      const { data } = await axios.get(
        origin + "/api/treatment/specialities/" + case_id + "/"
      );

      console.log(data);
      setSpecialitiesList(data);
    }

    fetchSpecialitiesList();
  }, []);

  const [caseProvidersList, setcaseProvidersList] = useState([]);

  useEffect(() => {
    async function fetchSpecialitiesList() {
      const { data } = await axios.get(
        origin + "/api/treatment/case-providers/" + case_id + "/"
      );
      setcaseProvidersList(data);
    }

    fetchSpecialitiesList();
  }, [needsUpdate]);

  const navRef = useRef(null);
  const [useAbbreviations, setUseAbbreviations] = useState(false);

  useEffect(() => {
    const updateTabVisibility = () => {
      const screenWidth = window.innerWidth;
      const thresholdWidth = 1200;

      if (navRef.current) {
        const navWidth = navRef.current.clientWidth;
        const tabs = navRef.current.querySelectorAll(".spec-tab-item");
        const totalTabsWidth = Array.from(tabs).reduce(
          (total, tab) =>
            total +
            tab.offsetWidth +
            (parseInt(window.getComputedStyle(tab).marginLeft, 10) +
              parseInt(window.getComputedStyle(tab).marginRight, 10)),
          0
        );

        console.log(
          `Nav Width: ${navWidth}, Total Tabs Width: ${totalTabsWidth}`
        );
        // Use screenWidth to decide on abbreviations
        const abbreviate =
          screenWidth < thresholdWidth || totalTabsWidth > navWidth;
        setUseAbbreviations(abbreviate);
        setSpecialityTabWidth(abbreviate);
      }
    };

    const setSpecialityTabWidth = (abbreviate) => {
      const tabs = navRef.current.querySelectorAll(".spec-tab-item");
      if (abbreviate) {
        tabs.forEach((tab) => {
          tab.style.width = `105px`;
          tab.style.minWidth = `105px`;
        });
      } else {
        let longestWidth = 0;
        tabs.forEach((tab) => {
          tab.style.width = `176.609px`;
          tab.style.minWidth = `176.609px`;
        });
      }
    };

    const resizeObserver = new ResizeObserver(updateTabVisibility);
    resizeObserver.observe(document.body);

    updateTabVisibility();

    return () => resizeObserver.disconnect();
  }, [specialitiesList]);

  const [activeSpecialty, setActiveSpecialty] = useState("all");
  const handleSpecialtyChange = (id) => {
    setActiveSpecialty(id);
  };

  function verify_unverify(arg) {
    const visits = refsArray.current[index].visits.current.value;
    const caseId = refsArray.current[index].caseId.current.value;
    const clientId = refsArray.current[index].clientId.current.value;

    console.log(`Form ${index + 1} Data:`, { visits, caseId, clientId });

    const data = {
      field_name: "No F",
      test: "testo",
    };

    axios
      .post(origin + "/api/treatment/verify-unverify/", data)
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  }

  const buttonsConfig = [
    {
      label: "New Provider",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#newProvider",
    },
  ];

  const linksConfig = [
    {
      to: "/simple/",
      label: "Simple",
      icon: <img src={SimpleIcon} width="35" alt="Simple" />,
      className: "three-icons ",
    },
    {
      to: "/treatment/",
      label: "Detail",
      icon: <img src={DetailIcon} width="35" alt="Detail" />,
      className: "three-icons active",
    },
    {
      to: "/dates/",
      label: "Dates",
      icon: <img src={DatesIcon} width="35" alt="Dates" />,
      className: "three-icons white-space",
    },
  ];
  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <>
      <div className="page-wrapper">
        <Sidebar pages={pages} />
        <div className="page-container">
          <div className="top-panel-wrapper"></div>
          <NavBar
            flaggedPageName="Treatment"
            client={client}
            currentCase={currentCase}
          />
          <div className="main-content hidden-scrollbar">
            <ActionBarComponent
              src={MedicalTreatmentIcon}
              page_name={"Treatment"}
              buttons={buttonsConfig}
              isChecklist={true}
              links={linksConfig}
            />
            {/* <div className="action-bar client-BarAlign anti-action-bar anti-client-BarAlign main-action-bar c-height-action-bar has-checklist d-flex m-b-5 m-t-5  margin-left-155  margin-left-12">
              <span className="page-icon">
                <img
                  className="translate-note-icon"
                  src={MedicalTreatmentIcon}
                />
              </span>
              <div className="text-wrapper text-white d-flex align-items-center p-l-5 width-60">
                <h2 className="text-white font-18">Treatment</h2>
              </div>
              <div className="mobile-action-btns ml-auto">
                <button
                  className="btn btn-primary rounded-0 position-relative z-index-1 ml-auto height-25 d-flex align-items-center mr-1"
                  id="actionbarToggleBtn"
                >
                  <span className="font-weight-bold pr-2 text-gold">+</span>
                  Actions
                </button>
              </div>
              <div className="btn-wrapper ml-auto left-pos-70 high-index new-provider-btn flex-row-reverse overflow-visible">
                <a
                  className="btn btn-primary rounded-0"
                  href="/30/addMedicalProvider/3/46/"
                  data-toggle="modal"
                  data-target="#newProvider"
                >
                  <span className="font-weight-bold text-gold pr-2">+</span>New
                  Provider
                </a>
                <div className="three-view-icons">
                  <Link to={`/simple/`} style={linkStyle}>
                    <span
                      className="three-icons"
                      onclick="location.href='/30/49/3/46/';"
                    >
                      <img src={SimpleIcon} width="35" />
                      Simple
                    </span>
                  </Link>
                  <Link to={`/treatment/`} style={linkStyle}>
                    <span
                      className="three-icons active"
                      onclick="location.href='/30/9/3/46/';"
                    >
                      <img src={DetailIcon} width="35" />
                      Detail
                    </span>
                  </Link>
                  <Link to={`/dates/`} style={linkStyle}>
                    <span
                      className="three-icons white-space"
                      onclick="location.href='/30/48/3/46/';"
                    >
                      <img src={DatesIcon} width="35" />
                      Dates
                      <span className="treatment-date"></span>
                    </span>
                  </Link>
                </div>
              </div>

              <PageChecklist entity={"Treatment"} />
            </div> */}

            <div className="container-fluid overflow-hidden p-main-center-div">
              <div className="custom-tab custom-tab-fixed-position">
                <nav className="mr-206px " id="spec-nav" ref={navRef}>
                  <div
                    className="nav nav-tabs c-padding-l justify-content-around spec-nav-tab flex-nowrap h-20px"
                    id="nav-tab"
                    role="tablist"
                  >
                    <a
                      className="p-0 nav-item nav-link active Pad8 tab-item spec-tab-item-all edit-case-tabs all-specialties
                                        c-align-speciality"
                      data-id="all"
                      onClick={() => handleSpecialtyChange("all")}
                      role="tab"
                      style={{ cursor: "pointer" }}
                    >
                      All Specialities
                    </a>

                    {specialitiesList.map((specialitie) => (
                      <Specialities
                        key={specialitie.id}
                        specialitie={specialitie}
                        useAbbreviations={useAbbreviations}
                        onSpecialtyChange={handleSpecialtyChange}
                        isActive={activeSpecialty === specialitie.id}
                      />
                    ))}
                  </div>
                </nav>
              </div>
              <div className="row content-below-fixed">
                <div className="col-12">
                  {specialitiesList.map((specialitie) =>
                    activeSpecialty === "all" ||
                    activeSpecialty === specialitie.id
                      ? caseProvidersList
                          .filter(
                            (caseProvider) =>
                              caseProvider.specialty === specialitie.id
                          )
                          .map((caseProvider) => (
                            <TreatmentCaseProvider
                              key={caseProvider.id}
                              caseProvider={caseProvider}
                              setcaseProvidersList={setcaseProvidersList}
                              specialitie={specialitie}
                              setSpecialitiesList={setSpecialitiesList}
                              onUpdate={handleUpdate}
                            />
                          ))
                      : null
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TreatmentPage;
