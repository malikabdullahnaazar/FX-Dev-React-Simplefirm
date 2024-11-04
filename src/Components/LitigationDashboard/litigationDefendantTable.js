import React, { useCallback, useState } from 'react';
import "../../../public/BP_resources/css/litigation.css";
import DocIcon from "../../../public/BP_resources/images/icon/documents-icon-gray.svg";
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { getCaseId, getClientId, mediaRoute } from '../../Utils/helper';
import api from '../../api/api';
import { useDocumentModal } from '../common/CustomModal/CustomModalContext';
import DocumentUploadModal from '../Modals/documentUploadModal';
import { customDateFormat } from '../../Utils/date';
export default function LitigationDefendant({ defendants = [], defendantProcessedPageSlots = [], fetchLitigationData, setLitigationDashboardDataUpdated }) {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const { showDocumentModal } = useDocumentModal();
    const [uploadFile, setUploadFile] = useState("");
    const [fileUploadModal, setFileUploadModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const simulateProgress = (totalFiles) => {
        let progress = 0;
        const increment = 100 / totalFiles;
        const intervalId = setInterval(() => {
            progress += 2;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(intervalId);
            }
        }, 300);
    };
    const handleDocPreview = (doc) => {
        console.log(`Previewing document with ID: ${doc.id}`);
        showDocumentModal("document", mediaRoute(doc.upload), doc);
    };
    const handleuploadDoc = useCallback(async (e, slot_id, pageId, panel_id) => {
        e.preventDefault();
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        setFileUploadModal(true);
        simulateProgress(files?.length);
        setUploadFile(files[0].name);
        const formData = new FormData();
        formData.append('file', files[0]);
        try {
            const response = await api.post(
                `/api/upload_doc/${getClientId()}/${getCaseId()}/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            const docId = response?.data?.docId;
            await api.post("api/doc/attach/treatment/", {
                panel_id: panel_id,
                slot: slot_id,
                page_id: pageId,
                case_id: getCaseId(),
                panels: true,
                doc_id: docId,
            });
            setLitigationDashboardDataUpdated(true);
            await fetchLitigationData();
            setLitigationDashboardDataUpdated(false);
        } catch (error) {
            console.log(error);
        } finally {
            setFileUploadModal(false);
            setUploadFile("");
            setUploadProgress(0);
        }
    }, [fetchLitigationData, setLitigationDashboardDataUpdated]);

    const defendantCount = defendants?.length || defendantProcessedPageSlots?.length;
    const initialFakeRows = 8;
    const defendantFakeRows = Math.max(0, initialFakeRows - defendantCount);
    return (
        <div className="dynamic-width-litigation d-flex flex-column p-0 p-r-5 width-fluid">
            <div className="position-relative overflow-scroll fake-information-row" style={{ height: "12rem", display: "flex", flexDirection: "column", scrollbarWidth: "none" }}>
                <table className="litigation-table position-relative">
                    <thead>
                        <tr>
                            <th className="text-center background-main-10 height-22">
                                <div className="client-contact-title">Defendant</div>
                            </th>
                            <th className="text-center background-main-10 height-21">
                                <div className="client-contact-title">Served</div>
                            </th>
                            <th className="text-center background-main-10 height-21">
                                <div className="client-contact-title">Proof</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {defendants?.map((defendant) => (
                            <tr key={defendant?.id}>
                                <td className="text-center height-21">
                                    {defendant?.first_name} {defendant?.last_name}
                                </td>
                                <td className="text-center height-21">
                                    {new Date(defendant?.defServedDate).toLocaleDateString('en-US')}
                                </td>
                                <td className="text-center height-21">
                                    {defendantProcessedPageSlots
                                        ?.filter(page_slot => page_slot?.defendant?.id === defendant?.id)
                                        ?.map((page_slot, index) => (
                                            <div key={index}
                                                onDrop={(event) => handleuploadDoc(event, page_slot?.page_slot?.id, page_slot?.page_slot?.page?.id, page_slot?.defendant?.id)}
                                                className="GreyBB1 col-12 col-md-3 col-xl text-center"
                                                id="no-vertical-border"
                                                onClick={page_slot?.doc ? () => handleDocPreview(page_slot?.doc) : (event) => {
                                                    event.stopPropagation();
                                                    const fileInput = document.createElement('input');
                                                    fileInput.type = 'file';
                                                    fileInput.onchange = (e) => handleuploadDoc(e, page_slot?.page_slot?.id, page_slot?.page_slot?.page?.id, page_slot?.defendant?.id);
                                                    fileInput.click();
                                                }}>
                                                {page_slot?.doc ?
                                                    <div  >
                                                        <p class="date">{customDateFormat(page_slot?.doc?.created)}</p>
                                                        <span class="icon-wrap">
                                                            <i class="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
                                                        </span>
                                                    </div>
                                                    : <span className="">
                                                        <img
                                                            src={DocIcon}
                                                            alt="Doc"
                                                            width="19"
                                                            height="19"
                                                            className="cursor-pointer"
                                                            loading="lazy"
                                                        />
                                                    </span>}
                                            </div>
                                        ))}
                                </td>
                            </tr>
                        ))}
                        {[...Array(defendantFakeRows)].map((_, index) => (
                            <tr key={`additional-${index}`} className="fake-row-2" style={{ height: "21px" }}>
                                <td colSpan="6">&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <DocumentUploadModal
                uploadFile={uploadFile}
                uploadProgress={uploadProgress}
                show={fileUploadModal}
                onHide={() => setFileUploadModal(false)}
            />
        </div>
    );
}