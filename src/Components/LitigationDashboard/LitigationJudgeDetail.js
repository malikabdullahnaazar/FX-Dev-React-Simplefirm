import React, { useEffect, useState, useRef } from "react";
import "../../../public/BP_resources/css/litigation.css";
import Button from "../ClientDashboard/shared/button";
import JudgeandDepartmentPopUp from "../Modals/JudgeandDepartmentPopUp";
import axios from 'axios';
import useIsStates from "../../Hooks/getStates";
import GenrateDocument from "../GenrateDocument/GenrateDocument";

export default function LitigationJudgeInfo({ Judge, states = [] }) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin = node_env === 'production' ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");

  const templatePopUp = (params) => {
    // Add your templatePopUp function here
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleCaseClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const [showDocument, setShowDocument] = useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);

  const handleGenrateDocument = () => {
    setInstanceIdForGenragteDoc(Judge?.litigation_id);
    setShowDocument(true);
  };

  return (
    <div className="dynamic-width-litigation d-flex flex-column p-0 p-r-5 width-260">
      <div className="information-wrapper-litigation">
        {/* <div data-toggle="modal" data-target="#judge-department-modal"> */}
        <div onClick={handleCaseClick} style={{ cursor: "pointer" }}>
          <div className="text-left p-l-5 p-r-5">
            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
              Judge and Department
            </p>
            <p className="columnsTitle">
              {Judge?.judge_first_name ? (
                `${Judge?.judge_first_name} ${Judge?.judge_last_name}`
              ) : (
                <span className="text-primary-20">Judge Name</span>
              )}{" "}
              and{" "}
              {Judge?.department ? (
                Judge?.department
              ) : (
                <span className="text-primary-20">Department</span>
              )}
            </p>
            <div>
              <p className="colFont m-0 font-weight-semibold info_address">
              {Judge?.judge_department_contact?.address1 || Judge?.judge_department_contact?.address2 ? (
                  <>
                    <div className="col-value colFonts text-left col-title min-h-0 mb-0">
                      {Judge?.judge_department_contact?.address1 && (
                        <span>{Judge?.judge_department_contact?.address1}</span>
                      )}
                      {Judge?.judge_department_contact?.address2 && (
                        <span>{Judge?.judge_department_contact?.address1 && ","} {Judge?.judge_department_contact?.address2}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-primary-20">Address</div>
                )}
              </p>
              <p className="colFont m-0 font-weight-semibold info_city_state_zip">
              {Judge?.judge_department_contact?.city ? (
                  <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{Judge?.judge_department_contact?.city}, </span>
                ) : (
                  <span className="text-primary-20">City, </span>
                )}
                {Judge?.judge_department_contact?.state ? (
                  <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{Judge?.judge_department_contact?.state + " "}</span>
                ) : (
                  <span className="text-primary-20">State </span>
                )}
                {Judge?.judge_department_contact?.zip ? (
                  <span style={{ fontWeight: "600", color: "black", fontSize: "14px", lineHeight: "21px" }}>{Judge?.judge_department_contact?.zip}</span>
                ) : (
                  <span className="text-primary-20">Zip</span>
                )}
              </p>
            </div>
            {Judge?.judge_department_contact?.phone_number ? (
              <p className="colFont info_phone_number text-black">
                {Judge?.judge_department_contact?.phone_number}
              </p>
            ) : (
              <p className="colFont info_phone_number text-black">
                <span className="text-primary-20">(###) ###-####</span>
              </p>
            )}
            {Judge?.judge_department_contact?.fax ? (
              <p className="colFont info_fax">
                <small>(</small>
                {Judge?.judge_department_contact?.fax.slice(0, 3)}
                <small>)</small>
                {Judge?.judge_department_contact?.fax.slice(3, 6)}-
                {Judge?.judge_department_contact?.fax.slice(6)}
                <small className="ml-2 text-grey">fax</small>
              </p>
            ) : (
              <p className="colFont info_fax">
                <span className="text-primary-20">(###) ###-####</span>
              </p>
            )}
          </div>
        </div>
        {/*{litigation?.judge_department_contact?.email ? (
                    <a href="#" className="btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-t-15 m-b-5 p-l-6 p-r-6 mt-auto">
                        <i className="ic ic-19 ic-email-3d m-r-5"></i>
                        {litigation?.judge_department_contact?.email}
                    </a>
                ) : (
                    <p className="btn btn-primary-lighter rounded-0 height-25 d-flex align-items-center justify-content-center m-b-5">
                        <i className="ic ic-19 ic-email-3d"></i>
                    </p>
                )}*/}
        <div className={Judge?.judge_department_contact?.email ? "m-t-18" : "m-t-45"}>
          {Judge?.judge_department_contact?.email &&
            <div>
              <div>
                <Button
                  showButton={true}
                  icon={"ic ic-19 ic-email-3d m-r-5"}
                  buttonText={`${Judge?.judge_department_contact?.email}`}
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
          <JudgeandDepartmentPopUp
            litigation_id={Judge?.litigation_id}
            contact_id={Judge?.judge_department_contact?.current_id}
            current_first_name={Judge?.judge_first_name}
            current_last_name={Judge?.judge_last_name}
            current_department={Judge?.department}
            current_address1={Judge?.judge_department_contact?.address1}
            current_address2={Judge?.judge_department_contact?.address2}
            current_city={Judge?.judge_department_contact?.city}
            current_state={Judge?.judge_department_contact?.state}
            current_zip={Judge?.judge_department_contact?.zip}
            current_phone={Judge?.judge_department_contact?.phone_number}
            current_fax={Judge?.judge_department_contact?.fax}
            current_email={Judge?.judge_department_contact?.email}
            states={states}
            showPopup={showPopup}
            handleClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  );
}
