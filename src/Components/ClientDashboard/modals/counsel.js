// Add Counsel Modal
import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import Input from "../shared/input";
import { useSelector } from "react-redux";
import Select from "../shared/select";
import { Modal, Button, Nav, Form, Col, Row, Tab } from "react-bootstrap";
import AutoCompleteSearch from "../../Insurance/AutoCompleteSearch";
import api from "../../../api/api";
import { ClientDataContext } from '../shared/DataContext';
import { getClientId, getCaseId } from "../../../Utils/helper";
import axios from 'axios';


// import AutoCompleteSearch from './AutoCompleteSearch';

const AddCounselModal = ({ handleClose, show }) => {

  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCase = getCaseId();
  const client = getClientId();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // counsel's filters

  const [filteredFirmResults, setFilteredFirmResults] = useState([])
  const [filteredCounselResults, setFilteredCounselResults] = useState([])
  const [filteredCounselOpen, setIsFiltersCounselOpen] = useState(false)
  const [filteredFirmOpen, setIsFiltersFirmOpen] = useState(false)
 

  const { isClientDataUpdated, setIsClientDataUpdated } = useContext(ClientDataContext);
  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const [counselTypes, setCounselTypes] = useState([]); //state abrs
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchSatesData();
    fetchCounselTypesData();
    fecthCounselFilter();
  }, [origin]);


  const onSubmit = async (data) => {
    setLoading(true);
    data['client_id'] = client;
    data['case_id'] = currentCase;
    try {
      const response = await axios.post(`${origin}/api/client-page/add_counsel/`, data, {
        headers: {
          Authorization: token,
        },
      })

    }
    catch (error) {
      console.error(error)

    }
    setIsClientDataUpdated(!isClientDataUpdated)
    setLoading(false);
    reset()
    handleClose()
  };

  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCounselTypesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/defendants/counsel_types/`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        setCounselTypes(response.data);
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
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        setSearchResults(response?.data)
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  const handleInputFirmChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length >= 2 ) {
      const filtered = searchResults?.firms?.filter((result) => {
        const office_name = result.office_name	 ? result.office_name	.toLowerCase() : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        const zip = result.zip ? result.zip.toLowerCase() : "";

        return (
          office_name.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          zip.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setFilteredFirmResults(filtered);
      setIsFiltersFirmOpen(true);
    } else {
      setFilteredFirmResults([]);
    }
  };

  const handleCounselChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length >= 2 ) {
      const filtered = searchResults?.firms?.filter((result) => { 
        const first_name = result.first_name	 ? result.first_name.toLowerCase() : "";
        const last_name = result.last_name  ? result.last_name.toLowerCase() : "";
        const office_name = result.office_name	 ? result.office_name	.toLowerCase() : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        const zip = result.zip ? result.zip.toLowerCase() : "";

        return (
        
          office_name.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          zip.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setFilteredCounselResults(filtered);
      setIsFiltersCounselOpen(true);
    } else {
      setFilteredCounselResults([]);
    }
  };



  const handleSelectedForFirm = (instance) => {
    setValue(
      "firm_name", 
      instance?.office_name
    );
    setValue("firm_address1", instance.address1 || "");
    setValue("firm_address2", instance.address2 || "");
    setValue("firm_city", instance.city || "");
    setValue("firm_state", instance.state || "");
    setValue("firm_zip", instance.zip || "");
    setValue(
      "firm_phone",
      formatNumber(instance.phone_number) || ""
    );
    setValue("firm_extension", instance.extension || "");
    setValue("firm_fax", formatNumber(instance.fax) || "");
    setValue("firm_email", instance.email || "");
  };

  const handleSelectedForCounsel = (instance) => {

    setValue("counsel_first_name", instance.first_name || "");
    setValue("counsel_last_name",  instance.last_name || "");
    setValue("counsel_address1", instance.address1 || "");
    setValue("counsel_address2", instance.address2 || "");
    setValue("counsel_city", instance.city || "");
    setValue("counsel_state", instance.state || "");
    setValue("counsel_zip", instance.zip || "");
    setValue(
      "counsel_phone",
      formatNumber(instance.phone_number) || ""
    );
    setValue("counsel_extension", instance.extension || "");
    setValue("counsel_fax", formatNumber(instance.fax) || "");
    setValue("counsel_email", instance.email || "");

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


  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="modal-dialog-centered INS-max-width-1000px custom-insurance-dialog"
      >
        <Modal.Header className="modal-header text-center bg-primary-fixed" style={{ padding: "5px" }}>
          <Modal.Title className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500 modal-title h4">
            Add Previous Client Counsel
          </Modal.Title>
          <Button
            variant="close"
            onClick={handleClose}
            aria-label="Close"
          ></Button>
        </Modal.Header>
        <div className="pr-2 pl-2">
          <Modal.Body className="panel-popups-body">
            <Form id="addinsurance_form" onSubmit={handleSubmit(onSubmit)}>
              <Row className="p-b-5">
                <Col className="p-0" md={6}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    placeholder="Enter File #"
                  ></Form.Control>
                </Col>

                <Col className="pl-4 pr-0" md={6}>
                  <Form.Select
                    {...register("counsel_type_id")}
                    required
                    className={`form-control ${errors.state && "is-invalid"}`}
                  >
                    {" "}
                    <option key="" value="">
                      Select Counsel Type
                    </option>
                    {counselTypes?.map((counsel) => (
                      <option key={counsel.id} value={counsel.id}>
                        {counsel.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row className="p-b-5">
                <Col className=" p-0" md={12}>
                  <Form.Control
                    type="text"
                    {...register("insuranceCompany")}
                    placeholder="Type Counsel Name or Firm Name to add from library"
                    className={`mb-1 ${errors?.insuranceCompany && "is-invalid"}`}
                    onChange={handleInputFirmChange}
                  />
                  {Array.isArray(filteredFirmResults) &&
                    filteredFirmResults.length > 0 && (
                      <div style={{ position: "relative" }}>
                        <div
                          className={`${filteredFirmOpen ? "block" : "hidden"}`}
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
                          {filteredFirmResults?.slice(0,9)?.map((result, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                handleSelectedForFirm(result);
                                setIsFiltersFirmOpen(false);
                              }}
                              style={{
                                padding: "5px",
                                cursor: "pointer",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              {result?.office_name && result?.office_name+", "}{result?.address1 && result?.address1+', '}{result?.address2}{" "}
                              {result?.city && result?.city+", "}{result?.state && result?.state+', '}{result?.zip}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </Col>
              </Row>
              <h5
                style={{
                  marginLeft: "-15px",
                  marginBottom: "5px",
                }}
              >
                Firm Information
              </h5>
              <Row className="p-b-5">
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    placeholder="Enter name"
                    {...register('firm_name')}
                  ></Form.Control>
                </Col>
                <Col className=" pl-4 pr-4" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('firm_website')}
                    placeholder="Enter website"
                  ></Form.Control>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('firm_phone')}
                    placeholder="Enter Phone"
                  ></Form.Control>
                </Col>
              </Row>
              <Row className="p-b-5">
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('firm_fax')}
                    placeholder="Enter Fax"
                  ></Form.Control>
                </Col>
                <Col className="pl-4 pr-4" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('firm_email')}
                    placeholder="Enter Email"
                  ></Form.Control>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('firm_extension')}
                    placeholder="Enter Extension"
                  ></Form.Control>
                </Col>
              </Row>
              <Row className="p-b-5">
                <Col className="p-0" md={6}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('firm_address1')}
                    placeholder="Enter Address 1"
                  ></Form.Control>
                </Col>

                <Col className="pl-4 pr-0" md={6}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('firm_address2')}
                    placeholder="Enter Address 2"
                  ></Form.Control>
                </Col>
              </Row>
              <Row className="p-b-5">
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('firm_city')}
                    placeholder="Enter City"
                  ></Form.Control>
                </Col>
                <Col className="pl-4 pr-4" md={4}>
                <Form.Select
                    className="dropdown-h-35px"
                    {...register("firm_state")}
                  >
                    <option value="" disabled selected>
                      Select State
                    </option>
                    {statesAbrs?.map((state) => (
                      <option key={state.StateAbr} value={state.StateAbr}>
                        {state.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    {...register('firm_zip')}
                    onKeyUp={(event) => { }}
                    placeholder="Enter ZIP"
                  ></Form.Control>
                </Col>
              </Row>
              <Row className="p-b-5">
                <Col className="p-0" md={12}>
                  <Form.Control
                    type="text"
                    onChange={handleCounselChange}
                    placeholder="Type Counsel Name to add from library"
                    className={` ${errors?.insuranceCompany && "is-invalid"}`}
                  // {...register("insuranceCompany")}
                  />

                    {Array.isArray(filteredCounselResults) &&
                      filteredCounselResults.length > 0 && (
                        <div style={{ position: "relative" }}>
                          <div
                            className={`${filteredCounselOpen ? "block" : "hidden"}`}
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
                            {filteredCounselResults.slice(0,9)?.map((result, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  handleSelectedForCounsel(
                                    result
                                  );
                                  setIsFiltersCounselOpen(false);
                                }}
                                style={{
                                  padding: "5px",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                {result.office_name && result.office_name+", "}{result.address1 && result.address1+","}{" "}
                                {result.address2 && result.address2+", "}{result.city && result.city+","}{" "}
                                {result.state && result.state+", "}{result.zip}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                </Col>
              </Row>
              <h5
                style={{
                  marginLeft: "-15px",
                  marginBottom: "5px",
                }}
              >
                Counsel Information
              </h5>
              <Row className="p-b-5">
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('counsel_first_name')}
                    placeholder="Enter first name"
                  ></Form.Control>
                </Col>
                <Col className="pl-4 pr-4" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('counsel_last_name')}
                    placeholder="Enter last name"
                  ></Form.Control>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    placeholder="Enter Phone"
                    {...register('counsel_phone')}
                  ></Form.Control>
                </Col>
              </Row>
              <Row className="p-b-5">
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('counsel_fax')}
                    placeholder="Enter Fax"
                  ></Form.Control>
                </Col>
                <Col className="pl-4 pr-4" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('counsel_email')}
                    placeholder="Enter Email"
                  ></Form.Control>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    {...register('counsel_extension')}
                    placeholder="Enter Extension"
                  ></Form.Control>
                </Col>
              </Row>
              <Row className="p-b-5">
                <Col className="p-0" md={6}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    placeholder="Enter Address 1"
                    {...register('counsel_address1')}
                  ></Form.Control>
                </Col>

                <Col className="pl-4 pr-0" md={6}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    placeholder="Enter Address 2"
                    {...register('counsel_address2')}
                  ></Form.Control>
                </Col>
              </Row>
              <Row className="p-b-5">
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    placeholder="Enter City"
                    {...register('counsel_city')}
                  ></Form.Control>
                </Col>
                <Col className="pl-4 pr-4" md={4}>
                  <Form.Select
                    className="dropdown-h-35px"
                    {...register("counsel_state")}
                  >
                    <option value="" disabled selected>
                      Select State
                    </option>
                    {statesAbrs?.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col className="p-0" md={4}>
                  <Form.Control
                    type="text"
                    onKeyUp={(event) => { }}
                    placeholder="Enter ZIP"
                    {...register("counsel_zip")}
                  ></Form.Control>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
              className="INS-float-margin;"
            >
              Cancel
            </Button>
            <Button variant="success" type="submit" form="addinsurance_form">
              {loading ? 'Saving..' : 'Save'}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default AddCounselModal;
