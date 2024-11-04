import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import LitigationEventPopUp from "../../Modals/LitigationEventPopUp";
import { Table } from "react-bootstrap";
import { setIsSearchDisabled } from "../../../Redux/Directory/directorySlice";
import { fetchLitigationData } from "../../../Redux/litigation-event/litigationEventSlice";

const LitigationEventTable = ({ fetchLitigation }) => {
  const tokenBearer = localStorage.getItem("token");
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  // const clientId = useSelector((state) => state?.client?.current.id);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [events, setEvents] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsPopUp, setEventsPopUp] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const lastRealRowRef = useRef(null);

  const [numColumns, setNumColumns] = useState(0);
  // const [hasNoData, setHasNoData] = useState(false);
  const dispatch = useDispatch();
  const { litigations, loading } = useSelector(
    (state) => state.litigationEvent
  );
  const hasNoData = useSelector((state) => state.directory.hasNoData);

  useEffect(() => {
    if (clientId && currentCaseId) {
      (async () => {
        dispatch(
          fetchLitigationData(
            `${origin}/api/add/litigation/event/${clientId}/${currentCaseId}/`
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
  }, [litigations]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData) {
      console.log("yes enter the function");
      // Perform the logic when there is no data
      dispatch(setIsSearchDisabled(true));
      const table = document.querySelector(".custom-table-directory");

      if (!table) return; // Check if the table exists

      const rowHeight = 74; // height of each row in px
      const viewportHeight = window.innerHeight;
      const tableBottom = table.getBoundingClientRect().bottom;
      const remainingHeight = viewportHeight - tableBottom;

      let additionalRows = Math.max(0, Math.floor(remainingHeight / rowHeight));
      console.log("additional rows = ", additionalRows);
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

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setEventsPopUp(true);
  };

  const handleClosePopup = () => {
    setEventsPopUp(false);
    setSelectedEvent(null);
  };

  const handleDelete = () => {
    setEventsPopUp(false);
  };

  const handleSave = (updatedEvents) => {
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
              <th style={{ width: "2%" }}></th>
              <th style={{ width: "5%" }}>State/Federal</th>
              <th style={{ width: "5%" }}>State</th>
              <th style={{ width: "6%" }}>County</th>
              <th style={{ width: "10%" }}>Event Type</th>
              <th style={{ width: "6%" }}>Calculate Dates</th>
              <th style={{ width: "10%" }}>Dependant Date Type</th>
              <th style={{ width: "10%" }}>Event Name</th>
              <th style={{ width: "15%" }}>Event Description</th>
              <th style={{ width: "10%" }}>Event Code</th>
              <th style={{ width: "10%" }}>Service</th>
            </tr>
          </thead>
          <tbody>
            {litigations?.map((event, index) => (
              <tr
                key={event.id}
                onClick={() => handleRowClick(event)}
                data-toggle="modal"
                data-target="#edit_litigationact_modal"
                ref={index === litigations.length - 1 ? lastRealRowRef : null}
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">{event?.state_fed || ""}</td>
                <td>{event?.state_id?.StateAbr || ""}</td>
                <td>{event?.county_id?.name || ""}</td>
                <td className="is-search">
                  {event?.event_type_id?.litigation_event_type || ""}
                </td>
                <td className="text-nowrap">
                  {event?.calculated_dates_id?.map((cal) => (
                    <span key={cal.id}>
                      {cal?.calculated_date_name || ""}
                      <br />
                    </span>
                  ))}
                </td>
                <td>
                  {event?.dependent_date_type_id?.dependent_date_name || ""}
                </td>
                <td className="is-search">{event?.event_name || ""}</td>
                <td>{event?.event_description || ""}</td>
                <td>{event?.event_code || ""}</td>
                <td>{event?.service ? "Yes" : "No"}</td>
              </tr>
            ))}
            {renderAdditionalRows()}
          </tbody>
        </Table>
      </div>
      {eventsPopUp && (
        <LitigationEventPopUp
          eventsPopUp={eventsPopUp}
          handleClose={handleClosePopup}
          handleDelete={handleDelete}
          handleSave={handleSave}
          events={litigations}
          litigationEvent={selectedEvent}
        />
      )}
    </div>
  );
};

export default LitigationEventTable;
