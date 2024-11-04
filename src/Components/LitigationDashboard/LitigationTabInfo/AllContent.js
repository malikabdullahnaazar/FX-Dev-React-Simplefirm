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

export default function AllContent({ object, name }) {
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
  const { isLitigationDataUpdate, setLitigationDataUpdated } = useContext(ClientDataContext);
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
      if (firstTimeLitData) {
        setDefParties(response.data?.defendants);
        setOtherParties(response.data?.other_parties);
        setClientParties(response.data?.clients);
        setFirstTimeLitData(false);
      }
      if (isLitigationDataUpdate) {
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
                  <div className="row mb-0 colFont">
                    <div className="col text-left">
                      <span className="d-inline-block">{name} Date:</span>
                    </div>
                    <div className="col-auto text-left font-weight-semibold">
                      <p>{formatDateForPanelDisplay(object?.dependant_date)}</p>
                    </div>
                  </div>
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

          <div className="info-div">
            <div className="p-l-5" onClick={null}>
              <div>
                <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
                  Panel labbel
                </p>

                <div>
                  <div className="row mb-0 colFont">
                    <div className="col text-left">
                      <span className="d-inline-block">Start Date:</span>
                    </div>
                    <div className="col-auto text-left font-weight-semibold">
                      <p>{formatDateForPanelDisplay(object?.date)}</p>
                    </div>
                  </div>

                  <div className="row mb-0 colFont">
                    <div className="col text-left">
                      <span className="d-inline-block">End Date:</span>
                    </div>
                    <div className="col-auto text-left font-weight-semibold">
                      <p>{formatDateForPanelDisplay(object?.end_date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="info-div">
            <div className="info-div-witness-statement-summary">
              <div className="p-l-5 ">

                <div >
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
          entity_type={"LitigationAct"}
          record_id={object?.id}
          module={"Litigation"}
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
          <DocumentRow clientProvider={object} page={object?.event_type_id?.litigation_event_type} />
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

///OLD LATOUT
// <div class="m-b-15 border-box has-checklist rounded-0  mr-15 m-t-5">
//   <div class="checklist-section-wrapper position-absolute top-0 right-0 z-index-9">
//     <div class="skew-box"></div>
//     <div class="checklist-section">
//       <div class="dropdown">
//         <button
//           class="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
//           id="myDropdownPlaceholder"
//           type="button"
//           data-toggle="dropdown"
//           aria-expanded="false"
//         >
//           <div class="nt-box sub-gauge"></div>
//           <span class="d-flex align-items-center">
//             <span class="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center text-brightgreen">
//               <svg
//                 width="17"
//                 height="50"
//                 viewBox="0 0 17 50"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
//                   fill="currentColor"
//                 ></path>
//               </svg>
//             </span>
//             <span class="checklist-text CL-text-Align-1">
//               Checklist <br />
//               Placeholder
//             </span>
//             <span class="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center CL-text-Align-2">
//               <svg
//                 width="17"
//                 height="50"
//                 viewBox="0 0 17 50"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
//                   fill="currentColor"
//                 ></path>
//                 <path
//                   d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
//                   fill="currentColor"
//                 ></path>
//               </svg>
//             </span>
//           </span>
//         </button>

//         <div
//           class="dropdown-menu dropdown-menu-right dropdown-content"
//           id="insurance-dropdown-width"
//         ></div>
//       </div>
//     </div>
//   </div>
//   <div>
//     <div class="top-header height-25 d-flex align-items-center p-r-5 position-relative has-title-bg p-l-35 text-white m-b-5">
//       <div class="panel-icon">
//         <i class="ic ic-Motion ic-25"></i>
//       </div>
//       <div class="top-head d-flex align-items-center position-relative z-index-1">
//         <div class="d-flex align-items-center">
//           <h2 class="client-contact-title text-center d-flex justify-content-center align-items-center h-100 textWrap-NW">
//             Motion
//           </h2>

//           <p class="m-l-5 m-r-5 textWrap-NW">General Motion</p>
//         </div>
//         <div class="btn-wrapper ml-2"></div>
//       </div>
//     </div>
//     <div class="">
//       <div class="dependent-dates-wrap d-flex">
//         <div
//           class="col-md-2"
//           data-toggle="modal"
//           data-target="#edit_litigation_act-modal"
//           onclick="fill_litigation_modal_fields(this , '100','General Motion', 'hi this is a note hi', 'Jan. 3, 2024, 2:51 a.m.' , 'Defendant, 6', 'Defendant, 5')"
//           data-dependant_date="2024/01/03"
//           data-start_date="2023/05/26"
//           data-end_date="2023/05/01"
//           data-meeting_url="http://www.hhhoooooa.com"
//           data-start_time="19:32"
//           data-end_time="06:34"
//           data-all_day="False"
//         >
//           <div class="motion-content-right d-flex position-relative z-index-1">
//             <input
//               type="text"
//               hidden=""
//               class="litigation_act_id"
//               value="100"
//             />

//             <div class="litigation-row d-flex dependent-dates-wrap">
//               <span class="text-row-wrap text-left">
//                 <p class="gray-label ml-2 mr-1">Filing date</p>
//               </span>
//               <span class="text-row-wrap d-block overflow-hidden ml-2 text-left">
//                 <p class=""> 01/03/2024</p>
//               </span>
//             </div>
//           </div>
//         </div>
//         <div
//           class="col-md-3"
//           data-toggle="modal"
//           data-target="#edit_litigation_act-modal"
//           onclick="fill_litigation_modal_fields(this , '100','General Motion', 'hi this is a note hi', 'Jan. 3, 2024, 2:51 a.m.' , 'Defendant, 6', 'Defendant, 5')"
//           data-dependant_date="2024/01/03"
//           data-start_date="2023/05/26"
//           data-end_date="2023/05/01"
//           data-meeting_url="http://www.hhhoooooa.com"
//           data-start_time="19:32"
//           data-end_time="06:34"
//           data-all_day="False"
//         >
//           <div class="litigation-row d-flex">
//             <span class="text-row-wrap text-left">
//               <p class="black-text">Opposition </p>
//               <p class="gray-label ml-2 mr-1">:</p>
//             </span>
//             <span class="text-row-wrap d-block overflow-hidden text-left">
//               <p class="black-text"> 11/03/2023</p>
//             </span>
//           </div>

//           <div class="litigation-row d-flex">
//             <span class="text-row-wrap text-left">
//               <p class="black-text">Reply </p>
//               <p class="gray-label ml-2 mr-1">:</p>
//             </span>
//             <span class="text-row-wrap d-block overflow-hidden text-left">
//               <p class="black-text"> 12/04/2023</p>
//             </span>
//           </div>

//           <div class="litigation-row d-flex">
//             <span class="text-row-wrap text-left">
//               <p class="black-text">2nd Opposition </p>
//               <p class="gray-label ml-2 mr-1">:</p>
//             </span>
//             <span class="text-row-wrap d-block overflow-hidden text-left">
//               <p class="black-text"> 01/03/2020</p>
//             </span>
//           </div>

//           <div class="litigation-row d-flex">
//             <span class="text-row-wrap text-left">
//               <p class="black-text">2nd Reply </p>
//               <p class="gray-label ml-2 mr-1">:</p>
//             </span>
//             <span class="text-row-wrap d-block overflow-hidden text-left">
//               <p class="black-text"> 12/19/2023</p>
//             </span>
//           </div>

//           <div class="litigation-row d-flex">
//             <span class="text-row-wrap text-left">
//               <p class="black-text">Reply Memo </p>
//               <p class="gray-label ml-2 mr-1">:</p>
//             </span>
//             <span class="text-row-wrap d-block overflow-hidden text-left">
//               <p class="black-text"> 01/08/2024</p>
//             </span>
//           </div>

//           <div class="litigation-row d-flex">
//             <span class="text-row-wrap text-left">
//               <p class="black-text">Serve Discovery </p>
//               <p class="gray-label ml-2 mr-1">:</p>
//             </span>
//             <span class="text-row-wrap d-block overflow-hidden text-left">
//               <p class="black-text"> 01/15/2024</p>
//             </span>
//           </div>

//           <div class="litigation-row d-flex">
//             <span class="text-row-wrap text-left">
//               <p class="black-text">Discovery Response Due </p>
//               <p class="gray-label ml-2 mr-1">:</p>
//             </span>
//             <span class="text-row-wrap d-block overflow-hidden text-left">
//               <p class="black-text"> 02/02/2024</p>
//             </span>
//           </div>
//         </div>
//         <div
//           class="col-md-2"
//           data-toggle="modal"
//           data-target="#edit_litigation_act-modal"
//           onclick="fill_litigation_modal_fields(this , '100','General Motion', 'hi this is a note hi', 'Jan. 3, 2024, 2:51 a.m.' , 'Defendant, 6', 'Defendant, 5')"
//           data-dependant_date="2024/01/03"
//           data-start_date="2023/05/26"
//           data-end_date="2023/05/01"
//           data-meeting_url="http://www.hhhoooooa.com"
//           data-start_time="19:32"
//           data-end_time="06:34"
//           data-all_day="False"
//         >
//           <p> hi this is a note hi </p>
//         </div>
//         <div class="col-md-5 lit-MiH-100-MaH-206">
//           <div
//             class="fields-wrap overflow-hidden h-100"
//             data-toggle="modal"
//             data-target="#individual_notes_modal"
//             onclick="show_notes(this, 'LitigationAct100' , 'LitigationAct', '100' , 'Litigation')"
//           >
//             <div
//               class="tab-pane"
//               id="custom-nav-todo"
//               role="tabpanel"
//               aria-labelledby="custom-nav-todo-tab"
//             >
//               <div class="col-lg-12">
//                 <div class="row">
//                   <div class="table-responsive table--no-card border-0 has-alternate-grey client-col-table overflow-hidden p-r-15">
//                     <div class="note-fake-rows w-100 p-r-15">
//                       <div class="note-fake-row"></div>
//                       <div class="note-fake-row"></div>
//                       <div class="note-fake-row"></div>
//                       <div class="note-fake-row"></div>
//                       <div class="note-fake-row"></div>
//                     </div>
//                     <p class="p-0 height-25 d-flex justify-content-center text-center line-height-25 margin-right-206">
//                       {" "}
//                       Motion Notes
//                     </p>
//                     <table class="table table-borderless table-striped table-earning table-y-down1">
//                       <tbody class="tbody-panels">
//                         <tr class="">
//                           <td class="td-autosize serial-number"></td>
//                           <td class="td-autosize">Nov 02, 2023</td>
//                           <td class="td-autosize hover-button-td">
//                             <div class="d-flex align-items-center">
//                               <a href="#" class="has-light-btn">
//                                 <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
//                                   <img
//                                     src="/media/images/attorneys/AS29/avatar-04.jpg"
//                                     alt=""
//                                     class=""
//                                   />
//                                 </span>
//                                 <span class="ml-2 text-black">
//                                   Usama Nawaz
//                                 </span>
//                               </a>
//                             </div>
//                           </td>
//                           <td class="client_page_note_row color-white-space-word-wrap">
//                             Note: new critical note for motion
//                           </td>
//                         </tr>

//                         <tr class="">
//                           <td class="td-autosize serial-number"></td>
//                           <td class="td-autosize">Nov 02, 2023</td>
//                           <td class="td-autosize hover-button-td">
//                             <div class="d-flex align-items-center">
//                               <a href="#" class="has-light-btn">
//                                 <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
//                                   <img
//                                     src="/media/images/attorneys/AS29/avatar-04.jpg"
//                                     alt=""
//                                     class=""
//                                   />
//                                 </span>
//                                 <span class="ml-2 text-black">
//                                   Usama Nawaz
//                                 </span>
//                               </a>
//                             </div>
//                           </td>
//                           <td class="client_page_note_row color-white-space-word-wrap">
//                             Note: new note for Motion event
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   <div class="position-relative d-flex">
//     <div class="position-relative ">
//       <a
//         href="#"
//         onclick="templatePopUp('Litigation','7',2)"
//         class="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center m-t-5 m-b-5"
//         data-toggle="modal"
//         data-target="#generateDocument"
//       >
//         <i class="ic ic-19 ic-generate-document m-r-5"></i>
//         Generate Document
//       </a>
//       <div class="d-none letter_template_dropdown">
//         <div class="d-flex justify-content-between align-items-center p-2 pointer-cursor letter-template-bckgrnd ">
//           <img
//             src="/static/BP_resources/images/icon/icons8-acrobat-67.png"
//             alt=""
//             width="25px"
//           />
//           <p class="mb-0"> Court Letter 1</p>
//           <img
//             src="/static/BP_resources/images/icon/icons8-document-96.svg"
//             alt=""
//             width="25px"
//           />
//         </div>
//         <div class="d-flex justify-content-between align-items-center p-2 pointer-cursor letter-template-bckgrnd ">
//           <img
//             src="/static/BP_resources/images/icon/icons8-acrobat-67.png"
//             alt=""
//             width="25px"
//           />
//           <p class="mb-0"> Court Letter 2</p>
//           <img
//             src="/static/BP_resources/images/icon/icons8-document-96.svg"
//             alt=""
//             width="25px"
//           />
//         </div>
//         <div class="d-flex justify-content-between align-items-center p-2 pointer-cursor letter-template-bckgrnd">
//           <img
//             src="/static/BP_resources/images/icon/icons8-acrobat-67.png"
//             alt=""
//             width="25px"
//           />
//           <p class="mb-0"> Court Letter 3</p>
//           <img
//             src="/static/BP_resources/images/icon/icons8-document-96.svg"
//             alt=""
//             width="25px"
//           />
//         </div>
//       </div>
//     </div>

//     <div
//       class="lit-flex-grow-100"
//       data-toggle="modal"
//       data-target="#edit_litigation_act-modal"
//       onclick="fill_litigation_modal_fields(this, '100','General Motion', 'hi this is a note hi', 'Jan. 3, 2024, 2:51 a.m.', 'Defendant, 6', 'Defendant, 5')"
//       data-dependant_date="2024/01/03"
//       data-start_date="2023/05/26"
//       data-end_date="2023/05/01"
//       data-meeting_url="http://www.hhhoooooa.com"
//       data-start_time="19:32"
//       data-end_time="06:34"
//     ></div>
//   </div>
//   <div class="background-main-10 height-25">
//     <h4 class="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
//       Quick-Access Document Row
//     </h4>
//   </div>
//   <div class="row no-gutters flex-row position-relative">
//     <div class="docs-row-litigation justify-content-start"></div>
//     <div class="col p-0">
//       <div class="d-flex justify-content-start w-100">
//         <div class="icon-text-boxes d-flex flex-wrap w-100">
//           <div
//             class="col-12 col-md-3 col-xl icon-text-box text-center pt-3 dropzone-13-100-Motion"
//             onclick="uploadPopUp('13','100','Motion')"
//           >
//             <p class="date"></p>
//             <span class="icon-wrap">
//               <i class="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer"></i>
//             </span>

//             <p class="name text-lg-grey">2. New Motion Slot</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
