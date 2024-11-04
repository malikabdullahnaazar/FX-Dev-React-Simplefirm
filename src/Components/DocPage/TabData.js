import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { useDocumentModal } from "../../Components/DocumentModal/DocumentModalContext";
import { mediaRoute } from "../../Utils/helper";
import UploadDocModal from "../../Components/DocumentRow/UploadDocModal";
import TableLoader from "../Loaders/tableLoader";
import { getClientId, getCaseId } from "../../Utils/helper";
import api from "../../api/api";
import ButtonLoader from "../Loaders/ButtonLoader";
import DocumentUploadModal from "../Modals/documentUploadModal";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
const TabData = ({ data, loading, all, refetchData, refetchLoading }) => {
  const { showDocumentModal, documentData } = useDocumentModal();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCase = getCaseId();
  const client = getClientId();
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedPanelId, setSelectedPanelId] = useState(null);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [ispanlename, setispanlename] = useState(false);

  // State for handling modal and upload progress
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState("");
  const handleUploadPopup = (slotId, pageId) => {
    setSelectedSlotId(slotId);
    setSelectedPageId(pageId);
    setShowDocModal(true); // Show the Doc modal
  };
  const handleUploadPopupwithoutSlots = (pageId) => {
    setSelectedPageId(pageId);
    setShowDocModal(true); // Show the Doc modal
  };
  const handleUploadPopupwithpanles = (slotId, panelId, pageId) => {
    setSelectedSlotId(slotId);
    setSelectedPanelId(panelId);
    setSelectedPageId(pageId);
    setShowDocModal(true);
  };
  const handleDocPreview = (doc) => {
    console.log(`Previewing document with ID: ${doc.id}`);
    console.log("DOC DATA", doc);
    console.log("DOC Upload URL", mediaRoute(doc.upload));
    axios
      .get(`${origin}/api/attorney-staff/${doc.attached_by.id}/profile-image/`)
      .then((response) => {
        doc.attached_by.profile_pic_29p = mediaRoute(
          response.data.profile_image
        );
      })
      .catch((error) => {
        console.error(`Error fetching profile image: ${error}`);
      });
    showDocumentModal("document", mediaRoute(doc.upload), doc);
  };

  const handleClose = () => {
    setShowDocModal(false); // Hide the Doc modal
    setSelectedSlotId(null);
    setSelectedPanelId(null);
    setSelectedPageId(null);
  };

  const addDocumentHandler = () => {
    setShowDocModal(false); // Hide the Doc modal
    setSelectedSlotId(null);
    setSelectedPanelId(null);
    setSelectedPageId(null);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [isDragginguploadingbutton, setIsDragginguploadingbutton] =
    useState(false);
  const [draggedSlotNumber, setDraggedSlotNumber] = useState("");
  const [uploadingSlot, setUploadingSlot] = useState({
    slotId: null,
    panelId: null,
  });
  // Drag and Drop functionality
  const simulateProgress = (setUploadProgress) => {
    let progress = 0;

    const intervalId = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      // Stop once we reach 100%
      if (progress >= 100) {
        clearInterval(intervalId);
      }
    }, 300); // 300ms delay between increments
  };
  const handleDrop = async (e, slot_id, pageId) => {
    e.preventDefault();
    setFileUploadModal(true);
    simulateProgress(setUploadProgress); // Simulate gradual progress
    setDraggedSlotNumber(slot_id);
    const files = e.dataTransfer.files;
    setUploadFile(files[0].name);
    const formData = new FormData();
    formData.append("file", files[0]);
    const response = await api.post(
      `/api/upload_doc/${getClientId()}/${getCaseId()}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const docId = response?.data?.docId;

    try {
      await api.post("api/doc/attach/treatment/", {
        slot: slot_id,
        page_id: pageId,
        case_id: getCaseId(),
        panels: false,
        doc_id: docId,
      });
      await refetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setIsDragging(false);
      setFileUploadModal(false);
    }
  };
  const [uploadbuttonLoadingid, setuploadbuttonLoadingid] = useState(null);
  const handleDropwithpanles = async (e, slot_id, pageId, panel_id) => {
    e.preventDefault();
    setFileUploadModal(true);
    simulateProgress(setUploadProgress); // Simulate gradual progress

    setUploadingSlot({ slotId: slot_id, panelId: panel_id });
    const files = e.dataTransfer.files;
    setUploadFile(files[0].name);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const response = await api.post(
        `/api/upload_doc/${getClientId()}/${getCaseId()}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const docId = response?.data?.docId;
      await api.post("api/doc/attach/treatment/", {
        panel_id: panel_id,
        slot: slot_id,
        page_id: pageId,
        case_id: getCaseId(),
        panels: true,
        doc_id: docId,
      });
      await refetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setIsDragging(false);
      setFileUploadModal(false);
    }
  };
  const handleDropwithOutpanlesWithoutslots = async (
    e,
    panel,
    pageId,
    panelId
  ) => {
    e.preventDefault();
    if (panel) {
      setFileUploadModal(true);
      simulateProgress(setUploadProgress); // Simulate gradual progress
      setuploadbuttonLoadingid(panelId);

      const files = e.dataTransfer.files;
      setUploadFile(files[0].name);
      const formData = new FormData();
      formData.append("file", files[0]);

      try {
        const response = await api.post(
          `/api/upload_doc/${getClientId()}/${getCaseId()}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const docId = response?.data?.docId;
        await api.post("api/doc/attach/treatment/", {
          page_id: pageId,
          case_id: getCaseId(),
          doc_id: docId,
        });
        await refetchData();
      } catch (error) {
        console.log(error);
      } finally {
        setFileUploadModal(false);
        setuploadbuttonLoadingid(null);
      }
    } else {
      setFileUploadModal(true);
      const files = e.dataTransfer.files;
      const formData = new FormData();
      simulateProgress(setUploadProgress);
      formData.append("file", files[0]);

      try {
        const response = await api.post(
          `/api/upload_doc/${getClientId()}/${getCaseId()}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const docId = response?.data?.docId;
        await api.post("api/doc/attach/treatment/", {
          page_id: pageId,
          case_id: getCaseId(),
          doc_id: docId,
        });
        await refetchData();
        console.log("check error " + isSlotUploading(slot_id, panel_id));
        console.log("check error " + isDragging);
        console.log("check error " + refetchLoading);
      } catch (error) {
        console.error("Failed to handle drop:", error);

        console.log(error);
      } finally {
        setFileUploadModal(false);
      }
    }
  };
  function getPanelName(panel) {
    if (!panel || !data || !data.page) {
      return " ";
    }

    if (data.page.name === "Litigation") {
      return (
        (panel.event_type_id?.litigation_event_type || " ") +
        " " +
        (panel.name || " ")
      );
    } else if (data.page.name === "Insurance") {
      return (
        (panel.insurance_type?.name || " ") +
        " For Client " +
        (panel.for_client?.first_name || " ") +
        " " +
        (panel.for_client?.last_name || " ")
      );
    } else if (data.page.name === "Defendants") {
      const panel_name = (panel?.defendantType_name === "Private Individual") ? (`${panel?.first_name ? panel?.first_name : " " } ${panel?.last_name ? panel?.last_name : " " }`) : (panel?.entity_name ? panel?.entity_name : " " )
      return  panel_name;
    } else if (data.page.name === "Reports") {
      return (
        (panel?.reporter_firstname || " ") +
        " " +
        (panel?.reporter_lastname || " ") +
        " " +
        (panel?.title || " ") +
        " " +
        (panel?.report_typeID?.name || " ")
      );
    } else if (data.page.name === "Employment") {
      return panel?.employer_name || " ";
    } else if (data.page.name === "Experts") {
      return (panel?.first_name || " ") + " " + (panel?.last_name || " ");
    } else if (data.page.name === "Loans") {
      return panel?.contact_name || " ";
    } else if (data.page.name === "Insurance") {
      return (
        (panel?.party_first_name || " ") +
        " For Client " +
        (panel?.party_middle_name || " ") +
        " " +
        (panel?.party_last_name || " ")
      );
    } else {
      return panel.panel_name || "No Name";
    }
  }
  const getPanelsArray = () => {
    if (!data?.page_slots || data?.page_slots.length === 0) {
      return data?.panels && data.panels.length > 0 ? [data.panels[0]] : [];
    } else {
      return data?.panels || [];
    }
  };
  const isSlotUploading = (slotId, panelId) => {
    return (
      uploadingSlot?.slotId === slotId && uploadingSlot?.panelId === panelId
    ); // Added parentheses for clarity
  };
  if (loading) {
    return <TableLoader />;
  }
  const unAttachedDocuments = () => {
    return all
      ? data?.page_docs?.filter((document) => document.document_slot === null)
      : data?.data?.filter((document) => document.document_slot === null);
  };

  if (!data) {
    return <div className="loading-center">No Data</div>; // Centered loading indicator
  }
  if (
    data?.page?.panels === false &&
    (!data?.panels || data?.panels?.length === 0)
  ) {
    return (
      <>
        {!all && (
          <div className="row no-gutters has-title-bg m-b-5 flex-nowrap">
            <div class="panel-icon">
              <img
                src={mediaRoute(data?.page?.page_icon)}
                height={25}
                width={25}
              />
            </div>
            <div class="top-header height-25 d-flex flex-wrap align-items-start">
              <div class="top-head d-flex align-items-center h-100">
                <div
                  class="d-flex align-items-center m-l-5"
                  style={{
                    fontStyle: "normal",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {data?.page?.name}
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <div>
            {data?.page_slots?.length === 0 && (
              <div className="d-flex">
                <div className="d-flex align-items-center w-100 skewed-primary-gradient-custom p-5-x alpha  ">
                  <div
                    className="col-auto p-0 text-white"
                    style={{
                      marginLeft: "34px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Nothing Added
                  </div>
                </div>
              </div>
            )}
            <div className="row no-gutters flex-row position-relative  p-md-r-0   m-t-5">
              <div className="col p-0">
                <div className="d-md-flex justify-content-start w-100 m-b-5">
                  <div
                    className="icon-text-boxes d-flex flex-wrap w-100 e-template-row "
                    style={{ marginRight: "10px", height: "auto" }}
                  >
                    {data?.page_slots?.map((slot, index) => {
                      const attachedDocs =
                        all === true
                          ? data?.page_docs?.filter(
                            (doc) => doc?.document_slot?.id === slot?.id
                          )
                          : data?.data?.filter(
                            (doc) => doc?.document_slot?.id === slot?.id
                          );
                      return (
                        <React.Fragment key={slot.id}>
                          {attachedDocs?.length > 0
                            ? attachedDocs.map((doc) => (
                              <div
                                className="col-12 col-md-3 col-xl icon-text-box text-center height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                                id="no-vertical-border"
                                onClick={() => handleDocPreview(doc)}
                                key={doc.id}
                              >
                                <p className="date">
                                  {new Date(doc.created).toLocaleDateString()}
                                </p>
                                <span className="icon-wrap">
                                  <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
                                </span>
                                <p className="name">
                                  {slot.slot_number}.{" "}
                                  {doc.file_name || slot.slot_name}
                                </p>
                              </div>
                            ))
                            : slot.slot_number !== 0 && (
                              <div
                                onDrop={() =>
                                  handleDrop(event, slot.id, data?.page?.id)
                                }
                                className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-{slot.id}-{clientProvider.id}-{page2.id} height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                                id="no-vertical-border"
                                onClick={() =>
                                  handleUploadPopup(slot?.id, data?.page?.id)
                                }
                              >
                                {draggedSlotNumber === slot?.id ? (
                                  isDragging || refetchLoading ? (
                                    <span className="d-flex align-items-center">
                                      <ButtonLoader />
                                      <span style={{ marginLeft: "5px" }}>
                                        Uploading...
                                      </span>
                                    </span>
                                  ) : (
                                    <>
                                      <span className="icon-wrap">
                                        <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                                      </span>
                                      <p className="name text-lg-grey">
                                        {slot?.slot_number}.{" "}
                                        {slot?.slot_name || "Available"}
                                      </p>
                                    </>
                                  )
                                ) : (
                                  <>
                                    <span className="icon-wrap">
                                      <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                                    </span>
                                    <p className="name text-lg-grey">
                                      {slot?.slot_number}.{" "}
                                      {slot?.slot_name || "Available"}
                                    </p>
                                  </>
                                )}
                              </div>
                            )}
                        </React.Fragment>
                      );
                    })}
                    <UploadDocModal
                      show={showDocModal}
                      handleClose={handleClose}
                      slot_id={selectedSlotId}
                      page_id={selectedPageId}
                      caseId={currentCase}
                      clientId={client?.id}
                      isDocumentTab={true}
                      handleDocumentUpload={addDocumentHandler}
                      refetchLoading={refetchLoading}
                      refetchData={refetchData}
                    />

                    {data?.page_slots?.length === 0 ? (
                      <div className="col-12 d-flex m-b-5 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer">
                        <div className="upload-icon border-0 rounded-0 bg-transparent dropzone-{data.page.id}-{clientProvider.id}">
                          <div className="d-flex align-items-center width-inherit justify-content-center">
                            <span className="font-weight-bold text-gold h5 m-0 pr-2">
                              +
                            </span>
                            <span className="text-lg-grey name">
                              Upload Document to Page
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : isDragginguploadingbutton ? (
                      <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer">
                        <div className="d-flex align-items-center justify-content-center">
                          <ButtonLoader />
                          <span style={{ marginLeft: "5px" }}>
                            Uploading...
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="col-12 d-flex m-b-5 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                        onDrop={() =>
                          handleDropwithOutpanlesWithoutslots(
                            event,
                            false,
                            data?.page?.id,
                            null
                          )
                        }
                        onClick={() =>
                          handleUploadPopupwithoutSlots(data?.page?.id)
                        }
                      >
                        <div className="upload-icon border-0 rounded-0 bg-transparent dropzone-{data.page.id}-{clientProvider.id} simple">
                          <div className="d-flex align-items-center width-inherit justify-content-center">
                            <span className="font-weight-bold text-gold h5 m-0 pr-2">
                              +
                            </span>
                            <span className="text-lg-grey name">
                              Upload Document to Page
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Un Attached Document Row */}
                {unAttachedDocuments().length > 0 && (
                  <>
                    <div className="d-flex align-items-center w-100 skewed-primary-gradient-custom p-5-x alpha m-t-5 m-b-5 ">
                      <div
                        className="col-auto p-0 text-white"
                        style={{
                          marginLeft: "34px",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        &#160;
                      </div>
                    </div>
                    <div
                      className="icon-text-boxes d-flex flex-wrap w-100 e-template-row m-t-5 "
                      style={{
                        marginRight: "10px",
                        justifyContent: "end",
                        paddingRight: "10px",
                        height: "auto",
                      }}
                    >
                      {unAttachedDocuments().map((document) => (
                        <>
                          <div
                            className="col-12 col-md-3 col-xl icon-text-box-custom  m-b-5 text-center height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                            id="no-vertical-border"
                            onClick={() => handleDocPreview(document)}
                            key={document.id}
                          >
                            <span className="icon-wrap">
                              <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
                            </span>
                            <p className="name">
                              {document?.file_name.length > 20
                                ? `${document.file_name.slice(0, 20)}...`
                                : document.file_name}
                            </p>
                          </div>
                        </>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <DocumentUploadModal
          uploadFile={uploadFile}
          uploadProgress={uploadProgress}
          show={fileUploadModal}
          onHide={() => setFileUploadModal(false)}
        />
      </>
    );
  }

  return (
    <>
      {!all && (
        <div className="row no-gutters has-title-bg m-b-5 flex-nowrap">
          <div class="panel-icon">
            <img
              src={mediaRoute(data?.page?.page_icon)}
              height={25}
              width={25}
            />
          </div>
          <div class="top-header height-25 d-flex flex-wrap align-items-start">
            <div class="top-head d-flex align-items-center h-100">
              <div
                class="d-flex align-items-center m-l-5"
                style={{
                  fontStyle: "normal",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {data?.page?.name}
              </div>
            </div>
          </div>
        </div>
      )}

      {getPanelsArray().map((panel) => (
        <div>
          <div>
            <div>
              {/* <div className="tab-data-sub-heading-hero"></div> */}

              <div className="d-flex align-items-center w-100 skewed-primary-gradient-custom p-5-x alpha  ">
                <div
                  className="col-auto p-0 text-white"
                  style={{
                    marginLeft: "34px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {data?.page_slots?.length === 0 || data?.page_slots === null
                    ? "Nothing Added"
                    : getPanelName(panel).trim() === "" ? "No Name" : getPanelName(panel)}
                </div>
              </div>
            </div>
          </div>
          <div className="row no-gutters flex-row position-relative  p-md-r-0   m-t-5">
            <div className="col p-0">
              <div className="d-md-flex justify-content-start w-100">
                <div
                  className="icon-text-boxes d-flex flex-wrap w-100 e-template-row m-b-5"
                  style={{ marginRight: "10px", height: "auto" }}
                >
                  {data?.page_slots?.slice(0, 9).map((slot, index) => {
                    const attachedDocs =
                      all === true
                        ? panel?.documents?.filter(
                          (doc) => doc?.document_slot?.id === slot?.id
                        )
                        : panel?.documents?.filter(
                          (doc) => doc?.document_slot?.id === slot?.id
                        );
                    return (
                      <React.Fragment key={slot.id}>
                        {attachedDocs?.length > 0
                          ? attachedDocs.map((doc) => (
                            <div
                              className="col-12 col-md-3 col-xl icon-text-box text-center height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                              id="no-vertical-border"
                              onClick={() => handleDocPreview(doc)}
                              key={doc.id}
                            >
                              <p className="date">
                                {new Date(doc.created).toLocaleDateString()}
                              </p>
                              <span className="icon-wrap">
                                <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
                              </span>
                              <p className="name">
                                {slot.slot_number}.{" "}
                                {doc.file_name || slot.slot_name}
                              </p>
                            </div>
                          ))
                          : slot.slot_number !== 0 && (
                            <div
                              onDrop={() =>
                                handleDropwithpanles(
                                  event,
                                  slot.id,
                                  data?.page?.id,
                                  panel?.id
                                )
                              }
                              className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-{slot.id}-{clientProvider.id}-{page2.id} height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                              id="no-vertical-border"
                              onClick={() =>
                                handleUploadPopupwithpanles(
                                  slot?.id,
                                  panel?.id,
                                  slot?.page?.id
                                )
                              }
                            >
                              {isSlotUploading(slot?.id, panel?.id) &&
                                (isDragging || refetchLoading) ? ( // Corrected condition
                                <div className="d-flex align-items-center justify-content-center">
                                  <ButtonLoader />
                                  <span style={{ marginLeft: "5px" }}>
                                    Uploading
                                  </span>
                                </div>
                              ) : (
                                // Unchanged code
                                <>
                                  <span className="icon-wrap">
                                    <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                                  </span>
                                  {slot.slot_name ? (
                                    <p className="name text-lg-grey">
                                      {slot?.slot_number}. {slot?.slot_name}
                                    </p>
                                  ) : (
                                    <p className="name text-lg-grey">
                                      {slot?.slot_number}. Available
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                      </React.Fragment>
                    );
                  })}

                  {data?.page_slots?.length === 0 ||
                    data?.page_slots === null ? (
                    isDragginguploadingbutton &&
                      panel?.id === uploadbuttonLoadingid ? (
                      <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer">
                        <div className="d-flex align-items-center justify-content-center">
                          <ButtonLoader />
                          <span
                            style={{
                              marginLeft: "5px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            Uploading...
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="col-12 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                        onDrop={(event) =>
                          handleDropwithOutpanlesWithoutslots(
                            event,
                            true,
                            data?.page?.id,
                            panel?.id
                          )
                        }
                        onClick={() =>
                          handleUploadPopupwithoutSlots(data?.page?.id)
                        }
                      >
                        <div className="upload-icon border-0 rounded-0 bg-transparent">
                          <div className="d-flex align-items-center width-inherit justify-content-center">
                            <span className="font-weight-bold text-gold h5 m-0 pr-2">
                              +
                            </span>
                            <span className="text-lg-grey name">
                              Upload Document to Page
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  ) : isDragginguploadingbutton &&
                    panel?.id === uploadbuttonLoadingid ? (
                    <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer">
                      <div className="d-flex align-items-center justify-content-center">
                        <ButtonLoader />
                        <span
                          style={{
                            marginLeft: "5px",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          Uploading...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="col-12 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                      onDrop={(event) =>
                        handleDropwithOutpanlesWithoutslots(
                          event,
                          true,
                          data?.page?.id,
                          panel?.id
                        )
                      }
                      onClick={() =>
                        handleUploadPopupwithoutSlots(data?.page?.id)
                      }
                    >
                      <div className="upload-icon border-0 rounded-0 bg-transparent">
                        <div className="d-flex align-items-center width-inherit justify-content-center">
                          <span className="font-weight-bold text-gold h5 m-0 pr-2">
                            +
                          </span>
                          <span className="text-lg-grey name">
                            Upload Document to Page
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {(data?.panels === null || data?.panels?.length === 0) &&
        data?.page_slots?.length > 0 ? (
        <div
          className="col-12 d-flex m-b-5 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
          onDrop={(event) =>
            handleDropwithOutpanlesWithoutslots(event, false, data?.page?.id, 0)
          }
          onClick={() => handleUploadPopupwithoutSlots(data?.page?.id)}
        >
          <div className="upload-icon border-0 rounded-0 bg-transparent dropzone-{data.page.id}-{clientProvider.id}">
            <div className="d-flex align-items-center width-inherit justify-content-center">
              {isDragginguploadingbutton ? (
                <>
                  <ButtonLoader />
                  <span style={{ marginLeft: "5px" }}>Uploading...</span>
                </>
              ) : (
                <>
                  <span className="font-weight-bold text-gold h5 m-0 pr-2">
                    +
                  </span>
                  <span className="text-lg-grey name">
                    Upload Document to Page{" "}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <UploadDocModal
        show={showDocModal}
        handleClose={handleClose}
        slot_id={selectedSlotId}
        page_id={selectedPageId}
        caseId={currentCase}
        clientId={client?.id}
        isDocumentTab={selectedPanelId ? false : true}
        handleDocumentUpload={addDocumentHandler}
        refetchLoading={refetchLoading}
        refetchData={refetchData}
        panel_id={selectedPanelId}
      />
      {unAttachedDocuments().length > 0 && (
        <>
          <div className="d-flex align-items-center w-100 skewed-primary-gradient-custom p-5-x alpha  ">
            <div
              className="col-auto p-0 text-white"
              style={{
                marginLeft: "34px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              &#160;
            </div>
          </div>

          <div
            className="icon-text-boxes d-flex flex-wrap w-100 e-template-row m-t-5 "
            style={{
              marginRight: "10px",
              justifyContent: "end",
              paddingRight: "10px",
              height: "auto",
            }}
          >
            {unAttachedDocuments().map((document) => (
              <div
                className="col-12 col-md-3 col-xl icon-text-box-custom  m-b-5 text-center height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                id="no-vertical-border"
                onClick={() => handleDocPreview(document)}
                key={document.id}
              >
                <span className="icon-wrap">
                  <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
                </span>
                <p className="name">
                  {document?.file_name.length > 20
                    ? `${document.file_name.slice(0, 20)}...`
                    : document.file_name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
      <DocumentUploadModal
        uploadFile={uploadFile}
        uploadProgress={uploadProgress}
        show={fileUploadModal}
        onHide={() => setFileUploadModal(false)}
      />
    </>
  );
};

export default TabData;
