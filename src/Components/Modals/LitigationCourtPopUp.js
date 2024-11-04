import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";


function LitigationCourtPopUp({
  showPopup,
  handleClose,
  handleSave,
  handleDelete,
  litigation_id,
  contact_id,
  current_name,
  current_title1,
  current_title2,
  current_address1,
  current_address2,
  current_city,
  current_state,
  current_zip,
  current_phone,
  current_fax,
  current_email,
  states = [],
  searchData = []
}) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const methods = useForm();
  const { handleSubmit, register, setValue, watch, formState: { errors } } = methods;
  const [loading, setLoading] = useState(false);
  const { setLitigationDashboardDataUpdated } = useContext(ClientDataContext);

  const [searchInput, setSearchInput] = useState(''); // Input for search filtering
  const [filteredData, setFilteredData] = useState([]); // Filtered search results

  useEffect(() => {
    // Set initial values for the form fields
    setValue('name', current_name);
    setValue('title1', current_title1);
    setValue('title2', current_title2);
    setValue('address1', current_address1);
    setValue('address2', current_address2);
    setValue('city', current_city);
    setValue('state', current_state);
    setValue('zip', current_zip);
    setValue('phone', current_phone);
    setValue('fax', current_fax);
    setValue('email', current_email);
  }, [current_name, current_title1, current_title2, current_address1, current_address2, current_city, current_state, current_zip, current_phone, current_fax, current_email])

  // Function to handle input change for search
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchInput(query);

    // Filter searchData based on input value
    const filtered = searchData.length > 0 && searchData.filter(item => {
      const { expert_firstname, expert_lastname, city, state, zip, category } = item;
      return (
        expert_firstname?.toLowerCase().includes(query) ||
        expert_lastname?.toLowerCase().includes(query) ||
        city?.toLowerCase().includes(query) ||
        state?.toLowerCase().includes(query) ||
        zip?.includes(query) ||
        (category && category.some(cat => cat.toLowerCase().includes(query)))
      );
    });

    setFilteredData(filtered);
  };

  // Function to handle auto-fill when selecting from search results
  const handleSelectEntry = (entry) => {
    methods.setValue('name', entry.name);
    methods.setValue('name', entry.title1);
    methods.setValue('name', entry.title2);
    methods.setValue('address1', entry.address1);
    methods.setValue('address2', entry.address2);
    methods.setValue('city', entry.city);
    methods.setValue('state', entry.state);
    methods.setValue('zip', entry.zip);
    methods.setValue('phone', entry.phone);
    methods.setValue('fax', entry.fax);
    methods.setValue('email', entry.email);
    setSearchInput(''); // Clear search input
    setFilteredData([]); // Hide results after selection
  };

  const onSubmit = async (data) => {
    const url = `${origin}/api/litigation-page/litigations-update/${litigation_id}/`;
    setLoading(true);

    const normalizeInput = (value) => value === "" ? null : value;

    const name = normalizeInput(watch("name"));
    const title1 = normalizeInput(watch("title1"));
    const title2 = normalizeInput(watch("title2"));
    const address1 = normalizeInput(watch("address1"));
    const address2 = normalizeInput(watch("address2"));
    const city = normalizeInput(watch("city"));
    const state = normalizeInput(watch("state"));
    const zip = normalizeInput(watch("zip"));
    const phone = watch("phone");
    const fax = watch("fax");
    const email = watch("email");

    const requestBody = {
      court_contact: {
        id: contact_id,
        address1: address1,
        address2: address2,
        city: city,
        state: state,
        zip: zip,
        phone_number: phone,
        email: email,
        fax: fax,
      },
      court_name: name,
      court_title1: title1,
      court_title2: title2,
    }

    try {
      const response = await axios.patch(url, requestBody, {
        headers: {
          Authorization: token,
        },
      });
      setLoading(false);
      setLitigationDashboardDataUpdated(true);
      handleClose()
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handlePhoneInput = (e, name) => {
    let phoneNumber = e.target.value.replace(/\D/g, ''); // Remove non-digit characters

    // Enforce max 10 digits
    if (phoneNumber.length > 10) phoneNumber = phoneNumber.slice(0, 10);

    // Apply formatting for (123) 456-7890
    if (phoneNumber.length > 6) {
      phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    } else if (phoneNumber.length > 3) {
      phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length > 0) {
      phoneNumber = `(${phoneNumber}`;
    }

    setValue(name, phoneNumber); // Update the field with the formatted value
  };

  return (
    <Modal
      show={showPopup ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-2 modal-dialog-centered"
      centered
    >
      <FormProvider {...methods}>
        <div className="modal-content">
          <div className="modal-header text-center">
            <h5 className="modal-title mx-auto">Court Contact</h5>
          </div>
          <div className="modal-body">
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-12">
                    <Form.Control
                      id="myInput"
                      type="text"
                      placeholder="Type court name, address, county or zip to search directory"
                      className="form-control mb-1"
                      value={searchInput}
                      onChange={handleSearchChange}
                    >
                    </Form.Control>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Display filtered results */}
            {filteredData.length > 0 && (
              <ul className="search-results-litigation">
                {filteredData.map((entry, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSelectEntry(entry)}
                    style={{ scrollbarWidth: "5px" }}
                  >
                    {entry.name && entry.name + ", "}{entry.title1 && entry.title1 + ", "}{entry.title2 && entry.title2 + ", "}{entry.address1 && entry.address1 + ", "}{entry.address2 && entry.address2 + ", "}{entry.city && entry.city + ", "}{entry.state && entry.state + ", "}{entry.zip && entry.zip + ", "}{entry.phone && entry.phone + ", "}{entry.fax && entry.fax + ", "}{entry.email}
                  </li>
                ))}
              </ul>
            )}

            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">

                  <div className="col-md-2 text-left">
                    <p className="text-secondary">Court Name :</p>
                  </div>
                  <div className="col-md-10">
                    <Form.Control
                      type="text"
                      placeholder="Enter Court Name"
                      {...register("name")}
                      defaultValue={current_name}
                      onChange={(e) => setValue('name', e.target.value)}
                    >
                    </Form.Control>
                  </div>

                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-2 text-left">
                    <p className="text-secondary">Court Title 1 :</p>
                  </div>
                  <div className="col-md-10">
                    <Form.Control
                      type="text"
                      name="court_title1"
                      placeholder="Enter Court Title 1"
                      {...register("title1")}
                      defaultValue={current_title1}
                      onChange={(e) => setValue('title1', e.target.value)}
                    >
                    </Form.Control>
                  </div>

                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-2 text-left">
                    <p className="text-secondary">Court Title 2 :</p>
                  </div>
                  <div className="col-md-10">
                    <Form.Control
                      type="text"
                      placeholder="Enter Court Title 2"
                      {...register("title2")}
                      defaultValue={current_title2}
                      onChange={(e) => setValue('title2', e.target.value)}
                    >
                    </Form.Control>
                  </div>

                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-2 text-left">
                    <p className="text-secondary">Address 1 :</p>
                  </div>
                  <div className="col-md-4">
                    <Form.Control
                      type="text"
                      placeholder="Enter Address 1"

                      {...register("address1")}
                      defaultValue={current_address1}
                      onChange={(e) => setValue('address1', e.target.value)}
                    >
                    </Form.Control>
                  </div>
                  <div className="col-md-2 text-left">
                    <p className="text-secondary">Address 2 :</p>
                  </div>
                  <div className="col-md-4">
                    <Form.Control
                      type="text"
                      placeholder="Enter Address 2"
                      {...register("address2")}
                      defaultValue={current_address2}
                      onChange={(e) => setValue('address2', e.target.value)}
                    >
                    </Form.Control>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-1 text-left">
                    <span className="text-secondary">
                      City:
                    </span>
                  </div>
                  <div className="col-md-3">
                    <Form.Control
                      type="text"
                      {...register("city")}
                      defaultValue={current_city}
                      onChange={(e) => setValue('city', e.target.value)}
                      placeholder='City'
                    >

                    </Form.Control>
                  </div>
                  <div className="col-md-1 text-left">
                    <span className="text-secondary">
                      State:
                    </span>
                  </div>
                  <div className="col-md-3">
                    <Form.Select
                      {...register('state')}
                      defaultValue={current_state}
                      onChange={(e) => setValue('state', e.target.value)}
                      className={`form-control ${errors.state && 'is-invalid'}`}
                    >   <option key="" value="">-------</option>
                      {states?.map(state => (
                        <option key={state.id} value={state.StateAbr}>
                          {state.name}
                        </option>
                      ))}

                    </Form.Select>
                  </div>
                  <div className="col-md-1 text-left">
                    <span className="text-secondary">
                      Zip:
                    </span>
                  </div>
                  <div className="col-md-3">
                    <Form.Control
                      type="text"
                      {...register("zip")}
                      defaultValue={current_zip}
                      onChange={(e) => setValue('zip', e.target.value)}
                      placeholder='Zip#'
                    >

                    </Form.Control>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div className="row align-items-center form-group">
                  <div className="col-md-1 text-left">
                    <p className="text-secondary">Phone:</p>
                  </div>
                  <div className="col-md-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter Phone"
                      {...register("phone")}
                      defaultValue={current_phone}
                      onChange={(e) => handlePhoneInput(e, 'phone')}
                      maxLength={14} // Allows for the formatted string with symbols
                      pattern="\(\d{3}\) \d{3}-\d{4}" // Regex pattern for (123) 456-7890 format
                    >
                    </Form.Control>
                  </div>


                  <div className="col-md-1 text-left">
                    <p className="text-secondary">Fax :</p>
                  </div>
                  <div className="col-md-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter fax"

                      {...register("fax")}
                      defaultValue={current_fax}
                      onChange={(e) => setValue('fax', e.target.value)}
                    >
                    </Form.Control>
                  </div>


                  <div className="col-md-1 text-left">
                    <p className="text-secondary">Email:</p>
                  </div>
                  <div className="col-md-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter email"
                      {...register("email")}
                      defaultValue={current_email}
                      onChange={(e) => setValue('email', e.target.value)}
                    >
                    </Form.Control>
                  </div>

                </div>
              </Col>
            </Row>
          </div>
          <div class="modal-footer border-0 justify-content-between pt-0">
            <button type="button" class="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="button" class="btn btn-success" onClick={onSubmit}>
              {loading ? 'Saving..' : 'Save'}
            </button>
          </div>
        </div>
      </FormProvider>
    </Modal>

  );
}

export default LitigationCourtPopUp;