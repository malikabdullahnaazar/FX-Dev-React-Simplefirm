import React from 'react';
import DocumentHistoryTableRow from './documentHistoryTableRow';
import { useSelector } from 'react-redux';

const DocumentHistoryTable = () => {
    const inboxDocumentHistory = useSelector((state) => state.inbox.inboxDocumentHistory);
    
    return (
    <>
        <div className="row m-0">
            <div className="col-md-12 pl-0 pr-0">
                <div className="no-border-1 table-responsive table--no-card m-b-40 position-relative has-tint-rows has-tint-h-35">
                    <table className="table table-earning t-b-0 table-history table-striped" id="table-1">
                        <thead>
                            <tr>
                                <th scope="col" className="inbox-width-1-p"></th>
                                <th className="text-center">Case</th>
                                <th className="inbox-width-290px text-center">Document</th>
                                <th colspan="3" className="text-center">Document Sorted To</th>
                                <th colspan="2" className="text-center">Sorted By</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            inboxDocumentHistory ? 
                            inboxDocumentHistory?.map((doc, index) => <DocumentHistoryTableRow index={index+1} doc={doc} />) 
                            : null
                        }

                            <tr style={{height: "140px" }} className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr style={{height: "140px" }} className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr style={{height: "140px" }} className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr style={{height: "140px" }} className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr style={{height: "140px" }} className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr style={{height: "140px" }} className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr style={{height: "140px" }} className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            
                        </tbody>

                    </table>
                </div>
            </div>
        </div>

    </>
  )
}

export default DocumentHistoryTable;