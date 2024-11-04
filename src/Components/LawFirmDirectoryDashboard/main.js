import React, { useState, useEffect } from "react";
import "./directory-47.css";
import AccountsTable from "./Content/AccountsTable";
import ReportTable from "./Content/ReportTable";
import InsuranceCompanyTable from "./Content/InsuranceCompanyTable";
import InsuranceAdjusterTable from "./Content/InsuranceAdjusterTable";
import ExpertTable from "./Content/ExpertTable";
import LawFirmTable from "./Content/LawFirmTable";
import AttorneyTable from "./Content/AttorneyTable";
import CaseLoanTable from "./Content/CaseLoanTable";
import CourtsTable from "./Content/CourtsTable";
import JudgeTable from "./Content/JudgeTable";
import DepartmentTable from "./Content/DepartmentTable";
import ProviderTable from "./Content/ProviderTable";
import LitigationEventTable from "./Content/LitigationEventTable";
import TimeCodeTable from "./Content/TimeCodeTable";
import StatueTable from "./Content/StatueTable";
import ProcessServerTable from "./Content/ProcessServerTable";
import CoPilotTable from "./Content/CoPilotTable";

import SearchTab from "./SearchTab";
import ActionBarComponent from "../common/ActionBarComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentTab,
  setHasNoData,
  setIsSearchDisabled,
} from "../../Redux/Directory/directorySlice";
import FederalCourtDistrictTable from "./Content/FederalCourtDistrictTable";

function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}
// Prevent the click from opening modal
export const handleLinkClick = (e) => {
  e.stopPropagation();
};
export default function LawFirmDirectoryDashboard() {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const currentTab = useSelector((state) => state.directory.currentTab);
  const dispatch = useDispatch();
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 1000);

    window.addEventListener("resize", debouncedHandleResize);

    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  const handleTabChange = (tab) => {
    dispatch(setCurrentTab(tab));
    dispatch(setIsSearchDisabled(false));
    dispatch(setHasNoData(false));
  };

  useEffect(() => {
    dispatch(setCurrentTab("copilotfirms"));
  }, []);

  const turncatetext = (text) => {
    let num = 15;
    if (dimensions.width > 2000) {
      num = 13;
    } else if (dimensions.width > 1500 && dimensions.width < 2000) {
      num = 12;
    } else if (dimensions.width > 1000 && dimensions.width < 1500) {
      num = 10;
    } else if (dimensions.width > 768 && dimensions.width < 1000) {
      num = 9;
    } else num = 7;
    if (text.length < num) {
      return text;
    } else return text.slice(0, num) + "...";
  };

  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <div className="col-12 px-0">
      <div className="notes-section-wrapper pt-0">
        <div className="action-bar-wrapper heigh-35 position-relative mr-0  ">
          <ActionBarComponent
            src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/directory-logo-icon.svg"
            page_name={"Law Firm Directory"}
          />
          {/* <div
            className="action-bar client-BarAlign d-flex m-b-5 m-t-5"
            style={{ left: 148 }}
          >
            <span className="page-icon">
              <img
                className="translate-note-icon"
                src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/directory-logo-icon.svg"
              />
            </span>
            <div className="text-wrapper text-white d-flex align-items-center ">
              <h2 className="text-white">Law Firm Directory</h2>
            </div>
          </div> */}
        </div>

        <SearchTab />

        <div
          className="nav nav-tabs directory-tab-box h-25px"
          id="nav-tab"
          role="tablist"
          style={{ paddingRight: "16px" }}
        >
          <a
            className="nav-item nav-link active PT9-LFD me-3"
            id="custom-nav-copilotfirms-tab"
            data-toggle="tab"
            href="#custom-nav-copilotfirms"
            role="tab"
            aria-controls="custom-nav-home"
            aria-selected="true"
            onClick={() => handleTabChange("copilotfirms")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="CoPilot Firms"
          >
            {turncatetext("CoPilot Firms")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="reporting_agency-nav-tab"
            data-toggle="tab"
            href="#reporting_agency-nav-home"
            role="tab"
            aria-controls="reporting_agency-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("reporting-agency")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Reporting Agency"
          >
            {turncatetext("Reporting Agency")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="insurance_company-nav-tab"
            data-toggle="tab"
            href="#insurance_company-nav-home"
            role="tab"
            aria-controls="insurance_company-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("insurance-company")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Insurance Company"
          >
            {turncatetext("Insurance Company")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="insurance_adjuster-nav-tab"
            data-toggle="tab"
            href="#insurance_adjuster-nav-home"
            role="tab"
            aria-controls="insurance_adjuster-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("insurance-adjuster")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Insurance Adjuster"
          >
            Insurance Ad
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="expert-nav-tab"
            data-toggle="tab"
            href="#expert-nav-home"
            role="tab"
            aria-controls="expert-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("experts")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Expert"
          >
            {turncatetext("Expert")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="lawfirm-nav-tab"
            data-toggle="tab"
            href="#lawfirm-nav-home"
            role="tab"
            aria-controls="lawfirm-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("law-firm")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Law Firm"
          >
            {turncatetext("Law Firm")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="attorney-nav-tab"
            data-toggle="tab"
            href="#attorney-nav-home"
            role="tab"
            aria-controls="attorney-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("attorney")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Attorney"
          >
            {turncatetext("Attorney")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="caseloan-nav-tab"
            data-toggle="tab"
            href="#caseloan-nav-home"
            role="tab"
            aria-controls="caseloan-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("case-loan")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Case Loan"
          >
            {turncatetext("Case Loan")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="courts-nav-tab"
            data-toggle="tab"
            href="#courts-nav-home"
            role="tab"
            aria-controls="courts-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("courts")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Courts"
          >
            {turncatetext("Courts")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="judge-nav-tab"
            data-toggle="tab"
            href="#judge-nav-home"
            role="tab"
            aria-controls="judge-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("judge")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Judge"
          >
            {turncatetext("Judge")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="department-nav-tab"
            data-toggle="tab"
            href="#department-nav-home"
            role="tab"
            aria-controls="department-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("department")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Department"
          >
            {turncatetext("Department")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="provider-nav-tab"
            data-toggle="tab"
            href="#provider-nav-home"
            role="tab"
            aria-controls="provider-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("provider")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Provider"
          >
            {turncatetext("Provider")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="litigationact-nav-tab"
            data-toggle="tab"
            href="#litigationact-nav-home"
            role="tab"
            aria-controls="litigationact-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("litigation-event")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Litigation Event"
          >
            {turncatetext("Litigation Event")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="timecodes-nav-tab"
            data-toggle="tab"
            href="#timecodes-nav-home"
            role="tab"
            aria-controls="timecodes-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("time-codes")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Time Codes"
          >
            {turncatetext("Time Codes")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="statute-nav-tab"
            data-toggle="tab"
            href="#statute-nav-home"
            role="tab"
            aria-controls="statute-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("statute")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Statute"
          >
            {turncatetext("Statute")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="process_server-nav-tab"
            data-toggle="tab"
            href="#process_server-nav-home"
            role="tab"
            aria-controls="process_server-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("process-server")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Process Server"
          >
            {turncatetext("Process Server")}
          </a>
          <a
            className="nav-item nav-link PT9-LFD"
            id="federal_court_district-nav-tab"
            data-toggle="tab"
            href="#federal_court_district-nav-home"
            role="tab"
            aria-controls="federal_court_district-nav-home"
            aria-selected="false"
            onClick={() => handleTabChange("federal-court-district")}
            style={{
              transition: "all -0.1s ease",
              // padding: "7px 10px",
              margin: "0",
              border: "none",
              boxSizing: "border-box",
            }}
            data-text="Federal Court District"
          >
            {turncatetext("Federal Court District")}
          </a>
          <a className="nav-item nav-link">
            {turncatetext("Search Attorneys")}
          </a>
        </div>

        <div
          className="tab-content directroy-tables-container"
          id="nav-tabContent"
        >
          <div
            className="tab-pane fade show active"
            id="custom-nav-copilotfirms"
            role="tabpanel"
            aria-labelledby="custom-nav-copilotfirms-tab"
          >
            {currentTab == "copilotfirms" && <CoPilotTable />}
          </div>
          <div
            className="tab-pane fade "
            id="reporting_agency-nav-home"
            role="tabpanel"
            aria-labelledby="reporting_agency-nav-tab"
          >
            {currentTab == "reporting-agency" && <ReportTable />}
          </div>
          <div
            className="tab-pane fade"
            id="insurance_company-nav-home"
            role="tabpanel"
            aria-labelledby="insurance_company-nav-tab"
          >
            {currentTab == "insurance-company" && <InsuranceCompanyTable />}
          </div>
          <div
            className="tab-pane fade"
            id="insurance_adjuster-nav-home"
            role="tabpanel"
            aria-labelledby="insurance_adjuster-nav-tab"
          >
            {currentTab == "insurance-adjuster" && <InsuranceAdjusterTable />}
          </div>
          <div
            className="tab-pane fade"
            id="expert-nav-home"
            role="tabpanel"
            aria-labelledby="expert-nav-tab"
          >
            {currentTab == "experts" && <ExpertTable />}
          </div>

          <div
            className="tab-pane fade"
            id="lawfirm-nav-home"
            role="tabpanel"
            aria-labelledby="lawfirm-nav-tab"
          >
            {currentTab == "law-firm" && <LawFirmTable />}
          </div>

          <div
            className="tab-pane fade"
            id="attorney-nav-home"
            role="tabpanel"
            aria-labelledby="attorney-nav-tab"
          >
            {currentTab == "attorney" && <AttorneyTable />}
          </div>
          <div
            className="tab-pane fade"
            id="caseloan-nav-home"
            role="tabpanel"
            aria-labelledby="caseloan-nav-tab"
          >
            {currentTab == "case-loan" && <CaseLoanTable />}
          </div>
          <div
            className="tab-pane fade"
            id="courts-nav-home"
            role="tabpanel"
            aria-labelledby="courts-nav-tab"
          >
            {currentTab == "courts" && <CourtsTable />}
          </div>
          <div
            className="tab-pane fade"
            id="judge-nav-home"
            role="tabpanel"
            aria-labelledby="judge-nav-tab"
          >
            {currentTab == "judge" && <JudgeTable />}
          </div>

          <div
            className="tab-pane fade"
            id="department-nav-home"
            role="tabpanel"
            aria-labelledby="department-nav-tab"
          >
            {currentTab == "department" && <DepartmentTable />}
          </div>
          <div
            className="tab-pane fade"
            id="provider-nav-home"
            role="tabpanel"
            aria-labelledby="provider-nav-tab"
          >
            {currentTab == "provider" && <ProviderTable />}
          </div>
          <div
            className="tab-pane fade"
            id="litigationact-nav-home"
            role="tabpanel"
            aria-labelledby="litigationact-nav-tab"
          >
            {currentTab == "litigation-event" && <LitigationEventTable />}
          </div>
          <div
            className="tab-pane fade"
            id="timecodes-nav-home"
            role="tabpanel"
            aria-labelledby="timecodes-nav-tab"
          >
            {currentTab == "time-codes" && <TimeCodeTable />}
          </div>
          <div
            className="tab-pane fade"
            id="statute-nav-home"
            role="tabpanel"
            aria-labelledby="statute-nav-tab"
          >
            {currentTab == "statute" && <StatueTable />}
          </div>
          <div
            className="tab-pane fade"
            id="process_server-nav-home"
            role="tabpanel"
            aria-labelledby="process_server-nav-tab"
          >
            {currentTab == "process-server" && <ProcessServerTable />}
          </div>
          <div
            className="tap-pane fade"
            id="federal_court_district-nav-home"
            role="tabpanel"
            aria-labelledby="federal_court_district-nav-tab"
          >
            {currentTab == "federal-court-district" && (
              <FederalCourtDistrictTable />
            )}
          </div>
        </div>
        <footer className="footer-directry">
          <div className="fotter-content-directory"></div>
        </footer>
      </div>
    </div>
  );
}
