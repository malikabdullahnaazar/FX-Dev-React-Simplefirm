import React, { useEffect, useState, useContext } from "react";
import "../../../../public/BP_resources/css/litigation.css";
import TitleBar from "./TitleBar";
import NotesPanel from "../../NotesPanelSection/NotesPanel";
import DocumentRow from "../../DocumentRow/DocumentRow";
import { formatDateForPanelDisplay } from "../../../Utils/helper";
import LitigationEditPopUp from "../Modals/editLitigationModal";
import { getClientId, getCaseId } from "../../../Utils/helper";
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";
import axios from "axios";
import getTimeFromDateTime from "./getTimeHelper";

export default function MotionContent({ object, name }) {
  const clientId = getClientId();
  const caseId = getCaseId();
  const token = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const [defParties, setDefParties] = useState([]);
  const [otherParties, setOtherParties] = useState([]);
  const [clientParties, setClientParties] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const {isLitigationDataUpdate, setLitigationDataUpdated} =useContext(ClientDataContext);
  const [firstTimeLitData, setFirstTimeLitData] = useState(true);
  const [currentStartTime, setCurrentStartTime] = useState();
  const [currentEndTime, setCurrentEndTime] = useState();

  const fecthDefPartiesData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/litigation-page/defendants-and-other-parties/${clientId}/${caseId}/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if(firstTimeLitData){
        setDefParties(response.data?.defendants);
        setOtherParties(response.data?.other_parties);
        setClientParties(response.data?.clients);
        setFirstTimeLitData(false);
      }
      if(isLitigationDataUpdate){
        setDefParties(response.data?.defendants);
        setOtherParties(response.data?.other_parties);
        setClientParties(response.data?.clients);
        setLitigationDataUpdated(false);
      }
        
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fecthDefPartiesData();
    setCurrentStartTime(getTimeFromDateTime(object?.start_date));
    setCurrentEndTime(getTimeFromDateTime(object?.start_date));
    if (isLitigationDataUpdate) {
      setLitigationDataUpdated(false);
    }
  }, [isLitigationDataUpdate, clientId, defParties, caseId]);

  const handleOpenClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };


  return (
    <div
      className="expert"
      style={{ marginTop: "5px", overflow: "hidden" }}
      key={object?.id}
    >
      <TitleBar object={object} name={name} />
      <div className="flex-row d-flex overflow-hidden">
        <div className="reports-data row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels padding-t-5">
          <div className="info-div">
            <div className="p-l-5" onClick={handleOpenClick}>
              <div>
                <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
                  label
                </p>

                <div>


                  {object.dependant_date ? (
                    object.date_name ? (
                      <div className="litigation-row d-flex dependent-dates-wrap">
                        <span className="text-row-wrap text-left">
                          <p className="gray-label ml-2 mr-1">
                            {object?.date_name}:
                          </p>
                        </span>
                        <span className="text-row-wrap d-block overflow-hidden ml-2 text-left">
                          <p>
                            {formatDateForPanelDisplay(object?.dependant_date)}
                          </p>
                        </span>
                      </div>
                    ) : (
                      <div className="litigation-row d-flex dependent-dates-wrap">
                        <span className="text-row-wrap text-left">
                          <p className="gray-label ml-2 mr-1">Filing date</p>
                        </span>
                        <span className="text-row-wrap d-block overflow-hidden ml-2 text-left">
                          <p>
                            {formatDateForPanelDisplay(object?.dependant_date)}
                          </p>
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="litigation-row d-flex dependent-dates-wrap">
                      <span className="text-row-wrap text-left">
                        <p className="gray-label ml-2 mr-1">
                          {object?.event_type_id?.litigation_event_type} date
                        </p>
                      </span>
                      <span className="text-row-wrap d-block overflow-hidden ml-2 text-left">
                        <p>
                          New {object?.event_type_id?.litigation_event_type}{" "}
                          Date
                        </p>
                      </span>
                    </div>
                  )}

                  <p class="m-l-5 m-r-5 textWrap-NW">
                    {object?.event_id?.event_name}
                  </p>
                </div>

                
              </div>
            </div>

            <div className="mt-auto">
              <a
                style={{ height: "25px" }}
                className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
              >
                <i className="ic ic-19 ic-generate-document mr-1"></i>
                Generate Document
              </a>
            </div>
          </div>

          <div className="info-div" id="calculated-dates-div">
            <div className="p-l-5">
              <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
                 Dates
              </p>

              {object?.calculated_dates?.length> 0 ? (
                  object.calculated_dates.map((calDate, index) => (
                    <div key={index} className="litigation-row d-flex justify-content-between">
                      <span className="text-row-wrap text-left">
                        <p className="black-text">{calDate?.date_name}</p>
                        
                      </span>
                      <span className="text-row-wrap d-block overflow-hidden text-left">
                        <p className="black-text">{formatDateForPanelDisplay(calDate?.date_val)}</p>
                      </span>
                    </div>
                  ))
                ) : object?.event_id?.calculated_dates_id?.length > 0 ? (
                  object.event_id.calculated_dates_id.map((calDate, index) => (
                    <div key={index} className="litigation-row d-flex">
                      <span className="text-row-wrap text-left">
                        <p className="black-text">{calDate?.calculated_date_name}</p>
                        
                      </span>
                      <span className="text-row-wrap d-block overflow-hidden text-left">
                        <p className="black-text">{calDate?.day_count} {calDate?.day_count_type} before</p>
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-primary-50">No calculated dates available.</p>
                )}              
            </div>
          </div>

          <div className="info-div">
            <div className="info-div-witness-statement-summary">
              <div className="p-l-5 ">
                <div>
                  <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase ">
                    Notes
                  </p>
                  {object?.notes ? (
                    object.notes.length > 200 ? (
                      <span title={object.notes}>
                        {object.notes.slice(0, 200) + "..."}
                      </span>
                    ) : (
                      <span>{object?.notes}</span>
                    )
                  ) : (
                    <p className="text-primary-50"> Notes </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <NotesPanel
          entity_type={'LitigationAct'} // same entity like in django site
          record_id={object?.id}
          module={"litigation"}
          pagePanels={3}
        />
      </div>
      <div className="row documents-wrapper m-t-5">
        <div className="col-12">
          <div className="height-25">
            <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
              &nbsp;Document Row
            </h4>
          </div>
          <DocumentRow clientProvider={ object } page="Motion" />
        </div>
      </div>
      {showPopup &&
        <LitigationEditPopUp
        showPopup={showPopup}
        handleClose={handleClosePopup}
        current_name={object?.name}
        current_note={object?.notes}
        current_depndt_date={object?.dependant_date}
        current_To={object?.to}
        current_from={object?.from_to}
        current_start_date={object?.start_date}
        current_end_date={object?.end_date}
        current_start_time={currentStartTime}
        current_end_time={currentEndTime}
        current_meeting_url={object?.meetingurl}
        current_allday={object?.is_allday}
        litigation_id={object?.id}
        client_parties={clientParties}
        def_parties={defParties}
        other_parties={otherParties}
        />
      }
    </div>
  );
}


// FOR TITILE BAR :: 

  // <div className="d-flex align-items-center">
  // {object.date_name ? (
  //   <h2 className="d-flex align-items-center">
  //     <small className="font-weight-bold">{object.date_name}</small>
  //   </h2>
  // ) : (
  //   <h2 className="d-flex align-items-center">
  //     <small className="font-weight-bold">
  //       {object.event_type_id.litigation_event_type}
  //     </small>
  //   </h2>
  // )}
  // <p className="m-l-5 m-r-5 textWrap-NW">{object.event_id.event_name}</p>


  // <div className="btn-wrapper ml-2">
  //   {letterTemps.map((temp) => (
  //     temp.litigation_event === object.event_id && (
  //       <>
  //         {temp.template_type === "Question" && (
  //           <button
  //             className="btn btn-primary rounded-0"
  //             onClick={() =>
  //               selectTemplate(
  //                 event,
  //                 temp.question_template.id,
  //                 "letter_template_hearing",
  //                 "Question",
  //                 object.documents
  //                   .filter((doc) => doc.document_slot.slot_number === 1)
  //                   .map((doc) => doc.id)
  //                   .join(","),
  //                 temp.litigation_event.id,
  //                 temp.letter_template.id,
  //                 object.id
  //               )
  //             }
  //           >
  //             Generate Question
  //           </button>
  //         )}
  //         {temp.template_type === "Answer" && (
  //           <button
  //             className="btn btn-primary rounded-0"
  //             onClick={() =>
  //               selectTemplate(
  //                 event,
  //                 temp.question_template.id,
  //                 "letter_template_hearing",
  //                 "Answer",
  //                 object.documents
  //                   .filter((doc) => doc.document_slot.slot_number === 1)
  //                   .map((doc) => doc.id)
  //                   .join(","),
  //                 temp.litigation_event.id,
  //                 temp.letter_template.id,
  //                 object.id
  //               )
  //             }
  //           >
  //             Generate Answer
  //           </button>
  //         )}
  //       </>
  //     )
  //   ))}
  // </div> 
  // </div>


// FOR TITILE BAR ENDS :: 
