import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import {
  addLitigation,
  deleteLitigation,
  fetchLitigationData,
  updateLitigation,
} from "../../Redux/litigation-event/litigationEventSlice";

function LitigationEventPopUp({
  eventsPopUp,
  handleClose,
  handleDelete,
  handleSave,
  events,
  litigationEvent,
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const dispatch = useDispatch();
  const tokenBearer = localStorage.getItem("token");

  const [stateData, setStateData] = useState([]);
  const [countyData, setCountyData] = useState([]);
  const [dependantDateType, setDependantDateType] = useState([]);
  const [calculatedDates, setCalculatedDates] = useState([]);
  const [eventType, setEventType] = useState(events);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("event-details");

  const [form, setForm] = useState({
    event_name: "",
    event_type: "",
    state: "",
    county: "",
    federal: "",
    date_type: "",
    description: "",
    event_code: "",
    service: false,
    calculated_dates: [],
  });

  const latestEventRef = useRef(litigationEvent);

  const getEventTypeHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/event/types/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });

      setEventType(response.data.data);
    } catch (err) {
      console.error("Error fetching event types:", err);
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
      console.error("Error fetching states:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCountyDataHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/counties/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });

      setCountyData(response.data.data);
    } catch (err) {
      console.error("Error fetching counties:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDependantDateType = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/all/dependant/date/types/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      setDependantDateType(response.data.data);
    } catch (err) {
      console.error("Error fetching dependant date types:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCalculatedDatesHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/calculated/dates/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });

      setCalculatedDates(response.data.data);
    } catch (err) {
      console.error("Error fetching calculated dates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventTypeHandler();
    getStateDataHandler();
    getCountyDataHandler();
    getDependantDateType();
    getCalculatedDatesHandler();

    const federalValue = litigationEvent.state_fed ? "State" : "Federal";

    setForm({
      event_name: litigationEvent?.event_name || "",
      event_type: litigationEvent?.event_type_id?.id || "",
      state: litigationEvent?.state_id?.id || "",
      county: litigationEvent?.county_id?.id || "",
      federal: litigationEvent?.state_fed || "",
      date_type: litigationEvent?.dependent_date_type_id?.id || "",
      description: litigationEvent?.event_description || "",
      event_code: litigationEvent?.event_code || "",
      service: litigationEvent?.service || false,
      calculated_dates:
        litigationEvent?.calculated_dates_id?.map((date) => date.id) || [],
    });
    latestEventRef.current = litigationEvent;
  }, [litigationEvent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "calculated_dates") {
      const updatedDates = checked
        ? [...form.calculated_dates, parseInt(value)]
        : form.calculated_dates.filter((id) => id !== parseInt(value));
      setForm((prevForm) => ({
        ...prevForm,
        [name]: updatedDates,
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSaveClick = async () => {
    const updatedEvent = {
      ...litigationEvent,
      ...latestEventRef.current,
      id: latestEventRef.current.id,
      block_name: "litigationEvent",
      event_name: form.event_name,
      event_type_id: form.event_type,
      state: form.state,
      county: form.county,
      state_fed: form.federal,
      dependent_date_type_id: form.date_type,
      event_description: form.description,
      event_code: form.event_code,
      service: form.service,
      calculated_dates_id: calculatedDates.filter((date) =>
        form.calculated_dates.includes(date.id)
      ),
    };

    try {
      const response = await axios.patch(
        `${origin}/api/add/litigation/event/${clientId}/${currentCaseId}/`,
        updatedEvent
      );
      dispatch(
        updateLitigation({
          id: latestEventRef.current.id,
          updatedData: response.data.data,
        })
      );
      handleSave(response.data.data);
    } catch (error) {
      console.error("Error updating litigation events", error.message);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/add/litigation/event/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: litigationEvent.id,
            block_name: "litigationEvent",
          },
        }
      );
      // dispatch(deleteLitigation(litigationEvent.id));
      await dispatch(
        fetchLitigationData(
          `${origin}/api/add/litigation/event/${clientId}/${currentCaseId}/`
        )
      );
      handleDelete(response.data.data);
    } catch (error) {
      console.error("Error deleting litigation events:", error.message);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Modal
      show={eventsPopUp ? true : false}
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
            {/* {litigationEvent.id 
            } */}
            <h5 className="modal-title mb-2 mx-auto">Litigation Event</h5>
          </div>
          <nav className="ml-0">
            <div
              className="nav nav-tabs justify-content-around"
              id="nav-tab"
              role="tablist"
            >
              <a
                className={`nav-item nav-link Pad8 tab-item ${
                  activeTab === "event-details" ? "active" : ""
                }`}
                onClick={() => handleTabClick("event-details")}
                role="tab"
                id="add-event-details-link"
                data-toggle="tab"
                href="#add-event-details-tab"
                aria-controls="add-event-details-tab"
                aria-selected={activeTab === "event-details"}
              >
                Event Details
              </a>
              <a
                className={`nav-item nav-link Pad8 tab-item ${
                  activeTab === "calculated-dates" ? "active" : ""
                }`}
                onClick={() => handleTabClick("calculated-dates")}
                role="tab"
                id="calculated-dates-link"
                data-toggle="tab"
                href="#calculated-dates-tab"
                aria-controls="calculated-dates-tab"
                aria-selected={activeTab === "calculated-dates"}
              >
                Calculated Dates
              </a>
            </div>
          </nav>

          <div
            className="tab-content mt-2"
            id="nav-tabContent"
            style={{ overflowX: "hidden" }}
          >
            <div
              className={`tab-pane fade ${
                activeTab === "event-details" ? "show active" : ""
              }`}
              id="add-event-details-tab"
              role="tabpanel"
              aria-labelledby="add-event-details-link"
              style={{ overflowX: "hidden" }}
            >
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr> Event Name </nobr>
                  </span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Event Name"
                    value={form.event_name || ""}
                    className="form-control"
                    name="event_name"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>Event Type</nobr>
                  </span>
                </div>
                <div className="col-md-10">
                  <select
                    name="event_type"
                    className="form-select form-control"
                    value={form.event_type || ""}
                    onChange={handleChange}
                  >
                    {eventType.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.litigation_event_type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    <nobr>State/Federal</nobr>
                  </span>
                </div>
                <div className="col-md-10">
                  <select
                    name="federal"
                    className="form-select form-control"
                    value={form.federal || ""}
                    onChange={handleChange}
                  >
                    <option value="State">State</option>
                    <option value="Federal">Federal</option>
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
                    value={form.state || ""}
                    onChange={handleChange}
                  >
                    {form.state?.length ? null : (
                    <option value="">select state</option>
                  )}
                    {stateData.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">County</span>
                </div>
                <div className="col-md-10">
                  <select
                    name="county"
                    className="form-select form-control"
                    value={form.county || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select County</option>
                    {countyData.map((county) => (
                      <option key={county.id} value={county.id}>
                        {county.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    Dependant Date Time
                  </span>
                </div>
                <div className="col-md-10">
                  <select
                    name="date_type"
                    className="form-select form-control"
                    value={form.date_type || ""}
                    onChange={handleChange}
                  >
                    {dependantDateType.map((date) => (
                      <option key={date.id} value={date.id}>
                        {date.dependent_date_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    Event Description
                  </span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Description"
                    value={form.description || ""}
                    className="form-control"
                    name="description"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Event Code</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Event Code"
                    value={form.event_code || ""}
                    className="form-control"
                    name="event_code"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Service</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="checkbox"
                    placeholder="Enter Service"
                    value={form.service}
                    checked={form.service}
                    // className="form-control"
                    name="service"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${
                activeTab === "calculated-dates" ? "show active" : ""
              }`}
              id="calculated-dates-tab"
              role="tabpanel"
              aria-labelledby="calculated-dates-link"
              style={{ overflowX: "hidden" }}
            >
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    Calculated Dates
                  </span>
                </div>
                <div className="col-md-10">
                  <div className="col-md-6">
                    <div>
                      {calculatedDates.map((date) => (
                        <div key={date.id}>
                          <input
                            type="checkbox"
                            data-state={date.state ? date.state.id : ""}
                            className="input"
                            id={`cal_date_Checkbox${date.id}`}
                            value={date.id}
                            checked={form.calculated_dates.includes(date.id)}
                            name="calculated_dates"
                            onChange={handleChange}
                            style={{ marginLeft: "-15px", marginRight: "5px" }}
                          />
                          <label
                            className="label"
                            htmlFor={`cal_date_Checkbox${date.id}`}
                          >
                            <nobr>
                              {date.state ? `${date.state.StateAbr}:` : ""}
                              {date.calculated_date_name}
                            </nobr>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-footer"
            style={{
              background: "#FFFFFF",
              borderTop: "1px solid #DFDFDF",
              borderRadius: "0 0 3px 3px",
            }}
          >
            <button className="btn btn-secondary h-35px" onClick={handleClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDeleteClick}>
              Delete
            </button>
            <button className="btn btn-success" onClick={handleSaveClick}>
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default LitigationEventPopUp;
