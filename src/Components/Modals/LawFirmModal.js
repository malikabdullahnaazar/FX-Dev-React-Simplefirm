import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addLawFirm } from "../../Redux/law-firm/lawFirmSlice";
const initialState = {
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
};
function LawFirmModal({ lawFirmPopUp, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const [stateData, setStateData] = useState([]);
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
      setError(err.message);
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

  const handleLawFirmSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/add/law/firm/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      dispatch(addLawFirm(response.data.data));
      handleClose();
      setForm(initialState);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`modal generic-popup generic-popup-scroll fade bd-example-modal-md ${lawFirmPopUp ? "show" : ""}`}
      style={{
        backgroundColor: "rgba(40, 80, 122, 0.5)",
        zIndex: 100000,
        display: lawFirmPopUp ? "flex" : "none",
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
              <h5 className="modal-title mb-2 mx-auto">Law Firm</h5>
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
                onClick={handleLawFirmSubmit}
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

export default LawFirmModal;
