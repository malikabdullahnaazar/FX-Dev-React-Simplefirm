import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";
import { deleteTimeCode, fetchTimeCode, updateTimeCode } from "../../Redux/time-code/timeCodeSlice";
function TimeCodePopUp({
  timeCodesPopup,
  handleClose,
  handleDelete,
  handleSave,
  timecode,
}) {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const dispatch = useDispatch();
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  // const clientId = useSelector((state) => state?.client?.current.id);

  const origin = process.env.REACT_APP_BACKEND_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    bill_code_category: "",
    bill_code_category_name: "",
    bill_code_name: "",
    bill_code: "",
    bill_code_definition: "",
  });

  useEffect(() => {
    if (timecode) {
      setForm({
        bill_code_category: timecode.bill_code_category || "",
        bill_code_category_name: timecode.bill_code_category_name || "",
        bill_code: timecode.bill_code || "",
        bill_code_name: timecode.bill_code_name || "",
        bill_code_definition: timecode.bill_code_definition || "",
      });
    }
  }, [timecode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleDeleteCode = () => {
    if (timecode && timecode.id) {
      handleDelete(timecode.id);
    }
  };

  const handleSaveClick = async () => {
    setLoading(true);

    try {
      const updatedTimeCode = {
        ...timecode,
        id: timecode.id,
        bill_code_category: form.bill_code_category,
        bill_code_category_name: form.bill_code_category_name,
        bill_code: form.bill_code,
        bill_code_name: form.bill_code_name,
        bill_code_definition: form.bill_code_definition,
      };

      try {
        const response = await axios.patch(
          `${origin}/api/add/time/code/${clientId}/${currentCaseId}/`,
          updatedTimeCode
        );
        console.log("Response Data:", response.data);
        dispatch(updateTimeCode({
          id: timecode.id,
          updatedData: response.data.data
        }));
        
        handleSave(response.data.data);
        
      } catch (error) {
        console.error("Error updating insurance company:", error.message);
        console.error("Error Response:", error.response); // Add this line to get more details about the error
      }
    } catch (err) {
      setError(err);
      alert("An error occurred while updating the time code.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    try {
      console.log("Deleted", timecode.id);

      const response = await axios.delete(
        `${origin}/api/add/time/code/${clientId}/${currentCaseId}/`,
        {
          data: {
            id: timecode.id,
          },
        }
      );
      // dispatch(deleteTimeCode(timecode.id));
      await dispatch(
        fetchTimeCode(
          `${origin}/api/add/time/code/${clientId}/${currentCaseId}/`
        )
      );
      handleDelete(response.data.data);
    } catch (error) {
      console.error("Error deleting insurance company:", error.message);
    }
  };

  return (
    <Modal
      show={timeCodesPopup ? true : false}
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
            <h5 className="modal-title mb-2 mx-auto" id="">
              Time Codes
            </h5>
          </div>

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
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary h-35px"
              data-dismiss="modal"
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
              {loading ? "Submitting..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TimeCodePopUp;
