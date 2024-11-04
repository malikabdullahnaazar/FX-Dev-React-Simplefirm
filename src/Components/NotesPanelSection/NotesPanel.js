// 05/24/2024---Hassnain Ali
import React, { useEffect, useRef, useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNote, fetchPages } from "../../Redux/notes/notesSlice";
import noImage from "../../assets/images/avatar.png";
import { useLocation } from "react-router-dom";
import NoteAddModal from "./NotesPannelModal";
import api from "../../api/api";
import { format } from "date-fns";
import avatarImage from "./../../assets/images/avatar.svg";

function NotesPanel({
  entity_type = "Insurance",
  instanceFor = '',
  record_id,
  module,
  pagePanels = 4,
}) {
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  // process.env.NODE_ENV !== "production"

  const [showNotes, setShowNotes] = useState(false);
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  const descriptionRef = useRef(null);
  const dispatch = useDispatch();

  const { isLoading, isError, pages } = useSelector((state) => state.notes);

  const handleProfilePic = (note) => {
    let profilePicUrl;

    try {
      profilePicUrl = note.created_by?.bp_attorneystaff_userprofile?.profile_pic_29p? media_origin + note.created_by.bp_attorneystaff_userprofile.profile_pic_29p: avatarImage;
    } catch (error) {
      console.log("ERROR PROFILE PIC", error);
      profilePicUrl = avatarImage;
    }
    return profilePicUrl;
  };

  //   Extracting the client_id and case_id from URL which is expected to /some/client_id/case_id
  const regex = /\d+/g;
  const { pathname } = useLocation();
  // Use match method to find all numbers
  const numbers = pathname.match(regex);
  // Convert the array of string numbers to an array of integers
  const URLParams = numbers.map(Number);

  useEffect(() => {
    // dispatch(fetchNotes({entity_type:entity_type,record_id:record_id}));
    dispatch(fetchPages());
  }, [dispatch, record_id, entity_type]);

  const fetchData = async () => {
    setDataLoading(true);
    setDataError(false);
    try {
      const response = await api.get(`/api/notes/${entity_type}/${record_id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDataError(true);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [entity_type, record_id]);

  const handleFormSubmission = async (category, description) => {
    await dispatch(
      addNote({
        client_id: URLParams[0],
        case_id: URLParams[1],
        category: category,
        entity_type: entity_type,
        record_id: record_id,
        description: description,
      })
    );
    // Refetching the updated Data after Post Request
    fetchData();

    // Hidding the Modal in Form Submission
    setShowNotes(false);
  };

  const handleClick = () => {
    setShowNotes(true); // Show the modal when the component is clicked
  };

  const handleClose = () => {
    setShowNotes(false); // Hide the modal
  };

  function getPanelClassName() {
    if (pagePanels === 4 && module === 'Defendants') {
      return 'notes-height-for-defendants';
    } else if (pagePanels === 4 && instanceFor === 'Defendants') {
      return 'notes-height-for-defendants';
    } else if (pagePanels === 3 && module === 'Counsel') {
      return 'notes-height-for-3p-counsel';
    } else if (pagePanels === 3 && module === 'Experts') {
      return 'notes-height-for-3p-experts';
    } else if (pagePanels === 4 ) {
      return 'notes-height-for-4p';
    } else {
      return 'notes-height-for-3p';
    }
  }

  //${pagePanels === 4 ? "notes-height-for-4p" : pagePanels === 3 && module !== "Counsel" ? "notes-height-for-3p" : "notes-height-for-3p-counsel"}

  return (
    <>
      {data.length > 0 ? (
        <div
          className={`position-relative ${getPanelClassName()} d-flex-1 p-0 position-relative z-index-1`}
          onClick={handleClick}
        >
          <div
            className="fields-wrap overflow-hidden h-100 "
            data-toggle="modal"
            style={{zIndex: '2'}}
          >
            <div
              className="tab-pane h-100 "
              id="custom-nav-todo"
              role="tabpanel"
              aria-labelledby="custom-nav-todo-tab"
            >
              <div className="col-lg-12">
                <div className="row position-relative">
                  <div
                    className="table-responsive table--no-card border-0 has-alternate-grey p-r-5 insurance-col-table panel-notes-section-height"
                    style={{ overflow: "hidden" }}
                  >
                    <table className="table  table-borderless table-striped table-earning table-y-down1">
                      <tbody className="tbody-panels " style={{zIndex: '2'}}>
                        {data &&
                          data.length > 0 &&
                          data.map((note, index) => (
                            <tr className="">
                              <td className="serial-number td-autosize width-36">
                                {index + 1}
                              </td>
                              <td className="td-autosize">
                                {format(note.created_at, "MMMM dd, yyyy")}
                              </td>
                              <td className="td-autosize">
                                {format(note.created_at, "h:mm a")}
                              </td>
                              <td className="td-autosize">
                                <div className=" d-flex align-items-center">
                                  <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <Image
                                      src={handleProfilePic(note)}
                                      alt=""
                                      className=""
                                    />
                                  </span>
                                  <span className="ml-2 text-black">
                                    {note.created_by.first_name +
                                      " " +
                                      note.created_by.last_name}
                                  </span>
                                </div>
                              </td>
                              <td
                                className="client_page_note_row INS-color-white-space-word-wrap"
                                style={{ textAlign: "left" }}
                              >
                                {entity_type} Note: {note.description}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>            
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="fields-wrap overflow-hidden"
            data-toggle="modal"
            style={{zIndex: '-2' , position:'absolute', inset:"0" , height: '100%'}}
          >
            <div
              className="tab-pane "
              id="custom-nav-todo"
              role="tabpanel"
              aria-labelledby="custom-nav-todo-tab"
            >
              <div className="col-lg-12">
                <div className="row ">
                  <div
                    className="table-responsive table--no-card border-0 has-alternate-grey p-r-5 insurance-col-table panel-notes-section-height"
                    style={{ overflow: "hidden" }}
                  >
                    <table className="table  table-borderless table-striped table-earning table-y-down1">
                      <tbody className="tbody-panels " style={{zIndex: '2' , height: '100%'}}>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                           <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                      </tbody>
                    
                    </table>
                          
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`${getPanelClassName()} d-flex-1 p-0 position-relative z-index-1`}
            onClick={handleClick}
            // style={{ overflow: "scroll", scrollbarWidth: "none", maxHeight: "350px"}}
          >
            <div
              className="fields-wrap overflow-hidden"
              data-toggle="modal"
              // data-target="#individual_notes_modal"
            >
              <div
                className="tab-pane "
                id="custom-nav-todo"
                role="tabpanel"
                aria-labelledby="custom-nav-todo-tab"
              >
                <div className="col-lg-12">
                  <div className="row">
                    <div
                      className="table-responsive table--no-card border-0 has-alternate-grey p-r-5 insurance-col-table panel-notes-section-height"
                      style={{ overflow: "hidden" }}
                    >
                      <table className="table table-borderless table-striped table-earning table-y-down1">
                        <tbody className="tbody-panels">
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                          <tr>
                            <td> </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showNotes && (
        <NoteAddModal
          show={showNotes}
          data={data}
          handleFormSubmission={handleFormSubmission}
          handleClose={handleClose}
          pages={pages}
          pannel={entity_type}
          module={module}
        />
      )}
    </>
  );
}

export default NotesPanel;
