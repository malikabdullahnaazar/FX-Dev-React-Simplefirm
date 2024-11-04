import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setInboxTab, setInboxDocPanels } from "../../Redux/inbox/actions";

const InboxActionBar = (props) => {
    const dispatch = useDispatch()
    const inboxTab = useSelector((state) => state.inbox.inboxTab);
    const inboxTabsCount = useSelector((state) => state.inbox.inboxTabsCount);
    const inboxDocPanels = useSelector((state) => state.inbox.inboxDocPanels);
    const inboxAllDocuments = useSelector((state) => state.inbox.inboxAllDocuments);
    const handleTabChange = (tab_name) => {
        dispatch(setInboxTab(tab_name))
        dispatch(setInboxDocPanels([]))
    } 
    return (
        <div className="action-bar client-BarAlign main-action-bar  d-flex justify-content-between m-b-5 m-t-5 ">
            <div className="d-flex align-items-center">
                <span className="page-icon"><img src="/BP_resources/images/icon/inbox-icon-color.svg"/></span>
                <div className="text-wrapper text-white d-flex align-items-center">
                    <h2 className="text-white">Inbox</h2>
                </div>
            </div>
            <div className="nav nav-tabs align-items-center" id="nav-tab" role="tablist">
                <a onClick={() => handleTabChange("processing")} id='processing' className={"nav-item nav-link  btn btn-primary rounded-0 " + (inboxTab == 'processing' ? 'active': '')} data-toggle="tab" href="#inbox-tab-processing" role="tab" aria-controls="all" aria-selected="true">
                    Processing 
                    <span style={{ paddingTop: "7px", fontSize: "14px" }} className="badge bg-primary-85 rounded-circle font-weight-normal">
                    {inboxTabsCount['processing']}
                    </span>
                </a>
                {/* <a onClick={() => handleTabChange("")} id='all' className={"nav-item nav-link btn btn-primary rounded-0 " + (inboxTab == 'all' ? 'active': '')} data-toggle="tab" href="#inbox-tab-all" role="tab" aria-controls="all" aria-selected="true">
                    All 
                    <span style={{ paddingTop: "7px" }} className="badge bg-primary-85 rounded-circle font-weight-normal">
                    {inboxTabsCount['all']}
                    </span>
                </a> */}
                <a onClick={() => handleTabChange("client")} id='client' className={"nav-item nav-link btn btn-primary rounded-0 " + (inboxTab == 'client' ? 'active': '')}  data-toggle="tab" href="#inbox-tab-1" role="tab" aria-controls="all" aria-selected="true" >
                    Client 
                    <span style={{ paddingTop: "7px", fontSize: "14px" }} className="badge bg-primary-85 rounded-circle font-weight-normal">
                    {inboxTabsCount['client']}
                    </span>
                </a>
                <a onClick={() => handleTabChange("check")} id='check' className={"nav-item nav-link btn btn-primary rounded-0 " + (inboxTab == 'check' ? 'active': '')}  data-toggle="tab" href="#inbox-tab-2" role="tab" aria-controls="all" aria-selected="true" >
                    Check 
                    <span style={{ paddingTop: "7px", fontSize: "14px" }} className="badge bg-primary-85 rounded-circle font-weight-normal">
                    {inboxTabsCount['check']}
                    </span>
                </a>
                <a onClick={() => handleTabChange("insurance")} id='insurance' className={"nav-item nav-link btn btn-primary rounded-0 " + (inboxTab == 'insurance' ? 'active': '')}  data-toggle="tab" href="#inbox-tab-3" role="tab" aria-controls="all" aria-selected="true" >
                    Insurance 
                    <span style={{ paddingTop: "7px", fontSize: "14px" }} className="badge bg-primary-85 rounded-circle font-weight-normal">
                    {inboxTabsCount['insurance']}
                    </span>
                </a>
                <a onClick={() => handleTabChange("account")} id='account' className={"nav-item nav-link btn btn-primary rounded-0 " + (inboxTab == 'account' ? 'active': '')}  data-toggle="tab" href="#inbox-tab-4" role="tab" aria-controls="all" aria-selected="true" >
                    Account 
                    <span style={{ paddingTop: "7px", fontSize: "14px" }} className="badge bg-primary-85 rounded-circle font-weight-normal">
                    {inboxTabsCount['account']}
                    </span>
                </a>
                <a onClick={() => handleTabChange("ocr_failed")} id='ocr_failed' className={"nav-item nav-link btn btn-primary rounded-0 " + (inboxTab == 'ocr-failed' ? 'active': '')}  data-toggle="tab" href="#inbox-tab-8" role="tab" aria-controls="all" aria-selected="true" >
                    OCR Failed 
                    <span style={{ paddingTop: "7px", fontSize: "14px" }} className="badge bg-primary-85 rounded-circle font-weight-normal">
                    {inboxTabsCount['ocr_failed']}
                    </span>
                </a>
                <a onClick={() => handleTabChange("unidentified")} id='unidentified' className={"nav-item nav-link btn btn-primary rounded-0 " + (inboxTab == 'unidentified' ? 'active': '')}  data-toggle="tab" href="#inbox-tab-7" role="tab" aria-controls="all" aria-selected="true">
                    UnIdentified 
                    <span style={{ paddingTop: "7px", fontSize: "14px" }} className="badge bg-primary-85 rounded-circle font-weight-normal">
                    {inboxTabsCount['unidentified']}
                    </span>
                </a>
            </div>
            <div className="nav nav-tabs" role="tablist">
                <a onClick={() => handleTabChange("document_history")} id='document-history' className={"pb-1 nav-item nav-link  btn btn-primary rounded-0 " + (inboxTab == 'document-history' ? 'active': '')} data-toggle="tab" href="#inbox-tab-processing" role="tab" aria-controls="all" aria-selected="true">
                   Document History
                </a>
            </div>
            
        </div>
    );
}

export default InboxActionBar;