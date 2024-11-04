import React, { useEffect, useState, useRef } from "react";
// import { useDocumentModal } from "./DocumentModalContext";
import { Modal, ModalDialog } from "react-bootstrap";
import "./DocumentModal.css";
import { Document, Page, pdfjs } from "react-pdf";
import PdfNavigation from "./PdfNavigation";
import { useDebounce } from "use-debounce";
import { usePdfTextSearch } from "./usePdfTextSearch";
import ClientSearch from "./ClientSearch";
import PdfThumbnail from "./PdfThumbnail";
import DocumentModalSideBar from "./DocumentSideBar/DocumentModalSideBar";
import { useSelector } from "react-redux";
import { getClientId, getCaseId } from "../../Utils/helper";
import api from "../../api/api";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const pdfPageStyle = {
  position: "relative",
  marginBottom: "5px",
  marginTop: "5px",
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.09)",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
};

const DocumentModal = () => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [numPages, setNumPages] = useState(null);
  const { documentURL, isVisible, hideDocumentModal, documentData } =
    useDocumentModal();
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [containerRef, setContainerRef] = useState(null);
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString] = useDebounce(searchString, 150);
  const [showSideBar, setShowSideBar] = useState(true);
  const observer = useRef();
  const pages = useSelector((state) => state.caseData?.pages);
  const currentCaseId = getCaseId();
  const [slotsData, setSlotsData] = useState([]);
  const [defaultZoom, setdefaultZoom] = useState("fit");

  const toggleSidebar = () => setShowSideBar((prev) => !prev);

  const onZoomChange = (zoomType) => {
    const containerWidth = containerRef?.offsetWidth || 0;
    const containerHeight = containerRef?.offsetHeight || 0;
    console.log("Page Width ===>", containerWidth);
    console.log("Page Width ===>", pageDimensions);
    switch (zoomType) {
      case "in":
        setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 4));
        setdefaultZoom("");
        break;
      case "out":
        setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5));
        setdefaultZoom("");
        break;
      case "width":
        const widthScale = containerWidth / pageDimensions.width;
        console.log("Width Scale", widthScale);
        const roundedWidthScale = Math.floor(widthScale * 10) / 10 - 0.1;
        console.log("WIdth Scales ===>", roundedWidthScale);
        setZoomLevel(roundedWidthScale);
        setdefaultZoom("");
        break;
      case "height":
        const heightScale = containerHeight / pageDimensions.height;
        setZoomLevel(heightScale);
        setdefaultZoom("");
        break;
      case "fit":
        const fitScale = Math.min(
          containerWidth / pageDimensions.width,
          containerHeight / pageDimensions.height
        );
        setZoomLevel(Math.max(fitScale - 0.05, 0.1));
        setdefaultZoom("fit");
        break;
      default:
        if (typeof zoomType === "number") {
          setZoomLevel(zoomType);
          setdefaultZoom("");
        }
        break;
    }
  };

  async function onDocumentLoadSuccess(pdf) {
    setNumPages(pdf?.numPages || 0);
    setError("");
  }

  function scrollPageToView(
    pageNumber,
    updatePageNumber = (pageNumber) => pageNumber
  ) {
    const pageElementId = `pdf_page_${pageNumber}`;
    const pageElement = document.getElementById(pageElementId);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth" });
      updatePageNumber(pageNumber);
    }
  }

  const onPageLoadSuccess = (page) => {
    const { width, height } = page.getViewport({ scale: 1 });
    setPageDimensions({
      width: width,
      height: height,
    });
    if (defaultZoom === "fit") {
      handleZoomDefault(width, height);
    }
  };

  const handleZoomDefault = (width, height) => {
    console.log("Hi");
    if (containerRef) {
      const containerWidth = containerRef?.offsetWidth || 0;
      const containerHeight = containerRef?.offsetHeight || 0;
      console.log("Hi", containerWidth, containerHeight, width, height);

      const fitScale = Math.min(
        containerWidth / width,
        containerHeight / height
      );
      setZoomLevel(Math.max(fitScale - 0.05, 0.1));
    }
  };

  const searchResult = usePdfTextSearch(documentURL, debouncedSearchString);

  useEffect(() => {
    if (searchResult.length > 0) {
      const pageNumber = searchResult[0];
      scrollPageToView(pageNumber);
    }
  }, [searchResult]);

  useEffect(() => {
    if (!containerRef) return;

    const options = {
      root: containerRef,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNumber = parseInt(
            entry.target.getAttribute("data-page-number")
          );
          setPage(pageNumber);
        }
      });
    };

    observer.current = new IntersectionObserver(callback, options);

    const pages = document.querySelectorAll(".pdf-page");
    pages.forEach((page) => {
      observer.current.observe(page);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [containerRef, numPages]);
  useEffect(() => {
    console.log("I am running");
    const fetchDataFirstTime = async () => {
      try {
        console.log("I am running 2");

        const response = await api.get(
          `api/doc-page/list-page-doc-optimized/`,
          {
            params: {
              page_id: "",
              case_id: currentCaseId ? currentCaseId : "",
              all_docs: "True",
            },
          }
        );
        if (response.status === 200) {
          console.log(
            "Page Slots From Document Pop Up ===>",
            response.data.data
          );
          setSlotsData(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataFirstTime();
  }, [currentCaseId]);

  const refetchSlotsData = async () => {
    try {
      const response = await api.get(`api/doc-page/list-page-doc-optimized/`, {
        params: {
          page_id: "",
          case_id: currentCaseId ? currentCaseId : "",
          all_docs: "True",
        },
      });
      if (response.status === 200) {
        console.log("Refetched Page Slots Data ===>", response.data.data);
        setSlotsData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to refetch slots data:", error);
    }
  };

  return (
    <Modal
      show={isVisible}
      onHide={hideDocumentModal}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="universal-document-modal modal-fullscreen-xl custom-modal-width"
    >
      <Modal.Header
        className="document-modal-header"
        style={{ borderRadius: "0px" }}
      >
        <Modal.Title id="contained-modal-title-vcenter">
          Document Viewing And Control
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="document-modal-body">
        <div className="main-pdf-view-area">
          <div className="search-and-error-area">
            {error && <div className="alert alert-danger">{error}</div>}
            <ClientSearch setError={setError} />
          </div>
          <div className="main-doc-area d-flex flex-column justify-content-between m-0">
            {/* <PdfNavigation
              handleSearch={(e) => setSearchString(e.target.value)}
              totalPages={numPages}
              pageNumber={page}
              setPageNumber={setPage}
              onZoomChange={onZoomChange}
              zoomScale={zoomLevel}
              toggleSidebar={toggleSidebar}
              scrollPageToView={scrollPageToView}
            /> */}
            <div className="document-modal-flex-container custom-document-modal-flex-container">
              {showSideBar && (
                <PdfThumbnail
                  documentURL={documentURL}
                  numPages={numPages}
                  currentPage={page}
                  onThumbnailClick={scrollPageToView}
                  setPageNumber={setPage}
                />
              )}
              <div
                className="doc-pop-background-color-white main-doc-area m-0"
                style={{
                  width: "100%",
                  overflowY: "scroll",
                }}
                ref={setContainerRef}
              >
                <Document
                  file={documentURL}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(error) => {
                    console.error(error);
                    setError("Failed to load this file");
                  }}
                >
                  {Array.from({ length: numPages }, (_, index) => (
                    <div
                      key={index}
                      id={`pdf_page_${index + 1}`}
                      data-page-number={index + 1}
                      className="pdf-page"
                      style={{
                        ...pdfPageStyle,
                        width: "min-content",
                      }}
                    >
                      <Page
                        scale={zoomLevel}
                        pageNumber={index + 1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        onLoadSuccess={onPageLoadSuccess}
                        className="pdf-page-content"
                        style={{
                          transition: "transform 0.2s ease",
                          transformOrigin: "center center",
                        }}
                      />
                    </div>
                  ))}
                </Document>
              </div>
            </div>
            <PdfNavigation
              handleSearch={(e) => setSearchString(e.target.value)}
              totalPages={numPages}
              pageNumber={page}
              setPageNumber={setPage}
              pageWidth={pageDimensions.width}
              onZoomChange={onZoomChange}
              zoomScale={zoomLevel}
              toggleSidebar={toggleSidebar}
              scrollPageToView={scrollPageToView}
            />
          </div>
        </div>
        <DocumentModalSideBar
          documentData={documentData}
          pages={pages}
          slotsData={slotsData}
          onRefetchSlotsData={refetchSlotsData}
        />
      </Modal.Body>
      <Modal.Footer
        style={{
          margin: 0,
          padding: 0,
          border: 0,
        }}
      ></Modal.Footer>
    </Modal>
  );
};

export default DocumentModal;
