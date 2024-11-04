import React from "react";
import {
  standardFormatDate,
} from "../../../Utils/helper";

const ExpireStatute = (chats) => {
  const litigation_acts = chats.chats.litigation_acts || [];
  const isValidName = (str) => {
    return str && str.trim().length > 0 && /[a-zA-Z]/.test(str.trim());
  };
  return (
    <div class="column order-1 order-xxl-2 d-flex flex-column m-b-5">
      <div class="background-main-10 height-21">
        <h4 class="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
          Expiring Statute of Limitations
        </h4>
      </div>
      <div class="table-responsive table--no-card position-relative  border-0 has-tint-rows has-tint-h-35 flex-g-1">
        {litigation_acts.length > 0 ? (
          <table class="table table-earning position-relative z-index-1 position-relative">
            <thead class="d-none">
              <tr>
                <th scope="col" class="width-1"></th>
                <th class="width-6-padding-left-42">Client</th>
                <th class="width-6">S.O.L</th>
              </tr>
            </thead>
            <tbody id="group_chat_body">
              {litigation_acts.map((caseData, index) => {
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
                        (window.location.href = `/bp-client/${client_id}/${case_id}`)
                      }
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
                        {end_date ? standardFormatDate(end_date) : ""}
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

export default ExpireStatute;
