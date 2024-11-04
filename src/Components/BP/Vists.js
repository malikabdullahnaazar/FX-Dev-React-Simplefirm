import React, { useState, useEffect } from 'react'
import axios from 'axios';
import VerificationIcon from './VerificationIcon'
import LastVerificationIcon from './LastVerificationIcon'
import VisitVerificationIcon from './VisitVerificationIcon'
import avatarImage from './../../assets/images/avatar.svg';

function Vists({ caseProvider_id, visits, dates, setdates, handleShow, caseId, onUpdate,
    isTreatmentDateFirstVerified,
    setIsTreatmentDateFirstVerified,
    isTreatmentDateLastVerified,
    setIsTreatmentDateLastVerified,
    isTreatmentDateVisitVerified,
    setIsTreatmentDateVisitVerified,
}) {

    const origin = process.env.REACT_APP_BACKEND_URL;

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    return (

        <>
            <p onClick={handleShow}
                className="d-flex align-items-center margin-left-low text-md-grey cursor-pointer h-100 dates-wrapper">
                <span className="d-flex">
                    <span className="d-flex align-items-center mr-2 date-col">
                        
                        <VerificationIcon caseProvider_id={caseProvider_id} arg={'CaseProviders-first_date'}
                            isTreatmentDateFirstVerified={isTreatmentDateFirstVerified}
                            setIsTreatmentDateFirstVerified={setIsTreatmentDateFirstVerified} 
                            dates={dates}
                            />
                    </span>
                </span>

                <span className="d-flex align-items-center mr-2 date-col">
                    
                    <LastVerificationIcon
                        caseProvider_id={caseProvider_id}
                        arg={'CaseProviders-second_date'}
                        isTreatmentDateLastVerified={isTreatmentDateLastVerified}
                        setIsTreatmentDateLastVerified={setIsTreatmentDateLastVerified}
                        dates={dates}
                    />
                </span>
                <span className="d-flex align-items-center mr-2 date-col">
                    
                    <VisitVerificationIcon caseProvider_id={caseProvider_id} arg={'CaseProviders-visits'}
                        isTreatmentDateVisitVerified={isTreatmentDateVisitVerified}
                        setIsTreatmentDateVisitVerified={setIsTreatmentDateVisitVerified}
                        visits={visits}
                        />
                </span>
            </p>
        </>
    )
}

export default Vists
