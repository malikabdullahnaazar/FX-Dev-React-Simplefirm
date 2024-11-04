import React, { useEffect, useState, useRef, useCallback } from "react";
import ExpertTablePopUp from "../../Modals/ExpertTablePopUp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import { getCaseId, getClientId } from "../../../Utils/helper";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchExpertData } from "../../../Redux/experts-table/expertsSlice";
import { handleLinkClick } from "../main";

const ExpertTable = () => {
  const tokenBearer = localStorage.getItem("token");
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  // const clientId = useSelector((state) => state?.client?.current.id);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const { experts, loading } = useSelector((state) => state.experts);
  const [numColumns, setNumColumns] = useState(0);
  const [error, setError] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [expertsPopup, setExpertsPopup] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const lastRealRowRef = useRef(null);
  const tableRef = useRef();
  // const [hasNoData, setHasNoData] = useState(false);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);

  useEffect(() => {
    if (clientId && currentCaseId) {
      (async () => {
        dispatch(
          fetchExpertData(
            `${origin}/api/add/directory/expert/${clientId}/${currentCaseId}/`
          )
        );
      })();
    }
  }, [clientId, currentCaseId]);

  useEffect(() => {
    if (experts.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [experts]);

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
  }, [experts]);

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

  const handleRowClick = (expert) => {
    setSelectedExpert(expert);
    setExpertsPopup(true);
  };

  const handleClosePopup = () => {
    setSelectedExpert(null);
    setExpertsPopup(false);
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
    return <div>Error: {error?.message}</div>;
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
              <th
                style={{
                  width: "1%",
                }}
              ></th>
              <th>Expert</th>
              <th>Contact Information</th>
              <th>Cases With Expert</th>
            </tr>
          </thead>
          <tbody>
            {experts.map((expert, index) => (
              <tr
                key={expert.id}
                onClick={() => handleRowClick(expert)}
                data-toggle="modal"
                data-target="#edit_expert_modal"
                ref={index === experts.length - 1 ? lastRealRowRef : null}
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">
                  {expert?.title +
                    " " +
                    expert?.first_name +
                    " " +
                    expert?.last_name || ""}
                  <br />
                  {expert?.contactID && (
                    <TableAddress fullAddress={expert?.contactID} />
                  )}
                </td>
                <td
                  className={`text-nowrap ${
                    !expert?.contactID?.phone_number ? "text-grey" : ""
                  }`}
                >
                  {expert?.contactID?.phone_number ? (
                    <>
                      ({expert.contactID.phone_number.slice(0, 3)}){" "}
                      {expert.contactID.phone_number.slice(3, 6)}-
                      {expert.contactID.phone_number.slice(6)}
                      {expert?.contactID?.phone_ext && (
                        <span className="text-grey">
                          {" ext "}
                          {expert?.contactID?.phone_ext}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-grey">(###) ###-#### ext #####</span>
                  )}
                  <br />
                  {expert?.contactID?.fax ? (
                    <>
                      ({expert.contactID.fax.slice(0, 3)}){" "}
                      {expert.contactID.fax.slice(3, 6)}-
                      {expert.contactID.fax.slice(6)} - <b>fax</b>
                    </>
                  ) : (
                    <span className="text-grey">
                      (###) ###-#### - <b>fax</b>
                    </span>
                  )}
                  <br />
                  {expert?.contactID?.email || (
                    <span className="text-grey">someone@example.com</span>
                  )}
                  <br />
                  {(
                    <a
                      href={expert?.contactID?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLinkClick}
                      className="text-black"
                    >
                      {expert?.contactID?.website}
                    </a>
                  ) || <span className="text-grey">www.site@xyz.com</span>}
                </td>
                <td>
                  <div className="row">
                    <div className="col-2 text-right pr-2">Open:</div>
                    <div className="col-10">1</div>
                  </div>
                  <div className="row">
                    <div className="col-2 text-right pr-2">Closed:</div>
                    <div className="col-10">120</div>
                  </div>
                </td>
              </tr>
            ))}
            {renderAdditionalRows()}
          </tbody>
        </Table>
      </div>
      {expertsPopup && (
        <ExpertTablePopUp
          ExpertTablePopUp={expertsPopup}
          handleClose={handleClosePopup}
          expert={selectedExpert}
        />
      )}
    </div>
  );
};

export default ExpertTable;
