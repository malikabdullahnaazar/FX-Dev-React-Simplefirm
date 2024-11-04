import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import api from "../api/api";
import "../../public/BP_resources/css/experts-i65.css";
import NotesPanel from "../Components/NotesPanelSection/NotesPanel";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import {
  fetchShakespeareStatus,
  getCaseId,
  getClientId,
} from "../Utils/helper";
import { Button, Modal } from "react-bootstrap";
import ExpertContact from "../Components/Experts/ExpertContact";
import SecondContact from "../Components/Experts/SecondContact";
import Information from "../Components/Experts/Information";
import DocumentRow from "../Components/DocumentRow/DocumentRow";
import ExpertActionBar from "../Components/Experts/ExpertActionBar";
import ExpertTitleBar from "../Components/Experts/ExpertTitleBar";
import EditCaseExpertModal from "../Components/Experts/ExpertsModals/EditCaseExpertModal";
import RetainedBy from "../Components/Experts/RetainedBy";
import Retained from "../Components/Experts/Retained";
import ConfirmDeletePopup from "../Components/ReportPage/ReportModals/ConfirmDeletePopup";
import { setSearchRecordId } from "../Redux/search/searchSlice";

//RK ::2024-26-06 10-31pm
function ExpertsPage() {
  const dispatch = useDispatch();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const client = useSelector((state) => state.todos.client);
  const pages = useSelector((state) => state.todos.pages);
  const currentCase = useSelector((state) => state.todos.currentCase);
  const currentCaseId = getCaseId();
  const clientId = getClientId();

  const [experts, setExperts] = useState([]);
  const [isFecthExperts, setIsFetchExperts] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [forDeleteExpertId, setForDeleteExpertId] = useState(null);
  const selectedEditableTabPanel = useRef("");

  // For scolling to a specific report page
  const expertRefs = useRef({});
  const containerRef = useRef(null);
  const searchRecordId = useSelector((state) => state.searchS.searchRecordId);

  // console.log(experts)

  const fecthExperts = async () => {
    try {
      setIsFetchExperts(false);
      const response = await api.get(
        `${origin}/api/experts/${clientId}/${currentCaseId}/`
      );
      if (response.status === 200) {
        setExperts(response.data);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fecthExperts();
    fetchShakespeareStatus(currentCaseId, clientId, "Experts", dispatch);
  }, [isFecthExperts]);

  const handleFacthExperts = () => {
    setIsFetchExperts(true);
  };

  const handleCloseFucton = () => {
    setSelectedExpert(null);
  };

  const showDeleteConfirmPopup = () => {
    setShowDeleteConfirm(true);
    setSelectedExpert(null);
  };

  const hideDeleteConfirmPopup = () => {
    setShowDeleteConfirm(false);
  };

  //Delete Post is handeled here
  const handleDeleteSubmission = async () => {
    try {
      setIsFetchExperts(false);
      const response = await api.delete(
        `${origin}/api/delete_expert/${forDeleteExpertId}/`
      );
      if (response.status === 204) {
        hideDeleteConfirmPopup();
        handleFacthExperts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // For Scrolling to specfic defendant record from redirected from search page
  useEffect(() => {
    // Scroll to that specific record
    if (searchRecordId && expertRefs.current[searchRecordId]) {
      const searchRecordElement = expertRefs.current[searchRecordId];
      const containerElement = containerRef.current;

      // Calculate the top offset of the product relative to the container
      const searchRecordOffsetTop = searchRecordElement.offsetTop;
      const containerScrollTop = containerElement.scrollTop;
      const smallScrollAdjustment = 10;

      // Scroll the container to the product with a small adjustment
      containerElement.scrollTo({
        top: searchRecordOffsetTop - containerScrollTop - smallScrollAdjustment,
        behavior: "smooth",
      });

      dispatch(setSearchRecordId(""));
    }
  }, [experts]);

  return (
    <div className="page-wrapper">
      <Sidebar pages={pages} />
      <div className="page-container">
        <NavBar
          client={client}
          currentCase={currentCase}
          flaggedPageName={"Experts"}
        />
        <ExpertActionBar onFetchExperts={handleFacthExperts} />
        <div
          className="experts-main-container  invisible-scrollbar"
          ref={containerRef}
          style={{ overflowY: "auto", maxHeight: "100vh" }}
        >
          {experts &&
            experts.map((object) => (
              <div
                className="expert"
                key={object.id}
                ref={(el) => (expertRefs.current[object?.id] = el)}
              >
                <ExpertTitleBar {...object} />
                <div className="flex-row d-flex" style={{ overflow: "hidden" }}>
                  <div className="reports-data row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels padding-t-5">
                    <ExpertContact
                      object={object}
                      onSelectExpert={() => (
                        setSelectedExpert(object),
                        (selectedEditableTabPanel.current = "expert-contact"),
                        setForDeleteExpertId(object.id)
                      )}
                    />

                    <SecondContact
                      object={object}
                      onSelectExpert={() => (
                        setSelectedExpert(object),
                        (selectedEditableTabPanel.current = "agency-contact"),
                        setForDeleteExpertId(object.id)
                      )}
                    />

                    <Retained
                      object={object}
                      onSelectExpert={() => (
                        setSelectedExpert(object),
                        (selectedEditableTabPanel.current = "retained"),
                        setForDeleteExpertId(object.id)
                      )}
                    />
                  </div>

                  <NotesPanel
                    entity_type={"Experts"}
                    record_id={object.id}
                    module={"Experts"}
                    pagePanels={3}
                  />
                </div>
                <div className="row documents-wrapper m-t-5">
                  <div className="col-12">
                    <div className="height-25">
                      <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
                        {/* {report.reporting_agency} {report.report_type_name} */}
                        &nbsp;Document Row
                      </h4>
                    </div>
                    <DocumentRow clientProvider={object} page="Experts" />
                  </div>
                </div>
              </div>
            ))}
          <NotesSectionDashboard />
        </div>

        {/* edit report all data component */}
        {selectedExpert && (
          <EditCaseExpertModal
            show={true}
            handleClose={handleCloseFucton}
            expert={selectedExpert}
            onFetchExperts={handleFacthExperts}
            onShowDeleteConfirmPopup={showDeleteConfirmPopup}
            activeTab={selectedEditableTabPanel.current}
          />
        )}

        {showDeleteConfirm && (
          <ConfirmDeletePopup
            handleDeleteSubmission={handleDeleteSubmission}
            handleClose={hideDeleteConfirmPopup}
            entity="Expert"
          />
        )}
      </div>
    </div>
  );
}

export default ExpertsPage;
