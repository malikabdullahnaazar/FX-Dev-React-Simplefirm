import React, { useState, useEffect, useContext } from "react";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import { getCaseId, getClientId, getToken } from "../../../Utils/helper";
import axios from "axios";
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";

// RK:07-11-2024 :: 10:40 pm
function AddDefendant({ show, handleClose, onFetchDefendants , defendantsLength }) {
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken()
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs

  const { reset, handleSubmit, register, watch, setValue } = useForm();

  const [defendantType, setDefendantType] = useState("Private Individual"); // to set defendat type based on active pannel

  const {isPanelChecklistUpdated, setIsPanelChecklistUpdated } = useContext(ClientDataContext);

  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/`, {
        headers:{
          Authorization:accessToken,
        }
      });
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSatesData();
  }, []);

  const formatNumber = (inputVal) => {
    inputVal = inputVal.replace(/\D/g, "");
    // Insert formatting characters
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

  function handleChange(event, inputType) {
    let formattedValue = formatNumber(event.target.value);
    setValue(`${inputType}`, formattedValue);
  }

  const onSubmit = (data) => {
    const CleanedData = {
      ...data,
      defendant_type: defendantType,
    };
    console.log(CleanedData)
    const CreateDefendant = async () => {
      try {
        const response = await axios.post(
          `${origin}/api/defendants/add_defendant/${clientId}/${currentCaseId}/`,
          CleanedData , {
            headers: {
              'Content-Type': 'application/json',  
              Authorization: accessToken, 
            }
          }
        );
        if (response.status === 201) {
          handleClose();
          setDefendantType("Private Individual")
          onFetchDefendants();
          setIsPanelChecklistUpdated(true)
          reset()
        }
      } catch (error) {
        console.log(error);
      } 
    };

    CreateDefendant();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="max-1024 modal-dialog-centered "
      >
        <div style={{ height: "515px" }}>
          <Modal.Header className="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
              id="modal_title"
            >
              Defendants
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="custom-tab mt-3">
              <Tab.Container defaultActiveKey={"PrivateIndividual"}>
                <Nav variant="tabs" className="justify-content-around">
                  <Nav.Link
                    className=" nav-link Pad8 tab-ite"
                    eventKey="PrivateIndividual"
                    onClick={() => setDefendantType("Private Individual")}
                  >
                    Private Individual
                  </Nav.Link>
                  <Nav.Link
                    className=" nav-link Pad8 tab-ite"
                    eventKey="CompanyOrBusiness"
                    onClick={() => setDefendantType("Commercial Company")}
                  >
                    Company or Business
                  </Nav.Link>

                  <Nav.Link
                    className=" nav-link Pad8 tab-ite"
                    eventKey="PublicEntity"
                    onClick={() => setDefendantType("Public Entity")}
                  >
                    Public Entity
                  </Nav.Link>
                </Nav>
                <Form
                  className="d-flex flex-column justify-content-between"
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ height: "395px" }}
                >
                  <div className="mt-3">
                    <Tab.Content>
                      <Tab.Pane eventKey="PrivateIndividual">
                        <Row className="mx-0">
                        {!defendantsLength &&(
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
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  First Name:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter First Name"
                                  className="form-control"
                                  {...register("PI_first_name")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Last Name:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Last Name"
                                  className="form-control"
                                  {...register("PI_last_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("PI_address1")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("PI_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  onKeyUp={(e) => handleChange(e, "PI_fax")}
                                  {...register("PI_fax")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City :
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter city"
                                  className="form-control"
                                  {...register("PI_city")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Email:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="email"
                                  placeholder="Enter email"
                                  className="form-control"
                                  {...register("PI_email")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-5">
                                <select
                                  name="state"
                                  className="form-select"
                                  {...register("PI_state")}
                                >
                                  <option selected value="">
                                    Select state
                                  </option>
                                  {statesAbrs &&
                                    statesAbrs.map((state) => (
                                      <option
                                        key={state.id}
                                        // selected={state.StateAbr === "AZ"}
                                        value={state.StateAbr}
                                      >
                                        {state.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Phone:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  onKeyUp={(e) => handleChange(e, "PI_phone")}
                                  {...register("PI_phone")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Extension:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("PI_extension")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip :
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("PI_zip")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="CompanyOrBusiness">
                        <Row className="mx-0 custom-margin-bottom">
                          <Col md={12} className="mx-0">
                            <input
                              type="text"
                              placeholder="Type Entity"
                              className="form-control"
                              {...register("CB_entity_name")}
                            />
                          </Col>
                        </Row>

                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  First Name:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter First Name"
                                  className="form-control"
                                  {...register("CB_first_name")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Last Name:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Last Name"
                                  className="form-control"
                                  {...register("CB_last_name")}
                                />
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("CB_address1")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("CB_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  onKeyUp={(e) => handleChange(e, "CB_fax")}
                                  {...register("CB_fax")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City :
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter city"
                                  className="form-control"
                                  {...register("CB_city")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Email:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="email"
                                  placeholder="Enter email"
                                  className="form-control"
                                  {...register("CB_email")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-5">
                                <select
                                  name="state"
                                  className="form-select"
                                  {...register("CB_state")}
                                >
                                  <option selected value="">
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
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Phone:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  onKeyUp={(e) => handleChange(e, "CB_phone")}
                                  {...register("CB_phone")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Extension:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("CB_extension")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip :
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("CB_zip")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="PublicEntity">
                        <Row className="mx-0 custom-margin-bottom">
                          <Col md={12} className="mx-0">
                            <input
                              type="text"
                              placeholder="Type Entity"
                              className="form-control"
                              {...register("PE_entity_name")}
                            />
                          </Col>
                        </Row>

                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  First Name:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter First Name"
                                  className="form-control"
                                  {...register("PE_first_name")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Last Name:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Last Name"
                                  className="form-control"
                                  {...register("PE_last_name")}
                                />
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("PE_address1")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("PE_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  onKeyUp={(e) => handleChange(e, "PE_fax")}
                                  {...register("PE_fax")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City :
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter city"
                                  className="form-control"
                                  {...register("PE_city")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Email:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="email"
                                  placeholder="Enter email"
                                  className="form-control"
                                  {...register("PE_email")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-5">
                                <select
                                  name="state"
                                  className="form-select"
                                  {...register("PE_state")}
                                >
                                  <option selected value="">
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
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Phone:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  onKeyUp={(e) => handleChange(e, "PE_phone")}
                                  {...register("PE_phone")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Extension:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("PE_extension")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip :
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("PE_zip")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      className="ml-2"
                    >
                      Close
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
    </>
  );
}

export default AddDefendant;
