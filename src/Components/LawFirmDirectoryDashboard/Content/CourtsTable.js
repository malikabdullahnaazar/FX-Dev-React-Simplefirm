import React, { useEffect, useState, useRef, useCallback } from "react";
import CourtsTablePopUp from "../../Modals/CourtsTablePopUp";
import axios from "axios";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import { useDispatch, useSelector } from "react-redux";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchCourtData } from "../../../Redux/courts-table/courtsSlice";
import { handleLinkClick } from "../main";

const CourtsTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const { courts, loading } = useSelector((state) => state.courts);
  const [courtdirectories, setCourtdirectories] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [courtPopUp, setCourtPopUp] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const lastRealRowRef = useRef(null);
  const selectedState = useSelector((state) => state.selectedState);
  const [filteredCourts, setFilteredCourts] = useState([]);

  const [numColumns, setNumColumns] = useState(0);
  // const [hasNoData, setHasNoData] = useState(false);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  useEffect(() => {
    if (clientId && currentCaseId && selectedState?.selectedState) {
      (async () => {
        dispatch(
          fetchCourtData(
            `${origin}/api/add/court/directory/${clientId}/${currentCaseId}/?limit=${100}&offset=${0}&state=${selectedState.selectedState}`
          )
        );
      })();
    } else {
      (async () => {
        dispatch(
          fetchCourtData(
            `${origin}/api/add/court/directory/${clientId}/${currentCaseId}/?limit=${100}&offset=${0}`
          )
        );
      })();
    }
  }, [clientId, currentCaseId, selectedState]);

  useEffect(() => {
    if (!loading && courts.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else if (!loading && courts.length > 0) {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [courts]);

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
  }, [courts, filteredCourts]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData || filteredCourts.length === 0) {
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
  }, [hasNoData, filteredCourts.length, loading]);

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

  const handleRowClick = (court) => {
    setSelectedCourt(court);
    setCourtPopUp(true);
  };

  const handleClosePopUp = () => {
    setCourtPopUp(false);
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
              <th>Court</th>
              <th>Contact Information</th>
              <th>Jurisdiction</th>
              <th>Cases With Court</th>
            </tr>
          </thead>
          <tbody>
            {courts?.map((court, index) => {
              const contact = court.court_contact;
              return (
                <tr
                  key={court.id}
                  onClick={() => handleRowClick(court)}
                  ata-toggle="modal"
                  data-target="#edit_court_modal"
                  ref={index === courts.length - 1 ? lastRealRowRef : null}
                >
                  <td className="width-36">{index + 1}</td>
                  <td className="is-search text-nowrap">
                    {court?.court_name || ""}
                    <br />
                    {contact && <TableAddress fullAddress={contact} />}
                  </td>

                  <td className="text-nowrap">
                    {contact?.phone_number &&
                    contact?.phone_number != "nan" &&
                    contact?.phone_number != "Self Help" ? (
                      <>
                        ({contact.phone_number?.slice(0, 3)}){" "}
                        {contact.phone_number?.slice(3, 6)}-
                        {contact.phone_number?.slice(6)}
                        {contact?.phone_ext && (
                          <span className="text-grey">
                            {" ext "}
                            {contact?.phone_ext}
                          </span>
                        )}
                      </>
                    ) : contact?.phone_number == "Self Help" ? (
                      contact.phone_number
                    ) : (
                      <span className="text-grey text-nowrap">
                        (###) ###-#### ext #####
                      </span>
                    )}
                    <br />
                    {contact?.fax ? (
                      <>
                        ({contact.fax.slice(0, 3)}) {contact.fax.slice(3, 6)}-
                        {contact.fax.slice(6)} - <b>fax</b>
                      </>
                    ) : (
                      <span className="text-grey">(###) ###-####</span>
                    )}
                    <br />
                    {contact?.email && contact?.email != "nan" ? (
                      contact?.email
                    ) : (
                      <span className="text-grey">someone@example.com</span>
                    )}
                    <br />
                    {(contact?.website && (
                      <a
                        href={`https://${contact.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className="text-black"
                      >
                        {contact.website}
                      </a>
                    )) || <span className="text-grey">www.site@xyz.com</span>}
                  </td>
                  <td>
                    {court.jurisdictiontype ? (
                      <span className="row text-nowrap col-2">
                        {court.jurisdictiontype === 1 ? "Federal" : "State"}
                      </span>
                    ) : (
                      <span className="row text-nowrap col-2 text-grey">
                        Jurisdiction Type,
                      </span>
                    )}
                    {court.jurisdiction?.state && court.jurisdiction?.county ? (
                      <span className="row text-nowrap col-2">
                        {court.jurisdiction?.state?.StateAbr},{" "}
                        {court.jurisdiction?.state?.name},{" "}
                        {court.jurisdiction?.county?.name}
                      </span>
                    ) : (
                      <span className="row text-nowrap col-2 text-grey">
                        State, County
                      </span>
                    )}
                    {court.jurisdiction?.circuit ? (
                      <span className="row text-nowrap col-2">
                        {court.jurisdiction?.circuit?.circuit_name},
                      </span>
                    ) : (
                      <span className="row text-nowrap col-2 text-grey">
                        Circuit,
                      </span>
                    )}
                    {court.jurisdiction?.district ? (
                      <span className="row text-nowrap col-2">
                        {court.jurisdiction?.district?.name}
                      </span>
                    ) : (
                      <span className="row text-nowrap col-2 text-grey">
                        District
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="row">
                      <div className="col-6 col-xxl-4 text-right pr-2">
                        Open:
                      </div>
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
              );
            })}
            {!filteredCourts.length && renderAdditionalRows()}
          </tbody>
        </Table>
      </div>

      {selectedCourt && (
        <CourtsTablePopUp
          courtPopUp={courtPopUp}
          handleClose={handleClosePopUp}
          courtData={selectedCourt}
        />
      )}
    </div>
  );
};

export default CourtsTable;
