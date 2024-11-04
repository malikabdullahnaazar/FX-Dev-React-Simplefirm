import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import {
  deleteLawFirm,
  updateLawFirm,
} from "../../Redux/law-firm/lawFirmSlice";

function LawFirmTablePopUp({
  lawFirmPopUp,
  handleClose,
  handleDelete,
  handleSave,
  selectedFirm,
}) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    law_first_name: "",
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
      const response = await axios.get(`${origin}/api/all/states/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setStateData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStateDataHandler();
    if (selectedFirm) {
      setForm({
        law_first_name: selectedFirm?.office_name || "",
        address1: selectedFirm?.contact?.address1 || "",
        address2: selectedFirm?.contact?.address2 || "",
        city: selectedFirm?.contact?.city || "",
        state: selectedFirm?.contact?.state || "",
        zip: selectedFirm?.contact?.zip || "",
        phone: selectedFirm?.contact?.phone_number || "",
        extension: selectedFirm?.contact?.phone_ext || "",
        fax: selectedFirm?.contact?.fax || "",
        email: selectedFirm?.contact?.email || "",
        website: selectedFirm?.contact?.website || "",
      });
    }
  }, [selectedFirm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    const updatedFirm = {
      firm_id: selectedFirm.id,
      office_name: form.law_first_name,
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
        `${origin}/api/add/law/firm/${clientId}/${currentCaseId}/`,
        updatedFirm
      );
      dispatch(
        updateLawFirm({
          id: selectedFirm.id,
          updatedData: response.data.data,
        })
      );
      handleClose();
      // handleSave(response.data.data);
    } catch (error) {
      console.error("Error updating insurance company:", error.message);
      console.error("Error Response:", error.response); // Add this line to get more details about the error
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/add/law/firm/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: selectedFirm.id,
          },
        }
      );
      dispatch(deleteLawFirm(selectedFirm.id));
      handleClose();
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  return (
    <Modal
      show={lawFirmPopUp ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-1000p custom-insurance-dialog"
    >
      <div className="modal-content">
        <div className="modal-body">
          <div className="text-center">
            <h5 className="modal-title mb-2 mx-auto">Law Firm</h5>
          </div>

          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">
                <nobr>Law Firm Name</nobr>
              </span>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                placeholder="Enter Law Firm Name"
                value={form.law_first_name}
                className="form-control"
                name="law_first_name"
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
              <span className="d-inline-block text-grey"></span>
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

export default LawFirmTablePopUp;
