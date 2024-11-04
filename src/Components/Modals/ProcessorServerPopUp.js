import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addProcessServer, deleteProcessServer, fetchProcessServerData, updateProcessServer } from "../../Redux/process-server/processServerSlice";

function ProcessorServerPopUp({
  processorPopUp,
  handleClose,
  processServer,
}) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const dispatch = useDispatch()
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [stateData, setStateData] = useState([]);
  const [activeTab, setActiveTab] = useState("information");
  const [form, setForm] = useState({
    name: "",
    cost: "",
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
    states_list_textarea: "",
    cities_list_textarea: "",
    counties_list_textarea: "",
    zipcodes_list_textarea: "",
  });

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
      console.log("");
    }
  };

  useEffect(() => {
    getStateDataHandler();
  }, []);

  useEffect(() => {
    if (processServer) {
      setForm({
        name: processServer?.contact_id?.name || "",
        cost: processServer?.cost || "",
        address1: processServer?.contact_id?.address1 || "",
        address2: processServer?.contact_id?.address2 || "",
        city: processServer?.contact_id?.city || "",
        state: processServer?.contact_id?.state || "",
        zip: processServer?.contact_id?.zip || "",
        phone: processServer?.contact_id?.phone_number || "",
        extension: processServer?.contact_id?.phone_ext || "",
        fax: processServer?.contact_id?.fax || "",
        email: processServer?.contact_id?.email || "",
        website: processServer?.contact_id?.website || "",
        states_list_textarea: processServer?.process_served_list?.states_list || "",
        cities_list_textarea: processServer?.process_served_list?.cities_list || "",
        counties_list_textarea: processServer?.process_served_list?.counties_list || "",
        zipcodes_list_textarea: processServer?.process_served_list?.zipcodes_list || "",
    });
    
    }
  }, [processServer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    const updatedProcessServer = {
      ...processServer,
      id: processServer.id,
      name: form.name,
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

      cost: form.cost,
      states_list_textarea: form.states_list_textarea,
      cities_list_textarea: form.cities_list_textarea,
      counties_list_textarea: form.counties_list_textarea,
      zipcodes_list_textarea: form.zipcodes_list_textarea,
    };

    try {
      const response = await axios.patch(
        `${origin}/api/add/server/processor/${clientId}/${currentCaseId}/`,
        updatedProcessServer
      );
      dispatch(updateProcessServer({
        id : processServer.id,
        updatedData : response.data.data
      }));
      handleClose();
    } catch (error) {
      console.error("Error updating insurance company:", error.message);
      console.error("Error Response:", error.response); // Add this line to get more details about the error
    }
  };

  const handleDeleteClick = async () => {
    try {

      const response = await axios.delete(
        `${origin}/api/add/server/processor/${clientId}/${currentCaseId}/`,
        {
          data: { id: processServer.id },
        }
      );
      // dispatch(deleteProcessServer(processServer.id))
      await dispatch(fetchProcessServerData(`${origin}/api/add/server/processor/${clientId}/${currentCaseId}/`))
      handleClose()
    } catch (error) {
      console.error("Error deleting process server:", error.message);
    }
  };

  const renderFormContent = () => {
    switch (activeTab) {
      case "information":
        return (
          <>
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
                  <nobr>Cost</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="number"
                  placeholder="Enter Cost"
                  value={form.cost}
                  className="form-control"
                  name="cost"
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
                  placeholder="Enter Address 2"
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
                    placeholder="Enter City"
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
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Phone"
                  value={form.phone}
                  className="form-control"
                  name="phone"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Extension</span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Extension"
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
                  placeholder="Enter Fax"
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
                  type="email"
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
                  type="url"
                  placeholder="Enter Website"
                  value={form.website}
                  className="form-control"
                  name="website"
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        );
      case "states_served":
        return (
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">States :</span>
            </div>
            <div className="col-md-10">
              <textarea
                className="form-control"
                name="states_list_textarea"
                value={form.states_list_textarea}
                onChange={handleChange}
                placeholder="Enter states served"
                rows="4"
              />
            </div>
          </div>
        );
      case "cities_served":
        return (
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Cities :</span>
            </div>
            <div className="col-md-10">
              <textarea
                className="form-control"
                name="cities_list_textarea"
                value={form.cities_list_textarea}
                onChange={handleChange}
                placeholder="Enter cities served"
                rows="4"
              />
            </div>
          </div>
        );
      case "counties_served":
        return (
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Counties :</span>
            </div>
            <div className="col-md-10">
              <textarea
                className="form-control"
                name="counties_list_textarea"
                value={form.counties_list_textarea}
                onChange={handleChange}
                placeholder="Enter counties served"
                rows="4"
              />
            </div>
          </div>
        );
      case "zip_served":
        return (
          <>
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Zip Codes :</span>
              </div>
              <div className="col-md-10">
                <textarea
                  className="form-control"
                  name="zipcodes_list_textarea"
                  value={form.zipcodes_list_textarea}
                  onChange={handleChange}
                  placeholder="Enter zip codes served"
                  rows="4"
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      show={processorPopUp ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered custom-insurance-dialogPS"
    >
      <div className="modal-content directory-model">
        <div
          className="modal-body"
          style={{ padding: 0, position: "relative" }}
        >
          <div
            className="modal-header text-center"
            style={{ border: "none", padding: 0 }}
          >
            <h3
              className="modal-title mb-2 mx-auto"
              style={{
                color: "#fff",
                backgroundColor: "#043363",
                // borderColor: "green",
                width: "100%",
              }}
            >
              EDIT PROCESS SERVER
            </h3>
          </div>
          <p
            className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center"
            style={{ marginBottom: "35px" }}
          >
            Input and edit your process server information here
          </p>

          <nav className="ml-0">
            <div
              className="nav nav-tabs justify-content-around"
              id="nav-tab"
              role="tablist"
            >
              <a
                className="nav-item nav-link active Pad8 tab-item"
                id="information-link"
                data-toggle="tab"
                href="#information-tabE"
                role="tab"
                aria-controls="information-tab"
                aria-selected="false"
              >
                Information
              </a>

              <a
                className="nav-item nav-link Pad8 tab-item"
                id="states_served-link"
                data-toggle="tab"
                href="#states_served-tabE"
                role="tab"
                aria-controls="states_served-tab"
                aria-selected="false"
              >
                States Served
              </a>
              <a
                className="nav-item nav-link Pad8 tab-item"
                id="cities_served-link"
                data-toggle="tab"
                href="#cities_served-tabE"
                role="tab"
                aria-controls="cities_served-tab"
                aria-selected="false"
              >
                Cities Served
              </a>
              <a
                className="nav-item nav-link Pad8 tab-item"
                id="counties_served-link"
                data-toggle="tab"
                href="#counties_served-tabE"
                role="tab"
                aria-controls="counties_served-tab"
                aria-selected="false"
              >
                Counties Served
              </a>
              <a
                className="nav-item nav-link Pad8 tab-item"
                id="zip_served-link"
                data-toggle="tab"
                href="#zip_served-tabE"
                role="tab"
                aria-controls="zip_served-tab"
                aria-selected="false"
              >
                Zip Codes Served
              </a>
            </div>
          </nav>
        </div>
        <div
          className="tab-content mt-2"
          style={{ margin: "8px", padding: "8px", minHeight: "420px"}}
        >
          <div
            className="tab-pane fade show active"
            id="information-tabE"
            role="tabpanel"
            aria-labelledby="information-link"
            style={{ overflowX: "hidden" }}
          >
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
                  <nobr>Cost</nobr>
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="number"
                  placeholder="Enter Cost"
                  value={form.cost}
                  className="form-control"
                  name="cost"
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
                  placeholder="Enter Address 2"
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
                    placeholder="Enter City"
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
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Phone"
                  value={form.phone}
                  className="form-control"
                  name="phone"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Extension</span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Enter Extension"
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
                  placeholder="Enter Fax"
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
                  type="email"
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
                  type="url"
                  placeholder="Enter Website"
                  value={form.website}
                  className="form-control"
                  name="website"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div
            className="tab-pane fade"
            id="states_served-tabE"
            role="tabpanel"
            aria-labelledby="states_served-link"
            style={{ overflowX: "hidden" }}
          >
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">States :</span>
              </div>
              <div className="col-md-10">
                <textarea
                  className="form-control"
                  name="states_list_textarea"
                  value={form.states_list_textarea}
                  onChange={handleChange}
                  placeholder="Enter states served"
                  rows="4"
                />
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="cities_served-tabE"
            role="tabpanel"
            aria-labelledby="cities_served-link"
            style={{ overflowX: "hidden" }}
          >
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Cities :</span>
              </div>
              <div className="col-md-10">
                <textarea
                  className="form-control"
                  name="cities_list_textarea"
                  value={form.cities_list_textarea}
                  onChange={handleChange}
                  placeholder="Enter cities served"
                  rows="4"
                />
              </div>
            </div>
          </div>

          <div
            className="tab-pane fade"
            id="counties_served-tabE"
            role="tabpanel"
            aria-labelledby="counties_served-link"
            style={{ overflowX: "hidden" }}
          >
            <div className="row align-items-center form-group">
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey">Counties :</span>
              </div>
              <div className="col-md-10">
                <textarea
                  className="form-control"
                  name="counties_list_textarea"
                  value={form.counties_list_textarea}
                  onChange={handleChange}
                  placeholder="Enter counties served"
                  rows="4"
                />
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="zip_served-tabE"
            role="tabpanel"
            aria-labelledby="zip_served-link"
            style={{ overflowX: "hidden" }}
          >
            <>
              <div className="row align-items-center form-group">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Zip Codes :</span>
                </div>
                <div className="col-md-10">
                  <textarea
                    className="form-control"
                    name="zipcodes_list_textarea"
                    value={form.zipcodes_list_textarea}
                    onChange={handleChange}
                    placeholder="Enter zip codes served"
                    rows="4"
                  />
                </div>
              </div>
            </>
          </div>
        </div>

        <div
          className="modal-footer"
          style={{ border: "none", justifyContent: "space-evenly" }}
        >
          <button
            type="button"
            className="btn btn-secondary h-35px"
            onClick={handleClose}
          >
            Close
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
            Save Process Server Information
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ProcessorServerPopUp;
