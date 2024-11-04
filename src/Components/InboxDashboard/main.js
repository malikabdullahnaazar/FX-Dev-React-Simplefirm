import React from "react";
import InboxActionBar from "./inboxActionBar";
import InboxTable from "./inboxTable";
import InboxEmptyTable from "./inboxEmptyTable";
import DocumentHistoryTable from "./documentHistoryTable";
import InboxProcessingTab from "./inboxProcessingTab";
import { useSelector } from "react-redux";
import TableLoader from "../Loaders/tableLoader";
import InboxOcrFailedTab from "./inboxOcrFailedTab";
import InboxUnidentifiedTab from "./inboxUnidentifiedTab";

const InboxDashboard = (props) => {
  const inboxDocPanels = useSelector((state) => state.inbox.inboxDocPanels);
  const inboxTableLoader = useSelector((state) => state.inbox.inboxTableLoader);
  const inboxTab = useSelector((state) => state.inbox.inboxTab);
  const inboxFailedOcrDocuments = useSelector(
    (state) => state.inbox.inboxFailedOcrDocuments,
  );
  const inboxProcessingDocuments = useSelector(
    (state) => state.inbox.inboxProcessingDocuments,
  );
  const inboxAllDocuments = useSelector(
    (state) => state.inbox.inboxAllDocuments,
  );
  
  return (
    <>
      <div className="top-panel-wrapper"></div>
      <div className="main-content">
        <InboxActionBar />
        {inboxTableLoader && <TableLoader />}
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="documents-row">
                <div className="custom-tab">
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="inbox-tab-all"
                      role="tabpanel"
                      aria-labelledby="inbox-tab-all"
                    >
                      <div className="single-document single-document-2">
                        {inboxTab == "unidentified" ? (
                            <>
                            {inboxDocPanels?.length == 0 && !inboxTableLoader && <InboxEmptyTable />}
                            {inboxDocPanels
                            ?.map((doc_panel) => (
                              <InboxUnidentifiedTab doc_panel={doc_panel} />
                            ))}
                            </>
                        ) : inboxTab == "ocr_failed" ? (
                            <>
                            {inboxDocPanels?.length == 0 && !inboxTableLoader && <InboxEmptyTable />}
                            {inboxDocPanels
                            ?.map((doc_panel, index) => (
                              <InboxOcrFailedTab index={index + 1} doc_panel={doc_panel} />
                            ))}
                            </>
                        ) : inboxTab == "processing" ? (
                          <InboxProcessingTab />
                        ) : inboxTab == "document_history" ? (
                          <DocumentHistoryTable />
                        ) : (
                          <>
                            {!inboxTableLoader && inboxDocPanels && (
                              <>
                                {inboxDocPanels?.map((doc_panel) => (
                                  <InboxTable
                                    inboxTab={inboxTab}
                                    doc_panel={doc_panel}
                                  />
                                ))}
                              </>
                            )}
                            {inboxDocPanels?.length == 0 &&
                              !inboxTableLoader && <InboxEmptyTable />}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-0">
          <div className="col-lg-12 table-section"></div>
        </div>
      </div>
    </>
  );
};

export default InboxDashboard;
