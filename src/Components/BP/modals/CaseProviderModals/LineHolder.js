import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import Avatar from '../../../../assets/images/avatar.png'
import { getCaseId, getClientId, getToken } from "../../../../Utils/helper";

const LineHolder = forwardRef((props, ref) => {
    const {
    handleClose,
    location,
    caseProvider,
    isLineHolderBalanceVerified,
    setIsLineHolderBalanceVerified,
    isLineHolderBalanceConfirmedVerified,
    setIsLineHolderBalanceConfirmedVerified,
    lienHolder,
    setLienHolder, 
    onUpdate,
    updateCall
    } = props;

    const origin = process.env.REACT_APP_BACKEND_URL;
    const [contactId, setContactId] = useState(lienHolder.id);
    const [name, setName] = useState(lienHolder.name);
    const [address1, setAddress1] = useState(lienHolder.address1);
    const [address2, setAddress2] = useState(lienHolder.address2);
    const [city, setCity] = useState(lienHolder.city);
    const [state, setState] = useState(lienHolder.state);
    const [zip, setZip] = useState(lienHolder.zip);
    const [phoneNumber, setPhoneNumber] = useState(lienHolder.phone_number);
    const [fax, setFax] = useState(lienHolder.fax);
    const [email, setEmail] = useState(lienHolder.email);
    const [website, setWebsite] = useState(lienHolder.website);

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
                setLienHolder(response.data)
            }
            handleClose()
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Failed to update data: ' + error.message); // Providing feedback to the user
        }

        // Updating case provider --  Hasnat
        try {
            const caseProviderResponse = await axios.put(`${origin}/api/treatment/update/case-provider/${caseProvider.id}/`, {
                balance: lineHolderBalance,
                balance_confirmed: LineHolderBalanceConfirm
            });
            console.log("Case provider response data:", caseProviderResponse.data);
            if (caseProviderResponse.data) {
                console.log('line holder update!');
                onUpdate();
            }
            handleClose()
        } catch (error) {
            console.error('Error updating case provider:', error);
        }
    }
}));

    console.log("caseProvider.balance_confirmed :", caseProvider.balance_confirmed)

    // Hasnat
    const [lineHolderBalance, setLineHolderBalance] = useState(caseProvider.final || '');
    const [LineHolderBalanceConfirm, setLineHolderBalanceConfirm] = useState(caseProvider.balance_confirmed);

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
        <div className="tab-pane fade" id="lien-holder-tab" role="tabpanel" aria-labelledby="lien-holder-link">
            

        <input type="text" name="address_block_name" hidden value="lien_holder" />
        <input type="text" name="case_provider_id" hidden />

        <div className="row align-items-center form-group">
            <div className="col-md-1 text-left">
                <span className="d-inline-block text-grey">Balance</span>
            </div>
            <div className="col-md-11 d-flex">
                <input type="number" placeholder="Enter Balance" class="form-control" 
                name="balance" id="line_holder_balance_input" 
                value={lineHolderBalance}
                onChange={(e) => setLineHolderBalance(e.target.value)}   />
                <div className="d-flex  align-items-center">
                    <div className="icon-wrap ic-25 m-l-5 m-r-5">
                        {isLineHolderBalanceVerified.action ? (isLineHolderBalanceVerified.action.toLowerCase() === 'verified' ?
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
                    <button
                        id="is_line_holder_balance_verified_btn"
                        class="btn btn-primary rounded-0 height-35 d-flex align-items-center"
                        onClick={() => verify_unverify('CaseProviders-final')}
                    >
                        {isLineHolderBalanceVerified.action ? (isLineHolderBalanceVerified.action.toLowerCase() === 'verified' ?
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
                        <span id="line_holder_balance_verified_date">
                        {isLineHolderBalanceVerified.action ? (isLineHolderBalanceVerified.action.toLowerCase() === 'verified' ?
                                created_at_format(isLineHolderBalanceVerified.created_at)
                                :
                                null)
                                :
                                null
                            }
                        </span>
                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                            <img src={Avatar} alt="" /></span>
                        <span id="line_holder_balance_verified_by">
                        {isLineHolderBalanceVerified.action ? (isLineHolderBalanceVerified.action.toLowerCase() === 'verified' ?
                                isLineHolderBalanceVerified.verification_by + ' ip: ' + isLineHolderBalanceVerified.ip_address
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
                    <nobr> Confirmed</nobr>
                </span>
            </div>
            <div className="col-md-11">
                <div className="d-flex justify-content-between align-items-center ">
                    <div className="d-flex justify-content-around align-items-center ml-3">
                        <label className="mr-3">
                            <input type="radio"
                name="balance_confirmed" id="is_line_holder_balance_confirmed_yes" value="YES"
                onChange={e => setLineHolderBalanceConfirm(e.target.value)} 
                checked={LineHolderBalanceConfirm === "YES"} />
                            Yes
                        </label>
                        <label>
                            <input type="radio" 
                id="is_line_holder_balance_confirmed_no" name="balance_confirmed" value="NO"
                onChange={e => setLineHolderBalanceConfirm(e.target.value)}
                checked={LineHolderBalanceConfirm === "NO"}  />
                            No
                        </label>
                    </div>
                    <div className="d-flex  align-items-center">
                        <div className="icon-wrap ic-25 m-l-5 m-r-5">
                        {isLineHolderBalanceConfirmedVerified.action ? (isLineHolderBalanceConfirmedVerified.action.toLowerCase() === 'verified' ?
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
                        <button
                        id="is_line_holder_balance_confirmed_btn"
                        class="btn btn-primary rounded-0 height-35 d-flex align-items-center"
                        onClick={() => verify_unverify('CaseProviders-balance_confirmed')}
                    >
                        {isLineHolderBalanceConfirmedVerified.action ? (isLineHolderBalanceConfirmedVerified.action.toLowerCase() === 'verified' ?
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
                <div className="bg-grey-100 mt-2 height-35 d-flex align-items-center justify-content-center text-center">
                    <p className="font-italic text-black d-flex align-items-center verification_note">
                        <span id="line_holder_balance_confirmed_date">
                        {isLineHolderBalanceConfirmedVerified.action ? (isLineHolderBalanceConfirmedVerified.action.toLowerCase() === 'verified' ?
                                created_at_format(isLineHolderBalanceConfirmedVerified.created_at)
                                :
                                null)
                                :
                                null
                            }
                        </span>
                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                            <img src={Avatar} alt="" /></span>
                        <span id="line_holder_balance_confirmed_by">
                        {isLineHolderBalanceConfirmedVerified.action ? (isLineHolderBalanceConfirmedVerified.action.toLowerCase() === 'verified' ?
                                isLineHolderBalanceConfirmedVerified.verification_by + ' ip: ' + isLineHolderBalanceConfirmedVerified.ip_address
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

        <form>
        <div className="row">
            <div className="col-md-3">
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

            <div className="col-md-9">
                <div className="row align-items-center form-group">
                    <div className="col-md-2 text-left">
                        <span className="d-inline-block text-grey">Name*</span>
                    </div>
                    <div className="col-md-10">
                        <input type="text" placeholder="Enter name" id="completed_location_name" className="form-control"
                            name="medical_name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                </div>
                <div className="row align-items-center form-group">
                    <div className="col-md-2 text-left">
                        <span className="d-inline-block text-grey">
                            <nobr>Addr. 1</nobr>
                        </span>
                    </div>
                    <div className="col-md-10">
                        <input type="text" placeholder="Enter Address 1" id="completed_location_address1" className="form-control"
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
                        <input type="text" placeholder="Enter Address 2" id="completed_location_address2" className="form-control"
                            name="medical_address2" value={address2} onChange={e => setAddress2(e.target.value)} />
                    </div>
                </div>


                <div className="row align-items-center form-group">

                    <div className="col-md-2">
                        <span
                            className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-40-Px">City</span>

                    </div>
                    <div className="col-md-3">
                        <input type="text" placeholder="Enter City" id="completed_location_medical_city" className="form-control"
                            name="medical_city" value={city} onChange={e => setCity(e.target.value)} />
                    </div>

                    <div className="col-md-2">
                        <span
                            className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">State</span>

                    </div>
                    <div className="col-md-2">
                        <select name="medical_state" id="completed_location_medical_state" className="form-select form-control"

                            value={state} onChange={e => setState(e.target.value)}>

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

                        <input type="text" placeholder="Enter Zip" id="completed_zip" className="form-control" name="medical_zip"
                            value={zip} onChange={e => setZip(e.target.value)}
                        />

                    </div>

                </div>

                <div className="row align-items-center form-group">

                    <div className="col-md-2">
                        <span
                            className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-25-Px">Phone</span>

                    </div>

                    <div className="col-md-2">
                        <input type="text" placeholder="Enter Phone" id="completed_phone" className="form-control"
                            name="medical_phone" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                    </div>

                    <div className="col-md-1">
                        <span
                            className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">Fax</span>

                    </div>

                    <div className="col-md-3">
                        <input type="text" placeholder="Enter fax" id="completed_fax" className="form-control" name="medical_fax"
                            value={fax} onChange={e => setFax(e.target.value)}
                        />

                    </div>

                    <div className="col-md-2">
                        <span
                            className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">Email</span>

                    </div>

                    <div className="col-md-2">
                        <input type="text" placeholder="Enter Email" id="completed_email" className="form-control"
                            name="medical_email"
                            value={email} onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row align-items-center form-group">
                    <div className="col-md-2 text-left">
                        <span className="d-inline-block text-grey">
                            <nobr>Website</nobr>
                        </span>
                    </div>
                    <div className="col-md-10">
                        <input type="text" placeholder="Enter Website Url" id="completed_website" className="form-control"
                            value={website} onChange={e => setWebsite(e.target.value)}
                            name="medical_website" />
                    </div>
                </div>

                <div className="col-md d-md-flex">
                    * Cannot be Blank
                </div>
            </div>
        </div>

    </form>
</div>
    )
}
);

export default LineHolder
