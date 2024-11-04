import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import { useDispatch } from "react-redux";
import {
  deleteAttorneyDirectory,
  updateAttorneyDirectory,
} from "../../Redux/attorny-table/attornySlice";

const AttorneyTablePopUp = ({ attorneyPopUp, handleClose, attorney }) => {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lawFirmData, setLawFirmData] = useState(null);
  const [form, setForm] = useState({
    law_firm: attorney?.firmdirectory?.id || "",
    first_name: attorney?.main_contact?.[0]?.first_name || "",
    last_name: attorney?.main_contact?.[0]?.last_name || "",
    address1: attorney?.main_contact?.[0]?.address1 || "",
    address2: attorney?.main_contact?.[0]?.address2 || "",
    city: attorney?.main_contact?.[0]?.city || "",
    state: attorney?.main_contact?.[0]?.state || "",
    zip: attorney?.main_contact?.[0]?.zip || "",
    phone: attorney?.main_contact?.[0]?.phone_number || "",
    phone_ext: attorney?.main_contact?.[0]?.phone_ext || "",
    fax: attorney?.main_contact?.[0]?.fax || "",
    email: attorney?.main_contact?.[0]?.email || "",
    website: attorney?.main_contact?.[0]?.website || "",
    password: "",
    confirm_password: "",
  });

  const getLawFirmHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/get/law/firm/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      const responseData = response.data;
      setLawFirmData(responseData.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    getStateDataHandler();
    getLawFirmHandler();
  }, []);

  useEffect(() => {
    setCourtName(attorney?.firmdirectory?.office_name || "");
    setForm({
      // law_firm: attorney.firmdirectory ? attorney.firmdirectory.id : "",
      first_name: attorney.main_contact[0].first_name,
      last_name: attorney.main_contact[0].last_name,
      title: attorney.main_contact[0].title,
      middle_name: attorney.main_contact[0].middle_name,
      suffix: attorney.main_contact[0].suffix,
      address1: attorney.main_contact[0].address1,
      address2: attorney.main_contact[0].address2,
      city: attorney.main_contact[0].city,
      state: attorney.main_contact[0].state,
      zip: attorney.main_contact[0].zip,
      phone: attorney.main_contact[0].phone_number,
      phone_ext: attorney.main_contact[0].phone_ext,
      fax: attorney.main_contact[0].fax,
      email: attorney.main_contact[0].email,
      website: attorney.main_contact[0].website,
      password: "",
      confirm_password: "",
    });
  }, [attorney]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateAttorney = async () => {
    const updatedAttorney = {
      ...attorney,
      id: attorney.id,
      lawfirm_id: form.law_firm,
      first_name: form.first_name,
      last_name: form.last_name,
      title: form.title,
      suffix: form.suffix,
      middle_name: form.middle_name,
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
      office_name: form.law_firm,
    };

    try {
      const response = await axios.patch(
        `${origin}/api/attorney/law/firm/${clientId}/${currentCaseId}/`,
        updatedAttorney,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      dispatch(
        updateAttorneyDirectory({
          id: attorney.id,
          updatedData: response.data.data,
        })
      );
      handleClose();
    } catch (error) {
      console.error("Error updating attorney:", error.message);
      if (error.response) {
        console.error("Error Response:", error.response.data);
      }
    }
  };

  const handleDeleteButton = async () => {
    try {
      console.log("Deleting Attorney with ID:", attorney.id);

      const response = await axios.delete(
        `${origin}/api/attorney/law/firm/${clientId}/${currentCaseId}/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
          data: {
            id: attorney.id,
          },
        }
      );
      dispatch(deleteAttorneyDirectory(attorney.id));
      handleClose();
    } catch (error) {
      console.error("Error deleting attorney:", error.message);
      if (error.response) {
        console.error("Error Response:", error.response.data);
      }
    }
  };

  const [courtName, setCourtName] = useState("");
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectCourt = (court) => {
    setCourtName(court.office_name); // Display court name in the input
    setForm((prevForm) => ({
      ...prevForm,
      law_firm: court.id, // Store court id for form submission
    }));
    
    
    setForm((prev) => ({
      ...prev,
      department_id: "",
    }));
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setCourtName(value);
  
    if (value !== "" && value.length >= 3) {
      const filtered = lawFirmData.filter((court) => {
        const court_name = court?.office_name?.toLowerCase()?.startsWith(value.toLowerCase()) || false;
        const address1 = court?.contact?.address1?.toLowerCase()?.startsWith(value.toLowerCase()) || false;
        const address2 = court?.contact?.address2?.toLowerCase()?.startsWith(value.toLowerCase()) || false;
        const city = court?.contact?.city?.toLowerCase()?.startsWith(value.toLowerCase()) || false;
        const state = court?.contact?.state?.toLowerCase()?.startsWith(value.toLowerCase()) || false;
        return court_name || address1 || address2 || city || state;
      });
      setFilteredCourts(filtered.slice(0, 10));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };
  


  return (
    <Modal
      show={attorneyPopUp ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-1000p custom-insurance-dialog"
    >
      <div className="modal-content">
        <div className="modal-body">
          <div
            className="modal-header"
            style={{
              marginBottom: "15px",
              padding: 0,
            }}
          >
            <h5 className="modal-title mb-2 mx-auto" id="">
              Attorney
            </h5>
          </div>

          <div className="row align-items-center form-group mt-5">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Law Firm</span>
            </div>

            <div className="col-md-10">
            <>
                  <input
                    type="text"
                    className="form-control"
                    value={courtName} // Display court name
                    onChange={handleInputChange}
                    onFocus={() => courtName && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Timeout to allow click event to register before hiding
                    placeholder="Type Lawfirm..."
                  />

                  {showDropdown && filteredCourts.length > 0 && (
                    <div
                      className="dropdown "
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "15px",
                        right: 0,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        zIndex: 1000,
                        width: "95.5%",
                        // maxHeight: '150px',
                        // overflowY: "auto",
                      }}
                    >
                      {filteredCourts.slice(0, 5).map((court) => (
                        <div
                          key={court.id}
                          className="form-control mb-1"
                          style={{
                            padding: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSelectCourt(court)}
                        >
                          {court?.office_name} {court.contact.address1}{" "}
                          {court.contact.address2}{" "}
                          {court.contact.city} {court.contact.state}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              {/* <select
                name="law_firm"
                className="form-control"
                value={form.law_firm}
                onChange={handleChange}
              >
                {lawFirmData ? (
                  lawFirmData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.office_name}
                    </option>
                  ))
                ) : (
                  <option key="" value="">
                    No Data Available
                  </option>
                )}
              </select> */}
            </div>
          </div>

          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">
                <nobr>Title</nobr>
              </span>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                placeholder="Enter Title"
                value={form.title}
                className="form-control"
                name="title"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">
                <nobr>First Name</nobr>
              </span>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                placeholder="Enter First Name"
                value={form.first_name}
                className="form-control"
                name="first_name"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">
                <nobr>Middle Name</nobr>
              </span>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                placeholder="Enter Middle Name"
                value={form.middle_name}
                className="form-control"
                name="middle_name"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">
                <nobr>Last Name</nobr>
              </span>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                placeholder="Enter Last Name"
                value={form.last_name}
                className="form-control"
                name="last_name"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">
                <nobr>Suffix</nobr>
              </span>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                placeholder="Enter Suffix"
                value={form.suffix}
                className="form-control"
                name="suffix"
                onChange={handleChange}
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

          <div class="row align-items-center form-group">
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
              className="btn btn-danger"
              onClick={handleDeleteButton}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={updateAttorney}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AttorneyTablePopUp;
