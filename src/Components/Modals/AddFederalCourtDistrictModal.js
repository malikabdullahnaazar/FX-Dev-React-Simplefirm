import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addDistrict } from "../../Redux/district-table/districtSlice";

const initialState = {
  name: "",
  state: "",
  counties: [],
};

function AddFederalCourtDistrictModal({
  addFederalCourtDistrict,
  handleClose,
}) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);
  const [statesData, setStatesData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [countiesData, setCountiesData] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [filteredCounties, setFilteredCounties] = useState([]);

  const getStateDataHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/states/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setStatesData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getCountiesDataHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/counties/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setCountiesData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStateDataHandler();
    getCountiesDataHandler();
  }, []);

  const handleStateChange = (e) => {
    const stateAbr = e.target.value;
    setSelectedCounties([]);

    const state = statesData.find((state) => state.StateAbr === stateAbr);
    setSelectedState(state);

    if (state) {
      setForm((prevForm) => ({
        ...prevForm,
        state: state, // Store state_id instead of abbreviation
      }));

      // Filter counties by the selected state's abbreviation
      const filterCounties = countiesData.filter(
        (county) => county?.in_state?.StateAbr === stateAbr
      );
      setFilteredCounties(filterCounties);
    } else {
      setCounties([]); // Clear counties if no state is selected
    }
  };

  const handleCountyChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCounties((prev) =>
      checked ? [...prev, value] : prev.filter((county) => county !== value)
    );
    setForm((prevForm) => ({
      ...prevForm,
      counties: checked
        ? [...prevForm.counties, value]
        : prevForm.counties.filter((county) => county !== value),
    }));
  };

  const handleDistrictSubmit = async () => {
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/add/districts/directory/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        const responseData = response.data.data;
        dispatch(addDistrict(responseData));
        setForm(initialState);
        await dispatch(
          fetchDepartmentData(
            `${origin}/api/add/districts/directory/${clientId}/${currentCaseId}/`
          )
        );
        setSelectedState("");
        handleClose();
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setForm(initialState);
    setSelectedState("");
    handleClose();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-container">
          <span class="loader"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div
      className={`modal generic-popup generic-popup-scroll fade bd-example-modal-md ${addFederalCourtDistrict ? "show" : ""}`}
      style={{
        backgroundColor: "rgba(40, 80, 122, 0.5)",
        zIndex: 100000,
        display: addFederalCourtDistrict ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="modal-dialog Law-firm-direct-max-width-800px directory-model"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="modal-content">
          <div className="modal-body">
            <div className="text-center">
              <h5 className="modal-title mb-2 mx-auto" id="">
                Add Federal Court District
              </h5>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">District</span>
              </div>
              <div className="col-10">
                <input
                  type="text"
                  placeholder="Enter District Name"
                  value={form.name}
                  className="form-control"
                  name="name"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
            <div className="row align-items-center form-group">
              <div className="col-2 text-left">
                <span className="d-inline-block text-grey">State</span>
              </div>
              <div className="col-10">
                <select
                  name="state"
                  className="form-select form-control"
                  value={form.state}
                  onChange={handleStateChange}
                >
                  <option
                    value=""
                    style={{
                      width: "90%",
                    }}
                  >
                    Select State
                  </option>
                  {statesData.map((state) => (
                    <option
                      key={state.id}
                      value={state.StateAbr}
                      style={{
                        width: "90%",
                      }}
                    >
                      {state.StateAbr}, {state.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedState && (
              <div className="row align-items-center form-group">
                <div className="col-2 text-left">
                  <span className="d-inline-block text-grey">Counties</span>
                </div>
                <div className="col-10">
                  {filteredCounties?.length > 0 ? (
                    <div
                      style={{
                        maxHeight: "300px",
                        overflowY: "scroll",
                        border: "1px solid #ccc",
                        padding: "10px",
                      }}
                    >
                      {filteredCounties.map((county, index) => (
                        <div key={index} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            value={county.name}
                            onChange={handleCountyChange}
                            checked={selectedCounties.includes(county.name)}
                          />
                          <label className="form-check-label">
                            {county.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No counties available</p>
                  )}
                </div>
              </div>
            )}
            <div className="modal-footer">
              <button
                type="button"
                class="btn btn-secondary float-left-margin-right-auto"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDistrictSubmit}
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

export default AddFederalCourtDistrictModal;
