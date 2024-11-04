import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

function SimplePageLocation({ caseProvider, specialitie, contact, handleShow }) {

    return (
        <div
            className="col w-515 p-0 d-flex flex-column overflow-x-hidden "
            id="treatment_location_info"
            data-toggle="modal" data-target="#case-provider-edit-modal"
            onClick={handleShow}
        >
            <div
                className="d-flex cursor-pointer flex-wrap min-h-45"
                onmouseover="this.style.backgroundColor='#eee'"
                onmouseout="this.style.backgroundColor='#fff'"
                style={{ backgroundColor: "rgb(255, 255, 255)" }}
            >
                <div className="col p-0 w-contact-box m-r-5">
                    <div className="colFonts colFont info_address m-0 text-truncated">
                        {contact.name ? contact.name : <span class="text-primary-20">Company Name</span>}
                    </div>
                    <div className="colFonts colFont info_address m-0">
                        {contact.address1 ? contact.address1 : <span class="text-primary-20">Address,</span>}
                        {contact.address2 ? contact.address2 : <span class="text-primary-20"></span>}
                    </div>
                    <div className="colFonts colFont info_city_state_zip m-0">
                        {contact.city ? `${contact.city}, ` : <span class="text-primary-20">City, </span>}
                        {contact.state ? <span style={{ marginRight: '16px' }}>{contact.state}</span> : 
                        <span class="color-primary">State,</span>}
                        {contact.zip ? contact.zip : <span class="text-primary-20">Zip</span>}
                    </div>
                </div>
                <div className="col w-contact-box  p-0">
                    <div className="">
                        <p className="colText colFont m-0 info_phone_number  ">
                            {
                                contact.phone_number ?
                                    `(${contact.phone_number.slice(0, 3)}) ${contact.phone_number.slice(3, 6)}-${contact.phone_number.slice(6, 10)}` :
                                    <span className="text-primary-20">(###) ###-####</span>
                            }
                        </p>
                        <p className="colText colFont m-0 info_fax ">
                            {
                                contact.fax ?
                                    <>({contact.fax.slice(0, 3)}) {contact.fax.slice(3, 6)}-{contact.fax.slice(6, 10)}</> :
                                    <span className="text-primary-20"> (###) ###-####</span>
                            }
                            <small className="ml-2 text-grey">fax</small>
                        </p>
                        {
                            contact.website ?
                                <p className=" email-text text-center">
                                    <a className="colText colFont" href={contact.website}
                                        target="_blank">{contact.website}</a>
                                </p> :
                                <div class="mb-0 text-center">
                                    <div class="colFonts colFont info_address">
                                    www.providerurl.com
                                    </div>

                                    <div class="colFonts colFont info_city_state_zip"> </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
            <div className="mt-auto d-flex f-gap-05">
                <div className="col w-contact-box p-0">
                    <a
                        href="#"
                        className="mt-1 btn btn-primary-lighter-default font-weight-semibold btn-white-hover c-border-style
                        btn-primary-10 text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
                        data-toggle="modal"
                        data-target="#generateDocument"
                    >
                        <i className="ic ic-19 ic-generate-document m-r-5"></i>
                        Generate Document
                    </a>
                </div>
                <div className="col w-contact-box p-0">
                    <a href="#"
                        className="mt-1 btn btn-primary-lighter-default btn-white-hover font-weight-semibold c-border-style
                        btn-primary-10 text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5">
                        <i className="ic ic-19 ic-email-3d m-r-5"></i>
                        {contact.email ? <span className="email-text">{contact.email}</span> :
                            <span className="text-primary-20">email@address.com</span>}
                    </a>
                </div>
            </div>

        </div>
    )
}

export default SimplePageLocation
