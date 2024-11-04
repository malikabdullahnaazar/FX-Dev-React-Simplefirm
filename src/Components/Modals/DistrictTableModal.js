import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { updateDistrict } from "../../Redux/district-table/districtSlice";

function DistrictTableModal({ districtPopUp, handleClose, districtData }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [statesData, setStatesData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [countiesData, setCountiesData] = useState([]);
  const [filteredCounties, setFilteredCounties] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    state: "",
    counties: [],
  });

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

  useEffect(() => {
    if (districtData) {
      setForm({
        id: districtData.id,
        name: districtData.name,
        state: districtData.state,
        counties: districtData.counties.map((county) => ({
          id: county.id,
          name: county.name,
        })),
      });
      setSelectedState(districtData.state);
      setSelectedCounties(districtData.counties.map((county) => county.id));

      const filterCounties = countiesData.filter(
        (county) => county.StateAbr === districtData.state.StateAbr
      );
      setFilteredCounties(filterCounties);
    }
  }, [districtData, countiesData]);

  const handleStateChange = (e) => {
    const stateAbr = e.target.value;
    setSelectedCounties([]);

    const state = statesData.find((state) => state.StateAbr === stateAbr);
    setSelectedState(state);

    setForm((prevForm) => ({
      ...prevForm,
      state: state,
      counties: [],
    }));

    const filterCounties = countiesData.filter(
      (county) => county?.in_state?.StateAbr === stateAbr
    );
    setFilteredCounties(filterCounties);
  };

  const handleCountyChange = (e) => {
    const { value, checked } = e.target;
    const selectCounty = countiesData.find(
      (county) => county.id.toString() === value
    );
    const countyObj = selectCounty
      ? { id: selectCounty.id, name: selectCounty.name }
      : null;

    if (countyObj) {
      setSelectedCounties((prev) =>
        checked
          ? [...prev, countyObj.id]
          : prev.filter((id) => id !== countyObj.id)
      );

      setForm((prevForm) => {
        const newCounties = checked
          ? [...prevForm.counties, countyObj]
          : prevForm.counties.filter((county) => county.id !== countyObj.id);
        return {
          ...prevForm,
          counties: newCounties,
        };
      });
    }
  };

  const handleDistrictSubmit = async () => {
    setError(null);
    try {
      const response = await axios.patch(
        `${origin}/api/add/districts/directory/${clientId}/${currentCaseId}/`,
        {
          id: districtData.id,
          name: form.name,
          state: form.state,
          counties: form.counties,
        },
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        const responseData = response.data.data;
        dispatch(updateDistrict(responseData));
        handleClose();
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteButton = async () => {
    try {
      console.log("Deleted", departmentData.id);

      const response = await axios.delete(
        `${origin}/api/add/districts/directory/${clientId}/${currentCaseId}/`,
        {
          id: districtData.id,
        },
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      console.log("delete response: ", response);
      // dispatch(deleteDepartment(departmentData.id));
      await dispatch(
        fetchDepartmentData(
          `${origin}/api/add/department/directory/${clientId}/${currentCaseId}/`
        )
      );

      handleClose();
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
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
      className={`modal generic-popup generic-popup-scroll fade bd-example-modal-md ${districtPopUp ? "show" : ""}`}
      style={{
        backgroundColor: "rgba(40, 80, 122, 0.5)",
        zIndex: 100000,
        display: districtPopUp ? "flex" : "none",
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
                Edit Federal Court District
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
                  <option value="">Select State</option>
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
                  {filteredCounties.length > 0 ? (
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
                            value={county.id}
                            onChange={handleCountyChange}
                            checked={selectedCounties.includes(county.id)}
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

export default DistrictTableModal;
