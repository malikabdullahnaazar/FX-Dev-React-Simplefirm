import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addCourt } from "../../Redux/courts-table/courtsSlice";
import { Modal, Tab, Nav } from "react-bootstrap";
import { useForm } from "react-hook-form";

const initialState = {
  court_name: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
  extension: "",
  fax: "",
  email: "",
  website: "",
  jurisdictiontype: "",
  jurisdiction: {
    federal: "",
    state: "",
    county: "",
    circuit: "",
    district: "",
  },
};

function CourtDirectoryModal({ courtPopUp, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  // const clientId = useSelector((state) => state?.client?.current.id);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [stateData, setStateData] = useState([]);
  const [jurisdictionData, setJurisdictionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialState);
  const [activeTab, setActiveTab] = useState("court");

  const [searchTerm, setSearchTerm] = useState([]);
  const [filteredJurisdictions, setFilteredJurisdictions] = useState([]);

  const getStateDataHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/states/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setStateData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  // jurisdiction data getter
  const getJurisdictionDataHandler = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/get/jurisdiction/directory/`
      );
      setJurisdictionData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  //filter through this data in seach tab inside the popups
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter jurisdictions based on the search term
    const filtered = jurisdictionData.filter((item) => {
      const federal = item.federal?.toString().toLowerCase();
      const stateName = item.state?.name?.toLowerCase();
      const stateAbr = item.state?.StateAbr?.toLowerCase();
      const countyName = item.county?.name?.toLowerCase();
      const circuitName = item.circuit?.circuit_name?.toLowerCase();
      const districtName = item.district?.name?.toLowerCase();

      return (
        federal?.includes(value) ||
        stateName?.includes(value) ||
        stateAbr?.includes(value) ||
        countyName?.includes(value) ||
        circuitName?.includes(value) ||
        districtName?.includes(value)
      );
    });

    setFilteredJurisdictions(filtered);
  };

  const handleSelectJurisdiction = (jurisdiction) => {
    setForm((prevForm) => ({
      ...prevForm,
      jurisdiction: {
        federal: jurisdiction.federal,
        state: jurisdiction.state,
        county: jurisdiction.county,
        circuit: jurisdiction.circuit,
        district: jurisdiction.district,
      },
    }));

    setSearchTerm(""); // Clear search after selection
    setFilteredJurisdictions([]); // Hide filtered list after selection
  };

  useEffect(() => {
    getStateDataHandler();
    getJurisdictionDataHandler();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCourseSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/add/court/directory/${clientId}/${currentCaseId}/`,
        ...form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data.data;
        dispatch(addCourt(responseData));
        handleClose();
        setForm(initialState);
      }
    } catch (err) {
      console.log(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={courtPopUp}
      onHide={handleClose}
      className="directory-model"
      size="lg"
      centered
      style={{
        backgroundColor: "rgba(40, 80, 122, 0.5)",
        zIndex: 100000,
        display: courtPopUp ? "flex" : "none",
        width: "100%",
      }}
    >
      <Modal.Body>
        <Tab.Container
          activeKey={activeTab}
          onSelect={(key) => {
            console.log("activeTab: ", activeTab);
            setActiveTab(key);
          }}
        >
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="court">Court</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="jurisdiction">Jurisdiction</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="court">
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Court Name</nobr>
                  </span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Court Name"
                    value={form.court_name}
                    className="form-control"
                    name="court_name"
                    onChange={handleChange}
                  />
                  <input
                    type="hidden"
                    placeholder="Enter Company Name"
                    value={form.block_name}
                    className="form-control"
                    name="block_name"
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Address 1</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Address 1"
                    value={form.address1}
                    className="form-control"
                    name="address1"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Address 2</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Address 2"
                    value={form.address2}
                    className="form-control"
                    name="address2"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey dispay-none-LFD "></span>
                </div>

                <div className="col-md-10 row">
                  <div className="col-md-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={form.city}
                      className="form-control"
                      name="city"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4 PRL15-B1">
                    <select
                      name="state"
                      className="form-select form-control"
                      value={form.state}
                      onChange={handleChange}
                    >
                      <option value="">Select State</option>
                      {stateData.map((item) => (
                        <option key={item.id} value={item.StateAbr}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 PRL30px">
                    <input
                      type="text"
                      placeholder="Zip"
                      value={form.zip}
                      className="form-control"
                      name="zip"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Phone</span>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Phone"
                    value={form.phone}
                    className="form-control"
                    name="phone"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 text-left">
                  <span className="d-inline-block text-grey">Ext.</span>
                </div>
                <div className="col-md-4 pl-0">
                  <input
                    type="number"
                    placeholder="Extension"
                    value={form.extension}
                    className="form-control"
                    name="extension"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Fax</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter fax"
                    value={form.fax}
                    className="form-control"
                    name="fax"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div class="row align-items-center form-group">
                <div class="col-md-2 text-left">
                  <span class="d-inline-block text-grey">Email</span>
                </div>
                <div class="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Email"
                    value={form.email}
                    className="form-control"
                    name="email"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div class="row align-items-center form-group pb-4">
                <div class="col-md-2 text-left">
                  <span class="d-inline-block text-grey">Website</span>
                </div>
                <div class="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Website"
                    value={form.website}
                    className="form-control"
                    name="website"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="jurisdiction">
              {/* Use the same handle change function just need to modify the form */}
              {/* Search Filter to get the juristiction/forward objects themselves from the backend. the below fields are not adjustable */}
              <input
                type="text"
                style={{
                  flex: 1,
                }}
                className="form-control p-2"
                placeholder="Search for Jurisdiction"
                onChange={handleSearchChange}
              />
              {filteredJurisdictions.length > 0 && (
                <ul className="list-group mt-2">
                  {filteredJurisdictions.map((jurisdiction) => {
                    // Construct a display name using available fields
                    const displayName = [
                      (jurisdiction.federal &&
                        `Federal: ${jurisdiction.federal}`) ||
                        "",
                      jurisdiction.state
                        ? `State: ${jurisdiction.state.StateAbr}, ${jurisdiction.state.name}`
                        : "",
                      jurisdiction.county
                        ? `County: ${jurisdiction.county.name}`
                        : "",
                      jurisdiction.circuit
                        ? `Circuit: ${jurisdiction.circuit.circuit_name}`
                        : "",
                      jurisdiction.district
                        ? `District: ${jurisdiction.district.name}`
                        : "",
                    ]
                      .filter(Boolean) // Remove empty strings
                      .join(" - "); // Join the values with a separator

                    return (
                      <li
                        key={jurisdiction.id}
                        className="list-group-item"
                        onClick={() => handleSelectJurisdiction(jurisdiction)}
                        style={{ cursor: "pointer" }}
                      >
                        {displayName || "Unnamed Jurisdiction"}{" "}
                        {/* Fallback for empty cases */}
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="row align-items-center form-group p-2">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    Jurisdiction Type
                  </span>
                </div>
                <div className="col-md-10 row">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="jurisdictiontype"
                      id="federal"
                      value="Federal"
                      style={{ accentColor: "grey" }}
                      checked={form.jurisdictiontype === "Federal"}
                      onChange={() =>
                        setForm((prevForm) => ({
                          ...prevForm,
                          jurisdictiontype: "Federal", // Set the value to Federal
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor="federal">
                      Federal
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="jurisdictiontype"
                      id="state"
                      value="State"
                      style={{ accentColor: "grey" }}
                      checked={form.jurisdictiontype === "State"}
                      onChange={() =>
                        setForm((prevForm) => ({
                          ...prevForm,
                          jurisdictiontype: "State", // Set the value to State
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor="state">
                      State
                    </label>
                  </div>
                </div>
              </div>
              <div className="row align-items-center form-group ">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Federal</span>
                </div>
                <div className="col-md-10">
                  <span className="custom-input-like d-inline-block w-100">
                    {form.jurisdiction.federal}
                  </span>
                </div>
              </div>
              <div className="row align-items-center form-group ">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">State</span>
                </div>
                <div className="col-md-10">
                  {form.jurisdiction.state && (
                    <span className="custom-input-like d-inline-block w-100">
                      {form.jurisdiction.state?.StateAbr},{" "}
                      {form.jurisdiction.state?.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="row align-items-center form-group ">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">County</span>
                </div>
                <div className="col-md-10">
                  <span className="custom-input-like d-inline-block w-100">
                    {form.jurisdiction.county?.name}
                  </span>
                </div>
              </div>
              <div className="row align-items-center form-group ">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Circuit</span>
                </div>
                <div className="col-md-10">
                  <span className="custom-input-like d-inline-block w-100">
                    {form.jurisdiction.circuit?.circuit_name}
                  </span>
                </div>
              </div>
              <div className="row align-items-center form-group pb-4">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">District</span>
                </div>
                <div className="col-md-10">
                  <span className="custom-input-like d-inline-block w-100">
                    {form.jurisdiction.district?.name}
                  </span>
                </div>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          class="btn btn-secondary float-left-margin-right-auto"
          onClick={() => {
            handleClose();
            setForm(initialState);
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCourseSubmit}
          class="btn btn-success"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default CourtDirectoryModal;
