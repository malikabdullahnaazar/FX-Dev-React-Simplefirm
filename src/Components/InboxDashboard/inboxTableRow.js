import React, { useState } from "react";
import NestedDropdown from "./nestedDropdown";
import TempNestedDropdown from "./tempNestedDropdown";
import { attachDocToPage, fetchTaskDocumentPopupData, updateCheckStatus } from '../../Providers/main';
import InboxConfirmationModalBody from "../Modals/inboxConfirmationModalBody";
import { useSelector } from "react-redux";
import { Tune } from "@mui/icons-material";

const InboxTableRow = (props) => {
    const [inboxConfirmationModalShow, setInboxConfirmationModalShow] = useState(false);
    const [inboxConfirmationContent, setInboxConfirmationContent] = useState({});
    const [taskDocumentPopupData, setTaskDocumentPopupData] = useState({});
    const unsortedCase = useSelector((state) => state.inbox.unsortedCase);
    const unsortedPage = useSelector((state) => state.inbox.unsortedPage);
    
    const [selectedData, setSelectedData] = useState({
        'page_id': props.case?.selected_pages ? props.case?.selected_pages[0]?.id : '',
        'slot': "",
        'panel': "-1"
    })
    
    const showInboxConfirmationModal = () => {
        setInboxConfirmationModalShow(!inboxConfirmationModalShow)
        var modalId = document.getElementById('confirmationModal');
        window.$(modalId).modal();
        window.$('.modal-backdrop').addClass('modal-rel-backdrop').appendTo(window.$(modalId).parent());
        window.$('body').removeClass('modal-open');
    }

    const handleUpdateCheckStatus = (action) => {
        updateCheckStatus(
            props.check?.id,
            props.document?.id, 
            action,
            (res) => {
                let user_ids = new Set();
                for (let i = 1; i < 7; i++) {
                    if(props.case[`user_type${i}_active`]) {
                        if(props.case[`user_type${i}_active`] == true) {
                            user_ids.add(props.case[`firm_user${i}`]?.id)
                        }
                    }
                }
                let unique_user_ids = Array.from(user_ids);
                fetchTaskDocumentPopupData(res?.docData?.for_client?.id, res?.docData?.for_case?.id, JSON.stringify(unique_user_ids), props.document?.id, setTaskDocumentPopupData)
                setInboxConfirmationContent(res?.docData)
                showInboxConfirmationModal()       
            }
        )
    }

    const handleAttachDocToPage = (type=null) => {
        let panels = "True"
        if(!selectedData["panel"] || selectedData["panel"] == "-1" || selectedData["panel"] == ""){
            panels = "False"
        }
        if(props.inboxTab == 'insurance') {
            attachDocToPage(
                selectedData["page_id"], 
                props.case?.id,
                panels, 
                props.document?.id, 
                selectedData["slot"], 
                selectedData["panel"],
                props.insurance?.id,
                null,
                type,
                false,
                false,
                (res) => {
                    let user_ids = new Set();
                    for (let i = 1; i < 7; i++) {
                        if(props.case[`user_type${i}_active`]) {
                            if(props.case[`user_type${i}_active`] == true) {
                                user_ids.add(props.case[`firm_user${i}`]?.id)
                            }
                        }
                    }
                    let unique_user_ids = Array.from(user_ids);
                    fetchTaskDocumentPopupData(res?.docData?.for_client?.id, res?.docData?.for_case?.id, JSON.stringify(unique_user_ids), props.document?.id, setTaskDocumentPopupData)
                    setInboxConfirmationContent(res?.docData)
                    showInboxConfirmationModal()
                    
                }
            )
        } else if (props.inboxTab == 'account') {
            attachDocToPage(
                selectedData["page_id"], 
                props.case?.id,
                panels, 
                props.document?.id, 
                selectedData["slot"], 
                selectedData["panel"],
                null,
                props.account?.id,
                type,
                false,
                false,
                (res) => {
                    let user_ids = new Set();
                    for (let i = 1; i < 7; i++) {
                        if(props.case[`user_type${i}_active`]) {
                            if(props.case[`user_type${i}_active`] == true) {
                                user_ids.add(props.case[`firm_user${i}`]?.id)
                            }
                        }
                    }
                    let unique_user_ids = Array.from(user_ids);
                    fetchTaskDocumentPopupData(res?.docData?.for_client?.id, res?.docData?.for_case?.id, JSON.stringify(unique_user_ids), props.document?.id, setTaskDocumentPopupData)
                    setInboxConfirmationContent(res?.docData)
                    showInboxConfirmationModal()
                    
                }
            )
        } 
        else {
            if(unsortedCase == true) {
                attachDocToPage(
                    null, 
                    props.case?.id,
                    panels, 
                    props.document?.id, 
                    null, 
                    null,
                    null,
                    null,
                    type,
                    true,
                    false,
                    (res) => {
                        let user_ids = new Set();
                        for (let i = 1; i < 7; i++) {
                            if(props.case[`user_type${i}_active`]) {
                                if(props.case[`user_type${i}_active`] == true) {
                                    user_ids.add(props.case[`firm_user${i}`]?.id)
                                }
                            }
                        }
                        let unique_user_ids = Array.from(user_ids);
                        fetchTaskDocumentPopupData(res?.docData?.for_client?.id, res?.docData?.for_case?.id, JSON.stringify(unique_user_ids), props.document?.id, setTaskDocumentPopupData)
                        setInboxConfirmationContent(res?.docData)
                        showInboxConfirmationModal()
                    }
                )
            } else if (unsortedCase == false && unsortedPage==true) {
                attachDocToPage(
                    selectedData["page_id"], 
                    props.case?.id,
                    panels, 
                    props.document?.id, 
                    null, 
                    null,
                    null,
                    null,
                    type,
                    false,
                    true,
                    (res) => {
                        let user_ids = new Set();
                        for (let i = 1; i < 7; i++) {
                            if(props.case[`user_type${i}_active`]) {
                                if(props.case[`user_type${i}_active`] == true) {
                                    user_ids.add(props.case[`firm_user${i}`]?.id)
                                }
                            }
                        }
                        let unique_user_ids = Array.from(user_ids);
                        fetchTaskDocumentPopupData(res?.docData?.for_client?.id, res?.docData?.for_case?.id, JSON.stringify(unique_user_ids), props.document?.id, setTaskDocumentPopupData)
                        setInboxConfirmationContent(res?.docData)
                        showInboxConfirmationModal()
                    }
                )
            } else {
                attachDocToPage(
                    selectedData["page_id"], 
                    props.case?.id,
                    panels, 
                    props.document?.id, 
                    selectedData["slot"], 
                    selectedData["panel"],
                    null,
                    null,
                    type,
                    false,
                    false,
                    (res) => {
                        let user_ids = new Set();
                        for (let i = 1; i < 7; i++) {
                            if(props.case[`user_type${i}_active`]) {
                                if(props.case[`user_type${i}_active`] == true) {
                                    user_ids.add(props.case[`firm_user${i}`]?.id)
                                }
                            }
                        }
                        let unique_user_ids = Array.from(user_ids);
                        fetchTaskDocumentPopupData(res?.docData?.for_client?.id, res?.docData?.for_case?.id, JSON.stringify(unique_user_ids), props.document?.id, setTaskDocumentPopupData)
                        setInboxConfirmationContent(res?.docData)
                        showInboxConfirmationModal()
                    }
                )
            }
        }
    }
    
    function formatDate(isoString) {
        const date = new Date(isoString);
    
        const month = String(date.getMonth() + 1); // getMonth() is zero-based
        const day = String(date.getDate());
        const year = date.getFullYear();
    
        return `${month}/${day}/${year}`;
    }
    return (
        <>
        <tr style={{ textAlign: "left" }} className="search-row fake-row-2 vertical-align-middle">
            <td className="text-dark-grey text-center">
                {props.index}
            </td>
            <td  className="">
                <div style={{ paddingTop: "20px" }} className="d-flex align-items-center client-name-box account_text-ellipsis">
                    <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                        {props.case?.for_client?.profile_pic_19p && <img src={props.case?.for_client?.profile_pic_19p} className="output-3 theme-ring" />}
                    </span>
                    <span className="ml-2 text-black text-black-2 whitespace-nowrap account_text-ellipsis font-600">
                        <b>
                        {props.case?.for_client?.last_name}, {props.case?.for_client?.first_name}
                        </b>
                    </span>
                </div>
                <p className="search-Flex-1" style={{ height: '20px' }}>
                    <img src="/c73278d64b4a4810f874.svg" class="mr-2"></img>
                    {formatDate(props.case?.for_client?.birthday)}
                </p>
                <div className="">  
                    <div className="search-Flex-1" style={{ height: '20px' }}>  
                        {props.case?.case_type?.casetype_icon && <img className="mr-2" src={props.case?.case_type?.casetype_icon} />}
                        <p className="MR8H19">{props.case?.case_type?.name}</p>
                    </div>
                    <p className="search-Flex-1" style={{ height: '20px' }}>
                        <img src="/b14998c1ad969183c291.svg" class="mr-2"></img>
                        {props.case?.incident_date ? formatDate(props.case?.incident_date) : "-"}
                    </p>
                </div>
            </td>
            {
                props.inboxTab == 'insurance' ?
                <>
                <td  className="">
                    <div style={{ paddingTop: "20px" }} className="align-items-center client-name-box">
                        <div>
                            <p className="pb-0 mb-0">
                                {props.insurance?.insurance_type?.name ? props.insurance?.insurance_type?.name : "-"} 
                            </p>
                        </div>
                        <div>
                            <p className="">
                                {props.insurance?.company?.company_name ? props.insurance?.company?.company_name : "-"}
                            </p>
                        </div>
                    </div>
                </td>
                <td  className="">
                    <div style={{ paddingTop: "20px" }} className="align-items-center client-name-box">
                        <div>
                            <p className="pb-0 mb-0">
                                {props.insurance?.claim_number ? props.insurance?.claim_number : "-"}
                            </p>
                        </div>
                        <div>
                            <p className="">
                                {props.insurance?.policy_number ? props.insurance?.policy_number : "-"}
                            </p>
                        </div>
                    </div>
                </td>
                <td  className="">
                    <div style={{ paddingTop: "20px" }} className="align-items-center client-name-box">
                        <div>
                            <p className="pb-0 mb-0">
                                {props.case?.court_name ? props.case?.court_name : "-"}
                            </p>
                        </div>
                        <div>
                            <p className="">
                                {props.case?.case_number ? props.case?.case_number : "-"}
                            </p>
                        </div>
                    </div>
                </td>
                </>
                :
                null
            }
            {
                props.inboxTab == 'account' ? 
                <>
                <td  className="">
                    <div style={{ paddingTop: "20px" }} className="align-items-center client-name-box">
                        <div>
                            <p className="pb-0 mb-0">
                                {props.account?.payee ? props.account?.payee : "-"} 
                            </p>
                        </div>
                        <div>
                            <p className="">
                                {props.account?.invoice_number ? props.account?.invoice_number : "-"}
                            </p>
                        </div>
                    </div>
                </td>
                <td style={{width: "100%"}} className="text-center">
                    <div style={{ alignItems: "center" }} className="d-flex justify-content-center btn-group-vertical">
                        <div>
                            <button onClick={() => handleAttachDocToPage('invoice')} style={{ width: "150px" }} className="btn btn-secondary btn-secondary-hover-green mb-2 height-25 d-flex align-items-center justify-content-center" >
                                Invoice
                            </button>
                        </div>
                        <div>
                            <button onClick={() => handleAttachDocToPage('verify')} style={{ width: "150px" }} className="btn btn-secondary btn-secondary-hover-green mb-2 height-25 d-flex align-items-center justify-content-center" >
                                Verification
                            </button>
                        </div>
                    </div>
                </td>
                </>
                :
                <>
                    {/* <td style={{width: "100%"}} className="text-center">
                        <div className="justify-content-center" style={{width: "100%"}} >
                            <form className="notes-form-2 notes-form-without-flex"  id="notes-form" style={{height: "100%"}}>
                                <TempNestedDropdown inboxTab={props.inboxTab} setSelectedData={setSelectedData} case={props.case} />
                            </form>
                        </div>
                    </td> */}
                    <td style={{width: "100%"}} className="text-center">
                        <div className="justify-content-center" style={{width: "100%"}} >
                            <form className="notes-form-2 notes-form-without-flex"  id="notes-form" style={{height: "100%"}}>
                                <NestedDropdown inboxTab={props.inboxTab} setSelectedData={setSelectedData} case={props.case} />
                            </form>
                        </div>
                    </td>
                </>
            }
            {
                props.inboxTab == 'check' ? 
                <>
                    <td  className="">
                        <div style={{ paddingTop: "20px" }} className="align-items-center client-name-box">
                            <div>
                                <p className="">
                                    {props.check?.bank_account?.account_number ? ("*"+props.check?.bank_account?.account_number?.slice(-4)) : "-"} 
                                </p>
                            </div>
                        </div>
                    </td>
                    <td  className="">
                        <div style={{ paddingTop: "20px" }} className="align-items-center client-name-box">
                            <div>
                                <p className="">
                                    {props.check?.cheque_number ? props.check?.cheque_number : "-"} 
                                </p>
                            </div>
                        </div>
                    </td>
                    <td  className="">
                        <div style={{ paddingTop: "20px" }} className="align-items-center client-name-box">
                            <div>
                                <p className="">
                                    {props.check?.cheque_date ? props.check?.cheque_date?.split("T")[0] : "-"} 
                                </p>
                            </div>
                        </div>
                    </td>
                    <td  className="">
                        <div style={{ paddingTop: "20px" }} className="align-items-center client-name-box">
                            <div>
                                <p className="">
                                    ${props.check?.amount ? props.check?.amount : "-"} 
                                </p>
                            </div>
                        </div>
                    </td>
                </>
                :
                null
            }
            <td style={{width: "35%"}} className="text-right mr-2">
                <div className="ml-4 users-account">
                    <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input className="mr-1 checkbox " onclick = "event.stopPropagation();"  type="checkbox" user_id={props.case?.firm_user1 ? props.case.firm_user1.id : ""} checked={props.case["user_type1_active"] == true} />
                        <div style={{ textAlign: "left", fontWeight: "400" }} className=" text-darker user-designation">{props.case?.user_type1 ? props.case["user_type1"] : null}</div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user1 && props.case?.firm_user1?.profile_pic_19p && <img src={props.case["firm_user1"]["profile_pic_19p"]} />}               
                        </div>
                        <div style={{fontWeight: "400"}} className=" text-darker ml-2">{props.case?.firm_user1 ? props.case?.firm_user1?.user?.first_name : null}  {props.case?.firm_user1 ? props.case?.firm_user1?.user?.last_name : null}</div>
                    </div> 
                    <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input className="mr-1 checkbox " onclick = "event.stopPropagation();"  type="checkbox" user_id={props.case?.firm_user2 ? props.case.firm_user2.id : ""} checked={props.case["user_type2_active"] == true} />
                        <div style={{ textAlign: "left", fontWeight: "400" }} className=" text-darker user-designation">{props.case?.user_type2 ? props.case["user_type2"] : null}</div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user2 && props.case?.firm_user2?.profile_pic_19p && <img src={props.case["firm_user2"]["profile_pic_19p"]} />}               
                        </div>
                        <div style={{fontWeight: "400"}} className=" text-darker ml-2">{props.case?.firm_user2 ? props.case?.firm_user2?.user?.first_name : null}  {props.case?.firm_user2 ? props.case?.firm_user2?.user?.last_name : null}</div>
                    </div> 
                    <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input className="mr-1 checkbox " onclick = "event.stopPropagation();"  type="checkbox" user_id={props.case?.firm_user3 ? props.case.firm_user3.id : ""} checked={props.case["user_type3_active"] == true} />
                        <div style={{ textAlign: "left", fontWeight: "400" }} className=" text-darker user-designation">{props.case?.user_type3 ? props.case["user_type3"] : null}</div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user3 && props.case?.firm_user3?.profile_pic_19p && <img src={props.case["firm_user3"]["profile_pic_19p"]} />}               
                        </div>
                        <div style={{fontWeight: "400"}} className=" text-darker ml-2">{props.case?.firm_user3 ? props.case?.firm_user3?.user?.first_name : null}  {props.case?.firm_user3 ? props.case?.firm_user3?.user?.last_name : null}</div>
                    </div> 
                    <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input className="mr-1 checkbox " onclick = "event.stopPropagation();"  type="checkbox" user_id={props.case?.firm_user4 ? props.case.firm_user4.id : ""} checked={props.case["user_type4_active"] == true} />
                        <div style={{ textAlign: "left", fontWeight: "400" }} className=" text-darker user-designation">{props.case?.user_type4 ? props.case["user_type4"] : null}</div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user4 && props.case?.firm_user4?.profile_pic_19p && <img src={props.case["firm_user4"]["profile_pic_19p"]} />}               
                        </div>
                        <div style={{fontWeight: "400"}} className=" text-darker ml-2">{props.case?.firm_user4 ? props.case?.firm_user4?.user?.first_name : null}  {props.case?.firm_user4 ? props.case?.firm_user4?.user?.last_name : null}</div>
                    </div> 
                    <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input className="mr-1 checkbox " onclick = "event.stopPropagation();"  type="checkbox" user_id={props.case?.firm_user5 ? props.case.firm_user5.id : ""} checked={props.case["user_type5_active"] == true} />
                        <div style={{ textAlign: "left", fontWeight: "400" }} className=" text-darker user-designation">{props.case?.user_type5 ? props.case["user_type5"] : null}</div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user5 && props.case?.firm_user5?.profile_pic_19p && <img src={props.case["firm_user5"]["profile_pic_19p"]} />}               
                        </div>
                        <div style={{fontWeight: "400"}} className=" text-darker ml-2">{props.case?.firm_user5 ? props.case?.firm_user5?.user?.first_name : null}  {props.case?.firm_user4 ? props.case?.firm_user5?.user?.last_name : null}</div>
                    </div> 
                    <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input className="mr-1 checkbox " onclick = "event.stopPropagation();"  type="checkbox" user_id={props.case?.firm_user6 ? props.case.firm_user6.id : ""} checked={props.case["user_type6_active"] == true} />
                        <div style={{ textAlign: "left", fontWeight: "400" }} className=" text-darker user-designation">{props.case?.user_type6 ? props.case["user_type6"] : null}</div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user6 && props.case?.firm_user6?.profile_pic_19p && <img src={props.case["firm_user6"]["profile_pic_19p"]} />}               
                        </div>
                        <div style={{fontWeight: "400"}} className=" text-darker ml-2">{props.case?.firm_user6 ? props.case?.firm_user6?.user?.first_name : null}  {props.case?.firm_user6 ? props.case?.firm_user6?.user?.last_name : null}</div>
                    </div> 
                </div>
            </td>
            {
                props.inboxTab == 'check' ?
                <td style={{width: "100%"}} className="text-center">
                    <div style={{ alignItems: "center" }} className="d-flex justify-content-center btn-group-vertical">
                        <div>
                            <button onClick={() => handleUpdateCheckStatus('Sent')} style={{ width: "150px" }} className="btn btn-primary mb-2 height-25 d-flex align-items-center justify-content-center" >
                                Sent
                            </button>
                        </div>
                        <div>
                            <button onClick={() => handleUpdateCheckStatus('Cleared')} style={{ width: "150px" }} className="btn btn-primary mb-2 height-25 d-flex align-items-center justify-content-center" >
                                Cleared
                            </button>
                        </div>
                    </div>
                </td>
                :
                <td style={{width: "100%"}} className="text-center">
                    <div style={{ alignItems: "center" }} className="d-flex justify-content-center btn-group-vertical">
                        <div>
                            <button onClick={() => handleAttachDocToPage()} style={{ width: "100px" }} className="btn delete-document green-bg-hover green-bg d-flex align-items-center justify-content-center" >
                                Save to <br />Case 
                            </button>
                        </div>
                    </div>
                </td>
            }
        </tr>
        <div data-keyboard="false" data-backdrop="static" className="modal modal-rel fade show" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" id="confirmationModal">
            <div className="modal-dialog modal-dialog-centered inbox-confirmation-modal">
                <div className="modal-content inbox-confirmation-content">
                    <InboxConfirmationModalBody taskDocumentPopupData={taskDocumentPopupData} inboxConfirmationContent={inboxConfirmationContent} onHide={() => setInboxConfirmationModalShow(false)} />

                </div>
            </div>
        </div>
        </>
    );
}

export default InboxTableRow;