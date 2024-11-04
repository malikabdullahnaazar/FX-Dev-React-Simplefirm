import React, { useEffect, useState, useRef, useCallback } from "react";
import TimeCodePopUp from "../../Modals/TimeCodePopUp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Table } from "react-bootstrap";
import { setIsSearchDisabled } from "../../../Redux/Directory/directorySlice";
import { fetchTimeCode as fetchTimeCodeData } from "../../../Redux/time-code/timeCodeSlice";

const TimecodeTable = ({}) => {
  const tokenBearer = localStorage.getItem("token");
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  // const clientId = useSelector((state) => state?.client?.current.id);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [error, setError] = useState(null);
  const [selectedTimecode, setSelectedTimecode] = useState(null);
  const [timeCodesPopup, setTimeCodesPopup] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const lastRealRowRef = useRef(null);

  const [numColumns, setNumColumns] = useState(0);
  // const [hasNoData,setHasNoData]=useState(false)
  const { timeCodes, loading } = useSelector((state) => state.timeCodes);

  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);

  useEffect(() => {
    if (clientId && currentCaseId) {
      (async () => {
        await dispatch(
          fetchTimeCodeData(
            `${origin}/api/add/time/code/${clientId}/${currentCaseId}/`
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
  }, [timeCodes]);

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

  const handleRowClick = (timecode) => {
    setSelectedTimecode(timecode);
    setTimeCodesPopup(true);
  };

  const handleDelete = () => {
    handleClosePopup();
  };

  const handleClosePopup = () => {
    setTimeCodesPopup(false);
    setSelectedTimecode(null);
  };

  const handleSave = (updatedTimeCodes) => {
    const updatedCodes = timeCodes.map((timecode) =>
      timecode.id === updatedTimeCodes.id ? updatedTimeCodes : timecode
    );
    // setTimecodes(updatedCodes);
    // console.log("object");
    handleClosePopup();
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
              <th style={{ width: "20px" }}>#</th>
              <th style={{ width: "3%" }}>Bill Code Category</th>
              <th style={{ width: "5%" }}>Bill Code Category Name</th>
              <th style={{ width: "30px" }}>Bill Code</th>
              <th style={{ width: "40px" }}>Bill Code Name</th>
              <th style={{ width: "auto" }}>Bill Code Definition</th>
            </tr>
          </thead>
          <tbody>
            {timeCodes.map((timecode, index) => (
              <tr
                key={timecode.id}
                onClick={() => handleRowClick(timecode)}
                data-toggle="modal"
                data-target="#edit_timecodes_modal"
                ref={index === timeCodes.length - 1 ? lastRealRowRef : null}
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">
                  {timecode?.bill_code_category || ""}
                </td>
                <td className="is-search">
                  {timecode?.bill_code_category_name || ""}
                </td>
                <td className="is-search">{timecode?.bill_code || ""}</td>
                <td>{timecode?.bill_code_name || ""}</td>
                <td>{timecode?.bill_code_definition || ""}</td>
              </tr>
            ))}
            {renderAdditionalRows()}
            {/* {additionalRows > 0 &&
              [...Array(additionalRows)].map((_, index) => (
                <tr
                  key={`additional-${index}`}
                  className="fake-row-2"
                  style={{ height: '55px' }}
                >
                  <td colSpan="6">&nbsp;</td>
                </tr>
              ))} */}
          </tbody>
        </Table>
      </div>
      <TimeCodePopUp
        timeCodesPopup={timeCodesPopup}
        handleClose={handleClosePopup}
        handleDelete={handleDelete}
        handleSave={handleSave}
        timecode={selectedTimecode}
      />
    </div>
  );
};

export default TimecodeTable;
