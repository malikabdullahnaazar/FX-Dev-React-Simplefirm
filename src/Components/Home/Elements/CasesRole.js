import React from "react";

const CasesRole = (chats) => {
  const case_role = chats.chats;
  return (
    <>
      <div className="background-main-10 height-21">
        <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
          Case Roles
        </h4>
      </div>
      <ul className="list-unstyled list-with-big-numbers">
        {case_role.supervisorCount > 0 && (
          <li>
            <span className="number">{case_role.supervisorCount}</span>
            <span className="text">Supervising Attorney</span>
          </li>
        )}
        {case_role.litigationAttorneyCount > 0 && (
          <li>
            <span className="number">{case_role.litigationAttorneyCount}</span>
            <span className="text">Litigation Attorney</span>
          </li>
        )}
        {case_role.paralegalCount > 0 && (
          <li>
            <span className="number">{case_role.paralegalCount}</span>
            <span className="text">Paralegal</span>
          </li>
        )}
        {case_role.caseManagerCount > 0 && (
          <li>
            <span className="number">{case_role.caseManagerCount}</span>
            <span className="text">Case Manager</span>
          </li>
        )}
        {case_role.caseAssistantCount > 0 && (
          <li>
            <span className="number">{case_role.caseAssistantCount}</span>
            <span className="text">Case Assistant</span>
          </li>
        )}
        {case_role.intakeCount > 0 && (
          <li>
            <span className="number">{case_role.intakeCount}</span>
            <span className="text">Intake</span>
          </li>
        )}
      </ul>
    </>
  );
};
export default CasesRole;
