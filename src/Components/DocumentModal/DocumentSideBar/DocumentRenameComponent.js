import React, { useState } from "react";
import PropTypes from "prop-types";
import DocumentRenameModal from "./DocumentRenameModal";
import api from "../../../api/api";
import { useDocumentModal } from "../DocumentModalContext";
import "./DocumentSidebar.css";

function DocumentRenameComponent({ initialDocumentName, docId }) {
  const [documentName, setDocumentName] = useState("");
  const [displayName, setDisplayName] = useState(initialDocumentName);
  const { toggle, setDocumentData } = useDocumentModal();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    let cleanName = documentName.replace(/\.pdf/gi, "");
    if (!cleanName || cleanName.length < 3) {
      setError("Document name must be at least 3 characters long.");
      return; // Exit the function if validation fails
    }
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    let cleanName = documentName.replace(/\.pdf/gi, "");
    try {
      const response = await api.put("/api/rename-doc/", {
        doc_id: docId,
        doc_rename: cleanName,
      });
      setError(null);
      console.log("Document renamed successfully:", response.data);
      setDisplayName(documentName);
      setDocumentData((prevData) => ({
        ...prevData,
        file_name: documentName,
      }));
      toggle();
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "An unexpected error occurred");
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="tile-row mw-100 d-flex align-items-center p-l-5 p-r-5"
        style={{ height: "25px" }}
      >
        <span className="text-black text-left text-break font-weight-semibold d-block">
          {displayName.length > 40
            ? `${displayName.slice(0, 40)}...`
            : displayName}
        </span>
      </div>
      <div className="tile-row d-flex flex-wrap w-100">
        <div className="input-wrap d-flex-1 ">
          <input
            className="form-control height-25 p-l-5 document-search-text-color"
            id="document_rename"
            placeholder="Rename Document"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
        </div>
        <button
          type="button"
          className="btn text-white bg-success d-flex justify-content-center align-items-center doc-pop-visibility-visible doc-pop-height-25px m-l-5"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      <DocumentRenameModal
        isOpen={isModalOpen}
        documentName={documentName}
        onConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

DocumentRenameComponent.propTypes = {
  initialDocumentName: PropTypes.string,
};

DocumentRenameComponent.defaultProps = {
  initialDocumentName: "",
};
export default DocumentRenameComponent;
