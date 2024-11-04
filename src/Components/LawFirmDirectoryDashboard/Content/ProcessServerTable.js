import React, { useEffect, useState, useRef, useCallback } from "react";
import ProcessorServerPopUp from "../../Modals/ProcessorServerPopUp";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import { setIsSearchDisabled } from "../../../Redux/Directory/directorySlice";
import { fetchProcessServerData } from "../../../Redux/process-server/processServerSlice";
import { handleLinkClick } from "../main";

const ProcessServerTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const { processServers, loading } = useSelector(
    (state) => state.processServers
  );
  // const [processServers, setProcessServers] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProcessServer, setSelectedProcessServer] = useState(null);
  const [processorPopUp, setProcessorPopUp] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const lastRealRowRef = useRef(null);

  const [numColumns, setNumColumns] = useState(0);
  // const [hasNoData,setHasNoData]=useState(false)
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);

  useEffect(() => {
    if (clientId && currentCaseId) {
      (async () => {
        dispatch(
          fetchProcessServerData(
            `${origin}/api/add/server/processor/${clientId}/${currentCaseId}/`
          )
        );
      })();
    }
  }, [clientId, currentCaseId]);

  useEffect(() => {
    const calculateRows = () => {
      if (!tableRef.current || !lastRealRowRef.current || hasNoData == true)
        return;

      const pageHeight = window.innerHeight;
      const tableTop =
        tableRef.current.getBoundingClientRect().top + window.scrollY;
      if (tableTop > 0) {
        const lastRowHeight =
          lastRealRowRef.current.getBoundingClientRect().height || 25;
        // Get the height of existing rows
        const existingRows = tableRef.current.rows.length;
        const existingRowsWithData = Array.from(tableRef.current.rows).filter(
          (row) => {
            return Array.from(row.cells).some(
              (cell) => cell.textContent.trim() !== ""
            );
          }
        ).length;
        const existingRowsHeight = existingRowsWithData * lastRowHeight;
        const remainingHeight = pageHeight - tableTop - existingRowsHeight - 10; // Subtracting a small buffer
        const rows = Math.floor(remainingHeight / lastRowHeight);
        // Set the number of rows needed to fill the remaining space
        setAdditionalRows(rows > 0 ? rows : 0);
      }
    };
    const extractColumns = () => {
      if (tableRef.current && tableRef.current.rows.length > 0) {
        const columns = tableRef.current.rows[0].cells.length;
        setNumColumns(columns);
      }
    };

    // Initial calculations
    calculateRows();
    extractColumns();

    // Resize event listener
    const handleResize = () => {
      calculateRows();
      extractColumns();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [processServers]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData) {
      // Perform the logic when there is no data
      dispatch(setIsSearchDisabled(true));
      const table = document.querySelector(".custom-table-directory");
      if (!table) return; // Check if the table exists

      const rowHeight = 74; // height of each row in px
      const viewportHeight = window.innerHeight;
      const tableBottom = table.getBoundingClientRect().bottom;
      const remainingHeight = viewportHeight - tableBottom;

      let additionalRows = Math.max(0, Math.floor(remainingHeight / rowHeight));

      const colSpan = table.querySelectorAll("thead tr th").length;
      const tbody = table.querySelector("tbody");

      // Clear existing fake rows
      const existingFakeRows = tbody.querySelectorAll(".fake-row-2");
      existingFakeRows.forEach((row) => row.remove());

      // Append new fake rows
      for (let i = 0; i < additionalRows; i++) {
        const fakeRow = document.createElement("tr");
        fakeRow.className = "fake-row-2";
        fakeRow.style.height = `${rowHeight}px`;

        const td = document.createElement("td");
        td.colSpan = colSpan;
        td.innerHTML = "&nbsp;";
        fakeRow.appendChild(td);
        tbody.appendChild(fakeRow);
      }
    } else {
      const table = document.querySelector(".custom-table-directory");
      if (!table) return;
      const tbody = table.querySelector("tbody");

      // Clear existing fake rows
      const existingFakeRows = tbody.querySelectorAll(".fake-row-2");
      existingFakeRows.forEach((row) => row.remove());
    }
  }, [hasNoData, loading]);

  useEffect(() => {
    // Initial call
    calculateAdditionalRows();
    // Add resize event listener
    const handleResize = () => {
      calculateAdditionalRows();
    };
    window.addEventListener("resize", handleResize);
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateAdditionalRows]);

  const renderAdditionalRows = () => {
    return Array.from({ length: additionalRows }).map((_, rowIndex) => (
      <tr
        key={rowIndex}
        className="emptytestRows"
        style={{
          height: `${lastRealRowRef.current ? lastRealRowRef.current.getBoundingClientRect().height : 25}px`,
        }}
      >
        {Array.from({ length: numColumns }).map((_, colIndex) => (
          <td
            key={colIndex}
            style={{
              height: `${lastRealRowRef.current ? lastRealRowRef.current.getBoundingClientRect().height : 25}px`,
              color: "transparent",
            }}
          ></td>
        ))}
      </tr>
    ));
  };

  const handleRowClick = (processServer) => {
    setSelectedProcessServer(processServer);
    setProcessorPopUp(true);
  };

  const handleClosePopUp = () => {
    setProcessorPopUp(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-container">
          <span class="loader"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="col-lg-12">
      <div className="row">
        <Table
          className="text-start custom-table-directory"
          striped
          responsive
          bordered
          hover
          ref={tableRef}
        >
          <thead>
            <tr>
              <th></th>
              <th>Process Server</th>
              <th>Cost</th>
              <th>Contact Information</th>
              <th>County</th>
              <th>Cases With Server</th>
            </tr>
          </thead>
          <tbody>
            {processServers.map((processServer, index) => (
              <tr
                key={processServer.id}
                onClick={() => handleRowClick(processServer)}
                data-toggle="modal"
                data-target="#edit_process_server-modal"
                ref={
                  index === processServers.length - 1 ? lastRealRowRef : null
                }
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">
                  {processServer?.contact_id?.name || ""}
                  <br />
                  {processServer?.contact_id && (
                    <TableAddress fullAddress={processServer?.contact_id} />
                  )}
                </td>
                <td className="is-search">{processServer?.cost || ""}</td>

                <td
                  className={`text-nowrap text-lowercase ${
                    !processServer?.contact_id?.phone_number ? "text-grey" : ""
                  }`}
                >
                  {processServer?.contact_id?.phone_number ? (
                    <>
                      ({processServer.contact_id.phone_number.slice(0, 3)}){" "}
                      {processServer.contact_id.phone_number.slice(3, 6)}-
                      {processServer.contact_id.phone_number.slice(6)}
                      {processServer?.contact_id?.phone_ext && (
                        <span className="text-grey">
                          {" ext "}
                          {processServer?.contact_id?.phone_ext}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-grey">(###) ###-#### ext #####</span>
                  )}
                  <br />
                  {processServer?.contact_id?.fax ? (
                    <>
                      ({processServer.contact_id.fax.slice(0, 3)}){" "}
                      {processServer.contact_id.fax.slice(3, 6)}-
                      {processServer.contact_id.fax.slice(6)}
                    </>
                  ) : (
                    <span className="text-grey">(###) ###-####</span>
                  )}
                  <br />
                  {processServer?.contact_id?.email || (
                    <span className="text-grey">someone@example.com</span>
                  )}
                  <br />
                  {(processServer?.contact_id?.website && (
                    <a
                      href={processServer.contact_id.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLinkClick}
                      className="text-black"
                    >
                      {processServer.contact_id.website}
                    </a>
                  )) || <span className="text-grey">www.site@xyz.com</span>}
                </td>
                <td>
                  {processServer?.service_areas?.map((ps) => (
                    <span key={ps.id}>{ps?.city || ""}</span>
                  ))}
                </td>
                <td>
                  <div className="row">
                    <div className="col-6 col-xxl-4 text-right pr-2">Open:</div>
                    <div className="col-6 col-xxl-8">1</div>
                  </div>
                  <div className="row">
                    <div className="col-6 col-xxl-4 text-right pr-2">
                      Closed:
                    </div>
                    <div className="col-6 col-xxl-8">120</div>
                  </div>
                </td>
              </tr>
            ))}
            {renderAdditionalRows()}
          </tbody>
        </Table>
      </div>
      <ProcessorServerPopUp
        processorPopUp={processorPopUp}
        handleClose={handleClosePopUp}
        processServer={selectedProcessServer}
      />
    </div>
  );
};

export default ProcessServerTable;
