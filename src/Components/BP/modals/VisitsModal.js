import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Avatar from '../../../assets/images/avatar.png'
import axios from 'axios';
import { getCaseId, getClientId, getToken } from "../../../Utils/helper";


function VisitsModal({
  show,
  handleClose,
  caseProvider,
  isTreatmentDateFirstVerified,
  setIsTreatmentDateFirstVerified,
  isTreatmentDateLastVerified,
  setIsTreatmentDateLastVerified,
  isTreatmentDateVisitVerified,
  setIsTreatmentDateVisitVerified,
  dates,
  setdates,
  caseProviderID, visits,
  first_visit_date, last_visit_date, caseId, onUpdate, updateCall
}) {


  // Hasnat


  const [visitCount, setVisitCount] = useState(visits || 0);
  const [firstVisitDate, setFirstVisitDate] = useState();
  const [lastVisitDate, setLastVisitDate] = useState();

  useEffect(() => {
    console.log("caseProviderIDDDDDD : ", caseProviderID)
    if (show) {
      console.log("Modal is now visible.");
      console.log("first_visit_date : ", first_visit_date);
      console.log("last_visit_date : ", last_visit_date);
      setFirstVisitDate(first_visit_date || '')
      setLastVisitDate(last_visit_date || '')
    }
  }, [show, first_visit_date, last_visit_date]);


  const origin = process.env.REACT_APP_BACKEND_URL;


  function verify_unverify(arg) {


    console.log(`Sending Data:`, { visits, firstVisitDate, lastVisitDate, caseId, caseProviderID });

    const data = {
      client_id: 20,
      case_id: caseId,
      visits: visitCount,
      first_visit_date: firstVisitDate,
      last_visit_date: lastVisitDate,
      Arg: arg,
      case_provider_id: caseProviderID,
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
        console.log('Response:', response.data);
        updateCall();
        onUpdate();
        //handleClose()
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
  }

  const formatRespDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  function updateCaseProvider() {

    const data = {
      visits: visitCount,
      first_date: firstVisitDate,
      last_date: lastVisitDate,
    };

    fetch(`${origin}/api/treatment/update/case-provider/${caseProviderID}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        updateCall()
        onUpdate();
        handleClose()
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  const formatDate = (dateString) => {
    if (dateString) {
      return dateString.split('T')[0];
    } else {
      return ''
    }

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

  //console.log(isTreatmentDateVisitVerified,"<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>")

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Body>
        <div class="modal-header">
          <h5 class="modal-title mx-auto" id="exampleModalLabel">Add Number of Visits, First and Last Treatment
            Dates</h5>
        </div>
        <div class="modal-body">
          <div class="row align-items-center form-group">
            <div class="col-md-2 text-left">
            </div>
            <div class="col-md-10">
              <div class="d-flex align-items-center">
                <input type="number" placeholder="Number of Visits" class="form-control" name="visits"
                  value={visitCount} onChange={e => setVisitCount(e.target.value)} />
                <div class="icon-wrap ic-25 m-l-5 m-r-5">
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

                <button id="is_request_billing_recived_verified_btn"
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
            <div class="col-md-12 m-t-15">
              <div
                class="bg-grey-100 mt-2 height-35 d-flex align-items-center justify-content-center text-center">
                <p className="font-italic text-black d-flex align-items-center verification_note">
                  <span id="request_billing_recived_verified_date">
                    {isTreatmentDateVisitVerified.action ? (isTreatmentDateVisitVerified.action.toLowerCase() === 'verified' ?
                      created_at_format(isTreatmentDateVisitVerified.created_at)
                      :
                      null)
                      :
                      null
                    }
                  </span>


                  {isTreatmentDateVisitVerified.action ?
                    isTreatmentDateVisitVerified.action.toLowerCase() != 'verified'
                      ?
                      <span className="ic ic-avatar-grey ic-25 has-avatar-icon has-cover-img mr-lg-1"></span>
                      :
                      isTreatmentDateVisitVerified.profile != '' ?
                        <img src={"https://simplefirm-bucket.s3.amazonaws.com/static/" + isTreatmentDateVisitVerified.profile} alt="" className="verify-profile-img-modal" />
                        :
                        <span className="ic ic-avatar ic-25 has-avatar-icon has-cover-img mr-lg-1"></span>
                    :
                    <span className="ic ic-avatar-grey ic-25 has-avatar-icon has-cover-img mr-lg-1"></span>
                  }

                  <span id="request_billing_recived_verified_by">
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
          <div class="k-separator mt-4 mb-4"></div>
          <div class="row align-items-center form-group">
            <div class="col-md-2 text-left">
              <label class="d-inline-block text-grey " for="first_date">First Visit</label>
            </div>
            <div class="col-md-10">
              <div class="d-flex align-items-center">
                <input type="date" class="form-control" value={firstVisitDate}
                  onChange={e => setFirstVisitDate(e.target.value)} />
                <div class="icon-wrap ic-25 m-l-5 m-r-5">
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

                <button id="is_request_billing_recived_verified_btn"
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
            <div class="col-md-12 m-t-15">
              <div
                class="bg-grey-100 mt-2 height-35 d-flex align-items-center justify-content-center text-center">
                <p className="font-italic text-black d-flex align-items-center verification_note">
                  <span id="request_billing_recived_verified_date">
                    {isTreatmentDateFirstVerified.action ? (isTreatmentDateFirstVerified.action.toLowerCase() === 'verified' ?
                      created_at_format(isTreatmentDateFirstVerified.created_at)
                      :
                      null)
                      :
                      null
                    }
                  </span>

                  {isTreatmentDateFirstVerified.action ?
                    isTreatmentDateFirstVerified.action.toLowerCase() != 'verified'
                      ?
                      <span className="ic ic-avatar-grey ic-25 has-avatar-icon has-cover-img mr-lg-1"></span>
                      :
                      isTreatmentDateFirstVerified.profile != '' ?
                        <img src={"https://simplefirm-bucket.s3.amazonaws.com/static/" + isTreatmentDateFirstVerified.profile} alt="" className="verify-profile-img-modal" />
                        :
                        <span className="ic ic-avatar ic-25 has-avatar-icon has-cover-img mr-lg-1"></span>
                    :
                    <span className="ic ic-avatar-grey ic-25 has-avatar-icon has-cover-img mr-lg-1"></span>
                  }

                  <span id="request_billing_recived_verified_by">
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
          <div class="k-separator mt-4 mb-4"></div>
          <div class="row align-items-center form-group mb-0">
            <div class="col-md-2 text-left">
              <label class="d-inline-block text-grey" for="second_date">Last Visit</label>
            </div>
            <div class="col-md-10">
              <div class="d-flex align-items-center">
                <input type="date" class="form-control" value={lastVisitDate}
                  onChange={e => setLastVisitDate(e.target.value)} />
                <div class="icon-wrap ic-25 m-l-5 m-r-5">
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

                <button id="is_request_billing_recived_verified_btn"
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
            <div class="col-md-12 m-t-15">
              <div
                class="bg-grey-100 mt-2 height-35 d-flex align-items-center justify-content-center text-center">
                <p className="font-italic text-black d-flex align-items-center verification_note">
                  <span id="request_billing_recived_verified_date">
                    {isTreatmentDateLastVerified.action ? (isTreatmentDateLastVerified.action.toLowerCase() === 'verified' ?
                      created_at_format(isTreatmentDateLastVerified.created_at)
                      :
                      null)
                      :
                      null
                    }
                  </span>
                  
                  {isTreatmentDateLastVerified.action ?
                    isTreatmentDateLastVerified.action.toLowerCase() != 'verified'
                      ?
                      <span className="ic ic-avatar-grey ic-25 has-avatar-icon has-cover-img mr-lg-1"></span>
                      :
                      isTreatmentDateLastVerified.profile != '' ?
                        <img src={"https://simplefirm-bucket.s3.amazonaws.com/static/" + isTreatmentDateLastVerified.profile} alt="" className="verify-profile-img-modal" />
                        :
                        <span className="ic ic-avatar ic-25 has-avatar-icon has-cover-img mr-lg-1"></span>
                    :
                    <span className="ic ic-avatar-grey ic-25 has-avatar-icon has-cover-img mr-lg-1"></span>
                  }

                  <span id="request_billing_recived_verified_by">
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
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary footer-btn" onClick={handleClose}>Cancel</button>
          <button type="button" onClick={updateCaseProvider} className="btn btn-success">Save</button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default VisitsModal
