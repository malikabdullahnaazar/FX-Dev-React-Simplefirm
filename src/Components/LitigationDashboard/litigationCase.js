import React, { useState, useEffect } from 'react';
import "../../../public/BP_resources/css/litigation.css";
import LitigationCasePopUp from '../Modals/LitigationCasePopUp';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import useIsStates from '../../Hooks/getStates';

export default function LitigationCase({ caseInfo, states = [] }) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin = node_env === 'production' ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [showPopup, setShowPopup] = useState(false)
  const [currentStateId, setCurrentStateID] = useState(null);

  // Use useEffect to set state_id when the component first renders
  useEffect(() => {
    // Check if current_state is defined and there are states available
    if (caseInfo?.state && states.length > 0) {
      // Find the state in the array that matches the current_state value
      const matchedState = states.find(state => state.name === caseInfo?.state);
      if (matchedState) {
        setCurrentStateID(matchedState.id); // Set state_id to the matched state's id
      }
    }
  }, [caseInfo?.state, states]);

  const handleCaseClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };


  // Media queries
  const isSmallestCards = useMediaQuery({ minWidth: 2400 });
  const isSmallerCards = useMediaQuery({ minWidth: 2100, maxWidth: 2350 });
  const isSmallCards = useMediaQuery({ minWidth: 1850, maxWidth: 2100 });
  const isBigCards = useMediaQuery({ minWidth: 1650, maxWidth: 1850 });
  const isBiggerCards = useMediaQuery({ minWidth: 1450, maxWidth: 1650 });
  const isBiggestCards = useMediaQuery({ minWidth: 1050, maxWidth: 1450 });

  const truncateName = (item) => {
    if (item && item.length > 12) {
      return <span title={item}>
        {item.slice(0, 10) + "..."}
      </span>
    }
    return <span>{item}</span>;
  };

  const headingFullName = "Full Case Name:";

  return (
    <div className="dynamic-width-litigation d-flex flex-column p-0 p-r-5 height-100">
      <div className="information-wrapper-litigation">
        <div onClick={handleCaseClick} style={{ cursor: 'pointer' }}>
          <div className="text-left p-l-5 p-r-5">
            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase height-10">
              Case
            </p>
            <p className="d-flex justify-content-between">
              <span className="gray-label mr-1 font-weight-normal">Case Name:</span>
              <span className="text-right">{caseInfo?.case_name || ''}</span>
            </p>
            <p className="columnsTitle-litigation d-flex justify-content-between">
              <span className="gray-label mr-1 font-weight-normal">Case Number:</span>
              <span className="text-right">{caseInfo?.case_number || ''}</span>
            </p>
            <div>
              <p className="colFont m-0 font-weight-semibold info_address d-flex justify-content-between">
                <span className="gray-label mr-1 font-weight-normal">Court Title 1:</span>
                <span className="text-right">{caseInfo?.court_title1 || ''}</span>
              </p>
              <p className="colFont m-0 font-weight-semibold info_city_state_zip d-flex justify-content-between">
                <span className="gray-label mr-1 font-weight-normal">Court Title 2:</span>
                <span className="text-right">{caseInfo?.court_title2 || ''}</span>
              </p>
            </div>
            <p className="colFont m-0 font-weight-semibold info_phone_number text-black d-flex justify-content-between">
              <span className="gray-label mr-1 font-weight-normal">Court Name:</span>
              <span className="text-right">{caseInfo?.court_name || ''}</span>
            </p>
            <p className="colFont m-0 font-weight-semibold d-flex justify-content-between">
              <span className="gray-label mr-1 font-weight-normal">Venue:</span>
              <span className="text-right">
                {caseInfo?.county || ''} <small className="text-grey">County,</small> {caseInfo?.state || ''}, <small className="text-grey">{isBigCards || isBiggerCards || isBiggestCards ? truncateName(caseInfo?.filing_type || '') : caseInfo?.filing_type || ''}</small>
              </span>
            </p>
            <p className="colFont info_phone_number text-black d-flex justify-content-between">
              <span className="gray-label mr-1 font-weight-normal">
                {isBigCards || isBiggerCards || isBiggestCards ? truncateName(headingFullName) : headingFullName}
              </span>
              <span className="text-right">
                {isBigCards || isBiggerCards || isBiggestCards ? truncateName(caseInfo?.case_full_name || '') : caseInfo?.case_full_name || ''}
              </span>
            </p>
          </div>
        </div>
        {showPopup && (
          <LitigationCasePopUp
            showPopup={showPopup}
            handleClose={handleClosePopup}
            litigation_id={caseInfo?.litigation_id}
            current_shortCaseTitle={caseInfo?.case_short_name}
            current_longCaseTitle={caseInfo?.case_full_name}
            current_caseNumber={caseInfo?.case_number}
            current_state_id={currentStateId}
            current_county={caseInfo?.county}
            states={states}
          />
        )}
      </div>
    </div>
  );
}
