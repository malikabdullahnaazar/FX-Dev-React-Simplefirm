import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import InputWithOutLabels from "../../common/InputWithoutLabel";
import { useEditSaveAddress, useSaveAddress } from "../hooks/useFirmAddress";

const AddEditModal = ({
  showModal,
  handleClose,
  data,
  refetch,
  isEdit = false,
  filledData = {},
}) => {
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");

  const { saveAddress } = useSaveAddress();
  const { editAddress } = useEditSaveAddress();
  useEffect(() => {
    if (isEdit && filledData) {
      setAddress1(filledData?.address1 || "");
      setAddress2(filledData?.address2 || "");
      setCity(filledData?.city || "");
      setZip(filledData?.zip || "");
      setState(filledData?.state || "");
    }
  }, [isEdit, filledData]);

  const ModalData = [
    {
      name: "Address 1",
      value: address1,
      onChange: (e) => setAddress1(e.target.value),
    },
    {
      name: "Address 2",
      value: address2,
      onChange: (e) => setAddress2(e.target.value),
    },
    {
      name: "City",
      value: city,
      onChange: (e) => setCity(e.target.value),
    },
    {
      name: "State",
      value: state,
      onChange: (e) => setState(e.target.value),
    },
    {
      name: "Zip",
      value: zip,
      onChange: (e) => setZip(e.target.value),
    },
  ];

  const handleSubmit = async () => {
    const payload = {
      firm_address1: address1,
      firm_address2: address2,
      firm_city: city,
      firm_state: state,
      firm_zip: zip,
    };

    try {
      if (isEdit) {
        payload.contact_id = filledData?.id;

        await editAddress(payload);
      } else {
        await saveAddress(payload);
      }
      refetch();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal size="lg" show={showModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title style={{ fontSize: "15px" }}>
          {isEdit ? "Edit Address" : "Add Address"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {ModalData.map((inputData, idx) => {
          if (inputData.name === "State") {
            return (
              <div className="row align-items-center form-group" key={idx}>
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    {inputData.name}:{" "}
                  </span>
                </div>
                <div className="col-md-10">
                  <select
                    value={inputData.value}
                    onChange={inputData.onChange}
                    className="form-select"
                  >
                    <option value="">Select a State</option>
                    {data?.states?.map((state) => (
                      <option key={state.id} value={state.stateAbr}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          } else {
            return (
              <div className="row align-items-center form-group" key={idx}>
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    {inputData.name}:{" "}
                  </span>
                </div>
                <InputWithOutLabels
                  cn="col-md-10"
                  placeholder={`Enter ${inputData.name}`}
                  type={"text"}
                  value={inputData.value}
                  onChange={inputData.onChange}
                />
              </div>
            );
          }
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          {isEdit ? "Update Address" : "Save Address"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditModal;
