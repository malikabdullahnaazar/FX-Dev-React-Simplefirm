import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import ActionBarLitigation from "../Components/LitigationDashboard/ActionBarLitigation";
import "../../public/BP_resources/css/litigation.css";
import LitigationCase from "../Components/LitigationDashboard/litigationCase";
import LitigationDefendant from "../Components/LitigationDashboard/litigationDefendantTable";
import { useDispatch, useSelector } from "react-redux";
import LitigationCourtInfo from "../Components/LitigationDashboard/LitigationCourtDetail";
import LitigationJudgeInfo from "../Components/LitigationDashboard/LitigationJudgeDetail";
import LitigationClerkInfo from "../Components/LitigationDashboard/LitigationClerkDetail";
import LitigationTimeline from "../Components/LitigationDashboard/LitigationTimeline";
import LitigationTab from "../Components/LitigationDashboard/LitigationsTabs";
import LitigationNotes from "../Components/LitigationDashboard/LitigationNotes";
import { getClientId, getCaseId } from "../Utils/helper";
import axios from "axios";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import { ClientDataContext } from "../Components/ClientDashboard/shared/DataContext";
import useIsStates from "../Hooks/getStates";
import { setSearchRecordId } from "../Redux/search/searchSlice";
import LitigationTimeLines from "../Components/LitigationDashboard/LitigationTimelines";

const LitigationPage = ({}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  // const currentCase = useSelector((state) => state?.caseData?.current);
  const currentCaseId = getCaseId();
  // const client = useSelector((state) => state?.client?.current);
  const clientId = getClientId();
  // const tabsPage = useSelector((state) => state.caseData?.pages);
  const [litigationData, setLitigationData] = useState({});
  const [defendantsData, setDefendantsData] = useState([]);
  const [DefendantProcessedPageSlots, setDefendantProcessedPageSlots] =
    useState([]);
    const {isLitigationDashboardDataUpdate, setLitigationDashboardDataUpdated} =useContext(ClientDataContext);
  const [CardsData, setCardsData] = useState(false);
  const [firstTimeLitigationtData, setFirstTimeLitigationData] = useState(true);
  const states = useIsStates();
  const searchRecordId = useSelector((state) => state.searchS.searchRecordId);

  const fetchLitigationData = async () => {
    try {
      const litigation_data = await axios.get(
        origin +
          "/api/litigation-page/litigations/" +
          clientId +
          "/" +
          currentCaseId +
          "/",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (firstTimeLitigationtData) {
        setLitigationData(litigation_data.data);
        setDefendantsData(litigation_data.data?.defendants);
        setDefendantProcessedPageSlots(
          litigation_data.data?.defendant_processed_page_slots
        );
        setFirstTimeLitigationData(false);
      }
      if (isLitigationDashboardDataUpdate) {
        setLitigationData(litigation_data.data);
        setDefendantsData(litigation_data.data?.defendants);
        setDefendantProcessedPageSlots(
          litigation_data.data?.defendant_processed_page_slots
        );
        setLitigationDashboardDataUpdated(false);
      }
    } catch (error) {
      console.log("Failed to fetch Litigation Data:", error);
    }
  };
  // State Hooks

  const [currentCase, setCurrentCase] = useState([]);

  //data for components
  function settingCardsData() {
    const CardsDataSetter = {
      CaseData: {
        litigation_id: litigationData?.litigation?.id,
        case_name: litigationData?.litigation?.case_name,
        case_number: litigationData?.litigation?.case_number,
        court_title1: litigationData?.litigation?.court_title1,
        court_title2: litigationData?.litigation?.court_title2,
        court_name: litigationData?.litigation?.court_name,
        county: litigationData?.litigation?.county,
        state: litigationData?.litigation?.state,
        filing_type: litigationData?.litigation?.filing_type,
        case_full_name: litigationData?.litigation?.case_full_name,
        case_short_name: litigationData?.litigation?.case_short_name,
      },
      CourtData: {
        litigation_id: litigationData?.litigation?.id,
        court_name: litigationData?.litigation?.court_name,
        court_title1: litigationData?.litigation?.court_title1,
        court_title2: litigationData?.litigation?.court_title2,
        court_contact: {
          current_id: litigationData?.litigation?.court_contact?.id,
          address1:
            litigationData?.litigation?.court_contact?.address1 ||
            litigationData?.litigation?.court_address1,
          address2:
            litigationData?.litigation?.court_contact?.address2 ||
            litigationData?.litigation?.court_address2,
          city:
            litigationData?.litigation?.court_contact?.city ||
            litigationData?.litigation?.court_address_city,
          state:
            litigationData?.litigation?.court_contact?.state ||
            litigationData?.litigation?.state,
          zip:
            litigationData?.litigation?.court_contact?.zip ||
            litigationData?.litigation?.court_address_zip,
          phone_number: litigationData?.litigation?.court_contact?.phone_number, // This should be 10 digits long (no formatting needed)
          fax: litigationData?.litigation?.court_contact?.fax, // This should also be 10 digits long (no formatting needed)
          email: litigationData?.litigation?.court_contact?.email,
        },
      },
      JudgeData: {
        litigation_id: litigationData?.litigation?.id,
        judge_first_name:
          litigationData?.litigation?.judge_department_contact?.first_name ||
          litigationData?.litigation?.judge_first_name,
        judge_last_name:
          litigationData?.litigation?.judge_department_contact?.last_name ||
          litigationData?.litigation?.judge_last_name,
        department: litigationData?.litigation?.department,
        judge_department_contact: {
          current_id: litigationData?.litigation?.judge_department_contact?.id,
          address1:
            litigationData?.litigation?.judge_department_contact?.address1,
          address2:
            litigationData?.litigation?.judge_department_contact?.address2,
          city: litigationData?.litigation?.judge_department_contact?.city,
          state: litigationData?.litigation?.judge_department_contact?.state,
          zip: litigationData?.litigation?.judge_department_contact?.zip,
          phone_number:
            litigationData?.litigation?.judge_department_contact?.phone_number, // No formatting needed
          fax: litigationData?.litigation?.judge_department_contact?.fax, // No formatting needed
          email: litigationData?.litigation?.judge_department_contact?.email,
        },
      },
      ClerkData: {
        litigation_id: litigationData?.litigation?.id,
        clerk_first_name:
          litigationData?.litigation?.clerk_contact?.first_name ||
          litigationData?.litigation?.clerk_first_name,
        clerk_last_name:
          litigationData?.litigation?.clerk_contact?.last_name ||
          litigationData?.litigation?.clerk_last_name,
        department: litigationData?.litigation?.department,
        clerk_department_contact: {
          current_id: litigationData?.litigation?.clerk_contact?.id,
          address1: litigationData?.litigation?.clerk_contact?.address1,
          address2: litigationData?.litigation?.clerk_contact?.address2,
          city: litigationData?.litigation?.clerk_contact?.city,
          state: litigationData?.litigation?.clerk_contact?.state,
          zip: litigationData?.litigation?.clerk_contact?.zip,
          phone_number: litigationData?.litigation?.clerk_contact?.phone_number, // 10-digit phone number (no formatting needed)
          fax: litigationData?.litigation?.clerk_contact?.fax, // 10-digit fax number (no formatting needed)
          email: litigationData?.litigation?.clerk_contact?.email,
        },
      },
    };
    return CardsDataSetter;
  }

  useEffect(() => {
    fetchLitigationData();
    setCardsData(settingCardsData());
    if (isLitigationDashboardDataUpdate) {
      setLitigationDashboardDataUpdated(false);
    }
  }, [clientId, currentCaseId, isLitigationDashboardDataUpdate, litigationData]);

  const sampleTimelineEvents = [
    {
      date: '2024-09-15',
      events: [
        {
          type: 'Litigation',
          event: {
            is_allday: true,
            event_id: { event_name: 'Court Hearing' }
          }
        },
        {
          type: 'DefendantDates',
          event: {
            is_allday: true,
            event_id: { event_name: 'Served Notice' }
          }
        }
      ]
    },
    {
      date: '2024-09-18',
      events: [
        {
          type: 'Litigation',
          event: {
            is_allday: false,
            event_id: { event_name: 'Motion Filed' }
          }
        }
      ]
    }
  ];

  useEffect(() => {
    dispatch(setSearchRecordId(""));
  }, [searchRecordId]);
  const open = useSelector((state) => state?.open?.open);
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar flaggedPageName="Litigation" />
        <ActionBarLitigation LitigationDetail={CardsData.CaseData}/>
        <div
          className=" overflow-auto Lit-ML5PL"
          style={{ marginTop: "10.5rem", width: "100%", zIndex: "0" }}
        >
          <div
            className="row"
            style={{
              zIndex: open ? "0" : "",
              position: open ? "relative" : "",
            }}
          >
            <div className="col-12">
              <div className="row litigation-main-wrapper-responsive d-flex flex-nowrap no-gutters m-b-5">
                <div className="litigation-left content-left d-flex-1 p-r-10">
                  <div className="border-box has-checklist rounded-0 overflow-hidden">
                    <div className="row no-gutters">
                      <div className="col-12 p-0">
                        <div className="row no-gutters equal-column-wrapper position-relative p-l-5">
                          <LitigationCase
                            caseInfo={CardsData.CaseData}
                            states={states}
                          />
                          <LitigationDefendant
                            defendants={defendantsData}
                            defendantProcessedPageSlots={
                              DefendantProcessedPageSlots
                            }
                            fetchLitigationData={fetchLitigationData}
                            setIsClientDataUpdated={setLitigationDashboardDataUpdated}
                          />
                          <div class="d-flex w-780">
                            <LitigationCourtInfo
                              Court={CardsData.CourtData}
                              states={states}
                            />
                            <LitigationJudgeInfo
                              Judge={CardsData.JudgeData}
                              states={states}
                            />
                            <LitigationClerkInfo
                              Clerk={CardsData.ClerkData}
                              states={states}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="litigation-right content-right bg-white"
                  id="right-timeline"
                >
                  <div class="right-calendar border-0 p-0">
                  <LitigationTimeLines timeline_events={litigationData?.timeline_events} sol_events={litigationData?.sol_events} />
                  </div>
                </div>
              </div>
              {/* <div class="row">
                <div class="litigation-tabs mr-15 w-100">
                  <LitigationTab />
                </div>
              </div>
              <NotesSectionDashboard /> */}
            </div>
          </div>
              <LitigationTab />
              <NotesSectionDashboard />
        </div>
      </div>
    </div>
  );
};

export default LitigationPage;