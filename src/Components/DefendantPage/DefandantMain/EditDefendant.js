import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import {
  formatDateForModalFields,
  formatDateForSubmission,
  getToken,
} from "../../../Utils/helper";
import axios from "axios";
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";

// RK:07-09-2024 :: 2:40 am
function EditDefendant({
  object,
  handleClose,
  onFetchDefendent,
  show,
  activeTab,
  onShowDeleteConfirmPopup,
  defendantsLength,
  setReducer,
  reducerValue,
}) {
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken()

  const methods = useForm();
  const { reset, handleSubmit, register, watch, setValue } = methods;

  const [searchResults, setSearchResults] = useState([]); // defendants's Directries
  const [filteredResults, setFilteredResults] = useState([]); //filteredDefendats
  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const {isPanelChecklistUpdated, setIsPanelChecklistUpdated } = useContext(ClientDataContext);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue !== "") {
      const filtered = searchResults.filter((result) => {
        const name = result.name ? result.name.toLowerCase() : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        const zip = result.zipcodes_list ? result.state.toLowerCase() : "";

        return (
          name.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          zip.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setFilteredResults(filtered);
      setIsFiltersOpen(true);
    } else {
      setFilteredResults([]);
    }
  };

  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/` , {
        headers: {
          Authorization: accessToken,
        },
      });
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFilterProcessDirectoriesData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/defendants/search_filter_process_server_directories/`
      );
      if (response.status === 200) {
        console.log(response.data);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFilterProcessDirectoriesData();
    fetchSatesData();
  }, [origin]);

  const handleSelectedDirectoryForProcessServer = (directory) => {
    setValue("process_server_name", directory.name || "");
    setValue("process_server_address1", directory.address1 || "");
    setValue("process_server_address2", directory.address2 || "");
    setValue("process_server_city", directory.city || "");
    setValue("process_server_state", directory.state || "");
    setValue("process_server_zip", directory.zip || "");
    setValue(
      "process_server_phone",
      formatNumber(directory.phone) || ""
    );
    setValue("process_server_extension", directory.extension || "");
    setValue("process_server_fax", formatNumber(directory.fax) || "");
    setValue("process_server_email", directory.email || "");
    // Optionally handle additional state or logic here if needed
  };

  const formatNumber = (value) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleProcessPhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("process_phone", formattedValue, { shouldValidate: true });
  };

  const handleProcessFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("process_fax", formattedValue, { shouldValidate: true });
  };

  const handleWorkPhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("work_phone", formattedValue, { shouldValidate: true });
  };

  const handleWorkFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("work_fax", formattedValue, { shouldValidate: true });
  };

  const handleHomePhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("home_phone", formattedValue, { shouldValidate: true });
  };

  const handleHomeFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("home_fax", formattedValue, { shouldValidate: true });
  };

  const workPhoneValue = watch("work_phone");
  const workFaxValue = watch("work_fax");

  const processPhoneValue = watch("process_server_phone");
  const processFaxValue = watch("process_server_fax");

  const homePhoneValue = watch("home_phone");
  const homeFaxValue = watch("home_fax");

  useEffect(() => {
    if (object) {
      console.log(object);
      const { work_contact, home_contact } = object;
      const process_server = object?.process_server?.contact_id;

      reset({
        // Fields for work_ prefix from work_contact
        defendant_employer: object?.defendant_employer || "",
        work_address1: work_contact?.address1 || "",
        work_address2: work_contact?.address2 || "",
        work_city: work_contact?.city || "",
        work_state: work_contact?.state || "",
        work_zip: work_contact?.zip || "",
        work_phone: formatNumber(work_contact?.phone_number) || "",
        work_extension: work_contact?.phone_ext || "",
        work_fax: formatNumber(work_contact?.fax) || "",
        work_email: work_contact?.email || "",
        work_name: work_contact?.name || "",

        first_name: object?.first_name || "",
        last_name: object?.last_name || "",
        home_address1: home_contact?.address1 || "",
        home_address2: home_contact?.address2 || "",
        home_city: home_contact?.city || "",
        home_state: home_contact?.state || "",
        home_zip: home_contact?.zip || "",
        home_phone: formatNumber(home_contact?.phone_number) || "",
        home_extension: home_contact?.phone_ext || "",
        home_fax: formatNumber(home_contact?.fax) || "",
        home_email: home_contact?.email || "",

        process_server_name: process_server?.name || "",
        process_server_address1: process_server?.address1 || "",
        process_server_address2: process_server?.address2 || "",
        process_server_city: process_server?.city || "",
        process_server_state: process_server?.state || "",
        process_server_zip: process_server?.zip || "",
        process_server_phone: formatNumber(process_server?.phone_number) || "",
        process_server_extension: process_server?.phone_ext || "",
        process_server_fax: formatNumber(process_server?.fax) || "",
        process_server_email: process_server?.email || "",

        // Other fields
        
        dummy : object?.dummy,
        entity_name : object?.entity_name || "",
        liability_estimate: object?.liability_estimate || "",
        liability_percent: object?.liability_percent || "",
        type: object?.defendantType_name || "",
        gender: object?.gender || "",
        birthday: formatDateForModalFields(object?.birthday) || "",
        repr_letter_sent:
          formatDateForModalFields(object?.repr_letter_sent) || "",
        contact_date: formatDateForModalFields(object?.contact_date) || "",
        defServedDate: formatDateForModalFields(object?.defServedDate) || "",
      });
    }
  }, [object, reset]);

  const selectedHomeState = watch("home_state");
  const selectedProcessServerState = watch("process_server_state");
  const SelectedWorkState = watch("work_state");


  const postDataforUpdateDefendant = async (data) => {
    try {
      const response = await axios.put(
        `${origin}/api/defendants/defendant_edit/${object.id}/`,
        data ,{
          headers: {
            'Content-Type': 'application/json',  
            Authorization: accessToken, 
          }
        }
      );
      onFetchDefendent();
      setIsPanelChecklistUpdated(!isPanelChecklistUpdated)
      setReducer(reducerValue)
      if (response.status === 200) {
        handleClose();
        // handleClose();
        // onFetchDefendent();
        // setIsPanelChecklistUpdated(true)
        // setReducer(reducerValue)
      }
    } catch (error) {
      handleClose();
      console.log(error);
    }
  };

  const onSubmit = (data) => {
    const cleanedData = {
      ...data,
      repr_letter_sent: data.repr_letter_sent
        ? formatDateForSubmission(data.repr_letter_sent)
        : null,
      contact_date: data.contact_date
        ? formatDateForSubmission(data.contact_date)
        : null,
      defServedDate: data.defServedDate
        ? formatDateForSubmission(data.defServedDate)
        : null,
      birthday: data.birthday ? formatDateForSubmission(data.birthday) : null,
      liability_estimate: data?.liability_estimate || 0,
      liability_percent: data?.liability_percent || 0,
    };
    postDataforUpdateDefendant(cleanedData);
    
  };

  return (
    <FormProvider {...methods}>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered max-800p custom-insurance-dialog"
      >
        <div style={{ height: "550px" }}>
          <Modal.Header className="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
              id="modal_title"
            >
              Defendants
            </Modal.Title>
          </Modal.Header>
          <p
            className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center"
            id="popup-paragraph"
          ></p>
          <Modal.Body>
            <div className="custom-tab custom-margin-top">
              <Tab.Container defaultActiveKey={activeTab}>
                <Nav variant="tabs" className="justify-content-around">
                  <Nav.Link eventKey="defendant">Defendant</Nav.Link>
                  <Nav.Link eventKey="employment">Employment</Nav.Link>

                  <Nav.Link eventKey="information">Information</Nav.Link>

                  <Nav.Link eventKey="process-server">Process Server</Nav.Link>
                </Nav>
                <Form
                  className="d-flex flex-column justify-content-between"
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ height: "434px" }}
                >
                  <div className="custom-margin-top ">
                    <Tab.Content>
                      <Tab.Pane eventKey="defendant">
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                          {object?.defendantType_name === "Private Individual" ? (
                           <>
                             <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  First Name:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter First Name"
                                  className="form-control"
                                  {...register("first_name")}
                                />
                              </div>
                            </div>
                            
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                            <div className="col-md-2 text-left">
                              <span className="d-inline-block text-grey text-nowrap">
                                Last Name:
                              </span>
                            </div>
                            <div className="col-md-10">
                              <input
                                type="text"
                                placeholder="Enter Last Name"
                                className="form-control"
                                {...register("last_name")}
                              />
                            </div>
                          </div>
                           </>

                          ): (
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Entity Name:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Entity Name"
                                  className="form-control"
                                  {...register("entity_name")}
                                />
                              </div>
                            </div>
                          )}

                            

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("home_address1")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("home_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City :
                                </span>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  placeholder="Enter city"
                                  className="form-control"
                                  {...register("home_city")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-3">
                                <select
                                  name="state"
                                  className="form-select"
                                  {...register("home_state")}
                                  value={selectedHomeState || ""}
                                  onChange={(e) => setValue("home_state", e.target.value)}
                                >
                                   <option  value="">
                                    Select state
                                  </option>

                                  {statesAbrs &&
                                    statesAbrs.map((state) => (
                                      <option
                                        key={state.id}
                                        value={state.StateAbr}
                                      >
                                        {state.name}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip :
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("home_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Phone:
                                </span>
                              </div>

                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("home_phone")}
                                  value={homePhoneValue || ""}
                                  onChange={handleHomePhoneInputChange}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Ext:
                                </span>
                              </div>

                              <div className="col-md-4">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("home_extension")}
                                />
                              </div>
                            </div>

                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Extension:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("home_extension")}
                                />
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("home_fax", {})}
                                  value={homeFaxValue || ""}
                                  onChange={handleHomeFaxInputChange}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Email:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="email"
                                  placeholder="Enter email"
                                  className="form-control"
                                  {...register("home_email")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="employment">
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Employer:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Employer Name"
                                  className="form-control"
                                  {...register("defendant_employer")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("work_address1")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("work_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City :
                                </span>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  placeholder="Enter city"
                                  className="form-control"
                                  {...register("work_city")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-3">
                                <select
                                  name="state"
                                  className="form-select"
                                  {...register("work_state")}
                                  value={SelectedWorkState || ""}
                                  onChange={(e) => setValue("work_state", e.target.value)}
                                >
                                   <option  value="">
                                    Select state
                                  </option>
                                  {statesAbrs &&
                                    statesAbrs.map((state) => (
                                      <option
                                        key={state.id}
                                        value={state.StateAbr}
                                      >
                                        {state.name}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip :
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("work_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Phone:
                                </span>
                              </div>

                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("work_phone")}
                                  value={workPhoneValue || ""}
                                  onChange={handleWorkPhoneInputChange}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Ext:
                                </span>
                              </div>

                              <div className="col-md-4">
                                <input
                                  type="number"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("work_extension")}
                                />
                              </div>
                            </div>

                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Extension:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("work_extension")}
                                />
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("work_fax", {})}
                                  value={workFaxValue || ""}
                                  onChange={handleWorkFaxInputChange}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Email:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="email"
                                  placeholder="Enter email"
                                  className="form-control"
                                  {...register("work_email")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="process-server">
                        <Row className="mx-0 custom-margin-bottom">
                          <Col md={12}>
                            <input
                              type="text"
                              placeholder="Type process server information to search directory then click an entry"
                              className="form-control"
                              name="reporting_agency_search_form"
                              onChange={handleInputChange}
                            />
                            {Array.isArray(filteredResults) &&
                              filteredResults.length > 0 && (
                                <div style={{ position: "relative" }}>
                                  <div
                                    className={`${isFiltersOpen ? "block" : "hidden"}`}
                                    style={{
                                      position: "absolute",
                                      zIndex: 1000,
                                      backgroundColor: "#fff",
                                      border: "1px solid #ccc",
                                      width: "100%",
                                      // maxHeight: "150px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {filteredResults.slice(0,9).map((result, index) => {
                                      const fullAddress = [
                                        (result?.name) ? `${result.name}` : '',
                                        result?.address1,
                                        result?.address2,
                                        result?.city,
                                        result?.state,
                                        result?.zip,
                                      ].filter(Boolean).join(', ') + (result?.zip ? '' : ''); 
                                      
                                      return <div
                                        key={index}
                                        onClick={() => {
                                          handleSelectedDirectoryForProcessServer(result);
                                          setIsFiltersOpen(false);
                                        }}
                                        style={{
                                          padding: "5px",
                                          cursor: "pointer",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      >
                                       {fullAddress}
                                      </div>
                                    })}
                                  </div>
                                </div>
                              )}
                          </Col>
                        </Row>

                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Name:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Employer Name"
                                  className="form-control"
                                  {...register("process_server_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("process_server_address1")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("process_server_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City :
                                </span>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  placeholder="Enter city"
                                  className="form-control"
                                  {...register("process_server_city")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-3">
                                <select
                                  name="state"
                                  className="form-select"
                                  {...register("process_server_state")}
                                  value={selectedProcessServerState || ""}
                                  onChange={(e) => setValue("process_server_state", e.target.value)}
                                >
                                   <option  value="">
                                    Select state
                                  </option>
                                  {statesAbrs &&
                                    statesAbrs.map((state) => (
                                      <option
                                        key={state.id}
                                        value={state.StateAbr}
                                      >
                                        {state.name}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip :
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("process_server_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Phone:
                                </span>
                              </div>

                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("process_server_phone")}
                                  value={processPhoneValue || ""}
                                  onChange={handleProcessPhoneInputChange}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Ext:
                                </span>
                              </div>

                              <div className="col-md-4">
                                <input
                                  type="number"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("process_server_extension")}
                                />
                              </div>
                            </div>

                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Extension:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("process_server_extension")}
                                />
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("process_server_fax", {})}
                                  value={processFaxValue || ""}
                                  onChange={handleProcessFaxInputChange}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Email:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="email"
                                  placeholder="Enter email"
                                  className="form-control"
                                  {...register("process_server_email")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="information">
                        <Row className="mx-0">
                              {defendantsLength && defendantsLength === 1 && (
                                   <Col
                                   md={12}
                                   className="d-flex align-items-center m-b-5"
                                 >
                                   <input
                                     type="checkbox"
                                     id="dummy_defendant"
                                     {...register("dummy")}
                                     style={{ marginRight: "5px" }}
                                   />
                                   <label className="mb-0">
                                     {" "}
                                     Defendant Unknown or Not Identified
                                   </label>
                                 </Col>
                              )}

                       
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Type:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  disabled
                                  className="form-control"
                                  {...register("type")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Birthday:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control"
                                  {...register("birthday")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Gender:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <select
                                  className="form-select"
                                  defaultValue={object?.gender}
                                  {...register("gender")}
                                >
                                  <option value={""}>-----</option>
                                  <option value={"Male"}>Male</option>
                                  <option value={"Female"}>Female</option>
                                </select>
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div
                                className="col-md-2 text-left"
                                style={{ paddingRight: "1px" }}
                              >
                                <span className="d-inline-block text-grey">
                                  Liability Acc % :
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="number"
                                  step="any"
                                  className="form-control"
                                  {...register("liability_percent")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div
                                className="col-md-2 text-left"
                                style={{ paddingRight: "1px" }}
                              >
                                <span className="d-inline-block text-grey">
                                  Liability Est % :
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="number"
                                  step="any"
                                  className="form-control"
                                  {...register("liability_estimate")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Rep Letter:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control"
                                  {...register("repr_letter_sent")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Contact:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control"
                                  {...register("contact_date")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Served:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control"
                                  {...register("defServedDate")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                  <div className="d-flex justify-content-between custom-margin-top">
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      className="ml-2"
                    >
                      Close
                    </Button>
                    <Button
                      variant="danger"
                      onClick={onShowDeleteConfirmPopup}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                    <Button variant="primary" type="submit">
                      Save
                    </Button>
                  </div>
                </Form>
              </Tab.Container>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </FormProvider>
  );
}

export default EditDefendant;
