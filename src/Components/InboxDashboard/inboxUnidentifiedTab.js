import React, {useState} from "react";
import DocumentCarousel from './documentCarousel';
import InboxTableRow from './inboxTableRow';
import {fetchCaseLoad} from '../../Providers/main';
import InboxDeleteDocument from "./inboxDeleteDocument";

const InboxUnidentifiedTab = (props) => {
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
                        <form onSubmit={handleSearchByClientName}>
                            <input value={searchQuery} onChange={(e) => setSearchQuery(e?.target?.value)} type="text" className="form-control" id={"search-doc-"+props.doc_panel?.document?.id} placeholder="Type 3 letters of the client name to search:"/>
                        </form>
                    </div>
                    <InboxDeleteDocument document_id={props.doc_panel?.document?.id} />
                </div> 
                <div className="table-container">
                    <div className="table-responsive table-responsive-2 table--no-card m-b-40 position-relative has-tint-rows has-tint-h-272 has-tint-top-25 ">
                        <table className="table-earning t-b-0 position-relative table-striped" id="table-{{doc_panel.document.id}}-tab1">
                            {!showTableLoader &&
                            <thead>
                                <tr className="">
                                    <th scope="col" className="inbox-width-1-p"></th>
                                    <th className="text-center">Case</th>
                                    <th className="text-center">Select Document Saving Location</th>
                                    <th className="has-dropdown"></th>
                                    <th className="has-form-check"></th>
                                </tr>
                            </thead>
                            }
                            <tbody style={{ maxHeight: '100px !important', overflowY: 'scroll' }}>
                                {showTableLoader ? 
                                    <div style={{ margin: '100px 0px 100px 300px' }} className="loader"></div>
                                    :
                                    <>
                                    { !showDefaultRows &&
                                        searchResults?.map((caseload, index) => <InboxTableRow index={index+1} case={caseload} />)
                                    }
                                    {
                                        showDefaultRows && props.doc_panel ? 
                                            props.doc_panel.searched_clients?.map((searched_client, index) =>  
                                                searched_client.cases?.length > 0 ? <InboxTableRow index={index+1} case={searched_client.cases[0]} /> : null
                                            )
                                            : null
                                    }
                                    </>
                                }
                                {
                                    showDefaultRows && props.doc_panel ? 
                                    <>
                                        <tr className="tab-row table-fake-row">
                                            <td className="text-dark-grey text-center"></td>
                                            <td className="text-dark-grey text-center"></td>
                                            <td className="text-dark-grey text-center"></td>
                                            <td className="text-dark-grey text-center"></td>
                                            <td className="text-dark-grey text-center"></td>
                                        </tr>
                                        <tr className="tab-row table-fake-row">
                                            <td className="text-dark-grey text-center"></td>
                                            <td className="text-dark-grey text-center"></td>
                                            <td className="text-dark-grey text-center"></td>
                                            <td className="text-dark-grey text-center"></td>
                                            <td className="text-dark-grey text-center"></td>
                                        </tr>
                                    </>
                                    : null
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InboxUnidentifiedTab;