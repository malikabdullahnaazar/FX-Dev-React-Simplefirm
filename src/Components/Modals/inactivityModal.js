import React from "react";
import InactivityModalBody from "./inactivityModalBody";
import Modal from "react-bootstrap/Modal";

const InactivityModal = (props) => {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <InactivityModalBody timeoutTime={props.timeoutTime} hideModal={props.onHide} />
    </Modal>
  );
};

export default InactivityModal;
