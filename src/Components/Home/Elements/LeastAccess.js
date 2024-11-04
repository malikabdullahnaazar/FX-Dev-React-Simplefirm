import React from "react";
import {
  standardFormatDate,
} from "../../../Utils/helper";

const LeastAccess = ({ chats }) => {
  const least_cases = chats.filtered_cases || []; // Default to an empty array if not present

  // Helper function to check if a string contains letters or words after trimming
  const isValidName = (str) => {
    return str && str.trim().length > 0 && /[a-zA-Z]/.test(str.trim());
  };

  // Set to track unique cases by the combination of client name and case type
  const renderedCases = new Set();

  return (
    <div className="column order-2 order-xxl-1 d-flex flex-column m-b-5">
      <div className="background-main-10 height-21">
        <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
          Cases Least Accessed
        </h4>
      </div>
      <div className="table-responsive table--no-card position-relative border-0 has-tint-rows has-tint-h-35 flex-g-1">
        {least_cases.length > 0 ? (
          <table className="table table-earning position-relative z-index-1 position-relative">
            <thead className="d-none">
              <tr>
                <th scope="col" className="width-1"></th>
                <th className="width-6-padding-left-42">Client</th>
                <th className="width-6">Last Accessed</th>
              </tr>
            </thead>
            <tbody id="group_chat_body">
              {least_cases.map((caseData, index) => {
                const { id, for_client, case_type, incident_date } = caseData;
                const { first_name, last_name, profile_pic } = for_client || {};

                // Check if both first_name and last_name are valid (contains at least one letter after trimming)
                const isValidFirstName = isValidName(first_name);
                const isValidLastName = isValidName(last_name);

                // Create a unique identifier for the case using client name and case type
                const uniqueCaseIdentifier = `${first_name?.trim()} ${last_name?.trim()} - ${case_type?.name}`;

                // Only render the case if both first and last names are valid, and the case hasn't been rendered before
                if (
                  isValidFirstName &&
                  isValidLastName &&
                  !renderedCases.has(uniqueCaseIdentifier)
                ) {
                  // Mark this case as rendered by adding the unique identifier to the set
                  renderedCases.add(uniqueCaseIdentifier);

                  const renderClientName = `${first_name.trim()} ${last_name.trim()}`;
                  return (
                    <tr
                      key={id}
                      onClick={() =>
                        (window.location.href = `/bp-case/${client_id}/${case_id}`)
                      }
                      style={{textAlign: "start"}}
                    >
                      <td scope="row">{index + 1}</td>
                      <td className="text-black">
                        <div className="td-autosize d-flex align-items-center">
                          <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img bg-white">
                            <img src={profile_pic} className="theme-ring" />
                          </span>
                          <span className="ml-2 text-black">
                            <span className="client-type d-block">
                              {renderClientName}
                            </span>
                            <span
                              className="case-type d-block font-weight-600 nowrap"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {case_type?.name?.trim() || ""}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="td-autosize">
                        {incident_date ? standardFormatDate(incident_date) : ""}
                      </td>
                    </tr>
                  );
                }

                // If the case is already rendered or has invalid names, skip rendering this row
                return null;
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-center m-5"></p>
        )}
      </div>
    </div>
  );
};

export default LeastAccess;
