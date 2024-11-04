import React, {useState} from "react";
import DocumentCarousel from './documentCarousel';
import InboxTableRow from './inboxTableRow';
import {fetchCaseLoad} from '../../Providers/main';
import InboxDeleteDocument from "./inboxDeleteDocument";

const InboxTable = (props) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDefaultRows, setShowDefaultRows] = useState(true);
    const [showTableLoader, setShowTableLoader] = useState(false);
    
    const handleSearchByClientName = (e) => {
        e.preventDefault();
        if(searchQuery != "") {
            setShowDefaultRows(false)
            setShowTableLoader(true)
            fetchCaseLoad(props.doc_panel?.document?.id, searchQuery, setSearchResults, setShowTableLoader)
        } else {
            setShowTableLoader(false)
            setShowDefaultRows(true)
        }
    }
    
    return (
        <div className="row m-0 mb-2 display-flex-inbox">
            <div className="inbox-document-holder p-0 box-1 m-0" id="colc">
                <DocumentCarousel images={props.doc_panel?.images} />
            </div>
            <div className="full-width-block pl-0 pr-0 box-2 m-0" onclick="openModal(this,{{doc_panel.document.id}})" id="cold">
                <div className="d-flex">
                    <div className="client-search d-flex-1">
                        {props.inboxTab == 'insurance' || props.inboxTab == 'checks' || props.inboxTab == 'account' ? 
                        <form style={{ paddingTop: "10px", fontSize: "15px", fontWeight: "bold" }}>
                            <span>{props.doc_panel?.document?.file_name}</span>
                        </form>
                        :
                        <form onSubmit={handleSearchByClientName}>
                            <input value={searchQuery} onChange={(e) => setSearchQuery(e?.target?.value)} type="text" className="form-control" id={"search-doc-"+props.doc_panel?.document?.id} placeholder="Type 3 letters of the client name to search:"/>
                        </form>
                        }
                        
                    </div>
                    <InboxDeleteDocument document_id={props.doc_panel?.document?.id}  />
                </div> 
                <div className="table-container">
                    <div className="table-responsive table-responsive-2 table--no-card m-b-40 position-relative has-tint-rows has-tint-h-272 has-tint-top-25 ">
                        <table className="table-earning t-b-0 position-relative fake-rows-2 table-striped" id="table-{{doc_panel.document.id}}-tab1">
                            {!showTableLoader &&
                            <thead>
                                {
                                    props.inboxTab == 'insurance' ?
                                    <tr className="">
                                        <th scope="col" className="inbox-width-1-p"></th>
                                        <th className="text-center">Case</th>
                                        <th className="text-center">Insurance Type & Company</th>
                                        <th className="text-center">Claim</th>
                                        <th className="text-center"></th>
                                        <th className="text-center">Select Document Saving Location</th>
                                        <th className="text-center">Send Document Review Task</th>
                                        <th className="has-form-check"></th>
                                    </tr>
                                    :
                                    (
                                        props.inboxTab == 'check' ?
                                        <tr className="">
                                            <th scope="col" className="inbox-width-1-p"></th>
                                            <th className="text-center">Case</th>
                                            <th className="text-center">Select Document Saving Location</th>
                                            <th className="text-center">Account</th>
                                            <th className="text-center">Check Number</th>
                                            <th className="text-center">Check Date</th>
                                            <th className="text-center">Check Amount</th>
                                            <th className="text-center">Send Document Review Task</th>
                                            <th className="has-form-check"></th>
                                        </tr>
                                        :
                                        (
                                            props.inboxTab == 'account' ?
                                            <tr className="">
                                                <th scope="col" className="inbox-width-1-p"></th>
                                                <th className="text-center">Case</th>
                                                <th className="text-center">Invoice</th>
                                                <th className="text-center">Send Document Review Task</th>
                                                <th className="text-center"></th>
                                                <th className="has-form-check"></th>
                                            </tr>
                                            :
                                            <tr className="">
                                                <th scope="col" className="inbox-width-1-p"></th>
                                                <th className="text-center">Case</th>
                                                {/* <th className="text-center">Temporary column</th> */}
                                                <th className="text-center">Select Document Saving Location</th>
                                                <th className="text-center">Send Document Review Task</th>
                                                <th className="has-form-check"></th>
                                            </tr>
                                        )
                                    )
                                }
                                
                            </thead>
                            }
                            <tbody style={{ maxHeight: '100px !important', overflowY: 'scroll' }}>
                                {showTableLoader ? 
                                    <div style={{ margin: '100px 0px 100px 300px' }} className="loader"></div>
                                    :
                                    <>
                                    { !showDefaultRows &&
                                        searchResults?.map((caseload, index) => <InboxTableRow inboxTab={props.inboxTab} document={props.doc_panel?.document} index={index+1} case={caseload} />)
                                    }
                                    {
                                        showDefaultRows && props.doc_panel ? 
                                            props.inboxTab == 'check' ? 
                                                <>
                                                {props.doc_panel.searched_checks?.map((searched_check, index) =>  
                                                    searched_check.cases?.length > 0 && searched_check.cases[0].for_client?.first_name ? <InboxTableRow inboxTab={props.inboxTab} document={props.doc_panel?.document} index={index+1} check={searched_check?.check} case={searched_check?.cases[0]} /> : null
                                                )}
                                                {
                                                    showDefaultRows && props.doc_panel && props.doc_panel.searched_checks?.length == 1 &&
                                                    <tr className="tab-row fake-row-2">
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                    </tr>
                                                }
                                                </>
                                            :
                                            (
                                                props.inboxTab == 'account' ? 
                                                    <>
                                                    {props.doc_panel.searched_accounts?.map((searched_account, index) =>  
                                                        searched_account.cases?.length > 0 && searched_account.cases[0].for_client?.first_name ? <InboxTableRow inboxTab={props.inboxTab} document={props.doc_panel?.document} index={index+1} account={searched_account?.account} case={searched_account?.cases[0]} /> : null
                                                    )}
                                                    {
                                                    showDefaultRows && props.doc_panel && props.doc_panel.searched_accounts?.length == 1 &&
                                                        <tr className="tab-row fake-row-2">
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                        </tr>
                                                    }
                                                    </>
                                            :
                                                (props.inboxTab == 'insurance' ? 
                                                    <>
                                                    {props.doc_panel.searched_insurances?.map((searched_insurance, index) =>  
                                                        searched_insurance.cases?.length > 0 && searched_insurance.cases[0].for_client?.first_name ? <InboxTableRow inboxTab={props.inboxTab} document={props.doc_panel?.document} index={index+1} insurance={searched_insurance?.insurance} case={searched_insurance?.cases[0]} /> : null
                                                    )}
                                                    {
                                                    showDefaultRows && props.doc_panel && props.doc_panel.searched_insurances?.length == 1 &&
                                                        <tr className="tab-row fake-row-2">
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                            <td className="text-dark-grey text-center"></td>
                                                        </tr>
                                                    }
                                                    </>
                                                :
                                                props.doc_panel.searched_clients?.map((searched_client, index) =>  
                                                    searched_client.cases?.length > 0 && searched_client.cases[0].for_client?.first_name ? <InboxTableRow inboxTab={props.inboxTab} document={props.doc_panel?.document} index={index+1} case={searched_client?.cases[0]} /> : null
                                                ))
                                            )
                                            : 
                                            null
                                    }
                                    {
                                        showDefaultRows && props.doc_panel && props.doc_panel.searched_clients?.length == 0 &&
                                        <>
                                            <tr className="tab-row fake-row-2">
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                            </tr>
                                            <tr className="tab-row fake-row-2">
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                            </tr>
                                        </>
                                    }
                                    {
                                        showDefaultRows && props.doc_panel && props.doc_panel.searched_clients?.length == 1 &&
                                        <>
                                            <tr className="tab-row fake-row-2">
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                                <td className="text-dark-grey text-center"></td>
                                            </tr>
                                        </>
                                    }
                                    </>
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InboxTable;