import React, { useEffect, useState, useRef, useCallback } from "react";
import AttorneyTablePopUp from "../../Modals/AttorneyTablePopUp";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import axios from "axios";
import { Spinner, Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchAttorneyDirectoryData } from "../../../Redux/attorny-table/attornySlice";
import { handleLinkClick } from "../main";

const AttorneyTable = () => {
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const { attorneyDirectories, loading } = useSelector(
    (state) => state.attorneyDirectories
  );
  const [error, setError] = useState(null);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [attorneyPopUp, setAttorneyPopUp] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const lastRealRowRef = useRef(null);
  // const [hasNoData, setHasNoData] = useState(false);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  //

  useEffect(() => {
    if (clientId && currentCaseId) {
      (async () => {
        dispatch(
          fetchAttorneyDirectoryData(
            `${origin}/api/attorney/law/firm/${clientId}/${currentCaseId}/`
          )
        );
      })();
    }
  }, [clientId, currentCaseId]);

  const [numColumns, setNumColumns] = useState(0);

  useEffect(() => {
    if (attorneyDirectories.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [attorneyDirectories]);
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
  }, [attorneyDirectories]);

  // Fake rows when there is no data
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
          height: `${lastRealRowRef.current ? lastRealRowRef.current.getBoundingClientRect().height : 94}px`,
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

  const handleRowClick = (attorney) => {
    setSelectedAttorney(attorney);
    setAttorneyPopUp(true);
  };

  const handleClose = () => {
    setAttorneyPopUp(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span class="loader"></span>
      </div>
    );
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
              <th>Attorney</th>
              <th>Law Firm Name</th>
              <th>Contact Information</th>
              <th>Cases With Attorney</th>
            </tr>
          </thead>
          <tbody>
            {attorneyDirectories.map((attorney, index) => {
              // Ensure main_contact is an array with at least one element
              const mainContact = attorney?.main_contact?.[0] || {};

              return (
                <tr
                  key={attorney.id}
                  onClick={() => handleRowClick(attorney)}
                  data-toggle="modal"
                  data-target="#edit_attorney_modal"
                  ref={
                    index === attorneyDirectories.length - 1
                      ? lastRealRowRef
                      : null
                  }
                >
                  <td className="width-36">{index + 1}</td>
                  <td className="is-search">
                    {mainContact.first_name +
                      " " +
                      mainContact.middle_name +
                      " " +
                      mainContact.last_name || ""}
                    <br />
                    {mainContact && <TableAddress fullAddress={mainContact} />}
                  </td>
                  <td className="is-search">
                    {attorney?.firmdirectory?.office_name || ""}
                  </td>
                  <td
                    className={`text-nowrap ${
                      !mainContact.phone_number ? "text-grey" : ""
                    }`}
                  >
                    {mainContact.phone_number ? (
                      <>
                        ({mainContact.phone_number.slice(0, 3)}){" "}
                        {mainContact.phone_number.slice(3, 6)}-
                        {mainContact.phone_number.slice(6)}
                        {mainContact.phone_ext && (
                          <span className="text-grey">
                            {" ext "}
                            {mainContact.phone_ext}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-grey">
                        (###) ###-#### ext #####
                      </span>
                    )}
                    <br />
                    {mainContact.fax ? (
                      <>
                        ({mainContact.fax.slice(0, 3)}){" "}
                        {mainContact.fax.slice(3, 6)}-{mainContact.fax.slice(6)}{" "}
                        -<b>fax</b>
                      </>
                    ) : (
                      <span className="text-grey">
                        (###) ###-#### - <b>fax</b>
                      </span>
                    )}
                    <br />
                    {mainContact.email || (
                      <span className="text-grey">someone@example.com</span>
                    )}
                    <br />
                    {(mainContact?.website && (
                      <a
                        href={mainContact?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className="text-black"
                      >
                        {mainContact?.website}
                      </a>
                    )) || <span className="text-grey">www.site@xyz.com</span>}
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
            {renderAdditionalRows()}
          </tbody>
        </Table>
      </div>
      {selectedAttorney && (
        <AttorneyTablePopUp
          attorneyPopUp={attorneyPopUp}
          handleClose={handleClose}
          attorney={selectedAttorney}
        />
      )}
    </div>
  );
};

export default AttorneyTable;
