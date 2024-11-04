import React, { useCallback, useEffect, useMemo, useState } from "react";
import { currencyFormat } from "../../Utils/helper";
import EditEnvelopeCostModal from "./EditEnvelopeCostModal";
import { shallowEqual, useSelector } from "react-redux";
import api from "../../api/api";
import axios from "axios";
import { getToken } from "../../Utils/helper";

const fetchEnvelopeCost = async (caseId) => {
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken();
  if (!caseId) {
    return { error: "Invalid caseId provided" };
  }

  try {
    const response = await axios.get(`${origin}/api/cost-envelope/${caseId}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    });
    return { data: response.data };
  } catch (error) {
    console.error("Error fetching envelope cost", error);
    return { error: error.message || "Unknown error occurred" };
  }
};

const EnvelopeCostComponent = ({ envelopeCostState, onUpdate }) => {
  const currentCase = useSelector(
    (state) => state?.caseData?.current,
    shallowEqual
  );

  const [showEnvelopeModal, setShowEnvelopeModal] = useState(false);
  const [envelopeCost, setEnvelopeCost] = useState(envelopeCostState);

  const handleEditEnvelope = () => {
    setShowEnvelopeModal(true);
  };

  const formattedAmount = useMemo(() => {
    return currencyFormat(envelopeCost?.amount || 0);
  }, [envelopeCost?.amount]);

  // Fetch updated cost when the case ID changes
  useEffect(() => {
    if (!currentCase?.id) {
      console.error("Invalid case ID");
      return;
    }

    fetchEnvelopeCost(currentCase.id).then((result) => {
      if (result.error) {
        console.error("Error fetching envelope cost:", result.error);
      } else {
        setEnvelopeCost(result.data);
      }
    });
  }, [currentCase?.id]);

  // Trigger onUpdate only when the modal closes after an update
  const onHide = useCallback(() => setShowEnvelopeModal(false), []);

  return (
    <React.Fragment>
      <EditEnvelopeCostModal
        show={showEnvelopeModal}
        envelopeCost={envelopeCost}
        onHide={onHide}
        onUpdate={(updatedCost) => {
          setEnvelopeCost(updatedCost);
          if (onUpdate) {
            onUpdate(updatedCost);
          }
        }}
      />
      <div
        style={{
          height: "25px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          marginTop: "-5px",
          marginBottom: "5px",
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            fontSize: "14px",
            fontWeight: "bolder",
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "5px",
            paddingRight: "5px",
            height: "25px",
            backgroundColor: "var(--primary)",
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          COST ENVELOPE
        </div>
        <div
          style={{
            boxSizing: "border-box",
            fontSize: "14px",
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "5px",
            paddingRight: "5px",
            height: "25px",
            backgroundColor: "var(--primary)",
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
          onClick={handleEditEnvelope}
        >
          Edit Envelope Cost
        </div>
        <div className="monospace-font">{formattedAmount}</div>
      </div>
    </React.Fragment>
  );
};

export default EnvelopeCostComponent;
