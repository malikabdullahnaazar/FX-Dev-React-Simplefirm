import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addStatute, fetchStatuteData } from "../../Redux/statue-data/statuteSlice";

const initialState = {
  name: "",
  time_span: "",
  statue_type: "After 18th birthday",
  state: "2",
  expired_on: "1",
  filing_date: "",
  filing_date_added: false,
  satisfied: false,
  removed: false,
  incident_date_bool: false,
  case_type_bool: false,
  case_state_bool: false,
  is_triggered: false,
  triggered_item: [],
};

function AddStatutesModal({ statuesPopUp, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  // const clientId = useSelector((state) => state?.client?.current.id);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [stateData, setStateData] = useState([]);
  const [statueLimit, setStatueLimit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialState);
  
  useEffect(() => {
    if (statuesPopUp) {
      getStatuesLimitationHandle();
    }
  }, [statuesPopUp]);


  useEffect(() => {
    getStateDataHandler();
    getStatuesLimitationHandle();
  }, []);


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

  const getStatuesLimitationHandle = async () => {
    try {
      const response = await axios.get(`${origin}/api/get/statue/limits/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setStatueLimit(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prevForm) => {
      const updatedTriggeredItem = checked
        ? [...prevForm.triggered_item, value]
        : prevForm.triggered_item.filter((item) => item !== value);
      return {
        ...prevForm,
        triggered_item: updatedTriggeredItem,
      };
    });
  };

  const handleStatutesSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/add/statue/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      // if (response.status === 200) {
      await dispatch(fetchStatuteData(`${origin}/api/get/statue/limits/`))
      handleClose();
      // dispatch(addStatute(response.data.data));
      getStatuesLimitationHandle();
      setForm(initialState);
      // }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`modal generic-popup generic-popup-scroll fade bd-example-modal-md ${statuesPopUp ? "show" : ""}`}
      style={{
        backgroundColor: "rgba(40, 80, 122, 0.5)",
        zIndex: 100000,
        display: statuesPopUp ? "flex" : "none",
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
              <h5 className="modal-title mb-2 mx-auto">Add Statues</h5>
            </div>

            {/* <div className="row">
              <div className="col-md-12">
                <input
                  type="text"
                  placeholder="Type insurance company name to search directory then click an entry"
                  className="form-control mb-3"
                />
              </div>
            </div> */}

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Name</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={form.name}
                  className="form-control"
                  name="name"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Time Span</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Time Span"
                  value={form.time_span}
                  className="form-control"
                  name="time_span"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Statue Type</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <select
                  name="statue_type"
                  className="form-select form-control"
                  value={form.statue_type}
                  onChange={handleChange}
                >
                  <option value="After 18th birthday">
                    After 18th birthday
                  </option>
                  <option value="After DOI">After DOI</option>
                </select>
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">State</span>
              </div>
              <div className="col-md-10">
                <select
                  name="state"
                  className="form-select form-control"
                  value={form.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {stateData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Expired On</span>
              </div>
              <div className="col-md-10">
                <select
                  name="expired_on"
                  className="form-select form-control"
                  value={form.expired_on}
                  onChange={handleChange}
                >
                  {statueLimit.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Filing Date</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="date"
                  min="1000-01-01"
                  max="9999-12-31"
                  placeholder=""
                  value={form.filing_date}
                  className="form-control"
                  name="filing_date"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">
                  Filing Date Added
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  placeholder=""
                  className="form-control"
                  name="filing_date_added"
                  checked={form.filing_date_added}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Satisfied</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  className="form-control"
                  name="satisfied"
                  checked={form.satisfied}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Removed</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  className="form-control"
                  name="removed"
                  checked={form.removed}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Incident Date</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  className="form-control"
                  name="incident_date_bool"
                  checked={form.incident_date_bool}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Case Type</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  className="form-control"
                  name="case_type_bool"
                  checked={form.case_type_bool}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Case State</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  className="form-control"
                  name="case_state_bool"
                  checked={form.case_state_bool}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Is Triggered</span>
              </div>
              <div className="col-md-10">
                <input
                  type="checkbox"
                  className="form-control"
                  name="is_triggered"
                  checked={form.is_triggered}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-4 text-left">
                <span className="d-inline-block text-grey">
                  Additional Statute Triggered
                </span>
              </div>
              <div className="col-md-8" id="triggered_statute_block">
                {statueLimit.map((item) => (
                  <div
                    className="col-md-6"
                    key={item.id}
                    data-state={item.for_state.id}
                  >
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`item_Checkbox${item.id}`}
                        value={String(item.id)} // Ensure the value is a string
                        name="triggered_item"
                        checked={form.triggered_item.includes(String(item.id))} // Check if this item is in triggered_item
                        onChange={handleCheckboxChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`item_Checkbox${item.id}`}
                      >
                        <nobr>{item.name}</nobr>
                      </label>
                    </div>
                  </div>
                ))}
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
                onClick={handleStatutesSubmit}
                className="btn btn-success"
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

export default AddStatutesModal;
