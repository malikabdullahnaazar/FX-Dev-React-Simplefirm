import React, {useState, useEffect} from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import {fetchInboxPage, fetchInboxDocumentHistory, fetchInboxTabCount} from "../Providers/main";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPanelId, setSelectedPanelName, setTabsToShow, setUnsortedCase, setUnsortedPage, setInboxDocPanels, setInboxTableLoader, setInboxTabsCount, setInboxDocumentHistory, setInboxProcessingDocuments, setInboxFailedOcrDocuments, setInboxAllDocuments } from '../Redux/inbox/actions';
import InboxDashboard from "../Components/InboxDashboard/main";
import { getClientId, getCaseId } from "../Utils/helper";

const InboxPage = () => {
    const dispatch = useDispatch()
    const inboxTab = useSelector((state) => state.inbox.inboxTab);
    const inboxTabsCount = useSelector((state) => state.inbox.inboxTabsCount);
    const inboxRefreshDocuments = useSelector((state) => state.inbox.inboxRefreshDocuments);
    
    useEffect(() => {
        dispatch(setTabsToShow({}))
        dispatch(setSelectedPanelId("-1"))
        dispatch(setSelectedPanelName())
        dispatch(setInboxTableLoader(true))
        dispatch(setUnsortedCase(true))
        dispatch(setUnsortedPage(true))
        
        if (inboxTab == 'document_history') {
            fetchInboxDocumentHistory(dispatch, setInboxDocumentHistory, setInboxTableLoader)
        } else {
            fetchInboxPage(dispatch, setInboxDocPanels, setInboxTableLoader, inboxTab)
        }
        fetchInboxTabCount(dispatch, setInboxTabsCount)
    }, [inboxTab, inboxRefreshDocuments])
    
    return (
        <>
            <div className='inbox-page'>
                <div className="page-wrapper">
                    <Sidebar />
                    <div className="page-container">
                        <NavBar flaggedPageName="Inbox" />
                        <InboxDashboard  />
                    </div>
                </div>
            </div>
        </>
    );
}

export default InboxPage;