import React from 'react';
import {
    calculateAge,
    formatDate,
  } from "../../../Utils/helper";
  import "./customStyle.css"

const ClientDetailsHeading = ({ client, caseSummary, parseDate, errorMsg, selectedTab }) => {

  return (
    <div className="container-fluid py-2" style={{backgroundColor:" var(--primary-5)"}}>
     <div
        className="customAlign"   >
      <DetailHeading label="First Name" value={client?.first_name} />
      <DetailHeading label="Last Name" value={client?.last_name} />
      <DetailHeading label="Case Type" value={caseSummary?.case_type?.name} />
      <DetailHeading label="Age" value={calculateAge(client?.birthday)} />
      <DetailHeading label="Birthday" value={client?.birthday ? formatDate(client.birthday) : ""} />
      <DetailHeading label="Incident Date" value={formatDate(caseSummary?.incident_date)} />
    </div>
  </div>
  );
};

// Reusable detail component with heading
const DetailHeading = ({ label, value }) => (
  <div className="d-flex align-items-center mx-4 minWidth">
    <h6 className="mr-2 text-muted" style={{  fontSize: "16px" }}>
      {label}:
    </h6>
    <h6 className="mb-0" style={{ fontSize: "16px" }}>
      {value || "N/A"}
    </h6>
  </div>
);

export default ClientDetailsHeading;
