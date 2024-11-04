import React, { useEffect } from "react";
import incident from "../../../public/bp_assets/img/incident.svg";

const ClientName = ({ first_name, last_name, clientCasesProp }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '');
        const day = String(date.getDate()).padStart(2, '');
        return `${month}/${day}/${year}`;
    };

    const clientCases = [...clientCasesProp];
    const caseCount = clientCases.length;
    const initialFakeRows = 3;
    const caseFakeRows = Math.max(0, initialFakeRows - caseCount);

    return (
        <>
            <div className="client-contact-phone-col client-contact-col c-case custom-w-mw client-contact-wrapper height-70 m-r-5">
                <div>
                    <h4 className="client-contact-title text-center height-20">
                        {first_name ? first_name : ''} {last_name ? last_name : ''} Case History
                    </h4>
                </div>
                <div>
                    <div className="row">
                        <div
                            className="table-responsive table--no-card border-0 has-alternate-grey insurance-col-table panel-notes-section-height"
                            style={{ height: "92px", overflowY: "scroll", scrollbarWidth: "none" }}
                        >
                            <table className="table table-borderless table-striped table-earning">
                                <tbody className="tbody-panels">
                                    {clientCases &&
                                        clientCases.length > 0 &&
                                        clientCases.map((cases, index) => (
                                            <tr className="" key={index}>
                                                <td className="height-21 text-left">
                                                    <i className="ic ic-accident ic-19"></i>
                                                    <span className="white-space-nowrap  ml-2">{cases?.case_type}</span>
                                                </td>
                                                <td className="height-25 text-left">
                                                    {cases.incident_date ? (
                                                        <span>
                                                            <span><img src={incident} alt='primary' className="ic-19" /></span>
                                                            <span className="font-weight-semibold p-t-8"> {formatDate(cases?.incident_date)}</span>
                                                        </span>
                                                    ) : (
                                                        null
                                                    )}
                                                </td>
                                                <td className="height-21 text-left">
                                                    {cases?.auto_case_stage &&
                                                        cases?.auto_case_stage?.length > 0 &&
                                                            cases?.auto_case_stage?.map((stages, index) =>(
                                                        <span key={index}>
                                                            <span className="font-weight-semibold">{stages}</span>
                                                        </span>
                                                    ))}
                                                </td>
                                                <td className="height-21 text-center p-t-8">
                                                    {cases.open === 'True' ? (
                                                        <>
                                                            <span className="color-green font-weight-bold">OPEN:</span>
                                                            <span className="font-weight-semibold ml-1">{formatDate(cases?.date_open)}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="colorgrey-2 font-weight-bold">CLOSED</span>
                                                            <span className="font-weight-semibold ml-1">{formatDate(cases?.date_closed)}</span>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    {[...Array(caseFakeRows)].map((_, index) => (
                                        <tr key={`additional-${index}`} className="fake-row-2" style={{ height: "15px" }}>
                                            <td colSpan="6">&nbsp;</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientName;

