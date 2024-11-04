import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Nav, Form, Col, Row, Tab } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId, getToken } from "../../../../Utils/helper";
import api from "../../../../api/api";
import axios from "axios";

function CounselEditPopup({
  show,
  handleClose,
  activeTab,
  opposingcounsel,
  counselTypes,
  handleFacthDefendants,
  onShowDeleteConfirmPopup,
}) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken();

  const [searchResults, setSearchResults] = useState([]); // counsel's filters
  const [filteredResults, setFilteredResults] = useState([]);
  const [isFilteresOpen, setIsFiltersOpen] = useState(false);

  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/`, {
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

  const fecthCounselFilter = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/general/search_filter_counsel/`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      if (response.status === 200) {
        setSearchResults(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSatesData();
    fecthCounselFilter();
  }, []);

  //   Formting phone number an fax number
  const formatNumber = (inputVal) => {
    if (!inputVal) return inputVal;

    inputVal = inputVal.replace(/\D/g, "");
    inputVal =
      "(" +
      inputVal.substring(0, 3) +
      ") " +
      inputVal.substring(3, 6) +
      "-" +
      inputVal.substring(6, 10);
    // Update input value
    return inputVal;
  };

  const handleInputFirmChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length >= 2) {
      const filtered = searchResults?.firms?.filter((result) => {
        const office_name = result.office_name
          ? result.office_name.toLowerCase()
          : "";
          const first_name = result.first_name
          ? result.first_name.toLowerCase()
          : "";
        const last_name = result.last_name
          ? result.last_name.toLowerCase()
          : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        const zip = result.zip ? result.zip.toLowerCase() : "";

        return (
          office_name.startsWith(inputValue) ||
          first_name.startsWith(inputValue) ||
          last_name.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          zip.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setFilteredResults(filtered);
      setIsFiltersOpen(!isFilteresOpen);
    } else {
      setFilteredResults([]);
    }
  };

  const handleCounselChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length >= 2) {
      const filtered = searchResults?.attorneys?.filter((result) => {
        const first_name = result.first_name
          ? result.first_name.toLowerCase()
          : "";
        const last_name = result.last_name
          ? result.last_name.toLowerCase()
          : "";
        const firm_name = result.firm_name
          ? result.firm_name.toLowerCase()
          : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        const zip = result.zip ? result.zip.toLowerCase() : "";

        return (
          firm_name.startsWith(inputValue) ||
          first_name.startsWith(inputValue) ||
          last_name.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          zip.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setFilteredResults(filtered);
      setIsFiltersOpen(!isFilteresOpen);
    } else {
      setFilteredResults([]);
    }
  };

  const handleSelectedForCounsel = (instance) => {

    setValue("counsel_name", instance?.office_name);
    setValue("counsel_address1", instance.address1 || "");
    setValue("counsel_address2", instance.address2 || "");
    setValue("counsel_city", instance.city || "");
    setValue("counsel_state", instance.state || "");
    setValue("counsel_zip", instance.zip || "");
    setValue("counsel_phone", formatNumber(instance.phone) || "");
    setValue("counsel_extension", instance.extension || "");
    setValue("counsel_fax", formatNumber(instance.fax) || "");
    setValue("counsel_email", instance.email || "");
    setValue("counsel_website", instance.website || "");
  };

  const handleSelectedForAttorney = (instance) => {
    setValue("attorney_name", `${instance.first_name || ''} ${instance.middle_name || ''} ${instance.last_name || ''}`.trim());
    setValue("attorney_address1", instance.address1 || "");
    setValue("attorney_address2", instance.address2 || "");
    setValue("attorney_city", instance.city || "");
    setValue("attorney_state", instance.state || "");
    setValue("attorney_zip", instance.zip || "");
    setValue("attorney_phone", formatNumber(instance.phone) || "");
    setValue("attorney_extension", instance.extension || "");
    setValue("attorney_fax", formatNumber(instance.fax) || "");
    setValue("attorney_email", instance.email || "");
    setValue("attorney_website", instance.website || "");

  };

  useEffect(() => {
    console.log("Results = ", opposingcounsel);
    // Counsel
    setValue(
      "counsel_name",
      opposingcounsel?.opposingcounselcontact?.name || ""
    );
    setValue(
      "counsel_address1",
      opposingcounsel?.opposingcounselcontact?.address1 || ""
    );
    setValue(
      "counsel_address2",
      opposingcounsel?.opposingcounselcontact?.address2 || ""
    );
    setValue(
      "counsel_city",
      opposingcounsel?.opposingcounselcontact?.city || ""
    );
    setValue(
      "counsel_state",
      opposingcounsel?.opposingcounselcontact?.state || ""
    );
    setValue("counsel_zip", opposingcounsel?.opposingcounselcontact?.zip || "");
    setValue(
      "counsel_phone",
      opposingcounsel?.opposingcounselcontact?.phone_number || ""
    );
    setValue(
      "counsel_email",
      opposingcounsel?.opposingcounselcontact?.email || ""
    );
    setValue("counsel_fax", opposingcounsel?.opposingcounselcontact?.fax || "");

    // Attorney
    setValue("attorney_name", opposingcounsel?.opposingattorney?.name || "");
    setValue(
      "attorney_address1",
      opposingcounsel?.opposingattorney?.address1 || ""
    );
    setValue(
      "attorney_address2",
      opposingcounsel?.opposingattorney?.address2 || ""
    );
    setValue("attorney_city", opposingcounsel?.opposingattorney?.city || "");
    setValue("attorney_state", opposingcounsel?.opposingattorney?.state || "");
    setValue("attorney_zip", opposingcounsel?.opposingattorney?.zip || "");
    setValue(
      "attorney_phone",
      opposingcounsel?.opposingattorney?.phone_number || ""
    );
    setValue("attorney_email", opposingcounsel?.opposingattorney?.email || "");
    setValue("attorney_fax", opposingcounsel?.opposingattorney?.fax || "");

    // information
    setValue("file_number", opposingcounsel?.file_number);
    setValue("counsel_type_id", opposingcounsel?.counsel_type?.id);
  }, []);

  function handleChange(event, inputType) {
    let formattedValue = formatNumber(event.target.value);
    setValue(`${inputType}`, formattedValue);
  }

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `${origin}/api/defendants/edit_opposing_counsel/${opposingcounsel?.id}/`,
        data,
        {
          headers: {
            "Content-Type": " application/json",
            Authorization: accessToken,
          },
        }
      );
      if (response.status === 200) {
        handleClose();
        handleFacthDefendants();
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleClose();
    }
  };

  const SelectedCounselState = watch("counsel_state");
  const SelectedAttorneyState = watch("attorney_state");

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-800p custom-insurance-dialog"
    >
      <Modal.Header className="text-center p-0 bg-primary popup-heading-color justify-content-center">
        <Modal.Title
          className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
          id="modal_title"
        >
          Counsel Contacts
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="custom-tab">
          <Tab.Container defaultActiveKey={activeTab}>
            <Nav variant="tabs" className="justify-content-around">
              <Nav.Link eventKey="counsel">Counsel</Nav.Link>

              <Nav.Link eventKey="attorney">Attorney</Nav.Link>

              <Nav.Link eventKey="information">Information</Nav.Link>
            </Nav>
            <Form
              id="insurance_contacts_form"
              onSubmit={handleSubmit(onSubmit)}
              style={{ height: "285px" }}
            >
              <div className=" mt-2">
                <div>
                  <Tab.Content>
                    <Tab.Pane eventKey="counsel">
                      <Row className="mb-1 mx-0">
                        <Col md={12}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type Counsel Name or Firm Name to add from library"
                            onChange={handleInputFirmChange}
                          />

                          {Array.isArray(filteredResults) &&
                            filteredResults.length > 0 && (
                              <div style={{ position: "relative" }}>
                                <div
                                  className={`${isFilteresOpen ? "block" : "hidden"}`}
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
                                  {filteredResults
                                    ?.slice(0, 9)
                                    ?.map((result, index) => {
                                      const fullAddress = [
                                        (result?.office_name) ? `${result.office_name}` : '',
                                        result?.first_name,
                                        result?.last_name,
                                        result?.address1,
                                        result?.address2,
                                        result?.city,
                                        result?.state,
                                        result?.zip,
                                        result?.phone,
                                        result?.website,
                                      ].filter(Boolean).join(', ') + (result?.zip ? '' : '');
                                     return  <div
                                        key={index}
                                        onClick={() => {
                                          handleSelectedForCounsel(result);
                                          setIsFiltersOpen(!isFilteresOpen);
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
                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap contact_name_title">
                            Name :
                          </span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="text"
                            placeholder="Enter name"
                            {...register("counsel_name")}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Address 1 :
                          </span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="text"
                            placeholder="Address 1"
                            {...register("counsel_address1")}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Address 2 :
                          </span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="text"
                            placeholder="Address 2"
                            {...register("counsel_address2")}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1  mx-0">
                        <Col md={2} className="d-flex align-items-center ">
                          <span className="d-inline-block text-grey text-nowrap">
                            City :
                          </span>
                        </Col>
                        <Col md={3}>
                          <Form.Control
                            type="text"
                            placeholder="Enter City"
                            className="form-control"
                            {...register("counsel_city")}
                          />
                        </Col>
                        <Col
                          md={1}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <span className="d-inline-block  text-grey text-nowrap">
                            State :
                          </span>
                        </Col>
                        <Col md={3} className="d-flex">
                          <Form.Control
                            as="select"
                            className="form-control "
                            {...register("counsel_state")}
                            value={SelectedCounselState || ""}
                            onChange={(e) =>
                              setValue("counsel_state", e.target.value)
                            }
                          >
                            <option value="">Select state</option>
                            {statesAbrs &&
                              statesAbrs?.map((state) => (
                                <option
                                  key={state.StateAbr}
                                  value={state.StateAbr}
                                >
                                  {state.name}
                                </option>
                              ))}
                          </Form.Control>
                        </Col>

                        <Col md={1} className="d-flex align-items-center ">
                          <span className="d-inline-block  text-grey text-nowrap">
                            Zip :
                          </span>
                        </Col>
                        <Col md={2}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Zip"
                            className="form-control"
                            {...register("counsel_zip")}
                          />
                        </Col>
                      </Row>

                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Phone :
                          </span>
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            onKeyUp={(e) => handleChange(e, "counsel_phone")}
                            {...register("counsel_phone")}
                          />
                        </Col>

                        <Col
                          md={1}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Ext :
                          </span>
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            type="number"
                            placeholder="Extension"
                            {...register("counsel_extension")}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Fax :
                          </span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            onKeyUp={(e) => handleChange(e, "counsel_fax")}
                            {...register("counsel_fax")}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Email :
                          </span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Email"
                            {...register("counsel_email")}
                          />
                        </Col>
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="attorney">
                      <Row className="mb-1 mx-0">
                        <Col md={12}>
                          <input
                            placeholder="Type Counsel Name or Firm Name to add from library"
                            id="12"
                            type="text"
                            className="form-control"
                            onChange={handleCounselChange}
                          />
                          {Array.isArray(filteredResults) &&
                            filteredResults.length > 0 && (
                              <div style={{ position: "relative" }}>
                                <div
                                  className={`${isFilteresOpen ? "block" : "hidden"}`}
                                  style={{
                                    position: "absolute",
                                    zIndex: 1000,
                                    backgroundColor: "#fff",
                                    border: "1px solid #ccc",
                                    width: "100%",
                                    overflowY: "auto",
                                  }}
                                >
                                  {filteredResults
                                    .slice(0, 9)
                                    ?.map((result, index) => {
                                      const fullAddress = [
                                        result?.firm_name,
                                        (result?.first_name || result?.last_name) ? `${result.first_name} ${result.last_name}` : '',
                                        result?.address1,
                                        result?.address2,
                                        result?.city,
                                        result?.state,
                                        result?.zip,
                                      ].filter(Boolean).join(', ') + (result?.zip ? '' : ''); 
                                      
                                      return <div
                                        key={index}
                                        onClick={() => {
                                          handleSelectedForAttorney(result);
                                          setIsFiltersOpen(!isFilteresOpen);
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

                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap contact_name_title">
                            Name :
                          </span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="text"
                            placeholder="Enter name"
                            {...register("attorney_name")}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Address 1 :
                          </span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="text"
                            placeholder="Address 1"
                            {...register("attorney_address1")}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Address 2 :
                          </span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="text"
                            placeholder="Address 2"
                            {...register("attorney_address2")}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1 mx-0">
                        <Col md={2} className="d-flex align-items-center">
                          <span className="d-inline-block  text-grey text-nowrap">
                            City :
                          </span>
                        </Col>
                        <Col md={3}>
                          <Form.Control
                            type="text"
                            placeholder="Enter City"
                            className="form-control"
                            {...register("attorney_city")}
                          />
                        </Col>
                        <Col
                          md={1}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <span className="d-inline-block  text-grey text-nowrap">
                            State :
                          </span>
                        </Col>
                        <Col md={3} className="d-flex">
                          <Form.Control
                            as="select"
                            className="form-control"
                            {...register("attorney_state")}
                            value={SelectedAttorneyState || ""}
                            onChange={(e) =>
                              setValue("attorney_state", e.target.value)
                            }
                          >
                            <option value="">Select state</option>
                            {statesAbrs &&
                              statesAbrs.map((state) => (
                                <option key={state.id} value={state.StateAbr}>
                                  {state.name}
                                </option>
                              ))}
                          </Form.Control>
                        </Col>
                        <Col
                          md={1}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <span className="d-inline-block  text-grey text-nowrap">
                            Zip :
                          </span>
                        </Col>
                        <Col md={2}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Zip"
                            className="form-control "
                            {...register("attorney_zip")}
                          />
                        </Col>
                      </Row>

                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Phone :
                          </span>
                        </Col>
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            onKeyUp={(e) => handleChange(e, "attorney_phone")}
                            {...register("attorney_phone")}
                          />
                        </Col>

                        <Col
                          md={1}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Ext :
                          </span>
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            type="number"
                            placeholder="Extension"
                            {...register("attorney_extension")}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Fax :
                          </span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            onKeyUp={(e) => handleChange(e, "attorney_fax")}
                            {...register("attorney_fax")}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Email :
                          </span>
                        </Col>
                        <Col md={10}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Email"
                            {...register("attorney_email")}
                          />
                        </Col>
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="information">
                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            Counsel Type:{" "}
                          </span>
                        </Col>
                        <Col md={10} className="d-flex">
                          <Form.Control
                            as="select"
                            className="form-control"
                            {...register("counsel_type_id")}
                          >
                            <option value={""}>---------</option>
                            {counselTypes &&
                              counselTypes?.map((counselType) => (
                                <option
                                  key={counselType.id}
                                  value={counselType.id}
                                >
                                  {counselType.name}
                                </option>
                              ))}
                          </Form.Control>
                        </Col>
                      </Row>
                      <Row className="mb-1 mx-0">
                        <Col
                          md={2}
                          className="text-left d-flex align-items-center"
                        >
                          <span className="d-inline-block text-grey text-nowrap">
                            File Number:{" "}
                          </span>
                        </Col>
                        <Col md={10} className="d-flex">
                          <Form.Control
                            type="text"
                            placeholder="Enter File Number"
                            {...register("file_number")}
                          />
                        </Col>
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </div>
            </Form>
          </Tab.Container>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-between pt-4">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => onShowDeleteConfirmPopup()}>
          Delete
        </Button>
        <Button
          form="insurance_contacts_form"
          type="submit"
          className="btn popup-heading-color save-btn-popup"
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CounselEditPopup;
