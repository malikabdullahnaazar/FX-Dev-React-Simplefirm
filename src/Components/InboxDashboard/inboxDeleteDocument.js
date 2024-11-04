import React from "react";
import { deleteDocument } from "../../Providers/main";
import { useDispatch, useSelector } from 'react-redux';
import { setInboxRefreshDocuments } from "../../Redux/inbox/actions";

const InboxDeleteDocument = (props) => {
    const dispatch = useDispatch()
    const inboxRefreshDocuments = useSelector((state) => state.inbox.inboxRefreshDocuments);
    const inboxTab = useSelector((state) => state.inbox.inboxTab);
    
    const handleDocumentDeletion = () => {
        deleteDocument(props.document_id, dispatch, inboxRefreshDocuments, setInboxRefreshDocuments)
    }

    const capitalizeFirstLetter = () => {
        return inboxTab.charAt(0).toUpperCase() + inboxTab.slice(1);
    }

    return (
        <a onClick={handleDocumentDeletion} id="removeButton" href="#" data-dismiss='modal' className="btn delete-document height-35 delete-margin-custom mb-1">
            Delete Document From {capitalizeFirstLetter()}
        </a>
    );
}

export default InboxDeleteDocument;