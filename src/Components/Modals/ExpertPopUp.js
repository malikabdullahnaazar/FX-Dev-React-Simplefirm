import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addExpertData } from "../../Redux/experts-table/expertsSlice";
const initialState = {
  title: "",
  first_name: "",
  last_name: "",
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
function ExpertPopUp({ expertPopup, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  // const clientId = useSelector((state) => state?.client?.current.id);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setfilteredResults] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialState);

  const getStateDataHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/states/`);
      setStateData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStateDataHandler();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleExpertSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/add/directory/expert/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      const responseData = response.data.data;
      dispatch(addExpertData(responseData));
      setForm(initialState);
      handleClose();
    } catch (err) {
      console.log(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getExpertDataHandler = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/add/directory/expert/${clientId}/${currentCaseId}/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      setSearchResults(response?.data?.data);
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getExpertDataHandler();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue !== "") {
      const filtered = searchResults?.filter((result) => {
        const title = result?.title ? result.title.toLowerCase() : "";
        const address1 = result?.contactID?.address1
          ? result.contactID.address1.toLowerCase()
          : "";
        const address2 = result?.contactID?.address2
          ? result.contactID.address2.toLowerCase()
          : "";
        const city = result?.contactID?.city
          ? result.contactID.city.toLowerCase()
          : "";
        const state = result?.contactID?.state
          ? result.contactID.state.toLowerCase()
          : "";

        return (
          title.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setfilteredResults(filtered);
      setIsFiltersOpen(true);
    } else {
      setfilteredResults("");
    }
  };

  const handleExpertDirectory = (company) => {
    setForm({
      title: "",
      first_name: "",
      last_name: "",
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
    setForm((prevForm) => ({
      ...prevForm,
      title: company?.title ?? "",
      first_name: company?.first_name ?? "",
      last_name: company?.last_name ?? "",
      address1: company?.contactID?.address ?? "",
      address2: company?.contactID?.address1 ?? "",
      city: company?.contactID?.city ?? "",
      state: company?.contactID?.state ?? "",
      zip: company?.contactID?.zip_code ?? "",
      email: company?.contactID?.email ?? "",
      phone: company?.contactID?.phone ?? "",
      extension: company?.contactID?.phone_ext ?? "",
      fax: company?.contactID?.fax ?? "",
      website: company?.contactID?.website ?? "",
    }));

    setIsFiltersOpen(false);
  };

  return (
    <div
      className={`modal generic-popup generic-popup-scroll fade bd-example-modal-md ${expertPopup ? "show" : ""}`}
      style={{
        backgroundColor: "rgba(40, 80, 122, 0.5)",
        zIndex: 100000,
        display: expertPopup ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="modal-dialog modal-lg Law-firm-direct-max-width-800px directory-model"
        style={{
          width: "600px",
          height: "450px",
          maxWidth: "100%",
          margin: "0",
        }}
      >
        <div className="modal-content">
          <div className="modal-body">
            <div className="text-center">
              <h5 className="modal-title mb-2 mx-auto" id="">
                Expert
              </h5>
            </div>

            <div className="row">
              <div className="col-md-12">
                <input
                  type="text"
                  placeholder="Type insurance company name to search directory then click an entry"
                  className="form-control mb-3"
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
                              handleExpertDirectory(result);
                              setIsFiltersOpen(false);
                            }}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              borderBottom: "1px solid #ddd",
                            }}
                          >
                            {result.title && `${result.title}, `}
                            {result.contactID.address1 &&
                              `${result.contactID.address1}, `}
                            {result.contactID.address2 &&
                              `${result.contactID.address2}, `}
                            {result.contactID.city &&
                              `${result.contactID.city}, `}
                            {result.contactID.state &&
                              `${result.contactID.state}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">First Name</span>
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
                <span className="d-inline-block text-grey">Last Name</span>
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

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Email</span>
              </div>
              <div className="col-md-10">
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

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Website</span>
              </div>
              <div className="col-md-10">
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

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary float-left-margin-right-auto"
                onClick={() => {
                  handleClose();
                  setForm(initialState);
                }}
                
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExpertSubmit}
                className="btn btn-success"
                style={{ backgroundColor: "green" }}
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

export default ExpertPopUp;
