import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import { useDispatch } from "react-redux";
import {
  deleteStatute,
  fetchStatuteData,
  updateStatute,
} from "../../Redux/statue-data/statuteSlice";

function StatuePopUp({ statuesPopUp, handleClose, selectedStatue }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [stateData, setStateData] = useState([]);
  const [statueLimit, setStatueLimit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    time_span: "",
    statue_type: "",
    state: "",
    expired_on: "",
    filing_date: "",
    filing_date_added: false,
    satisfied: false,
    removed: false,
    incident_date_bool: false,
    case_type_bool: false,
    case_state_bool: false,
    is_triggered: false,
    triggered_item: [],
  });
  const ttr = [
    {
      id: 2,
      name: "Public Entity Expired",
      time_span: "45 Days",
    },
    {
      id: 15,
      name: "Claim Form Filing Minor",
      time_span: "2 years",
    },
    {
      id: 18,
      name: "khan statue",
      time_span: "2",
    },
    {
      id: 19,
      name: "Umar Farooq",
      time_span: "55",
    },
  ];
  const getStateDataHandler = async () => {
    setLoading(true);
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
    setLoading(true);
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

  useEffect(() => {
    getStateDataHandler();
    getStatuesLimitationHandle();
  }, []);

  useEffect(() => {
    if (selectedStatue) {
      const filingDate = selectedStatue.claim_form_filing_date
        ? selectedStatue.claim_form_filing_date.split("T")[0]
        : "";
      const triggered_item = selectedStatue.additional_statute_triggered?.map(
        (st) => String(st.id)
      );
      setForm({
        name: selectedStatue?.name || "",
        time_span: selectedStatue?.time_span || "",
        statue_type: selectedStatue?.statute_type || "After 18th birthday",
        state: selectedStatue?.for_state?.id || "",
        expired_on: selectedStatue?.expired_on?.id || "", // Ensure this is set correctly
        filing_date: filingDate || "",
        filing_date_added: selectedStatue?.filing_date_added || false,
        satisfied: selectedStatue?.satisfied || false,
        removed: selectedStatue?.removed || false,
        incident_date_bool: selectedStatue?.incident_date_bool || false,
        case_type_bool: selectedStatue?.case_type_bool || false,
        case_state_bool: selectedStatue?.case_state_bool || false,
        is_triggered: selectedStatue?.is_triggered || false,
        triggered_item: triggered_item || [],
      });
    }
  }, [selectedStatue]);

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

  const handleDeleteClick = async () => {
    try {
      console.log("Deleted", selectedStatue.id);

      const response = await axios.delete(
        `${origin}/api/add/statue/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: selectedStatue.id,
          },
        }
      );
      // dispatch(deleteStatute(selectedStatue.id));
      await dispatch(fetchStatuteData(`${origin}/api/get/statue/limits/`));
      handleClose();
      // handleDelete(selectedStatue.id);
    } catch (error) {
      console.error("Error deleting statue:", error.message);
    }
  };

  const handleSaveClick = async () => {
    // const expired_on =
    //   typeof form.expired_on === "object"
    //     ? form.expired_on
    //     : statueLimit.find((st) => st.id == form.expired_on);
    const updatedStatue = {
      id: selectedStatue.id,
      name: form.name,
      time_span: form.time_span,
      statue_type: form.statue_type,
      state: form.state,
      expired_on: form.expired_on,
      filing_date: form.filing_date,
      filing_date_added: form.filing_date_added,
      satisfied: form.satisfied,
      removed: form.removed,
      incident_date_bool: form.incident_date_bool,
      case_type_bool: form.case_type_bool,
      case_state_bool: form.case_state_bool,
      is_triggered: form.is_triggered,
      triggered_item: form.triggered_item.map((num) => Number(num)),
    };

    try {
      const response = await axios.patch(
        `${origin}/api/add/statue/${clientId}/${currentCaseId}/`,
        updatedStatue
      );
      dispatch(
        updateStatute({
          id: updatedStatue.id,
          updatedData: response.data.data,
        })
      );
      handleClose();
    } catch (error) {
      console.error("Error updating insurance company:", error.message);
      console.error("Error Response:", error.response); // Add this line to get more details about the error
    }
  };

  return (
    <Modal
      show={statuesPopUp ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-1000p custom-insurance-dialog"
    >
      <div className="modal-content directory-model">
        <div className="modal-body">
          <div
            className="modal-header"
            style={{
              marginBottom: "20px",
              padding: 0,
            }}
          >
            <h5 className="modal-title mb-2 mx-auto" id="exampleModalLabel">
              Edit Statues
            </h5>
          </div>
          {/* Form Fields */}
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
                <option value="After 18th birthday">After 18th birthday</option>
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
                {form.state?.length ? null : (
                    <option value="">select state</option>
                  )}
                {stateData &&
                  stateData.map((item) => (
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
                {statueLimit &&
                  statueLimit.map((item) => (
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

          {/* Checkbox Fields */}
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
                placeholder=""
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
                placeholder=""
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
                placeholder=""
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
                placeholder=""
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
                placeholder=""
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
                placeholder=""
                className="form-control"
                name="is_triggered"
                checked={form.is_triggered}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">
                Additional Statute Triggered
              </span>
            </div>
            <div className="col-md-8" id="triggered_statute_block">
              {statueLimit &&
                statueLimit.map((item) => (
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
                        checked={form.triggered_item.includes(String(item.id))} // Ensure the includes check is against a string
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
              onClick={handleDeleteClick}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSaveClick}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default StatuePopUp;
