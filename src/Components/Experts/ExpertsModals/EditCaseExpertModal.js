import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCaseId, getClientId, formatDateForModalFields  , formatDateForSubmission } from "../../../Utils/helper";


function EditCaseExpertModal({
  expert,
  handleClose,
  onFetchExperts,
  show,
  activeTab,
  onShowDeleteConfirmPopup,
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCaseId = getCaseId()
  const clientId = getClientId()
  const methods = useForm();
  const { reset, handleSubmit, register, watch, setValue } = methods;

  const [searchResults, setSearchResults] = useState([]); // Expert's Directries
  const [filteredResults, setFilteredResults] = useState([]); //filteredExperties
  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const [expertCategories, setExpertCategories] = useState([]); // all categories
  const [shouldSubmit, setShouldSubmit] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [retainedByRecordId, setRetainedByRecordId] = useState(0);
  const [retainedByEntity, setRetainedByEntity] = useState(0);

  const [retainedByList, setRetainedByList] = useState({
    clients: [],
    defendants: [],
    otherParties: [],
  });


  const notify = (message, type) => toast((message = message), { type: type });


  // const handleInputChange = (e) => {
  //   const inputValue = e.target.value.toLowerCase();
  //   if (inputValue !== "") {
  //     const filtered = searchResults.filter((result) => {
  //       const agency = result.name ? result.name.toLowerCase() : "";
  //       const address1 = result.address1 ? result.address1.toLowerCase() : "";
  //       const address2 = result.address2 ? result.address2.toLowerCase() : "";
  //       const city = result.city ? result.city.toLowerCase() : "";
  //       const state = result.state ? result.state.toLowerCase() : "";

  //       return (
  //         agency.startsWith(inputValue) ||
  //         address1.startsWith(inputValue) ||
  //         address2.startsWith(inputValue) ||
  //         city.startsWith(inputValue) ||
  //         state.startsWith(inputValue)
  //       );
  //     });

  //     setFilteredResults(filtered);
  //     setIsFiltersOpen(true);
  //   } else {
  //     setFilteredResults([]);
  //   }
  // };

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    console.log("filtered Experts = ", searchResults);
    if (inputValue !== "") {
        const filtered = searchResults?.filter((result) => {
        const title = result.title ? result.title.toLowerCase() : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        const zip = result.zip ? result.zip.toLowerCase() : "";
        const expert_firstname = result.expert_firstname
          ? result.expert_firstname.toLowerCase()
          : "";
        const expert_lastname = result.expert_lastname
          ? result.expert_lastname.toLowerCase()
          : "";
        const expert_category = result.category
          ? result.category.map((value) => value.toLowerCase())
          : [];
  
        return (
          expert_firstname.startsWith(inputValue) ||
          expert_lastname.startsWith(inputValue) ||
          expert_category.some((value) => value.startsWith(inputValue)) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          state.startsWith(inputValue) ||
          zip.startsWith(inputValue)
        );
      });

      setFilteredResults(filtered);
      setIsFiltersOpen(true);
    } else {
      setFilteredResults("");
    }
  };

  const fetchExpertRetainedByList = async () => {
    try {
      const response = await api.get(
        `${origin}/api/experts_retained_by_list/${clientId}/${currentCaseId}/`
      );
      if (response.status === 200) {
        setRetainedByList({
          clients: response.data.client,
          defendants: response.data.defendants,
          otherParties: response.data.other_parties,
        });
        console.log("retained by :: ", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpertCategories = async () => {
    try {
      const response = await api.get(`${origin}/api/expert_categories/`);
      if (response.status === 200) {
        setExpertCategories(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSatesData = async () => {
    try {
      const response = await api.get(`${origin}/api/states/`);
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFilterExpertData = async () => {
    try {
      const response = await api.get(`${origin}/api/search_filter_expert/`);
      if (response.status === 200) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFilterExpertData();
    fetchSatesData();
    fetchExpertCategories();
    fetchExpertRetainedByList();
  }, [origin]);

  const handleSelectRetainedByChange = (event) => {
    const selectedValue = event.target.value;
    const [Entity, id] = selectedValue.split(",");

    // // You can now use Entity and id separately
    // console.log("Full Name:", Entity);
    // console.log("ID:", id);

    setRetainedByEntity(Entity);
    setRetainedByRecordId(id);

    // setValue("retained_by_entity" ,Entity )
    // setValue("retained_by_record_id" ,id )
  };

  const handleSelectedDirectoryForSecondContant = (expertDirectory) => {
    // Using setValue to update each field individually
    setValue("firm_address1", expertDirectory.address1 || "");
    setValue("firm_address2", expertDirectory.address2 || "");
    setValue("firm_city", expertDirectory.city || "");
    setValue("firm_state", expertDirectory.state || "");
    setValue("firm_zip", expertDirectory.zip || "");
    setValue("firm_phone", formatNumber(expertDirectory.phone_number) || "");
    setValue("firm_extension", expertDirectory.extension || "");
    setValue("firm_fax", formatNumber(expertDirectory.fax) || "");
    setValue("firm_email", expertDirectory.email || "");
  
    // Optionally handle additional state or logic here if needed
  };


  const handleSelectedDirectoryForExpertContact = (expertDirectory) => {
    // Using setValue to update each field individually
    setValue("expert_title", expertDirectory.title || "");
    setValue("expert_first_name", expertDirectory.expert_firstname || "");
    setValue("expert_last_name", expertDirectory.expert_lastname || "");
    setValue("expert_address1", expertDirectory.address1 || "");
    setValue("expert_address2", expertDirectory.address2 || "");
    setValue("expert_city", expertDirectory.city || "");
    setValue("expert_state", expertDirectory.state || "");
    setValue("expert_zip", expertDirectory.zip || "");
    setValue("expert_phone", formatNumber(expertDirectory.phone_number) || "");
    setValue("expert_extension", expertDirectory.extension || "");
    setValue("expert_fax", formatNumber(expertDirectory.fax) || "");
    setValue("expert_email", expertDirectory.email || "");
  
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

  const handleFirmPhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("firm_phone", formattedValue, { shouldValidate: true });
  };

  const handleFirmFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("firm_fax", formattedValue, { shouldValidate: true });
  };
  const handleExpertPhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("expert_phone", formattedValue, { shouldValidate: true });
  };

  const handleExpertFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("expert_fax", formattedValue, { shouldValidate: true });
  };

  const firmPhoneValue = watch("firm_phone");
  const firmFaxValue = watch("firm_fax");

  const expertPhoneValue = watch("expert_phone");
  const expertFaxValue = watch("expert_fax");


  useEffect(() => {
    if (expert) {
      const { expert_contact, second_contact } = expert;
  
      // Using setValue to populate each field instead of reset
      setValue("expert_title", expert?.title || "");
      setValue("expert_first_name", expert_contact?.first_name || "");
      setValue("expert_last_name", expert_contact?.last_name || "");
      setValue("expert_address1", expert_contact?.address1 || "");
      setValue("expert_address2", expert_contact?.address2 || "");
      setValue("expert_city", expert_contact?.city || "");
      setValue("expert_state", expert_contact?.state || "");
      setValue("expert_zip", expert_contact?.zip || "");
      setValue("expert_phone", formatNumber(expert_contact?.phone_number) || "");
      setValue("expert_extension", expert_contact?.phone_ext || "");
      setValue("expert_fax", formatNumber(expert_contact?.fax) || "");
      setValue("expert_email", expert_contact?.email || "");
      setValue("expert_name", expert_contact?.name || "");
  
      setValue("firm_name", second_contact?.name || "");
      setValue("firm_first_name", second_contact?.first_name || "");
      setValue("firm_last_name", second_contact?.last_name || "");
      setValue("firm_address1", second_contact?.address1 || "");
      setValue("firm_address2", second_contact?.address2 || "");
      setValue("firm_city", second_contact?.city || "");
      setValue("firm_state", second_contact?.state || "");
      setValue("firm_zip", second_contact?.zip || "");
      setValue("firm_phone", formatNumber(second_contact?.phone_number) || "");
      setValue("firm_extension", second_contact?.phone_ext || "");
      setValue("firm_fax", formatNumber(second_contact?.fax) || "");
      setValue("firm_email", second_contact?.email || "");
  
      // Setting other fields
      setValue("expert_categoryID", expert?.expert_categoryID || null);
      setValue("field", expert.field || "");
      setValue("retained", formatDateForModalFields(expert.retained) || "");
      setValue("retainer", expert.retainer || "");
      setValue("rate", expert.rate || "");
      setValue("url", expert.url || "");
  
      // Set the state for retained entity and record ID
      setRetainedByEntity(expert?.retained_by_entity);
      setRetainedByRecordId(expert?.retained_by_record_id);
    }
  }, [expert, setValue]);

  const postDataforUpdateCaseExpertContacts = async (data) => {
    // console.log(data);
    try {
      const response = await api.post(
        `${origin}/api/edit_expert/${expert.id}/`,
        data
      );
      if (response.status === 200) {
        // handleClose();
        onFetchExperts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data) => {
    // const phoneNumber = data["expert_phone"];
    // const firmPhoneNumber = data["firm_phone"];
    // const faxNumber = data["expert_fax"];
    // if (phoneNumber.length > 0) {
    //   if (!isValidUSPhoneNumber(phoneNumber)) {
    //     notify("Please Enter Valid Expert Phone Number", "warning");
    //     return;
    //   }
    // }
    // if (firmPhoneNumber.length > 0) {
    //   if (!isValidUSPhoneNumber(phoneNumber)) {
    //     notify("Please Enter Valid Firm Phone Number", "warning");
    //     return;
    //   }
    // }
    // if (faxNumber.length > 0) {
    //   if (!isValidUSPhoneNumber(phoneNumber)) {
    //     notify("Please Enter Valid Expert Fax", "warning");
    //     return;
    //   }
    // }

    const cleanedData = {
      ...data,
      retained: data.retained ? formatDateForSubmission(data.retained): null, 
      retained_by_entity: retainedByEntity || " ",
      retained_by_record_id: retainedByRecordId || null,
      expert_categoryID: data.expert_categoryID ? parseInt(data.expert_categoryID, 10) : null,
    };

    postDataforUpdateCaseExpertContacts(cleanedData);
    handleClose();
  };

  return (
    <FormProvider {...methods}>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered expert-modal-1000p"
      >
        <div style={{ height: "650px" }}>
          <Modal.Header className="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
              id="modal_title"
            >
              Experts
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="custom-tab custom-margin-top">
              <Tab.Container defaultActiveKey={activeTab}>
                <Nav variant="tabs" className="justify-content-around">
                  <Nav.Link
                    eventKey="expert-contact"
                  >
                    Expert
                  </Nav.Link>

                  <Nav.Link
                    eventKey="agency-contact"
                  >
                    Expert Agency
                  </Nav.Link>

                  <Nav.Link
                    eventKey="retained"
                  >
                    Retained
                  </Nav.Link>
                </Nav>
                <Form
                  className="d-flex , flex-column justify-content-between"
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ height: "555px" }}
                >
                  <div className="custom-margin-top ">
                    <Tab.Content>
                      <Tab.Pane eventKey="retained">
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Retained By:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <select
                                  className="form-select"
                                  // {...register("retained_by_entity")}
                                  onChange={handleSelectRetainedByChange}
                                >

                                    <option
                                      value={" "}
                                      >
                                        -----------
                                      </option>
                                  {retainedByList &&
                                    retainedByList.clients.map((client) => (
                                      <option
                                        key={`Client, ${client.id}`}
                                        value={`Client, ${client.id}`}
                                        selected={
                                          retainedByEntity === "Client" &&
                                          retainedByRecordId === client.id
                                        }
                                      >
                                        {client.first_name} {client.last_name}{" "}
                                        (Client)
                                      </option>
                                    ))}
                                  {retainedByList &&
                                      retainedByList.defendants.map((defendant) => (
                                        <option
                                          key={`Defendant, ${defendant.id}`}
                                          value={`Defendant, ${defendant.id}`}
                                          selected={
                                            retainedByEntity === "Defendant" &&
                                            retainedByRecordId === defendant.id
                                          }
                                        >
                                          {defendant?.defendantType_name === "Private Individual"
                                            ? `${defendant.first_name} ${defendant.last_name}`
                                            : defendant.entity_name}{" "}
                                          (Defendant)
                                        </option>
                                      ))}
                                  {retainedByList &&
                                    retainedByList.otherParties.map(
                                      (otherParty) => (
                                        <option
                                          key={`OtherParty, ${otherParty.id}`}
                                          value={`OtherParty, ${otherParty.id}`}
                                          selected={
                                            retainedByEntity === "OtherParty" &&
                                            retainedByRecordId === otherParty.id
                                          }
                                        >
                                          {otherParty.party_first_name}{" "}
                                          {otherParty.party_last_name} (Other
                                          Party)
                                        </option>
                                      )
                                    )}
                                </select>
                              </div>
                            </div>

                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Name:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Full Name"
                                  className="form-control"
                                  {...register("expert_name")}
                                />
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  <nobr>Field:</nobr>
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Field"
                                  className="form-control"
                                  {...register("field")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Retainer:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="number"
                                  className="form-control"
                                  {...register("retainer")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Rate:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="number"
                                  className="form-control"
                                  {...register("rate")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                 Retained:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control"
                                  {...register("retained")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="expert-contact">
                        <Row className="mx-0 ">
                          <Col md={12}>
                            <input
                              type="text"
                              placeholder="Type Expert name or field to search directory then click an entry"
                              className="form-control custom-margin-bottom"
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
                                      maxHeight: "150px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {filteredResults.map((result, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          handleSelectedDirectoryForExpertContact(
                                            result
                                          );
                                          setIsFiltersOpen(false);
                                        }}
                                        style={{
                                          padding: "8px",
                                          cursor: "pointer",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      >
                                        {result?.expert_firstname} {result?.expert_lastname} {result?.address1}{" "}
                                      {result?.address2} {result?.city}{" "}
                                      {result?.state}
                                      </div>
                                    ))}
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
                                  Category :
                                </span>
                              </div>
                              <div className="col-md-10">
                              <select
                                  {...register("expert_categoryID")}
                                  className="form-select"
                                  value={watch("expert_categoryID") || expert?.expert_categoryID || null}
                                  onChange={(e) => setValue("expert_categoryID", e.target.value)}
                                >
                                  <option value="">-----------</option>
                                  {expertCategories &&
                                    expertCategories.map((obj) => (
                                      <option key={obj.id} value={obj.id}>
                                        {obj.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Title :
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter title"
                                  className="form-control"
                                  {...register("expert_title")}
                                />
                              </div>
                            </div>

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
                                  {...register("expert_first_name")}
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
                                  {...register("expert_last_name")}
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
                                  {...register("expert_address1")}
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
                                  {...register("expert_address2")}
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
                                  {...register("expert_city")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-3">
                              <select
                                    name="expert_state"
                                    className="form-select"
                                    {...register("expert_state")}
                                    value={watch("expert_state") || expert?.expert_contact?.expert_state || ""}
                                    onChange={(e) => setValue("expert_state", e.target.value)}
                                  >
                                    <option value="">Select State</option>
                                    {statesAbrs &&
                                      statesAbrs.map((state) => (
                                        <option key={state.id} value={state.StateAbr}>
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
                                  {...register("expert_zip")}
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
                                  {...register("expert_phone")}
                                  value={expertPhoneValue || ""}
                                  onChange={handleExpertPhoneInputChange}
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
                                  {...register("expert_extension")}
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
                                  {...register("expert_extension")}
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
                                  {...register("expert_fax", {})}
                                  value={expertFaxValue || ""}
                                  onChange={handleExpertFaxInputChange}
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
                                  {...register("expert_email")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="agency-contact">
                        <Row className="mx-0 ">
                          <Col md={12}>
                            <input
                              type="text"
                              placeholder="Type Expert's name or Expertise to search directory then click an entry"
                              className="form-control custom-margin-bottom"
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
                                      maxHeight: "150px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {filteredResults.map((result, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          handleSelectedDirectoryForSecondContant(
                                            result
                                          );
                                          setIsFiltersOpen(false);
                                        }}
                                        style={{
                                          padding: "8px",
                                          cursor: "pointer",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      >
                                      {result?.expert_firstname} {result?.expert_lastname} {result?.address1}{" "}
                                      {result?.address2} {result?.city}{" "}
                                      {result?.state}
                                      </div>
                                    ))}
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
                                  Agency Name:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Agency Name"
                                  className="form-control"
                                  {...register("firm_name")}
                                />
                              </div>
                            </div>

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
                                  {...register("firm_first_name")}
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
                                  {...register("firm_last_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Firm Address 1:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Firm Address 1"
                                  className="form-control"
                                  {...register("firm_address1")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Firm Address 2:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Firm Address 2"
                                  className="form-control"
                                  {...register("firm_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Firm City :
                                </span>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  placeholder="Enter Firm City"
                                  className="form-control"
                                  {...register("firm_city")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Firm State :
                                </span>
                              </div>
                              <div className="col-md-3">
                              <select
                                name="firm_state"
                                className="form-select"
                                {...register("firm_state")}
                                value={watch("firm_state") || expert?.second_contact?.firm_state || ""}
                                onChange={(e) => setValue("firm_state", e.target.value)}
                              >
                                <option value="">Select State</option>
                                {statesAbrs &&
                                  statesAbrs.map((state) => (
                                    <option key={state.id} value={state.StateAbr}>
                                      {state.name}
                                    </option>
                                  ))}
                              </select>
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Firm Zip :
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Firm Zip"
                                  className="form-control"
                                  {...register("firm_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Firm Phone:
                                </span>
                              </div>

                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("firm_phone")}
                                  value={firmPhoneValue || ""}
                                  onChange={handleFirmPhoneInputChange}
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
                                  {...register("firm_extension")}
                                />
                              </div>
                            </div>

                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Firm Extension:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Firm Phone Extension"
                                  className="form-control"
                                  {...register("firm_extension")}
                                />
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Firm Fax:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("firm_fax", {})}
                                  value={firmFaxValue || ""}
                                  onChange={handleFirmFaxInputChange}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Firm Email:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="email"
                                  placeholder="Enter Firm Email"
                                  className="form-control"
                                  {...register("firm_email")}
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
        <ToastContainer />
      </Modal>

      {/* {showDeleteConfirm && (
        <ConformDeletePopup handleDeleteSubmission={handleDeleteSubmission} handleClose={hideDeleteConfirmPopup} />
      )} */}
    </FormProvider>
  );
}

export default EditCaseExpertModal;
