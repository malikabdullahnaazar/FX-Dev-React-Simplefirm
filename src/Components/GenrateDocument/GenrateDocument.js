import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Nav, Tab } from "react-bootstrap";
import api from "../../api/api";
import axios from "axios";
import { getCaseId, getClientId } from "../../Utils/helper";
import GenericModalComponent from "../common/Modal/Modal";

function GenrateDocument({
  handleClose,
  show,
  PageEntity,
  instanceId,
  dropdownName = "",
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const tokenBearer = localStorage.getItem("token");
  const caseId = getCaseId();
  const clientId = getClientId();
  const [generateData, setGenerateData] = useState([]);
  const [dropdownId, setDropdownId] = useState(null);
  const [pageId, setPageId] = useState(null);
  const [dropdowns, setDropdowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [selectedDraftDocs, setSelectedDraftDocs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTab, setSelectedTab] = useState("GDFT");
  const isProduction = process.env.NODE_ENV === "production";
  console.log("I am Prod ==>", isProduction);

  const AuthenticatedUserId = useMemo(
    () => localStorage.getItem("loggedInUser"),
    []
  );

  const entityId = useMemo(() => {
    const entity_id = {};
    switch (PageEntity.toLowerCase()) {
      case "defendants":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "notes":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "injury":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "treatment":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "docs":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "photos":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "experts":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "discovery":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "witnesses":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "contact":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "Costs":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "Loans":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "provider":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "parties":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "reports":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "insurance":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "litigation":
        entity_id.entity_id = instanceId - 1;
        entity_id.entity = PageEntity;
        break;
      case "Employment":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "Accident":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      case "to do":
        entity_id.entity_id = instanceId;
        entity_id.entity = PageEntity;
        break;
      default:
        return;
    }
    return entity_id;
  }, [PageEntity, instanceId]);

  const downloadSelectedDocs = async (selectedDocs, entityId) => {
    try {
      const docsArray = Array.isArray(selectedDocs)
        ? selectedDocs
        : [selectedDocs];

      console.log("entityId ===>", entityId);

      const downloadPromises = docsArray.map(async (doc) => {
        const formData = {
          doc_id: doc.doc_id,
          template_id: doc.template_id,
          dynamic_template_id: doc.id,
          case_id: `${caseId}`,
          client_id: `${clientId}`,
          ...entityId,
        };

        console.log("formData ===>", formData);

        try {
          const response = await axios.post(
            `${origin}/api/documents/download_docs_word/`,
            formData,
            {
              headers: {
                Authorization: tokenBearer,
              },
            }
          );
          const { data, filename } = response.data;

          // Trigger file download
          const byteCharacters = atob(data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error("Error downloading document:", error);
        }
      });

      await Promise.all(downloadPromises);
      console.log("All downloads completed");
    } catch (error) {
      console.error("Error processing documents:", error);
    }
  };

  const fetchDropdownsAndSetIds = useCallback(async () => {
    try {
      const response = await axios.get(
        `${origin}/api/documents/get_all_dropdowns/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      console.log("get_all_dropdowns ===>", response.data);
      if (response.status === 200) {
        setDropdowns(response.data);
        const filteredPages = response.data.filter(
          (obj) => obj.for_page.name === PageEntity && obj.name === dropdownName
        );
        console.log("filteredPages", filteredPages);
        if (filteredPages.length > 0) {
          const dropdown = filteredPages[0];
          setDropdownId(dropdown.number);
          setPageId(dropdown.for_page.id);
        }
      }
    } catch (error) {
      console.error("GET ALL DROPDOWNSLIST ::", error);
    }
  }, [PageEntity]);

  useEffect(() => {
    fetchDropdownsAndSetIds();
  }, [fetchDropdownsAndSetIds]);

  useEffect(() => {
    if (dropdownId && pageId && caseId && clientId) {
      setLoading(true);
      axios
        .get(
          `${origin}/api/documents/get-dl-template/?dropdown_id=${dropdownId}&page_id=${pageId}&case_id=${caseId}&client_id=${clientId}`,
          {
            headers: {
              Authorization: tokenBearer,
            },
          }
        )
        .then((response) => {
          setGenerateData(response.data);
        })
        .catch((error) => {
          console.error({ error });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dropdownId, pageId, caseId, clientId]);

  useEffect(() => {
    if (selectAll) {
      if (selectedTab === "GDFT") {
        setSelectedDocs(generateData?.data || []);
      } else if (selectedTab === "DD") {
        setSelectedDraftDocs(generateData?.document_drafts || []);
      }
    } else {
      setSelectedDocs([]);
      setSelectedDraftDocs([]);
    }
  }, [selectAll, selectedTab, generateData]);

  const handleCheckboxChange_1 = useCallback(
    (doc) => {
      setSelectedDocs((prevDocs) =>
        prevDocs.some((d) => d.id === doc.id)
          ? prevDocs.filter((d) => d.id !== doc.id)
          : [...prevDocs, doc]
      );
    },
    [setSelectedDocs]
  );

  const handleCheckboxChange_2 = useCallback(
    (doc) => {
      setSelectedDraftDocs((prevDocs) =>
        prevDocs.some((d) => d.id === doc.id)
          ? prevDocs.filter((d) => d.id !== doc.id)
          : [...prevDocs, doc]
      );
    },
    [setSelectedDraftDocs]
  );

  const handleSelectAllChange = useCallback(() => {
    setSelectAll((prev) => !prev);
  }, []);
  const openDraftDocs = (doc) => {
    const newBaseUrl = isProduction
      ? `https://react-dev.simplefirm.com/bp-wordprocessor/${getClientId()}/${getCaseId()}`
      : `http://localhost:3000/bp-wordprocessor/${getClientId()}/${getCaseId()}`;
    const url = `${newBaseUrl}/?docId=${doc.doc_id}&userId=${AuthenticatedUserId}&type=Draft&dynamic_template_id=${doc.id}&draftId=${doc.template_id}`;
    window.open(url, `_blank_${doc.doc_id}`);
  };

  const openDocWordProcessor2 = useCallback(
    async ({ DynamicTemplateId, templateId, doc_id, count }) => {
      const openDocWord = async (formData, index = 0) => {
        console.log("form Data ===>", formData);
        const newBaseUrl = isProduction
          ? `https://react-dev.simplefirm.com/bp-wordprocessor/${getClientId()}/${getCaseId()}`
          : `http://localhost:3000/bp-wordprocessor/${getClientId()}/${getCaseId()}`;
        try {
          const res = await api.post("api/documents/fillTemplate/", formData);
          res.data.link = res.data.link.replace(
            "https://wordprocessor.simplefirm.com",
            newBaseUrl
          );
          const url = res.data.link;
          const id_doc = res.data.id;
          const windowName = `_blank_${id_doc}_${index}`;

          console.log("URL", url);

          setTimeout(() => {
            const a = document.createElement("a");
            a.href = url;
            a.target = windowName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }, index * 1000);
        } catch (error) {
          console.error("Error during API call:", error);
        }
      };

      const openDraftDocs = (doc) => {
        const newBaseUrl = isProduction
          ? `https://react-dev.simplefirm.com/bp-wordprocessor/${getClientId()}/${getCaseId()}`
          : `http://localhost:3000/bp-wordprocessor/${getClientId()}/${getCaseId()}`;
        const url = `${newBaseUrl}/?docId=${doc.doc_id}&userId=${AuthenticatedUserId}&type=Draft&dynamic_template_id=${doc.id}&draftId=${doc.template_id}`;
        window.open(url, `_blank_${doc.doc_id}`);
      };

      if (count === "one") {
        const formData = {
          doc_id: doc_id,
          case_id: `${caseId}`,
          client_id: `${clientId}`,
          template_id: templateId,
          dynamic_template_id: DynamicTemplateId,
          option: "WordProcessor",
          ...entityId,
        };
        openDocWord(formData);
      } else if (count === "all") {
        if (selectedTab === "GDFT") {
          selectedDocs.forEach((doc, index) => {
            const formData = {
              doc_id: doc.doc_id,
              case_id: `${caseId}`,
              client_id: `${clientId}`,
              template_id: doc.template_id,
              dynamic_template_id: doc.id,
              option: "WordProcessor",
              ...entityId,
            };
            openDocWord(formData, index);
          });
        } else if (selectedTab === "DD") {
          selectedDraftDocs.forEach((doc, index) => {
            setTimeout(() => openDraftDocs(doc), index * 1000);
          });
        }
      }
    },
    [
      AuthenticatedUserId,
      caseId,
      clientId,
      selectedDocs,
      selectedDraftDocs,
      selectedTab,
      entityId,
    ]
  );

  const downloadDraftDocs = async (selectedDocs) => {
    console.log(selectedDocs, "LLLLLLLLLLLLLLLLL");
    try {
      // Ensure selectedDocs is an array
      const docsArray = Array.isArray(selectedDocs)
        ? selectedDocs
        : [selectedDocs];

      const downloadPromises = docsArray.map(async (doc) => {
        const formData = {
          doc_id: doc.doc_id,
        };

        console.log("Form Data:", formData);

        try {
          const response = await axios.post(
            `${origin}/api/documents/downloadDraftDoc/`,
            formData,
            {
              headers: {
                Authorization: tokenBearer,
              },
            }
          );

          if (response.status !== 200) {
            throw new Error(
              `API call failed with status code: ${response.status}`
            );
          }

          const { data, filename } = response.data;

          console.log("Downloading document:", response.data);
          const byteCharacters = atob(data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          // Create a blob and trigger a download
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error(
            "An error occurred while downloading the document:",
            error
          );
        }
      });

      await Promise.all(downloadPromises);
      console.log("All downloads completed");
    } catch (error) {
      console.error("An error occurred while processing the documents:", error);
    }
  };

  const downloadSelectedPdfs = async (selectedDocs, PageEntity, instanceId) => {
    try {
      const docsArray = Array.isArray(selectedDocs)
        ? selectedDocs
        : [selectedDocs];
      const downloadPromises = docsArray.map(async (doc) => {
        const formData = {
          doc_id: doc.doc_id,
          template_id: doc.template_id,
          dynamic_template_id: doc.id,
          ...entityId,
        };
        try {
          const response = await axios.post(
            `${origin}/api/documents/convert_to_pdf_and_downloads/`,
            formData,
            {
              headers: {
                Authorization: tokenBearer,
                "Content-Type": "application/json",
              },
            }
          );
          const { data, filename } = response.data;
          const pdfBlob = new Blob(
            [Uint8Array.from(atob(data), (c) => c.charCodeAt(0))],
            { type: "application/pdf" }
          );
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error downloading PDF:", error);
        }
      });
      await Promise.all(downloadPromises);
    } catch (error) {
      console.error("Error processing PDFs:", error);
    }
  };



  const downloadPdf = async (doc, PageEntity, instanceId) => {
    try {
      
        const formData = {
          doc_id: doc.doc_id,
          template_id: doc.template_id,
          dynamic_template_id: doc.id,
          ...entityId,
        };
        try {
          const response = await axios.post(
            `${origin}/api/documents/convert_to_pdf_and_downloads/`,
            formData,
            {
              headers: {
                Authorization: tokenBearer,
                "Content-Type": "application/json",
              },
            }
          );
          const { data, filename } = response.data;
          const pdfBlob = new Blob(
            [Uint8Array.from(atob(data), (c) => c.charCodeAt(0))],
            { type: "application/pdf" }
          );
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error downloading PDF:", error);
        }
    } catch (error) {
      console.error("Error processing PDFs:", error);
    }
  };

  const printDocs = async (selectedDocs, PageEntity, instanceId) => {
    try {
      const docsArray = Array.isArray(selectedDocs)
        ? selectedDocs
        : [selectedDocs];
      const printPromises = docsArray.map(async (doc) => {
        const formData = {
          doc_id: doc.doc_id,
          template_id: doc.template_id,
          dynamic_template_id: doc.id,
          ...entityId,
        };
        try {
          const response = await axios.post(
            `${origin}/api/documents/convert_to_pdf_and_downloads/`,
            formData,
            {
              headers: {
                Authorization: tokenBearer,
                "Content-Type": "application/json",
              },
            }
          );
          const { data } = response.data;
          const pdfBlob = new Blob(
            [Uint8Array.from(atob(data), (c) => c.charCodeAt(0))],
            { type: "application/pdf" }
          );
          const url = URL.createObjectURL(pdfBlob);
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = url;
          document.body.appendChild(iframe);
          iframe.onload = () => {
            iframe.contentWindow.print();
            document.body.removeChild(iframe);
          };
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error printing document:", error);
        }
      });
      await Promise.all(printPromises);
    } catch (error) {
      console.error("Error processing documents:", error);
    }
  };

  const bodyContent = useMemo(
    () => (
      <div className="custom-tab mt-3">
        <Tab.Container defaultActiveKey={"GenerateDocumentFromTemplate"}>
          <Nav variant="tabs" className="justify-content-around">
            <Nav.Link
              eventKey="GenerateDocumentFromTemplate"
              onClick={() => {
                setSelectAll(false);
                setSelectedTab("GDFT");
              }}
            >
              Generate Document From Template
            </Nav.Link>
            <Nav.Link
              eventKey="DocumentDrafts"
              onClick={() => {
                setSelectAll(false);
                setSelectedTab("DD");
              }}
            >
              Document Drafts
            </Nav.Link>
          </Nav>
          <div
            className="d-flex flex-column justify-content-between"
            style={{ height: "545px" }}
          >
            <Tab.Content style={{ height: "490px", overflow: "scroll" }}>
              <Tab.Pane eventKey="GenerateDocumentFromTemplate">
                <div class="table-responsive table--no-card rounded-0 border-0">
                  <table class="table table-borderless table-striped table-earning has-height-25 generate-doc-table">
                    <thead>
                      <tr>
                        <th scope="col" class="width-1"></th>
                        <th>
                          <input
                            id="select-all-docs"
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                          />
                        </th>
                        <th>Template Name</th>
                        <th class="text-center">Pages</th>
                        <th class="text-center">Uploaded</th>
                        <th class="text-center width-25">Last Generated</th>
                        <th>Copilot</th>
                        <th class="text-center width-25">Firm</th>
                        <th class="text-center width-25">Uploaded User</th>

                        <th></th>
                        <th>Task For</th>
                      </tr>
                    </thead>
                    <tbody id="table-body-cat" className="generate-doc-body">
                      {generateData?.data?.map((obj, index) => (
                        <tr key={obj.doc_id}>
                          <td>{index + 1}</td>
                          <td>
                            <div class="form-check justify-content-center">
                              <input
                                className="form-check-input template-checkbox"
                                type="checkbox"
                                checked={selectedDocs.some(
                                  (d) => d.id === obj.id
                                )}
                                onChange={() =>
                                  handleCheckboxChange_1({
                                    ...obj,
                                  })
                                }
                              />
                            </div>
                          </td>
                          <td class="text-nowrap">{obj.template_name}</td>

                          <td class="text-center">{obj.pages}</td>
                          <td class="text-center">{obj.created}</td>
                          <td class="text-center td-autosize">
                            <div class="align-items-center">
                              <span>{obj.last_generated}</span>
                            </div>
                          </td>
                          <td class="text-center">
                            {/* <a href="#" class="has-light-btn">
                                <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                  <img src={obj.copilot_profile_pic} alt="" />
                                </span>
                                <span class="ml-1 text-black">
                                  {obj.copilot_name}
                                </span>
                              </a> */}
                            {obj.copilot_logo ? (
                              <img
                                className="copilot-logo-generate-document"
                                src={obj.copilot_logo}
                              />
                            ) : (
                              <img
                                className="copilot-logo-generate-document"
                                src={
                                  "https://simplefirm-bucket.s3.amazonaws.com/static/images/shutterstock_583717939_c7Rm30h.jpg"
                                }
                              />
                            )}
                          </td>
                          <td class="text-center td-autosize">
                            <div class="align-items-center">
                              <a href="#" class="has-light-btn">
                                <span class="ml-1 text-black">{obj.firm}</span>
                              </a>
                            </div>
                          </td>

                          <td class="text-center td-autosize">
                            <div class="align-items-center">
                              <a href="#" class="has-light-btn">
                                <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                  {obj.profile_pic ? (
                                    <img src={obj.profile_pic} alt="" />
                                  ) : null}
                                </span>
                                <span class="ml-1 text-black">
                                  {obj.user_name}
                                </span>
                              </a>
                            </div>
                          </td>
                          <td class="text-center td-autosize">
                            <div class="d-flex justify-content-center space-x-5">
                              <Button
                                className="width-120 height-25 d-flex align-items-center justify-content-center"
                                onClick={() =>
                                  openDocWordProcessor2({
                                    DynamicTemplateId: obj.id,
                                    templateId: obj.template_id,
                                    doc_id: obj.doc_id,
                                    count: "one",
                                  })
                                }
                              >
                                Open
                                <i className="ic ic-19 ic-generate-document ml-1"></i>
                              </Button>
                              <Button
                                className="width-120 height-25 d-flex align-items-center justify-content-center"
                                onClick={
                                  selectedTab === "GDFT"
                                    ? () =>
                                        downloadPdf(
                                          obj,
                                          entityId
                                        )
                                    : () => downloadDraftDocs({ doc_id: obj })
                                }
                              >
                                Download
                                <i className="ic ic-19 ic-generate-document-pdf ml-1"></i>
                              </Button>
                            </div>
                          </td>
                          <td>
                            <div class="d-flex align-items-center">
                              <select
                                className="form-select height-25 d-flex align-items-center justify-content-center p-0-10"
                                aria-label="select example"
                              >
                                <option>Task for</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                              </select>
                              <Button
                                variant="primary"
                                type="submit"
                                className="d-flex height-25 align-items-center justify-content-center ml-1"
                              >
                                <span class="font-weight-bold pr-2 text-gold">
                                  +
                                </span>{" "}
                                Task
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="DocumentDrafts">
                <div class="table-responsive table--no-card rounded-0 border-0">
                  <table class="table table-borderless table-striped table-earning has-height-25">
                    <thead>
                      <tr>
                        <th scope="col" class="width-1"></th>
                        <th>
                          <input
                            id="select-all-docs"
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                          />
                        </th>
                        <th class="">Document Name</th>
                        <th class="text-center">Last Accessed</th>
                        <th></th>
                        <th>Assign Document Generation Task</th>
                      </tr>
                    </thead>
                    <tbody id="table-body-cat">
                      {generateData?.document_drafts?.map((obj, index) => (
                        <tr class="height-70" key={obj.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div class="form-check justify-content-center">
                              <input
                                className="form-check-input template-checkbox"
                                type="checkbox"
                                checked={selectedDraftDocs.some(
                                  (d) => d.id === obj.id
                                )}
                                onChange={() =>
                                  handleCheckboxChange_2({
                                    ...obj,
                                  })
                                }
                              />
                            </div>
                          </td>
                          <td class="text-nowrap text-center">
                            {obj?.document_name}
                          </td>
                          <td class="text-center td-autosize">
                            <div class="align-items-center">
                              <a href="#" class="has-light-btn">
                                <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                                <span class="ml-1 text-black">
                                  {obj?.user_name}
                                </span>
                              </a>
                            </div>
                            <span>{obj?.created_at}</span>
                          </td>
                          <td class="text-center">
                            <div class="mx-auto">
                              <button
                                class="btn btn-primary height-25 d-flex align-items-center mb-1 width-85 mx-auto"
                                onClick={() => openDraftDocs(obj)}
                              >
                                Open{" "}
                                <i class="ic ic-19 ic-generate-document ml-1"></i>
                              </button>
                              <button
                                class="btn btn-primary height-25 d-flex align-items-center width-85 text-center mx-auto"
                                onClick={() =>
                                  downloadDraftDocs({
                                    doc_id: obj.doc_id,
                                  })
                                }
                              >
                                <img
                                  class="ic ic-19 mx-auto"
                                  src="/static/bp_assets/img/pdf.svg"
                                />
                                Download
                              </button>
                            </div>
                          </td>
                          <td class="text-right">
                            <div class="d-flex align-items-center">
                              <div class="dropdown pl-0 p-r-5 dropdown-document w-auto ml-auto">
                                <a
                                  class=" w-100 form-select has-no-after has-no-bg text-left d-flex align-items-center"
                                  href="#"
                                  role="button"
                                  id="dropdownMenuLink2-3"
                                  data-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  Select Firm User For Task
                                  <span class="ic ic-17 height-100 has-no-after ic-arrow text-primary d-flex align-items-center justify-content-center ml-auto">
                                    <svg
                                      width="34"
                                      height="17"
                                      viewBox="0 0 34 17"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                                        fill="currentColor"
                                      ></path>
                                    </svg>
                                  </span>
                                </a>
                                <div
                                  className="dropdown-menu w-100 p-0"
                                  aria-labelledby="dropdownMenuLink"
                                  x-placement="bottom-start"
                                  style={{
                                    position: "absolute",
                                    transform: "translate3d(0px, 34px, 0px)",
                                    top: 0,
                                    left: 0,
                                    willChange: "transform",
                                  }}
                                >
                                  <input type="hidden" id="dd-user2-3" />
                                </div>
                              </div>
                              <button
                                class="btn btn-primary height-25 d-flex align-items-center m-r-5"
                                onclick="addTask2('3','undefined')"
                              >
                                <span class="font-weight-bold pr-2 text-gold">
                                  +
                                </span>{" "}
                                Task
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>
            </Tab.Content>
            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="ml-2"
              >
                Close
              </Button>
              <div className="d-flex space-x-5">
                <Button
                  variant="primary"
                  onClick={() => openDocWordProcessor2({ count: "all" })}
                  disabled={
                    selectedDocs.length === 0 && selectedDraftDocs.length === 0
                  }
                >
                  Open Selected Docs in Tabs
                </Button>
                <Button
                  variant="primary"
                  onClick={
                    selectedTab === "GDFT"
                      ? () => downloadSelectedDocs(selectedDocs, entityId)
                      : () => downloadDraftDocs(selectedDraftDocs)
                  }
                  disabled={
                    selectedDocs.length === 0 && selectedDraftDocs.length === 0
                  }
                >
                  Download Selected as Docs
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    downloadSelectedPdfs(selectedDocs, PageEntity, instanceId)
                  }
                  disabled={
                    selectedDocs.length === 0 && selectedDraftDocs.length === 0
                  }
                >
                  Download Selected as PDFs
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    printDocs(selectedDocs, PageEntity, instanceId)
                  }
                  disabled={
                    selectedDocs.length === 0 && selectedDraftDocs.length === 0
                  }
                >
                  Print Selected
                </Button>
              </div>
            </div>
          </div>
        </Tab.Container>
      </div>
    ),
    [
      handleClose,
      openDocWordProcessor2,
      selectedDocs,
      selectedDraftDocs,
      selectedTab,
    ]
  );

  return (
    <GenericModalComponent
      show={show}
      handleClose={handleClose}
      title={
        <>
          <i className="ic ic-29 ic-generate-document m-r-5"></i> Generate
          Document
        </>
      }
      height="659px"
      bodyContent={bodyContent}
      dialogClassName="modal-dialog-centered genrate-docs-modal"
      titleClassName="mx-auto d-flex align-items-center justify-content-center font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
      headerClassName="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center"
    />
  );
}

export default GenrateDocument;
