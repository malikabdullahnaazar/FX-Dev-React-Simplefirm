import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addAttorneyDirectory } from "../../Redux/attorny-table/attornySlice";
const initialState = {
  law_firm: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  title: "",
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
};
function AttorneyModal({ attorneyPopUp, handleClose }) {
  const tokenBearer = localStorage.getItem("token");

  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [lawFirmData, setLawFirmData] = useState(null);
  const [form, setForm] = useState(initialState);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setfilteredResults] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");


  const getLawFirmHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/get/law/firm/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      const responseData = response.data;
      setLawFirmData(responseData.data);
      setSearchResults(response.data.data);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };



  
  const handleAttorneySubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/attorney/law/firm/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      // console.log(response.status_code, response.status);
      if (response.status === 200) {
        const responseData = response.data.data;
        dispatch(addAttorneyDirectory(responseData));
        handleClose();
        setForm(initialState);
        setCourtName("");
        setSearchInput("")
      }
    } catch (err) {
      console.log(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const [courtName, setCourtName] = useState("");
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectCourt = (court) => {
    setCourtName(court.office_name); // Display court name in the input
    setForm((prevForm) => ({
      ...prevForm,
      law_firm: court.office_name, // Store court id for form submission
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

  

  const handleUpperInputChange = (e) => {
    
    const inputValue = e.target.value.toLowerCase();
    setSearchInput(e.target.value);
    if (inputValue !== "" && inputValue.length >= 3) {
      const filtered = searchResults?.filter((result) => {
        const court_name = result?.office_name?.toLowerCase() ?? "";
        const address1 = result?.contact?.address1?.toLowerCase() ?? "";
        const address2 = result?.contact?.address2?.toLowerCase() ?? "";
        const city = result?.contact?.city?.toLowerCase() ?? "";
        const state = result?.contact?.state?.toLowerCase() ?? "";

        return (
          court_name.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setfilteredResults(filtered.slice(0, 10));
      setIsFiltersOpen(true);
    } else {
      setfilteredResults("");
    }
  };

  const handleSelectAgency = (company) => {
    setForm({
      courtName: "",
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
    });
    // const fullCourtName = `${company?.court_name} - ${company?.court_contact?.address1}, ${company?.court_contact?.city}, ${company?.court_contact?.state}`;
    setCourtName(company?.office_name);

    setForm((prevForm) => ({
      ...prevForm,
      law_firm: company?.office_name || "",
      address1: company?.contact?.address1 || "",
      address2: company?.contact?.address2 || "",
      city: company?.contact?.city || "",
      state: company?.contact?.state || "",
      zip: company?.contact?.zip || "",
      email: company?.contact?.email || "",
      phone: company?.contact?.phone_number || "",
      extension: company?.contact?.phone_ext || "",
      fax: company?.contact?.fax || "",
      website: company?.contact?.website || "",
    }));

    // setSelectedReportTypeID(Number(reportingAgency.report_type));
    setIsFiltersOpen(false);
  };

  const handleCloseForm = () => {
    setForm(initialState)
    setCourtName("")
    setSearchInput("")
    handleClose()
  };


  return (
    <div
      className={`modal generic-popup generic-popup-scroll fade bd-example-modal-md ${attorneyPopUp ? "show" : ""}`}
      style={{
        backgroundColor: "rgba(40, 80, 122, 0.5)",
        zIndex: 100000,
        display: attorneyPopUp ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="modal-dialog modal-lg Law-firm-direct-max-width-800px directory-model"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="modal-content">
          <div className="modal-body">
            <div className="text-center">
              <h5 className="modal-title mb-2 mx-auto" id="">
                Add Attorney
              </h5>
            </div>

          <div className="row">
            <div class="col-md-12 ">
                <input
                  type="text"
                  value={searchInput}
                  placeholder="Type Lawfirm to search directory then click an entry"
                  className="form-control mb-2"
                  onChange={handleUpperInputChange}
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
                          // overflowY: "auto",
                        }}
                      >
                        {filteredResults.map((result, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              handleSelectAgency(result);
                              setIsFiltersOpen(false);
                            }}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {result.office_name && `${result.office_name}, `}
                            {result.contact.address1 &&
                              `${result.contact.address1}, `}
                            {result.contact.address2 &&
                              `${result.contact.address2}, `}
                            {result.contact.city &&
                              `${result.contact.city}, `}
                            {result.contact.state &&
                              `${result.contact.state}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <div className="row align-items-center form-group">
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
                      <option key={item.id} value={item.value}>
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
                <span className="d-inline-block text-grey dispay-none-LFD ">
                  CityStateZip
                </span>
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

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary float-left-margin-right-auto"
                onClick={handleCloseForm}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAttorneySubmit}
                class="btn btn-success"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttorneyModal;
