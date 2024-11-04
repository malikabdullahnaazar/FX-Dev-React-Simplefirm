import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Tab, Nav } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import { deleteCourt, updateCourt } from "../../Redux/courts-table/courtsSlice";

function CourtsTablePopUp({ courtPopUp, handleClose, courtData }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const dispatch = useDispatch();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
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
  });

  const [jurisdictionData, setJurisdictionData] = useState([]);
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

  const handleModalClose = () => {
    setActiveTab("court");
    handleClose();
  };

  // Filter jurisdictions based on the search term
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

  useEffect(() => {
    if (courtData) {
      setForm({
        court_name: courtData?.court_name || "",
        address1: courtData?.court_contact?.address1 || "",
        address2: courtData?.court_contact?.address2 || "",
        city: courtData?.court_contact?.city || "",
        state: courtData?.court_contact?.state || "",
        zip: courtData?.court_contact?.zip || "",
        phone: courtData?.court_contact?.phone_number || "",
        extension: courtData?.court_contact?.phone_ext || "",
        fax: courtData?.court_contact?.fax || "",
        email: courtData?.court_contact?.email || "",
        website: courtData?.court_contact?.website || "",
        jurisdictiontype: courtData?.jurisdictiontype || "",
        jurisdiction: courtData?.jurisdiction || "",
      });
    }
  }, [courtData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    const updatedCourt = {
      ...courtData,
      id: courtData.id,
      court_name: form.court_name,
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      zip: form.zip,
      phone_number: form.phone,
      phone_ext: form.extension,
      fax: form.fax,
      email: form.email,
      website: form.website,
      jurisdictiontype: form.jurisdictiontype,
      jurisdiction: form.jurisdiction,
    };
    try {
      const response = await axios.patch(
        `${origin}/api/add/court/directory/${clientId}/${currentCaseId}/`,
        updatedCourt
      );
      dispatch(
        updateCourt({
          id: courtData.id,
          updatedData: response.data.data,
        })
      );
      setActiveTab("court");
      handleClose();
    } catch (error) {
      console.error("Error updating insurance company:", error.message);
      console.error("Error Response:", error.response); // Add this line to get more details about the error
    }
  };

  const handleDeleteButton = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/add/court/directory/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: courtData.id,
          },
        }
      );
      dispatch(deleteCourt(courtData.id));
      setActiveTab("court");
      handleClose();
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  return (
    <Modal
      show={courtPopUp}
      onHide={handleModalClose}
      size="lg"
      centered
      dialogClassName="max-1000p custom-insurance-dialog"
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
                      value={form.state === "nan" ? "" : form.state}
                      onChange={handleChange}
                    >
                      {form.state?.length ? null : (
                        <option value="">select state</option>
                      )}
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
                      checked={form.jurisdictiontype === 1}
                      onChange={() =>
                        setForm((prevForm) => ({
                          ...prevForm,
                          jurisdictiontype: 1, // Set the value to State
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
                      checked={form.jurisdictiontype === 2}
                      onChange={() =>
                        setForm((prevForm) => ({
                          ...prevForm,
                          jurisdictiontype: 2, // Set the value to State
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor="state">
                      State
                    </label>
                  </div>
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Federal</span>
                </div>
                <div className="col-md-10">
                  <span className="custom-input-like d-inline-block w-100">
                    {form.jurisdiction.federal}
                  </span>
                </div>
              </div>
              <div className="row align-items-center form-group">
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
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">County</span>
                </div>
                <div className="col-md-10">
                  <span className="custom-input-like d-inline-block w-100">
                    {form.jurisdiction.county?.name}
                  </span>
                </div>
              </div>
              <div className="row align-items-center form-group">
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
          className="btn btn-secondary h-35px"
          data-dismiss="modal"
          onClick={handleModalClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDeleteButton}
        >
          Delete
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSaveClick}
        >
          {loading ? "Submitting..." : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default CourtsTablePopUp;
