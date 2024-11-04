import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';

const TreatmentLocation = forwardRef((props, ref) => {
    const {
        handleClose, location, contact, caseProvider, specialitie, setContact
    } = props;

    const origin = process.env.REACT_APP_BACKEND_URL;

    const [contactId, setContactId] = useState(contact.id);
    const [name, setName] = useState(contact.name);
    const [address1, setAddress1] = useState(contact.address1);
    const [address2, setAddress2] = useState(contact.address2);
    const [city, setCity] = useState(contact.city);
    const [state, setState] = useState(contact.state);
    const [zip, setZip] = useState(contact.zip);
    const [phoneNumber, setPhoneNumber] = useState(contact.phone_number);
    const [fax, setFax] = useState(contact.fax);
    const [email, setEmail] = useState(contact.email);
    const [website, setWebsite] = useState(contact.website);

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
                setContact(response.data)
            }
            handleClose()
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Failed to update data: ' + error.message); // Providing feedback to the user
        }
    }
}));


    return (
        <div className="tab-pane fade" id="treatment-location-tab" role="tabpanel" aria-labelledby="treatment-location-link">
            <form id="editClientForm2_treatment_location">
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

export default TreatmentLocation
