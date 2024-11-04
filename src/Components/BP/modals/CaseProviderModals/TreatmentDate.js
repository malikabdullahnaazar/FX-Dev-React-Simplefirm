import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import Avatar from '../../../../assets/images/avatar.png'
import TreatmentDatesRow from './TreatmentDatesRow'
import { getCaseId, getClientId, getToken } from "../../../../Utils/helper";

const TreatmentDate = forwardRef((props, ref) => {
    const {
    onUpdate,
    updateCall,
    handleClose,
    caseProvider,
    specialitie,
    isTreatmentDateFirstVerified,
    setIsTreatmentDateFirstVerified,
    isTreatmentDateLastVerified,
    setIsTreatmentDateLastVerified,
    isTreatmentDateVisitVerified,
    setIsTreatmentDateVisitVerified,
    allTreatmentDates,
    setAllTreatmentDates,
    isTreatmentCompleteVerified,
    setIsTreatmentCompleteVerified,
    contact
    } = props;

    const origin = process.env.REACT_APP_BACKEND_URL;
    const [treatmentDate, setTreatmentDate] = useState('');
    const [treatmentNotes, setTreatmentNotes] = useState('');

    const addTreatmentDate = async () => {
        try {
            const response = await axios.post(`${origin}/api/treatment/add_treatment_date/`, {
                case_provider_id: caseProvider.id,
                new_treatment_date: treatmentDate,
                new_treatment_notes: treatmentNotes,
            });
            if (response.data) {
                setAllTreatmentDates(prevDates => [...prevDates, response.data]);
            }
            setTreatmentDate('')
            setTreatmentNotes('')
        } catch (error) {
            console.error('Error:', error);
        }
    };

    console.log("caseProvider.treatment_complete :", caseProvider.treatment_complete)

    const [firstDate, setFirstDate] = useState(caseProvider.first_date ? caseProvider.first_date.split("T")[0] : '');
    const [lastDate, setLastDate] = useState(caseProvider.second_date ? caseProvider.second_date.split("T")[0] : '');
    const [visitCount, setVisitCount] = useState(caseProvider.visits || '');
    const [completeTreatment, setCompleteTreatment] = useState(caseProvider.treatment_complete || '');


    // Hasnat 

    useImperativeHandle(ref, () => ({
        save: async () => {
    // Updating case provider --  Hasnat
    try {
        const caseProviderResponse = await axios.put(`${origin}/api/treatment/update/case-provider/${caseProvider.id}/`, {
            first_appointment: firstDate,
            last_appointment: lastDate,
            visits: visitCount,
            treatment_complete: completeTreatment,
        });
        console.log("Case provider response data:", caseProviderResponse.data);
        if (caseProviderResponse.data) {
            console.log('Case provider information updated successfully!');
            onUpdate();
            handleClose()
        }
    } catch (error) {
        console.error('Error updating case provider:', error);
    }
}
}));

    function verify_unverify(arg) {
    
        const data = {
            client_id: 20,
            case_id: caseProvider.for_case,
            Arg: arg,
            case_provider_id: caseProvider.id,
        };
    
        const apiUrl = `${origin}/api/treatment/verify-unverify/`;

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: getToken(),
            }
        };
    
        axios.post(apiUrl, data, config)
            .then(response => {
                console.log('Response Treatment Date:', response.data);
                console.log("verification successful");
                updateCall();
                onUpdate();
                //handleClose()
            })
            .catch(error => {
                console.error('Error posting data:', error);
            });
    }

    function created_at_format(string_date) {
        const date = new Date(string_date);

        const options = {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        const formattedDateTime = date.toLocaleString('en-US', options);
        return formattedDateTime
    }


    return (
        <div className="tab-pane fade" id="treatment-dates-tab" role="tabpanel" aria-labelledby="treatment-dates-link">
            <div>
                
                    <input type="text" name="case_provider_id" hidden />
                    <div className='row'>
                        <div className='col-6'>
                            <div className="row align-items-center form-group">
                                <div className="col-md-2 text-left">
                                    <span className="d-inline-block text-grey">
                                        <nobr>First Appt.</nobr>
                                    </span>
                                </div>
                                <div className="col-md-10 d-flex">
                                    <input type="date" id="treatment_dates_first_date" class="form-control" 
                                        name="first_appointment" 
                                        value={firstDate}
                                        onChange={(e) => setFirstDate(e.target.value)}  />
                                    <div className="d-flex  align-items-center">
                                        <div className="icon-wrap ic-25 m-l-5 m-r-5">
                                        {isTreatmentDateFirstVerified.action ? (isTreatmentDateFirstVerified.action.toLowerCase() === 'verified' ?
                                    <i id="is_request_billing_recived_verified"
                                        className="ic ic-verified ic-25"></i>
                                    :
                                    <i id="is_request_billing_recived_verified"
                                        className="ic ic-unverified ic-25"></i>)
                                    :
                                    <i id="is_request_billing_recived_verified"
                                        className="ic ic-unverified ic-25"></i>
                                }
                                        </div>
                                        <button id="treatment_dates_first_date_verified_btn" 
                                        className="btn btn-primary rounded-0 height-35 d-flex align-items-center"
                                        onClick={() => verify_unverify('CaseProviders-first_date')}
                                            >
                                                {isTreatmentDateFirstVerified.action ? (isTreatmentDateFirstVerified.action.toLowerCase() === 'verified' ?
                                                    'Unverify'
                                                    :
                                                    'Verify')
                                                    :
                                                    'Verify'
                                                }

                                            </button>
                                    </div>
                                </div>
                                <div className="col-md-12 m-t-15 mt-2">
                                    <div className="bg-grey-100 height-35 d-flex align-items-center justify-content-center text-center">
                                        <p className="font-italic text-black d-flex align-items-center verification_note">
                                            <span id="treatment_dates_first_date_verified_date">
                                            {isTreatmentDateFirstVerified.action ? (isTreatmentDateFirstVerified.action.toLowerCase() === 'verified' ?
                                        created_at_format(isTreatmentDateFirstVerified.created_at)
                                        :
                                        null)
                                        :
                                        null
                                    }
                                            </span>
                                            <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1"><img
                                                src={Avatar} alt="" /></span>
                                            <span id="treatment_dates_first_date_verified_by">
                                            {isTreatmentDateFirstVerified.action ? (isTreatmentDateFirstVerified.action.toLowerCase() === 'verified' ?
                                        isTreatmentDateFirstVerified.verification_by + ' ip: ' + isTreatmentDateFirstVerified.ip_address
                                        :
                                        null)
                                        :
                                        null
                                    }
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className="row align-items-center form-group">
                                <div className="col-md-2 text-left">
                                    <span className="d-inline-block text-grey">
                                        <nobr>Last Appt.</nobr>
                                    </span>
                                </div>
                                <div className="col-md-10 d-flex">
                                    <input type="date" id="treatment_dates_last_date" class="form-control" 
                                        name="last_appointment" 
                                        value={lastDate}
                                        onChange={(e) => setLastDate(e.target.value)}  />
                                    <div className="d-flex  align-items-center">
                                        <div className="icon-wrap ic-25 m-l-5 m-r-5">
                                        {isTreatmentDateLastVerified.action ? (isTreatmentDateLastVerified.action.toLowerCase() === 'verified' ?
                                    <i id="is_request_billing_recived_verified"
                                        className="ic ic-verified ic-25"></i>
                                    :
                                    <i id="is_request_billing_recived_verified"
                                        className="ic ic-unverified ic-25"></i>)
                                    :
                                    <i id="is_request_billing_recived_verified"
                                        className="ic ic-unverified ic-25"></i>
                                }
                                        </div>
                                        <button id="treatment_dates_last_date_verified_btn" 
                                        className="btn btn-primary rounded-0 height-35 d-flex align-items-center"
                                        onClick={() => verify_unverify('CaseProviders-second_date')}
                                            >
                                                {isTreatmentDateLastVerified.action ? (isTreatmentDateLastVerified.action.toLowerCase() === 'verified' ?
                                                    'Unverify'
                                                    :
                                                    'Verify')
                                                    :
                                                    'Verify'
                                                }

                                            </button>
                                    </div>
                                </div>
                                <div className="col-md-12 m-t-15 mt-2">
                                    <div className="bg-grey-100 height-35 d-flex align-items-center justify-content-center text-center">
                                        <p className="font-italic text-black d-flex align-items-center verification_note">
                                            <span id="treatment_dates_last_date_verified_date">
                                            {isTreatmentDateLastVerified.action ? (isTreatmentDateLastVerified.action.toLowerCase() === 'verified' ?
                                        created_at_format(isTreatmentDateLastVerified.created_at)
                                        :
                                        null)
                                        :
                                        null
                                    }
                                            </span>
                                            <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                                                <img src={Avatar} alt="" /></span>
                                            <span id="treatment_dates_last_date_verified_by">
                                            {isTreatmentDateLastVerified.action ? (isTreatmentDateLastVerified.action.toLowerCase() === 'verified' ?
                                        isTreatmentDateLastVerified.verification_by + ' ip: ' + isTreatmentDateLastVerified.ip_address
                                        :
                                        null)
                                        :
                                        null
                                    }
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-6'>
                            <div className="row align-items-center form-group">
                                <div className="col-md-2 text-left">
                                    <span className="d-inline-block text-grey">
                                        <nobr>Visits #</nobr>
                                    </span>
                                </div>
                                <div className="col-md-10 d-flex">
                                    <input type="number" placeholder="Enter Visits" class="form-control" 
                                        name="no_of_visits"  id="treatment_dates_visits"
                                        value={visitCount}
                                        onChange={(e) => setVisitCount(e.target.value)}  />
                                    <div className="d-flex  align-items-center">
                                        <div className="icon-wrap ic-25 m-l-5 m-r-5">
                                        {isTreatmentDateVisitVerified.action ? (isTreatmentDateVisitVerified.action.toLowerCase() === 'verified' ?
                                    <i id="is_request_billing_recived_verified"
                                        className="ic ic-verified ic-25"></i>
                                    :
                                    <i id="is_request_billing_recived_verified"
                                        className="ic ic-unverified ic-25"></i>)
                                    :
                                    <i id="is_request_billing_recived_verified"
                                        className="ic ic-unverified ic-25"></i>
                                }
                                        </div>
                                        <button id="treatment_dates_visits_verify_btn" 
                                        className="btn btn-primary rounded-0 height-35 d-flex align-items-center"
                                        onClick={() => verify_unverify('CaseProviders-visits')}
                                            >
                                                {isTreatmentDateVisitVerified.action ? (isTreatmentDateVisitVerified.action.toLowerCase() === 'verified' ?
                                                    'Unverify'
                                                    :
                                                    'Verify')
                                                    :
                                                    'Verify'
                                                }

                                            </button>
                                    </div>
                                </div>
                                <div className="col-md-12 m-t-15 mt-2">
                                    <div className="bg-grey-100 height-35 d-flex align-items-center justify-content-center text-center">
                                        <p className="font-italic text-black d-flex align-items-center verification_note">
                                            <span id="treatment_dates_visits_verify_date">
                                            {isTreatmentDateVisitVerified.action ? (isTreatmentDateVisitVerified.action.toLowerCase() === 'verified' ?
                                        created_at_format(isTreatmentDateVisitVerified.created_at)
                                        :
                                        null)
                                        :
                                        null
                                    }
                                            </span>
                                            <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                                                <img src={Avatar} alt="" /></span>
                                            <span id="treatment_dates_visits_verify_by">
                                            {isTreatmentDateVisitVerified.action ? (isTreatmentDateVisitVerified.action.toLowerCase() === 'verified' ?
                                        isTreatmentDateVisitVerified.verification_by + ' ip: ' + isTreatmentDateVisitVerified.ip_address
                                        :
                                        null)
                                        :
                                        null
                                    }
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className="row align-items-center form-group">
                                <div className="col-md-2 text-left">
                                    <span className="d-inline-block text-grey">Complete?</span>
                                </div>
                                <div className="col-md-10">
                                    <div className="d-flex justify-content-between align-items-center ">
                                        <div className="d-flex justify-content-around align-items-center ml-3">
                                            <label className="mr-3 mb-0">
                                                <input type="radio" name="treatment_complete" id="treatment_complete_yes"
                                                value="YES"
                                                onChange={(e) => setCompleteTreatment(e.target.value)}
                                                checked={completeTreatment === "YES"}  />
                                                Yes
                                            </label>
                                            <label className="mb-0">
                                                <input type="radio" name="treatment_complete" id="treatment_complete_no"
                                                value="NO"
                                        onChange={(e) => setCompleteTreatment(e.target.value)} 
                                        checked={completeTreatment === "NO"} />
                                                No
                                            </label>
                                        </div>
                                        <div className="d-flex  align-items-center">
                                            <div className="icon-wrap ic-25 m-l-5 m-r-5">
                                                <i id="isCaseCompleted" className="ic ic-verified ic-25"></i>
                                            </div>
                                            <button id="isCompleteVerifyBtn"
                                        className="btn btn-primary rounded-0 height-35 d-flex align-items-center"
                                        onClick={() => verify_unverify('CaseProviders-treatment_complete')}
                                            >
                                                {isTreatmentCompleteVerified.action ? (isTreatmentCompleteVerified.action.toLowerCase() === 'verified' ?
                                                    'Unverify'
                                                    :
                                                    'Verify')
                                                    :
                                                    'Verify'
                                                }

                                            </button>
                                        </div>
                                    </div>


                                </div>
                                <div className="col-md-12 m-t-15 mt-2">
                                    <div className="bg-grey-100 height-35 d-flex align-items-center justify-content-center text-center">
                                        <p className="font-italic text-black d-flex align-items-center verification_note">
                                            <span id="completeVerificationDate">
                                            {isTreatmentCompleteVerified.action ? (isTreatmentCompleteVerified.action.toLowerCase() === 'verified' ?
                                        created_at_format(isTreatmentCompleteVerified.created_at)
                                        :
                                        null)
                                        :
                                        null
                                    }
                                            </span>
                                            <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                                                <img src={Avatar} alt="" /></span>
                                            <span id="completeVerificationBy">
                                            {isTreatmentCompleteVerified.action ? (isTreatmentCompleteVerified.action.toLowerCase() === 'verified' ?
                                        isTreatmentCompleteVerified.verification_by + ' ip: ' + isTreatmentCompleteVerified.ip_address
                                        :
                                        null)
                                        :
                                        null
                                    }
                                            </span>
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="row m-b-5">
                        <div className="col-md-9">
                            <div className="d-flex justify-content-between align-items-center">
                                <label for="treatment_date1" className="fw-bold mr-1 mb-0">Date</label>
                                <input type="date" className="form-control"
                                    placeholder="Treatment Date" value={treatmentDate}
                                    onChange={e => setTreatmentDate(e.target.value)} />
                                <label for="treatment_note1" className="fw-bold mr-1 ml-1 mb-0">Note</label>
                                <input type="text" placeholder="Treatment Note" className="form-control"
                                    value={treatmentNotes}
                                    onChange={e => setTreatmentNotes(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-3">
                        <div className="d-flex justify-content-end m-b-5">
                    <button className="btn btn-primary border-no" onClick={addTreatmentDate}>
                        <span className="font-weight-bold pr-2 text-gold margin-b-08">+</span>
                        Treatment Date
                    </button>
                    </div>
                </div>
                    </div>

                    <input type="text" hidden name="case_provider_id" />

                
                <div className="row bg-white has-speciality-color-2" id="treatment-dates-block-92">
                    <div className="d-flex justify-content-start w-100">
                        <div className="table-responsive table--no-card overflow-hidden">
                            <table className="table table-borderless table-striped table-earning has-specialty-icon">
                                <thead>
                                    <tr id="bg-m-10" className="line-height">
                                        <th className="p-t-5 p-b-5 pr-3 btn-primary-lighter-default">
                                            MEDICAL PROVIDER
                                        </th>
                                        <th className="p-t-5 p-b-5 btn-primary-lighter-default">Date</th>
                                        <th className="pr-3 p-t-5 p-b-5 btn-primary-lighter-default">Record</th>
                                        <th colSpan="2" className="p-t-5 p-b-5 btn-primary-lighter-default">
                                            <div className="d-flex align-items-center notes-section">
                                                <span>Treatment Note</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="treatment_dates_table">

                                    {allTreatmentDates.map(td => (
                                        <TreatmentDatesRow
                                            key={td.id}
                                            treatmentDate={td}
                                            specialitie={specialitie}
                                            contact={contact}
                                            setAllTreatmentDates={setAllTreatmentDates}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
);

export default TreatmentDate
