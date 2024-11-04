import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RoleSelectionModal = ({
  show,
  handleClose,
  handleSave,
  userRoles,
  userId,
}) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [hourlyRates, setHourlyRates] = useState({});

  const handleCheckboxChange = (role) => {
    setSelectedRoles((prevSelected) =>
      prevSelected.includes(role)
        ? prevSelected.filter((r) => r !== role)
        : [...prevSelected, role]
    );
  };

  const handleHourlyRateChange = (roleId, rate) => {
    setHourlyRates((prevRates) => ({
      ...prevRates,
      [roleId]: rate,
    }));
  };

  const handleSaveRoles = () => {
    const payload = userRoles.reduce((acc, role) => {
      acc[role.id] = selectedRoles.includes(role.id);

      acc[`hourly_rate_${role.id}`] = selectedRoles.includes(role.id)
        ? parseFloat(hourlyRates[role.id]) || 0.0
        : 0.0;

      return acc;
    }, {});

    payload.user_id = userId;

    handleSave(payload);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "15px" }}>
          Check the boxes of all the roles this Firm User can hold in the firm
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {userRoles?.map((role) => (
            <div
              key={role.id}
              className="d-flex justify-content-between align-items-center m-b-5"
              style={{ width: "100%" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ flexBasis: "50%" }}
              >
                <Form.Check
                  type="checkbox"
                  label={role.name}
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => handleCheckboxChange(role.id)}
                  style={{ flexShrink: 0 }}
                />
              </div>
              <div style={{ flexBasis: "45%" }}>
                <Form.Control
                  type="text"
                  placeholder="Enter Hourly Rate"
                  value={hourlyRates[role.id] || ""}
                  onChange={(e) =>
                    handleHourlyRateChange(role.id, e.target.value)
                  }
                  disabled={!selectedRoles.includes(role.id)}
                />
              </div>
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveRoles}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoleSelectionModal;
