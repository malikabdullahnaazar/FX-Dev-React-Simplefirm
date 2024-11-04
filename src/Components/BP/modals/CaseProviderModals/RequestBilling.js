import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import Avatar from '../../../../assets/images/avatar.png'
import { getCaseId, getClientId, getToken } from "../../../../Utils/helper";

const RequestBilling = forwardRef((props, ref) => {
    const {
        handleClose,
    location,
    caseProvider,
    isRequestBillingVerified,
    setIsRequestBillingVerified,
    isReceivedBillingVerified,
    setIsReceivedBillingVerified,
    isBillingCostVerified,
    setIsBillingCostVerified,
    isBillingPaidVerified,
    setIsBillingPaidVerified,
    treatmentBill,
    setTreatmentBill,
    paidBill,
    setPaidBill,
    onUpdate,
    updateCall
    } = props;

    const origin = process.env.REACT_APP_BACKEND_URL;
    const [contactId, setContactId] = useState(treatmentBill.id);
    const [name, setName] = useState(treatmentBill.name);
    const [address1, setAddress1] = useState(treatmentBill.address1);
    const [address2, setAddress2] = useState(treatmentBill.address2);
    const [city, setCity] = useState(treatmentBill.city);
    const [state, setState] = useState(treatmentBill.state);
    const [zip, setZip] = useState(treatmentBill.zip);
    const [phoneNumber, setPhoneNumber] = useState(treatmentBill.phone_number);
    const [fax, setFax] = useState(treatmentBill.fax);
    const [email, setEmail] = useState(treatmentBill.email);
    const [website, setWebsite] = useState(treatmentBill.website);

    const [contactId2, setContactId2] = useState(paidBill.id);
    const [name2, setName2] = useState(paidBill.name);
    const [address12, setAddress12] = useState(paidBill.address1);
    const [address22, setAddress22] = useState(paidBill.address2);
    const [city2, setCity2] = useState(paidBill.city);
    const [state2, setState2] = useState(paidBill.state);
    const [zip2, setZip2] = useState(paidBill.zip);
    const [phoneNumber2, setPhoneNumber2] = useState(paidBill.phone_number);
    const [fax2, setFax2] = useState(paidBill.fax);
    const [email2, setEmail2] = useState(paidBill.email);
    const [website2, setWebsite2] = useState(paidBill.website);

    // Hasnat
    const [billingOrdered, setBillingOrdered] = useState(caseProvider.billing_ordered ? caseProvider.billing_ordered.split("T")[0] : '');
    const [billingReceived, setBillingReceived] = useState(caseProvider.billing_received ? caseProvider.billing_received.split("T")[0] : '');
    const [billingPaid, setBillingPaid] = useState(caseProvider.bills_request_paid || '');
    const [billingCost, setBillingCost] = useState(caseProvider.billsCost || '');
    const [billingPaidTime, setBillingPaidTime] = useState(caseProvider.billing_paid ? caseProvider.billing_paid.split("T")[0] : '');

    useImperativeHandle(ref, () => ({
        save: async () => {
            if (!name.trim()) {
                alert("Required field cannot be blank.");
                return;
            }
        try {
            const response = await axios.post(origin + '/api/treatment/edit-contact-info/', {
                location_id: contactId,
                name: name,
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                zip: zip,
                phone: phoneNumber,
                fax: fax,
                email: email,
                website: website,
            });
            console.log("Response data:", response.data);  // Detailed logging
            if (response.data) {
                setTreatmentBill(response.data)
            }
            handleClose()
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Failed to update data: ' + error.message); // Providing feedback to the user
        }

        try {
            if (!name2.trim()) {
                alert("Required field cannot be blank.");
                return;
            }
            const response = await axios.post(origin + '/api/treatment/edit-contact-info/', {
                location_id: contactId2,
                name: name2,
                address1: address12,
                address2: address22,
                city: city2,
                state: state2,
                zip: zip2,
                phone: phoneNumber2,
                fax: fax2,
                email: email2,
                website: website2,
            });
            console.log("Response data:", response.data);  // Detailed logging
            if (response.data) {
                setPaidBill(response.data)
            }
            handleClose()
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Failed to update data: ' + error.message); // Providing feedback to the user
        }
        // Updating case provider
        try {
            const caseProviderResponse = await axios.put(`${origin}/api/treatment/update/case-provider/${caseProvider.id}/`, {
                billing_ordered: billingOrdered,
                billing_received: billingReceived,
                billing_paid: billingPaidTime,
                billing_paid_time: billingPaid,
                billing_cost: billingCost
            });
            console.log("Case provider response data:", caseProviderResponse.data);
            if (caseProviderResponse.data) {
                setBillingOrdered(caseProviderResponse.data.billing_ordered);
                setBillingReceived(caseProviderResponse.data.billing_received);
                console.log('Updated billingOrdered state:', billingOrdered);
                onUpdate();
            }
            handleClose()
        } catch (error) {
            console.error('Error updating case provider:', error);
        }
    }
}));

    // Hasnat


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
                console.log('Response:', response.data);
                console.log("verification successful");
                updateCall();
                onUpdate();
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
        <div className="tab-pane fade" id="request-billing-tab" role="tabpanel" aria-labelledby="request-billing-link">

                <div className="row align-items-center form-group">
                    <div className="col-md-1 text-left">
                        <span className="d-inline-block text-grey">
                            <nobr> Ordered</nobr>
                        </span>
                    </div>
                    <div className="col-md-11 d-flex ">
                    <input type="date" class="form-control" name="billing_ordered" id="is_request_billing_ordered_date"
                        value={billingOrdered}
                        onChange={(e) => setBillingOrdered(e.target.value)}  />
                        <div className="d-flex  align-items-center">
                            <div className="icon-wrap ic-25 m-l-5 m-r-5">
                                {isRequestBillingVerified.action ? (isRequestBillingVerified.action.toLowerCase() === 'verified' ?
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
                             onClick={() => verify_unverify('CaseProviders-billing_ordered')}
                            >
                                {isRequestBillingVerified.action ? (isRequestBillingVerified.action.toLowerCase() === 'verified' ?
                                    'Unverify'
                                    :
                                    'Verify')
                                    :
                                    'Verify'
                                }

                            </button>
                        </div>
                    </div>
                    <div className="col-md-12 m-t-15">
                        <div className="bg-grey-100 mt-2 height-35 d-flex align-items-center justify-content-center text-center">
                            <p className="font-italic text-black d-flex align-items-center verification_note">
                                <span id="request_billing_recived_verified_date">
                                    {isRequestBillingVerified.action ? (isRequestBillingVerified.action.toLowerCase() === 'verified' ?
                                        created_at_format(isRequestBillingVerified.created_at)
                                        :
                                        null)
                                        :
                                        null
                                    }
                                </span>
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                                    <img src={Avatar} alt="" />
                                </span>
                                <span id="request_billing_recived_verified_by">
                                    {isRequestBillingVerified.action ? (isRequestBillingVerified.action.toLowerCase() === 'verified' ?
                                        isRequestBillingVerified.verification_by + ' ip: ' + isRequestBillingVerified.ip_address
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
                <div className="row align-items-center form-group">
                    <div className="col-md-1 text-left">
                        <span className="d-inline-block text-grey">
                            <nobr> Received</nobr>
                        </span>
                    </div>
                    <div className="col-md-11 d-flex ">
                    <input type="date" class="form-control" name="billing_received" id="is_request_billing_received_date"
                        value={billingReceived}
                        onChange={(e) => setBillingReceived(e.target.value)} />
                        <div className="d-flex  align-items-center">
                            <div className="icon-wrap ic-25 m-l-5 m-r-5">
                                {isReceivedBillingVerified.action ? (isReceivedBillingVerified.action.toLowerCase() === 'verified' ?
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
                            onClick={() => verify_unverify('CaseProviders-billing_received')}
                            >
                                {isReceivedBillingVerified.action ? (isReceivedBillingVerified.action.toLowerCase() === 'verified' ?
                                    'Unverify'
                                    :
                                    'Verify')
                                    :
                                    'Verify'
                                }

                            </button>
                        </div>
                    </div>
                    <div className="col-md-12 m-t-15">
                        <div className="bg-grey-100 mt-2 height-35 d-flex align-items-center justify-content-center text-center">
                            <p className="font-italic text-black d-flex align-items-center verification_note">

                                <span id="request_billing_recived_verified_date">
                                    {isReceivedBillingVerified.action ? (isReceivedBillingVerified.action.toLowerCase() === 'verified' ?
                                        created_at_format(isReceivedBillingVerified.created_at)
                                        :
                                        null)
                                        :
                                        null
                                    }
                                </span>
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                                    <img src={Avatar} alt="" />
                                </span>
                                <span id="request_billing_recived_verified_by">
                                    {isReceivedBillingVerified.action ? (isReceivedBillingVerified.action.toLowerCase() === 'verified' ?
                                        isReceivedBillingVerified.verification_by + 'ip:' + isReceivedBillingVerified.ip_address
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

                <div className="row">
                    <div className="col-md-5">
                        <div>
                            <p id="completed_specialty" className="text-white provider_specialty">
                            </p><br />
                            <p id="completed_provider_name" className="provider_name" >
                                {caseProvider.providerprofile_office_name ? caseProvider.providerprofile_office_name : 'Provider Name'}
                            </p><br />
                            <p><span id="completed_address1" className="location_address1">
                                {location.address ? location.address : 'Address'},
                            </span>
                                <span id="completed_address2" className="location_address2">
                                    {location.address2 ? location.address2 : 'Address2'}</span></p><br />
                            <p>
                                <span id="completed_location_city" className="location_city">
                                    {location.city ? location.city : 'city'},
                                </span>
                                <span id="completed_location_state" className="location_state">
                                    {location.state ? location.state : 'state'},
                                </span>
                                <span id="completed_location_zip" className="location_zip">
                                    {location.post_code ? location.post_code : 'zip'}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">Name*</span>
                            </div>
                            <div className="col-md-10">
                                <input type="text" placeholder="Enter name" id="request_billing_medical_name" className="form-control"
                                    name="medical_name" value={name} onChange={e => setName(e.target.value)} 
                                    required/>
                            </div>
                        </div>

                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    <nobr>Addr. 1</nobr>
                                </span>
                            </div>
                            <div className="col-md-10">
                                <input type="text" placeholder="Enter Address 1" className="form-control"
                                    name="medical_address1" value={address1} onChange={e => setAddress1(e.target.value)} />
                            </div>
                        </div>

                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    <nobr>Addr. 2</nobr>
                                </span>
                            </div>
                            <div className="col-md-10">
                                <input type="text" placeholder="Enter Address 2" id="request_billing_medical_address2" className="form-control"
                                    name="medical_address2" value={address2} onChange={e => setAddress2(e.target.value)} />
                            </div>
                        </div>

                        <div className="row align-items-center form-group">

                            <div className="col-md-2">
                                <span
                                    className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-40-Px">City</span>

                            </div>
                            <div className="col-md-2">
                                <input type="text" placeholder="Enter City"
                                    id="request_billing_medical_city"
                                    className="form-control col-md-9"
                                    name="medical_city"
                                    value={city} onChange={e => setCity(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">

                                <span
                                    className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">State</span>

                            </div>
                            <div className="col-md-3">
                                <select name="medical_state" id="request_billing_medical_state" className="form-select form-control" value={state} onChange={e => setState(e.target.value)}>

                                    <option value="CA">California</option>
                                    <option value="IL">Illinois</option>
                                    <option value="TX">Texas</option>
                                    <option value="AZ">Arizona</option>
                                    <option value="FL">Florida</option>
                                    <option value="NY">New York</option>
                                    <option value="WA">Washington</option>
                                    <option value="NV">Nevada</option>
                                    <option value="MI">Michigan</option>
                                    <option value="MA">Massachusetts</option>
                                    <option value="PA">Pennsylvania</option>
                                    <option value="OH">Ohio</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="VA">Virginia</option>
                                    <option value="UT">Utah</option>
                                    <option value="NC">North Carolina</option>
                                    <option value="MD">Maryland</option>
                                    <option value="GA">Georgia</option>
                                    <option value="MO">Missouri</option>
                                    <option value="HI">Hawaii</option>
                                    <option value="IN">Indiana</option>
                                    <option value="WI">Wisconsin</option>
                                    <option value="CT">Connecticut</option>
                                    <option value="TN">Tennessee</option>
                                    <option value="NJ">New Jersey</option>
                                    <option value="OR">Oregon</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="CO">Colorado</option>
                                    <option value="DC">District of Columbia</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="AL">Alabama</option>
                                    <option value="RI">Rhode Island</option>
                                    <option value="KS">Kansas</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="DE">Delaware</option>
                                    <option value="SC">South Carolina</option>
                                    <option value="IA">Iowa</option>
                                    <option value="ID">Idaho</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="NH">New Hampshire</option>
                                    <option value="AR">Arkansas</option>
                                    <option value="AK">Alaska</option>
                                    <option value="ME">Maine</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="SD">South Dakota</option>
                                    <option value="WV">West Virginia</option>
                                    <option value="ND">North Dakota</option>
                                    <option value="VT">Vermont</option>
                                    <option value="MT">Montana</option>
                                    <option value="WY">Wyoming</option>

                                </select>
                            </div>
                            <div className="col-md-1">
                                <span
                                    className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">Zip</span>

                            </div>
                            <div className="col-md-2">
                                <input type="text" placeholder="Enter Zip" id="request_billing_medical_zip" className="form-control"
                                    value={zip} onChange={e => setZip(e.target.value)}
                                    name="medical_zip" />
                            </div>
                        </div>


                        <div className="row align-items-center form-group">

                            <div className="col-md-2">
                                <span
                                    className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-25-Px">Phone</span>

                            </div>
                            <div className="col-md-2">
                                <input type="text" placeholder="Enter Phone"
                                    id="request_billing_medical_phone"
                                    className="form-control"
                                    name="medical_phone"
                                    value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                                />
                            </div>

                            <div className="col-md-2">
                                <span
                                    className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3">Fax</span>
                            </div>
                            <div className="col-md-2">
                                <input type="text" placeholder="Enter fax"
                                    id="request_billing_medical_fax"
                                    className="form-control col-md-9"
                                    name="medical_fax"
                                    value={fax} onChange={e => setFax(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <span
                                    className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">Email</span>
                            </div>
                            <div className="col-md-2">
                                <input type="text" placeholder="Enter Email"
                                    id="request_billing_medical_email"
                                    className="form-control"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                    name="medical_email" />
                            </div>
                        </div>

                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    <nobr>Website</nobr>
                                </span>
                            </div>
                            <div className="col-md-10">
                                <input type="text" placeholder="Enter Website Url"
                                    id="request_billing_medical_website"
                                    className="form-control"
                                    name="medical_website"
                                    value={website}
                                    onChange={e => setWebsite(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md d-md-flex">
                            * Cannot be Blank
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <div className="row align-items-center form-group">
                            <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey">
                                    <nobr>Cost</nobr>
                                </span>
                            </div>
                            <div className="col-md-11 d-flex">
                            <input type="number" class="form-control" name="bills_cost"
                                    id="request_billing_cost" placeholder="Enter Cost"
                                    value={billingCost}
                                    onChange={(e) => setBillingCost(e.target.value)}  />
                                <div className="d-flex  align-items-center">
                                    <div className="icon-wrap ic-25 m-l-5 m-r-5">
                                        {isBillingCostVerified.action ? (isBillingCostVerified.action.toLowerCase() === 'verified' ?
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
                                    <button id="bills_cost_verify_btn" 
                                    className="btn btn-primary rounded-0 height-35 d-flex align-items-center"
                                    onClick={() => verify_unverify('CaseProviders-billsCost')}
                                    >
                                        {isBillingCostVerified.action ? (isBillingCostVerified.action.toLowerCase() === 'verified' ?
                                            'Unverify'
                                            :
                                            'Verify')
                                            :
                                            'Verify'
                                        }
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-12 m-t-15">
                                <div
                                    className="bg-grey-100 mt-2 height-35 d-flex align-items-center justify-content-center text-center">
                                    <p className="font-italic text-black d-flex align-items-center verification_note">
                                        <span id="request_billing_recived_verified_date">
                                            {isBillingCostVerified.action ? (isBillingCostVerified.action.toLowerCase() === 'verified' ?
                                                created_at_format(isBillingCostVerified.created_at)
                                                :
                                                null)
                                                :
                                                null
                                            }
                                        </span>
                                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                                            <img src={Avatar} alt="" />
                                        </span>
                                        <span id="request_billing_recived_verified_by">
                                            {isBillingCostVerified.action ? (isBillingCostVerified.action.toLowerCase() === 'verified' ?
                                                isBillingCostVerified.verification_by + ' ip: ' + isBillingCostVerified.ip_address
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
                        <div className="row align-items-center form-group">
                            <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey">Paid</span>
                            </div>
                            <div className="col-md-11">


                                <div className="d-flex justify-content-between align-items-center ">
                                    <div className="d-flex justify-content-around align-items-center ">
                                    <input type="date" class="form-control" name="billing_paid"
                                                value={billingPaidTime}
                                                id="bills_coast_paid_at"
                                                onChange={(e) => setBillingPaidTime(e.target.value)}  />
                                    </div>
                                    <div className="d-flex justify-content-around align-items-center ">
                                    <label className="mr-3">
                                            <input type="radio" name="bills_request_paid" value="YES"
                                                id="bills_coast_paid_yes"
                                                onChange={(e) => setBillingPaid(e.target.value)} 
                                                checked={billingPaid === "YES"} />
                                            Yes
                                        </label>
                                        <label>
                                            <input type="radio" name="bills_request_paid" value="NO"
                                                id="bills_coast_paid_no"
                                                onChange={(e) => setBillingPaid(e.target.value)} 
                                                checked={billingPaid === "NO"} />
                                            No
                                        </label>
                                    </div>
                                    <div className="d-flex  align-items-center">
                                        <div className="icon-wrap ic-25 m-l-5 m-r-5">
                                            {isBillingPaidVerified.action ? (isBillingPaidVerified.action.toLowerCase() === 'verified' ?
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
                                        <button id="is_bills_request_paid_verified_btn" 
                                        className="btn btn-primary rounded-0 height-35 d-flex align-items-center"
                                        onClick={() => verify_unverify('CaseProviders-bills_request_paid')}
                                        >
                                            {isBillingPaidVerified.action ? (isBillingPaidVerified.action.toLowerCase() === 'verified' ?
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
                            <div className="col-md-12 m-t-15">
                                <div
                                    className="bg-grey-100 mt-2 height-35 d-flex align-items-center justify-content-center text-center">
                                    <p className="font-italic text-black d-flex align-items-center verification_note">
                                        <span id="request_billing_recived_verified_date">
                                            {isBillingPaidVerified.action ? (isBillingPaidVerified.action.toLowerCase() === 'verified' ?
                                                created_at_format(isBillingPaidVerified.created_at)
                                                :
                                                null)
                                                :
                                                null
                                            }
                                        </span>
                                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                                            <img src={Avatar} alt="" />
                                        </span>
                                        <span id="request_billing_recived_verified_by">
                                            {isBillingPaidVerified.action ? (isBillingPaidVerified.action.toLowerCase() === 'verified' ?
                                                isBillingPaidVerified.verification_by + ' ip: ' + isBillingPaidVerified.ip_address
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
                    <div className="col-md-7">
                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">Name*</span>
                            </div>
                            <div className="col-md-10">
                                <input type="text" placeholder="Enter name" id="request_billing_medical_name" className="form-control"
                                    name="medical_name" value={name2} onChange={e => setName2(e.target.value)} />
                            </div>
                        </div>

                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    <nobr>Addr. 1</nobr>
                                </span>
                            </div>
                            <div className="col-md-10">
                                <input type="text" placeholder="Enter Address 1" className="form-control"
                                    name="medical_address1" value={address12} onChange={e => setAddress12(e.target.value)} />
                            </div>
                        </div>

                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    <nobr>Addr. 2</nobr>
                                </span>
                            </div>
                            <div className="col-md-10">
                                <input type="text" placeholder="Enter Address 2" id="request_billing_medical_address2" className="form-control"
                                    name="medical_address2" value={address22} onChange={e => setAddress22(e.target.value)} />
                            </div>
                        </div>

                        <div className="row align-items-center form-group">

                            <div className="col-md-2">
                                <span
                                    className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-40-Px">City</span>

                            </div>
                            <div className="col-md-2">
                                <input type="text" placeholder="Enter City"
                                    id="request_billing_medical_city"
                                    className="form-control col-md-9"
                                    name="medical_city"
                                    value={city2} onChange={e => setCity2(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">

                                <span
                                    className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">State</span>

                            </div>
                            <div className="col-md-3">
                                <select name="medical_state" id="request_billing_medical_state" className="form-select form-control" value={state2} onChange={e => setState2(e.target.value)}>

                                    <option value="CA">California</option>
                                    <option value="IL">Illinois</option>
                                    <option value="TX">Texas</option>
                                    <option value="AZ">Arizona</option>
                                    <option value="FL">Florida</option>
                                    <option value="NY">New York</option>
                                    <option value="WA">Washington</option>
                                    <option value="NV">Nevada</option>
                                    <option value="MI">Michigan</option>
                                    <option value="MA">Massachusetts</option>
                                    <option value="PA">Pennsylvania</option>
                                    <option value="OH">Ohio</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="VA">Virginia</option>
                                    <option value="UT">Utah</option>
                                    <option value="NC">North Carolina</option>
                                    <option value="MD">Maryland</option>
                                    <option value="GA">Georgia</option>
                                    <option value="MO">Missouri</option>
                                    <option value="HI">Hawaii</option>
                                    <option value="IN">Indiana</option>
                                    <option value="WI">Wisconsin</option>
                                    <option value="CT">Connecticut</option>
                                    <option value="TN">Tennessee</option>
                                    <option value="NJ">New Jersey</option>
                                    <option value="OR">Oregon</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="CO">Colorado</option>
                                    <option value="DC">District of Columbia</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="AL">Alabama</option>
                                    <option value="RI">Rhode Island</option>
                                    <option value="KS">Kansas</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="DE">Delaware</option>
                                    <option value="SC">South Carolina</option>
                                    <option value="IA">Iowa</option>
                                    <option value="ID">Idaho</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="NH">New Hampshire</option>
                                    <option value="AR">Arkansas</option>
                                    <option value="AK">Alaska</option>
                                    <option value="ME">Maine</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="SD">South Dakota</option>
                                    <option value="WV">West Virginia</option>
                                    <option value="ND">North Dakota</option>
                                    <option value="VT">Vermont</option>
                                    <option value="MT">Montana</option>
                                    <option value="WY">Wyoming</option>

                                </select>
                            </div>
                            <div className="col-md-1">
                                <span
                                    className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">Zip</span>

                            </div>
                            <div className="col-md-2">
                                <input type="text" placeholder="Enter Zip" id="request_billing_medical_zip" className="form-control"
                                    value={zip2} onChange={e => setZip2(e.target.value)}
                                    name="medical_zip" />
                            </div>
                        </div>


                        <div className="row align-items-center form-group">

                            <div className="col-md-2">
                                <span
                                    className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-25-Px">Phone</span>

                            </div>
                            <div className="col-md-2">
                                <input type="text" placeholder="Enter Phone"
                                    id="request_billing_medical_phone"
                                    className="form-control"
                                    name="medical_phone"
                                    value={phoneNumber2} onChange={e => setPhoneNumber2(e.target.value)}
                                />
                            </div>

                            <div className="col-md-2">
                                <span
                                    className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3">Fax</span>
                            </div>
                            <div className="col-md-2">
                                <input type="text" placeholder="Enter fax"
                                    id="request_billing_medical_fax"
                                    className="form-control col-md-9"
                                    name="medical_fax"
                                    value={fax2} onChange={e => setFax2(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <span
                                    className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">Email</span>
                            </div>
                            <div className="col-md-2">
                                <input type="text" placeholder="Enter Email"
                                    id="request_billing_medical_email"
                                    className="form-control"
                                    value={email2} onChange={e => setEmail2(e.target.value)}
                                    name="medical_email" />
                            </div>
                        </div>

                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    <nobr>Website</nobr>
                                </span>
                            </div>
                            <div className="col-md-10">
                                <input type="text" placeholder="Enter Website Url"
                                    id="request_billing_medical_website"
                                    className="form-control"
                                    name="medical_website"
                                    value={website2}
                                    onChange={e => setWebsite2(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md d-md-flex">
                            * Cannot be Blank
                        </div>
                    </div>
                </div>
        </div>
    )
}
);

export default RequestBilling
