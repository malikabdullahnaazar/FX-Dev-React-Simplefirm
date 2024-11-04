import React, { useEffect, useState, useRef } from "react";
import "../../../public/BP_resources/css/litigation.css";
import Button from "../ClientDashboard/shared/button";
import LitigationCourtPopUp from "../Modals/LitigationCourtPopUp";
import axios from 'axios';
import useIsStates from "../../Hooks/getStates";
import GenrateDocument from "../GenrateDocument/GenrateDocument";

export default function LitigationCourtInfo({ Court, states = [] }) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin = node_env === 'production' ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [searchData, setSearchData] = useState([]); // Search data from API

  useEffect(() => {
    const getSearchData = async () => {
      try {
        const response = await axios.get(`${origin}/api/search_filter_expert/`, {
          headers: {
            Authorization: token,
          },
        });
        setSearchData(response.data)
      } catch (error) {
        console.error('Error:', error);
      }
    }
    getSearchData();
  }, []);

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
    setInstanceIdForGenragteDoc(Court?.litigation_id);
    setShowDocument(true);
  };

  return (
    <div
      className="dynamic-width-litigation d-flex flex-column p-0 p-r-5 width-260 H1-35PX "
    >
      <div className="information-wrapper-litigation">
        {/* <div data-toggle="modal" data-target="#court-details-modal"> */}
        <div onClick={handleCaseClick} style={{ cursor: "pointer" }}>
          <div className="text-left p-l-5 p-r-5 gapleft">
            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
              Court
            </p>
            <p className="columnsTitle">
              {Court?.court_name ? (
                Court?.court_name
              ) : (
                <span className="text-primary-20">Court Name</span>
              )}
            </p>
            <div>
              <p className="colFont m-0 font-weight-semibold info_address">
                {Court?.court_contact?.address1 || Court?.court_contact?.address2 ? (
                  <>
                    <div className="col-value colFonts text-left col-title min-h-0 mb-0">
                      {Court?.court_contact?.address1 && (
                        <span>{Court?.court_contact?.address1}</span>
                      )}
                      {Court?.court_contact?.address2 && (
                        <span>{Court?.court_contact?.address1 && ","} {Court?.court_contact?.address2}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-primary-20">Address</div>
                )}
              </p>
              <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                {Court?.court_contact?.city ? (
                  <span>{Court?.court_contact?.city},</span>
                ) : (
                  <span className="text-primary-20">City,</span>
                )}
                {Court?.court_contact?.state ? (
                  <span>{Court?.court_contact?.state.toUpperCase()+" "}</span>
                ) : (
                  <span className="text-primary-20">State </span>
                )}
                ,
                {Court?.court_contact?.zip ? (
                  Court?.court_contact?.zip
                ) : (
                  <span className="text-primary-20">Zip</span>
                )}
              </p>
            </div>
            {Court?.court_contact?.phone_number ? (
              <p className="colFont info_phone_number text-black">
                {Court?.court_contact?.phone_number}
              </p>
            ) : (
              <p className="colFont info_phone_number text-black">
                <span className="text-primary-20">(###) ###-####</span>
              </p>
            )}
            {Court?.court_contact?.fax ? (
              <p className="colFont info_fax">
                <small>(</small>
                {Court?.court_contact?.fax.slice(0, 3)}
                <small>)</small>
                {Court?.court_contact?.fax.slice(3, 6)}-
                {Court?.court_contact?.fax.slice(6)}
                <small className="ml-2 text-grey">fax</small>
              </p>
            ) : (
              <p className="colFont info_fax">
                <span className="text-primary-20">(###) ###-####</span>
              </p>
            )}
          </div>
        </div>
        <div className={Court?.court_contact?.email ? "m-t-18" : "m-t-45"}>
          {Court?.court_contact?.email &&
            <div>
              <div>
                <Button
                  showButton={true}
                  icon={"ic ic-19 ic-email-3d m-r-5"}
                  buttonText={`${Court?.court_contact?.email}`}
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
          <LitigationCourtPopUp
            litigation_id={Court?.litigation_id}
            contact_id={Court?.court_contact?.current_id}
            current_name={Court?.court_name}
            current_title1={Court?.court_title1}
            current_title2={Court?.court_title2}
            current_address1={Court?.court_contact?.address1}
            current_address2={Court?.court_contact?.address2}
            current_city={Court?.court_contact?.city}
            current_state={Court?.court_contact?.state}
            current_zip={Court?.court_contact?.zip}
            current_phone={Court?.court_contact?.phone_number}
            current_fax={Court?.court_contact?.fax}
            current_email={Court?.court_contact?.email}
            showPopup={showPopup}
            handleClose={handleClosePopup}
            states={states}
            searchData={searchData}
          />
        )}
      </div>
    </div>
  );
}
