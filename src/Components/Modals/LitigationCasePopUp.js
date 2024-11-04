import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";

function LitigationCasePopUp({
  onStateIdChange,
  litigation_id,
  showPopup,
  handleClose,
  handleSave,
  handleDelete,
  current_shortCaseTitle,
  current_longCaseTitle,
  current_caseNumber,
  current_state_id,
  current_county,
  states = []
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const token = localStorage.getItem('token');
  const clientId = getClientId();
  const currentCaseId = getCaseId();
  const methods = useForm();
  const { handleSubmit, register, setValue, watch, formState: { errors } } = methods;
  const [loading, setLoading] = useState(false);
  const { setLitigationDashboardDataUpdated } = useContext(ClientDataContext);
  const [state_id, set_state_id] = useState(current_state_id);
  const [current_county_id, set_current_county_id] = useState(null);
  const [counties, setCounties] = useState([]);
  const [isFirstCheckboxChecked, setIsFirstCheckboxChecked] = useState(false); // Track first checkbox state
  const [isSecondCheckboxChecked, setIsSecondCheckboxChecked] = useState(false); // Track second checkbox state

  // Fetch counties when state_id changes
  useEffect(() => {
    const getCounties = async () => {
      if (state_id) {
        try {
          const response = await axios.get(
            `${origin}/api/litigation-page/County/?in_state=${state_id}`,
            {
              headers: { Authorization: token },
            }
          );
          setCounties(response.data);
        } catch (error) {
          console.error("Failed to fetch counties data:", error);
        }
      }
    };

    getCounties();
  }, [state_id]);

  useEffect(() => {
    // Set initial values for the form fields
    setValue('shorttitle', current_shortCaseTitle);
    setValue('longtitle', current_longCaseTitle);
    setValue('caseNumber', current_caseNumber);
    setValue('state', current_state_id);
    setValue('county', current_county_id);
  }, [current_shortCaseTitle, current_longCaseTitle, current_caseNumber, current_state_id, current_county])

  const onSubmit = async (data) => {
    const url = `${origin}/api/litigation-page/litigations-update/${litigation_id}/`;
    const shotTitle = watch("shorttitle");
    const longTitle = watch("longtitle");
    const caseNumber = watch("caseNumber");
    const state = watch("state");
    const county = watch("county");
    const SolCheck = isFirstCheckboxChecked; // Watch first checkbox
    const DelSolCheck = isSecondCheckboxChecked; // Watch second checkbox

    setLoading(true);
    const requestBody = {
      case_short_name: shotTitle,
      case_full_name: longTitle,
      case_number: caseNumber,
      state: state,
      county: county,
      state_sol_check: SolCheck,
      delete_sol_check: DelSolCheck
    }

    try {
      console.log("BODY", requestBody);
      const response = await axios.patch(url, requestBody, {
        headers: {
          Authorization: token,
        },
      });
      setLoading(false);
      setLitigationDashboardDataUpdated(true);
      handleClose()
    } catch (error) {
      console.log("BODY", requestBody);
      console.error('Error making PATCH request:', error)
      setLoading(false);
    }
  };

  const handleFirstCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsFirstCheckboxChecked(isChecked);

    // If the first checkbox is unchecked, uncheck and disable the second checkbox
    if (!isChecked) {
      setIsSecondCheckboxChecked(false); // Uncheck the second checkbox
    }
  };

  const handleSecondCheckboxChange = (e) => {
    setIsSecondCheckboxChecked(e.target.checked);
  };

  return (
    <Modal
      show={showPopup ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-2 modal-dialog-centered"
      centered
    >
      <FormProvider {...methods}>
        <div className="modal-content" style={{}}>
          <div className="modal-body">
            <div
              className="modal-header"
              style={{
                marginBottom: "20px",
                padding: 0,
              }}
            >
              <h5 className="modal-title mb-2 mx-auto" id="">
                Court Info
              </h5>
            </div>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-2 text-left">
                    <span className="d-inline-block text-secondary lit-color-000">
                      Short Case Title:
                    </span>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      name="litigation_case_shortname"
                      placeholder="Enter Case Name"
                      {...register("shorttitle")}
                      defaultValue={current_shortCaseTitle}
                      onChange={(e) => setValue('shorttitle', e.target.value)}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-2 text-left">
                    <p className="d-inline-block text-secondary lit-color-000">
                      Long Case Title:
                    </p>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      name="litigation_case_shortname"
                      placeholder="Enter Case Name"
                      {...register("longtitle")}
                      defaultValue={current_longCaseTitle}
                      onChange={(e) => setValue('longtitle', e.target.value)}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-1 text-left">
                    <p className="text-secondary">
                      Case Number:
                    </p>
                  </div>
                  <div className="col-md-3">
                    <Form.Control
                      type="text"
                      name="case_number"
                      placeholder="Enter Case #"
                      className="form-control CaseNumber-CI"
                      {...register("caseNumber")}
                      defaultValue={current_caseNumber}
                      onChange={(e) => setValue('caseNumber', e.target.value)}
                    >
                    </Form.Control>
                  </div>
                  <div className="col-md-1 text-left">
                    <p className="text-secondary">State:</p>
                  </div>
                  <div className="col-md-3">
                    <Form.Select
                      {...register("state")}
                      defaultValue={current_state_id}
                      onChange={(e) => {
                        const selectedStateId = Number(e.target.value); // Convert value to number
                        const selectedState = states.find(state => state.id === selectedStateId);
                        if (selectedState) {
                          setValue('state', selectedState.id);
                          set_state_id(selectedState.id); // Update state ID
                        }
                      }}
                      className={`form-control ${errors.state && 'is-invalid'}`}
                    >   <option key="" value="">-------</option>
                      {states?.map(state => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}

                    </Form.Select>
                  </div>
                  <div className="col-md-1 text-left">
                    <p className="text-secondary">County:</p>
                  </div>
                  <div className="col-md-3">
                    <Form.Select
                      {...register("county")}
                      defaultValue={current_county_id}
                      onChange={(e) => setValue('county', e.target.value)}
                      className={`form-control ${errors.state && 'is-invalid'}`}
                    >   <option key="" value="">-------</option>
                      {counties?.map(county => (
                        <option key={county.id} value={county.id}>
                          {county.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-6">
                    <p className="text-secondary">
                      Recalculate Statute of Limitations if State is changed
                    </p>
                  </div>
                  <div className="col-md-3">
                    <input
                      type="checkbox"
                      name="state_sol_check"
                      {...register("recalculate")}
                      checked={isFirstCheckboxChecked}
                      onChange={handleFirstCheckboxChange}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-6">
                    <p className="text-secondary">
                      Delete old statute entries on case
                    </p>
                  </div>
                  <div className="col-md-3">
                    <input
                      type="checkbox"
                      name="delete_sol_check"
                      {...register("entries")}
                      disabled={!isFirstCheckboxChecked} // Disable if the first checkbox is unchecked
                      checked={isSecondCheckboxChecked}
                      onChange={handleSecondCheckboxChange}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="modal-footer" style={{ border: "none" }}>
            <button
              type="button"
              className="btn btn-secondary h-35px"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={onSubmit}
            >
              {loading ? 'Saving..' : 'Save'}
            </button>
          </div>
        </div>
      </FormProvider>
    </Modal >
  );
}

export default LitigationCasePopUp;
