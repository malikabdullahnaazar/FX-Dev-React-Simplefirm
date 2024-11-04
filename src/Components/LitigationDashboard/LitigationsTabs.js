import React, { useEffect, useState, useContext } from 'react';
import "../../../public/BP_resources/css/litigation.css";
import { Nav, Tab, TabContent } from "react-bootstrap";
import AllContent from "./LitigationTabInfo/AllContent";
import FilingsContent from "./LitigationTabInfo/FilingsContent";
import DiscoveryContent from "./LitigationTabInfo/DiscoveryContent";
import MotionContent from "./LitigationTabInfo/MotionContent";
import api from "../../api/api";
import axios from "axios";
import { getCaseId, getClientId } from "../../Utils/helper";
import SOLContent from "./LitigationTabInfo/SOLTabComp";
import HearingContent from "./LitigationTabInfo/HearingContent";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import DespositionContent from './LitigationTabInfo/DespositionContent';
import ExamContent from './LitigationTabInfo/ExamContent';
import TrailContent from './LitigationTabInfo/TrailContent';
import DeadlineContent from './LitigationTabInfo/DeadlineContent';
import EventsContent from './LitigationTabInfo/EventsContent';


export default function LitigationTab() {
  const clientId = getClientId();
  const caseId = getCaseId();
  const [activeKey, setActiveKey] = useState("all-panel");
  const [tabData, setTabData] = useState({});
  const token = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const [solData, setSolData] = useState([]);
  const {isLitigationDataUpdate, setLitigationDataUpdated} =useContext(ClientDataContext);
  const [firstTimeLitData, setFirstTimeLitData] = useState(true);
  
  const fecthSOLData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/litigation-page/solcase/${clientId}/${caseId}/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if(firstTimeLitData){
        setSolData(response.data?.solcase_data);
        setFirstTimeLitData(false);
      }
      if(isLitigationDataUpdate){
        setSolData(response.data?.solcase_data);
        setLitigationDataUpdated(false);
      }
        
    } catch (error) {
      console.log(error);
    }
  };

  const fecthData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/litigation-page/litigations-acts/${clientId}/${caseId}/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
        setTabData(response.data);
        if(firstTimeLitData){
          setTabData(response.data);
          setFirstTimeLitData(false);
        }
        if(isLitigationDataUpdate){
          setTabData(response.data);
          setLitigationDataUpdated(false);
        }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fecthData();
    if (isLitigationDataUpdate) {
      setLitigationDataUpdated(false);
    }
  }, [isLitigationDataUpdate, clientId, tabData, caseId]);

  //hook to fetch SOL data
  useEffect(() => {
    fecthSOLData();
    if (isLitigationDataUpdate) {
      setLitigationDataUpdated(false);
    }
  }, [isLitigationDataUpdate, clientId, solData, caseId]);

  const handleSelect = (key) => {
    setActiveKey(key);
  };

  return (
    <div className="custom-tab m-b-5">
      <Tab.Container activeKey={activeKey} onSelect={handleSelect}>
        <nav className="border-0 ml-0 m-r-15" id="margin-right-10">
          <div className="white-div"></div>
          <Nav
            className="nav nav-tabs flex-nowrap  background-main-10"
            id="nav-tab"
            role="tablist"
            style={{ width: "calc(100% - 300px)" }}
          >
            <div className="white-div"></div>

            <Nav.Link eventKey="all-panel" className="nav-item nav-link">All</Nav.Link>

            <Nav.Link eventKey="filings" className="nav-item nav-link">
              <i className="ic ic-19 ic-filing-grey m-r-5"></i>
              <span className="text">Filings</span>
            </Nav.Link>

            <Nav.Link eventKey="hearings" className="nav-item nav-link">
              <i className="ic ic-19 ic-hearing-grey m-r-5"></i>
              <span className="text">Hearings</span>
            </Nav.Link>

            <Nav.Link eventKey="motion" className="nav-item nav-link">
              <i className="ic ic-19 ic-motion-grey m-r-5"></i>
              <span className="text">Motions</span>
            </Nav.Link>

            <Nav.Link eventKey="discovery" className="nav-item nav-link">
              <i className="ic ic-19 ic-discovery-grey m-r-5"></i>
              <span className="text">Discovery</span>
            </Nav.Link>

            <Nav.Link eventKey="deposition" className="nav-item nav-link">
              <i className="ic ic-19 ic-deposition-grey m-r-5"></i>
              <span className="text">Depositions</span>
            </Nav.Link>

            <Nav.Link eventKey="exam-modules" className="nav-item nav-link">
              <i className="ic ic-19 ic-exam-grey m-r-5"></i>
              <span className="text">Exams</span>
            </Nav.Link>

            <Nav.Link eventKey="trial" className="nav-item nav-link">
              <i className="ic ic-19 ic-trial-grey m-r-5"></i>
              <span className="text">Trial</span>
            </Nav.Link>

            <Nav.Link eventKey="deadline" className="nav-item nav-link">
              <i className="ic ic-19 ic-deadline-grey m-r-5"></i>
              <span className="text">Deadline</span>
            </Nav.Link>

            <Nav.Link eventKey="other-litigation" className="nav-item nav-link">
              <i className="ic ic-19 ic-event-grey m-r-5"></i>
              <span className="text">Events</span>
            </Nav.Link>
            <Nav.Link
              eventKey="sol"
              id=""
              className="litigation-sol-tab"
            >
              S.O.L
            </Nav.Link>
          </Nav>
        </nav>

        <Tab.Content>
          <Tab.Pane eventKey="all-panel">
            {tabData?.categorized_litigation_acts &&
              Object.entries(tabData?.categorized_litigation_acts).map(
                ([categoryName, items]) =>
                  items.map((obj, index) => (
                    <AllContent
                      key={`${categoryName}-${index}`}
                      name={categoryName}
                      object={obj}
                    />
                  ))
              )}
            {solData?.map((item, index) => (
              <SOLContent
                key={index}
                solcase={item.less_than_18}
                solcaseData={item.solcase}
                calculatedData={item.calculated_date} />
            ))}
            {/* <AllContent /> */}
          </Tab.Pane>
          <Tab.Pane eventKey="filings">
            <div class="panel-sub-title height-25 d-flex align-items-center bg-primary  row-low-tab">
              <p class="text-lg">Filings</p>
            </div>
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Filing?.map((obj) => (
                <FilingsContent object={obj} name="Filing" />
              ))}
          </Tab.Pane>
          <Tab.Pane eventKey="hearings">
            <div class="panel-sub-title height-25 d-flex align-items-center bg-primary  row-low-tab">
              <p class="text-lg">Hearings</p>
            </div>
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Hearing?.map((obj) => (
                <HearingContent object={obj} name="Hearing" />
              ))}
          </Tab.Pane>
          <Tab.Pane eventKey="motion">
            <div class="panel-sub-title height-25 d-flex align-items-center bg-primary  row-low-tab">
              <p class="text-lg">Motion</p>
            </div>
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Motion?.map((obj) => (
                <MotionContent object={obj} name="Motion" />
              ))}
          </Tab.Pane>
          <Tab.Pane eventKey="discovery">
            <div class="panel-sub-title height-25 d-flex align-items-center bg-primary  row-low-tab">
              <p class="text-lg">Discover</p>
            </div>
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Discovery?.map((obj) => (
                <DiscoveryContent object={obj} name="Discovery" />
              ))}
          </Tab.Pane>
          <Tab.Pane eventKey="deposition">
            <div class="panel-sub-title height-25 d-flex align-items-center bg-primary  row-low-tab">
              <p class="text-lg">Deposition</p>
            </div>
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Depos?.map((obj) => (
                <DespositionContent object={obj} name="Deposition" />
              ))}
          </Tab.Pane>
          <Tab.Pane eventKey="exam-modules">
            <div class="panel-sub-title height-25 d-flex align-items-center bg-primary  row-low-tab">
              <p class="text-lg">Exams</p>
            </div>
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Exam?.map((obj) => (
                <ExamContent object={obj} name="Exam" />
              ))}
          </Tab.Pane>
          <Tab.Pane eventKey="trial">
            <div class="panel-sub-title height-25 d-flex align-items-center bg-primary  row-low-tab">
              <p class="text-lg">Trial</p>
            </div>
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Trial?.map((obj) => (
                <TrailContent object={obj} name="Trial" />
              ))}
          </Tab.Pane>
          <Tab.Pane eventKey="deadline">
            <div class="panel-sub-title height-25 d-flex align-items-center bg-primary  row-low-tab">
              <p class="text-lg">Deadline</p>
            </div>
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Deadline?.map((obj) => (
                <DeadlineContent object={obj} name="Deadline" />
              ))}
          </Tab.Pane>
          <Tab.Pane eventKey="other-litigation">
            <div class="panel-sub-title height-25 d-flex align-items-center bg-primary  row-low-tab">
              <p class="text-lg">Events</p>
            </div>
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Event?.map((obj) => (
                <EventsContent object={obj} name="Event" />
              ))}
          </Tab.Pane>
          <Tab.Pane eventKey="sol">
            <div class="panel-sub-title height-25 d-flex align-items-center bg-primary  row-low-tab">
              <p class="text-lg">Birthday</p>
            </div>
            {solData?.map((item, index) => (
              <SOLContent
                key={index}
                solcase={item.less_than_18}
                solcaseData={item.solcase}
                calculatedData={item.calculated_date} />
            ))}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

const LitigationDocRows = () => {
  return (
    <div className="docs-row-litigation mt-3">
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading "><p class="text-lg-grey">Court Form</p></div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading "><p class="text-lg-grey">Court Form</p></div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading "><p class="text-lg-grey">Court Form</p></div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading "><p class="text-lg-grey">Court Form</p></div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading "><p class="text-lg-grey">Court Form</p></div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading "><p class="text-lg-grey">Court Form</p></div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading "><p class="text-lg-grey">Court Form</p></div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading "><p class="text-lg-grey">Court Form</p></div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading "><p class="text-lg-grey">Court Form</p></div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
    </div>
  );
};
