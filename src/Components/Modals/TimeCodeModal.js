import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { addTimeCode, fetchTimeCode } from "../../Redux/time-code/timeCodeSlice";

const initialState = {
  bill_code_category: "",
  bill_code_category_name: "",
  bill_code_name: "",
  bill_code: "",
  bill_code_definition: "",
};
function TimeCodeModal({ timeCodePopUp, handleClose }) {
  const tokenBearer = localStorage.getItem("token");
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  // const clientId = useSelector((state) => state?.client?.current.id);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialState);
  const dispatch = useDispatch()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleTimeCodeSubmit = async () => {

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${origin}/api/add/time/code/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            // 'Authorization': `Bearer ${token}`
            Authorization: tokenBearer,
          },
        }
      );


        const responseData = response.data.data;
        // dispatch(addTimeCode(responseData))
        await dispatch(
          fetchTimeCode(
            `${origin}/api/add/time/code/${clientId}/${currentCaseId}/`
          )
        );
        handleClose();
        setForm(initialState);
    } catch (err) {
      console.log(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`modal generic-popup generic-popup-scroll fade bd-example-modal-md ${timeCodePopUp ? "show" : ""}`}
      style={{
        backgroundColor: "rgba(40, 80, 122, 0.5)",
        zIndex: 100000,
        display: timeCodePopUp ? "flex" : "none",
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
                Add Time Codes
              </h5>
            </div>

            {/* <div class="row">
              <div class="col-md-12">
                <input
                  type="text"
                  onclick="search_filter_reports(this)"
                  placeholder="Type insurance company name to search directory then click an entry"
                  className="form-control mb-3"
                />
              </div>
            </div> */}

            <div className="row align-items-center form-group">
              <div className="col-md-4 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Bill Code Category</nobr>
                </span>
              </div>
              <div className="col-md-8">
                <input
                  type="text"
                  placeholder="Enter Code Category"
                  value={form.bill_code_category}
                  className="form-control"
                  name="bill_code_category"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-4 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Bill Code Category Name</nobr>
                </span>
              </div>
              <div className="col-md-8">
                <input
                  type="text"
                  placeholder="Enter Code Category Name"
                  value={form.bill_code_category_name}
                  className="form-control"
                  name="bill_code_category_name"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-4 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Bill Code</nobr>
                </span>
              </div>
              <div className="col-md-8">
                <input
                  type="text"
                  placeholder="Enter Code"
                  value={form.bill_code}
                  className="form-control"
                  name="bill_code"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-4 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Bill Code Name</nobr>
                </span>
              </div>
              <div className="col-md-8">
                <input
                  type="text"
                  placeholder="Enter Bill Code Name"
                  value={form.bill_code_name}
                  className="form-control"
                  name="bill_code_name"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row align-items-center form-group">
              <div className="col-md-4 text-left">
                <span className="d-inline-block text-grey">
                  <nobr>Bill Code Definition</nobr>
                </span>
              </div>
              <div className="col-md-8">
                <textarea
                  className="form-control"
                  value={form.bill_code_definition}
                  name="bill_code_definition"
                  rows="3"
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary float-left-margin-right-auto"
                onClick={() => {
                  handleClose();
                  setForm(initialState);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTimeCodeSubmit}
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

export default TimeCodeModal;
