import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { getCaseId, getClientId } from "../../Utils/helper";
import { useDispatch } from "react-redux";
import {
  deleteExpert,
  updateExpertData,
} from "../../Redux/experts-table/expertsSlice";

function ExpertTablePopUp({ ExpertTablePopUp, handleClose, expert }) {
  const tokenBearer = localStorage.getItem("token");
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  // const clientId = useSelector((state) => state?.client?.current.id);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const [stateData, setStateData] = useState([]);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [form, setForm] = useState({
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
  const getStateDataHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/states/`);
      setStateData(response.data.data);
    } catch (err) {
      console.log(err.message);
      // setError(err);
    } finally {
      // setLoading(false);
      console.log("");
    }
  };

  useEffect(() => {
    getStateDataHandler();
    if (expert) {
      setForm({
        title: expert?.title || "",
        first_name: expert?.first_name || "",
        last_name: expert?.last_name || "",
        address1: expert?.contactID?.address1 || "",
        address2: expert?.contactID?.address2 || "",
        city: expert?.contactID?.city || "",
        state: expert?.contactID?.state || "",
        zip: expert?.contactID?.zip || "",
        phone: expert?.contactID?.phone_number || "",
        extension: expert?.contactID?.phone_ext || "",
        fax: expert?.contactID?.fax || "",
        email: expert?.contactID?.email || "",
        website: expert?.contactID?.website || "",
      });
    }
  }, [expert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    const updatedExpert = {
      ...expert,
      id: expert.id,
      title: form.title,
      first_name: form.first_name,
      last_name: form.last_name,
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
    };

    try {
      const response = await axios.patch(
        `${origin}/api/add/directory/expert/${clientId}/${currentCaseId}/`,
        updatedExpert
      );
      dispatch(
        updateExpertData({
          id: expert.id,
          updatedData: response.data.data,
        })
      );
      handleClose();
    } catch (error) {
      console.error("Error updating expert:", error.message);
      console.error("Error Response:", error.response); // Add this line to get more details about the error
    }
  };

  const handleDeleteButton = async () => {
    try {
      console.log("Deleted", expert.id);

      const response = await axios.delete(
        `${origin}/api/add/directory/expert/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: expert.id,
          },
        }
      );
      dispatch(deleteExpert(expert.id));
      handleClose();
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  return (
    <Modal
      show={ExpertTablePopUp ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-1000p custom-insurance-dialog"
    >
      <div className="modal-content">
        <div className="modal-body">
          <div
            className="modal-header"
            style={{
              marginBottom: "20px",
              padding: 0,
            }}
          >
            <h5 className="modal-title mb-2 mx-auto" id="">
              Expert
            </h5>
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

export default ExpertTablePopUp;
