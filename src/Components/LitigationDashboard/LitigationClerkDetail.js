import React, { useEffect, useState, useRef } from "react";
import "../../../public/BP_resources/css/litigation.css";
import Button from "../ClientDashboard/shared/button";
import LitigationClerkPopUp from "../Modals/LitigationClerkPopUp";
import axios from 'axios';
import useIsStates from "../../Hooks/getStates";
import GenrateDocument from "../GenrateDocument/GenrateDocument";

export default function LitigationClerkInfo({ Clerk, states = [] }) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin = node_env === 'production' ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [showPopup, setShowPopup] = useState(false);

  const handleCaseClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const templatePopUp = (params) => {
    // Add your templatePopUp function here
  };

  const [showDocument, setShowDocument] = useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);

  const handleGenrateDocument = () => {
    setInstanceIdForGenragteDoc(Clerk?.litigation_id);
    setShowDocument(true);
  };

  return (
    <div className="dynamic-width-litigation d-flex flex-column p-0 p-r-5 width-260">
      <div className="information-wrapper-litigation">
        {/* <div data-toggle="modal" data-target="#clerk-department-modal"> */}
        <div onClick={handleCaseClick} style={{ cursor: "pointer" }}>
          <div className="text-left p-l-5 p-r-5">
            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
              Department Clerk
            </p>
            <p className="columnsTitle">
              {Clerk?.clerk_first_name ? (
                `${Clerk?.clerk_first_name} ${Clerk?.clerk_last_name}`
              ) : (
                <span className="text-primary-20">Clerk Name</span>
              )}{" "}
              and{" "}
              {Clerk?.department ? (
                Clerk?.department
              ) : (
                <span className="text-primary-20">Department</span>
              )}
            </p>
            <div>
              <p className="colFont m-0 font-weight-semibold info_address">
                {Clerk?.clerk_department_contact?.address1 || Clerk?.clerk_department_contact?.address2 ? (
                  <>
                    <div className="col-value colFonts text-left col-title min-h-0 mb-0">
                      {Clerk?.clerk_department_contact?.address1 && (
                        <span>{Clerk?.clerk_department_contact?.address1}</span>
                      )}
                      {Clerk?.clerk_department_contact?.address2 && (
                        <span>{Clerk?.clerk_department_contact?.address1 && ","} {Clerk?.clerk_department_contact?.address2}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-primary-20">Address</div>
                )}
              </p>
              <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                {Clerk?.clerk_department_contact?.city ? (
                  <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{Clerk?.clerk_department_contact?.city}, </span>
                ) : (
                  <span className="text-primary-20">City, </span>
                )}
                {Clerk?.clerk_department_contact?.state ? (
                  <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{Clerk?.clerk_department_contact?.state + " "}</span>
                ) : (
                  <span className="text-primary-20">State </span>
                )}
                {Clerk?.clerk_department_contact?.zip ? (
                  <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{Clerk?.clerk_department_contact?.zip}</span>
                ) : (
                  <span className="text-primary-20">Zip</span>
                )}
              </p>
            </div>
            {Clerk?.clerk_department_contact?.phone_number ? (
              <p className="colFont info_phone_number text-black">
                {Clerk?.clerk_department_contact?.phone_number}
              </p>
            ) : (
              <p className="colFont info_phone_number text-black">
                <span className="text-primary-20">(###) ###-####</span>
              </p>
            )}
            {Clerk?.clerk_department_contact?.fax ? (
              <p className="colFont info_fax">
                <small>(</small>
                {Clerk?.clerk_department_contact?.fax.slice(0, 3)}
                <small>)</small>
                {Clerk?.clerk_department_contact?.fax.slice(3, 6)}-
                {Clerk?.clerk_department_contact?.fax.slice(6)}
                <small className="ml-2 text-grey">fax</small>
              </p>
            ) : (
              <p className="colFont info_fax">
                <span className="text-primary-20">(###) ###-####</span>
              </p>
            )}
          </div>
        </div>
        {/*{litigation?.clerk_department_contact?.email ? (
                    <a href="#" className="btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-t-15 m-b-5 p-l-6 p-r-6 mt-auto">
                        <i className="ic ic-19 ic-email-3d m-r-5"></i>
                        {litigation?.clerk_department_contact?.email}
                    </a>
                ) : (
                    <p className="btn btn-primary-lighter rounded-0 height-25 d-flex align-items-center justify-content-center m-b-5">
                        <i className="ic ic-19 ic-email-3d"></i>
                    </p>
                )}*/}
        <div className={Clerk?.clerk_department_contact?.email ? "m-t-18" : "m-t-45"}>
          {Clerk?.clerk_department_contact?.email &&
            <div>
              <div>
                <Button
                  showButton={true}
                  icon={"ic ic-19 ic-email-3d m-r-5"}
                  buttonText={`${Clerk?.clerk_department_contact?.email}`}
                />
              </div>
            </div>
          }
          <div>
            <div onClick={handleGenrateDocument}>
              <Button
                showButton={true}
                icon={"ic ic-19 ic-generate-document m-r-5"}
                buttonText={"Generate Document"}
              />
            </div>
          </div>
        </div>
        {showDocument &&
          <GenrateDocument
            show={true}
            handleClose={() => setShowDocument(false)}
            PageEntity="litigation"
            instanceId={instanceIdForGenrateDoc}
          />
        }
        {showPopup && (
          <LitigationClerkPopUp
            litigation_id={Clerk?.litigation_id}
            contact_id={Clerk?.clerk_department_contact?.current_id}
            current_first_name={Clerk?.clerk_first_name}
            current_last_name={Clerk?.clerk_last_name}
            current_department={Clerk?.department}
            current_address1={Clerk?.clerk_department_contact?.address1}
            current_address2={Clerk?.clerk_department_contact?.address2}
            current_city={Clerk?.clerk_department_contact?.city}
            current_state={Clerk?.clerk_department_contact?.state}
            current_zip={Clerk?.clerk_department_contact?.zip}
            current_phone={Clerk?.clerk_department_contact?.phone_number}
            current_fax={Clerk?.clerk_department_contact?.fax}
            current_email={Clerk?.clerk_department_contact?.email}
            showPopup={showPopup}
            handleClose={handleClosePopup}
            states={states}
          />
        )}
      </div>
    </div>
  );
}
