import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addLitigation, fetchLitigationData } from "../../Redux/litigation-event/litigationEventSlice";
const initialState = {
  event_name: "",
  event_type: "",
  state: "",
  county: "",
  federal: "",
  date_type: "",
  description: "",
  event_code: "",
  service: false,
  calculated_dates: [], // This will hold the selected checkbox values
};
function LitigationEventModal({
  litigationEventPopUp,
  handleClose,
}) {
  const tokenBearer = localStorage.getItem("token");
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  // const clientId = useSelector((state) => state?.client?.current.id);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [stateData, setStateData] = useState([]);
  const [countyData, setCountyData] = useState([]);
  const [dependantDateType, setDependantDateType] = useState([]);
  const [calculatedDates, setCalculatedDates] = useState([]);
  const [eventType, setEventType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(initialState);

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

  const getCountyDataHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/counties/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });

      setCountyData(response.data.data);
    } catch (err) {
      setError(err);
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
      setError(err);
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
      setError(err);
      console.error("Error fetching calculated dates:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/event/types/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });

      setEventType(response.data.data);
    } catch (err) {
      setError(err);
      console.error("Error fetching calculated dates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStateDataHandler();
    getCountyDataHandler();
    getDependantDateType();
    getCalculatedDatesHandler();
    getEventTypeHandler();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: checked
          ? [...(prevForm[name] || []), value]
          : (prevForm[name] || []).filter((v) => v !== value),
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleLitigationEventSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/add/litigation/event/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      const responseData = response.data;
      // dispatch(addLitigation(responseData.data));
      await dispatch(
        fetchLitigationData(
          `${origin}/api/add/litigation/event/${clientId}/${currentCaseId}/`
        )
      );
      setData(responseData);
      setForm(initialState);
      handleClose();
    } catch (err) {
      console.log(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`modal generic-popup generic-popup-scroll fade bd-example-modal-md ${litigationEventPopUp ? "show" : ""}`}
      style={{
        backgroundColor: "rgba(40, 80, 122, 0.5)",
        zIndex: 100000,
        display: litigationEventPopUp ? "flex" : "none",
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
                Add Litigation Event
              </h5>
            </div>

            <nav className="ml-0">
              <div
                className="nav nav-tabs justify-content-around"
                id="nav-tab"
                role="tablist"
              >
                <a
                  className="nav-item nav-link active Pad8 tab-item"
                  id="add-event-details-link"
                  data-toggle="tab"
                  href="#add-event-details-tab"
                  role="tab"
                  aria-controls="add-event-details-tab"
                  aria-selected="false"
                >
                  Event Details
                </a>

                <a
                  className="nav-item nav-link Pad8 tab-item"
                  id="add-calculted-dates-link"
                  data-toggle="tab"
                  href="#add-calculted-dates-tab"
                  role="tab"
                  aria-controls="add-calculted-dates-tab"
                  aria-selected="false"
                >
                  Calculated Dates
                </a>
              </div>
            </nav>

            <div className="tab-content mt-2" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="add-event-details-tab"
                role="tabpanel"
                aria-labelledby="add-event-details-link"
                style={{ overflowX: "hidden" }}
              >
                <div className="row align-items-center form-group">
                  <div className="col-md-2 text-left">
                    <span className="d-inline-block text-grey">
                      <nobr>Event Name</nobr>
                    </span>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="text"
                      placeholder="Enter Event Name"
                      value={form.event_name}
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
                      value={form.event_type}
                      onChange={handleChange}
                    >
                      <option value="">Select Event type</option>
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
                    <span className="d-inline-block text-grey">County</span>
                  </div>
                  <div className="col-md-10">
                    <select
                      name="county"
                      className="form-select form-control"
                      value={form.county}
                      onChange={handleChange}
                    >
                      <option value="">Select County</option>
                      {countyData.map((item) => (
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
                      Dependant Date Time
                    </span>
                  </div>
                  <div className="col-md-10">
                    <select
                      name="date_type"
                      className="form-select form-control"
                      value={form.date_type}
                      onChange={handleChange}
                    >
                      <option value="">Select Dependant Date</option>
                      {dependantDateType.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.dependent_date_name}
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
                      value={form.description}
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
                      value={form.event_code}
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
                      // className="form-control"
                      name="service"
                      checked={form.service}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="add-calculted-dates-tab"
                role="tabpanel"
                aria-labelledby="add-calculted-dates-link"
                style={{ overflowX: "hidden" }}
              >
                <div className="row align-items-center form-group">
                  <div className="col-md-2 text-left">
                    <span className="d-inline-block text-grey">
                      Calculated Dates
                    </span>
                  </div>
                  <div className="col-md-10">
                    <div>
                      {calculatedDates.map((date) => (
                        <div className="" key={date.id}>
                          <input
                            type="checkbox"
                            data-state={date.state ? date.state.id : ""}
                            // className="form-check-input"
                            id={`cal_date_Checkbox${date.id}`}
                            value={date.id}
                            name="calculated_dates"
                            onChange={handleChange}
                            checked={form.calculated_dates.includes(
                              String(date.id)
                            )}
                            style={{
                              marginRight: "5px",
                            }}
                          />
                          <label
                            className="d-inline"
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
                onClick={handleLitigationEventSubmit}
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

export default LitigationEventModal;
