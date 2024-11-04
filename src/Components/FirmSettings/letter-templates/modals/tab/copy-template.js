import React from "react";
import { formatDate } from "../../../../../Utils/helper";

const CopyTemplateModalBody = ({
  data,
  templateName,
  setTemplateName,
  dropdownData,
  pageId,
  setPageName,
  setPageId,
  pageDropdownId,
  setPageDropdownId,
  setPageDropdownName,
}) => {
  const selectedPageData = dropdownData.find((item) => item.id === pageId);

  const generateDocumentOptions = selectedPageData
    ? selectedPageData.dropdown_data
    : [];
  return (
    <>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            Template Name:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            className="form-control"
            placeholder="Template Name"
            value={templateName}
            onChange={setTemplateName}
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            Page:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <select
            className="form-control"
            value={pageId || ""}
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              const selectedPage = dropdownData.find(
                (item) => item.id === selectedId
              );
              setPageId(selectedId);
              setPageName(selectedPage ? selectedPage.name : "");
              setPageDropdownId(null);
              setPageDropdownName("");
            }}
          >
            <option value="" disabled>
              Select Page
            </option>
            {dropdownData.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            Generate Document:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <select
            className="form-control"
            value={pageDropdownId || ""}
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              const selectedDropdown = generateDocumentOptions.find(
                (item) => item.id === selectedId
              );
              setPageDropdownId(selectedId);
              setPageDropdownName(
                selectedDropdown ? selectedDropdown.name : ""
              );
            }}
            disabled={!pageId}
          >
            <option value="" disabled>
              {pageId ? "Select Document" : "Select Page First"}
            </option>
            {generateDocumentOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            File Name:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <input
            value={data?.for_template?.template?.file_name}
            disabled={true}
            type="text"
            className="form-control"
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            Date Uploaded:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <input
            value={formatDate(data?.for_template?.template?.created)}
            disabled={true}
            type="text"
            className="form-control"
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-3 text-left">
          <span
            style={{ fontSize: "14px" }}
            className="d-inline-block text-grey"
          >
            Firm User:{" "}
          </span>
        </div>
        <div className="col-md-9">
          <div className="d-flex align-items-center form-control">
            {data?.profile_pic ? (
              <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                <img
                  src={data?.profile_pic}
                  alt={`${data?.profile_pic} Icon`}
                />
              </span>
            ) : (
              <span className="ic ic-29 ic-avatar"></span>
            )}

            <div className="ml-1 text-black">
              {data?.for_firm_user?.first_name} {data?.for_firm_user?.last_name}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyTemplateModalBody;
