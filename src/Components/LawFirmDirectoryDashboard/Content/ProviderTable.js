import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import "../../../../public/bp_assets/css/provider.css";
import {
  getProviderInfo,
  setBulkProviderData,
} from "../../../Redux/client-providers/clientProviderSlice";
import ProviderTableRow from "../../common/ProviderTableRow";
import AddProviderDirectoryModal from "../../Modals/AddProviderDirectoryModalS";
import axios from "axios";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import ProviderTableAddress from "../../common/ProviderTableAddress";
import { setIsSearchDisabled } from "../../../Redux/Directory/directorySlice";

const ProviderTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const providerData = useSelector(
    (state) => state.clientProvider.providerData
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [updateProvider, setUpdateProvider] = useState(null);

  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);

  const [numColumns, setNumColumns] = useState(0);
  const [hasNoData, setHasNoData] = useState(false);

  useEffect(() => {
    const calculateRows = () => {
      if (!tableRef.current || !lastRealRowRef.current) return;

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
  }, [providerData]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    console.log("Calculating additional rows", hasNoData);
    if (hasNoData) {
      // Perform the logic when there is no data
      dispatch(setIsSearchDisabled(true));
      const table = document.querySelector(".custom-table-directory");
      console.log("TABLE EXIST", table);
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
      console.log("ADDITIONAL ROWS", additionalRows);
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
  }, [hasNoData]);

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

  useEffect(() => {
    (async () => {
      const data = await getProviderInfo(
        clientId,
        currentCaseId,
        setError,
        setLoading
      );
      dispatch(setBulkProviderData(data));
    })();
    getProviderInfo();
  }, []);

  useEffect(() => {
    if (updateProvider) {
      setShowPopup(true);
    } else {
      // console.log("nullllllllllllllll");
      setShowPopup(false);
    }
  }, [updateProvider]);

  const handleClosePopup = () => {
    setUpdateProvider(null);
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
    return <div>Error: {error.message || "Something went wrong"}</div>;
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
              <th>Office Name</th>
              <th>Website</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Fax</th>
              <th>Email</th>
              <th># of Treatment</th>
              <th>BR</th>
              <th>BP</th>
              <th>RR</th>
              <th>RP</th>
              <th>L</th>
              <th>Searchable</th>
              <th>Firm Name</th>
            </tr>
          </thead>
          <tbody>
            {providerData.map((provider, index) => (
              <tr
                key={index}
                onClick={() => setUpdateProvider(provider)}
                ref={index === providerData.length - 1 ? lastRealRowRef : null}
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">{provider?.search_name_provider}</td>
                <td className="is-search" style={{ wordBreak: "break-word" }}>
                  {provider?.website || ""}
                </td>
                <td className="is-search">
                  {provider?.locations[0]?.fullAddress && (
                    <ProviderTableAddress
                      fullAddress={provider?.locations[0]?.fullAddress}
                    />
                  )}
                </td>

                <td>
                  {provider?.locations[0]?.fullAddress?.phone || (
                    <span className="text-grey">(###) ###-####</span>
                  )}
                </td>
                <td
                  className="text-nowrap"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {provider?.locations[0]?.fullAddress?.fax || (
                    <span className="text-grey">(###) ###-####</span>
                  )}
                </td>
                <td style={{ wordBreak: "break-word" }}>
                  {provider?.locations[0]?.fullAddress?.email || ""}
                </td>
                <td>{provider?.treatment_location_count || ""}</td>
                <td>{provider?.BR || ""}</td>
                <td>{provider?.BP || ""}</td>
                <td>{provider?.RR || ""}</td>
                <td>{provider?.RP || ""}</td>
                <td>{provider?.L || ""}</td>
                <td>{provider?.isSearchable ? "Yes" : "No"}</td>
                <td>
                  {provider?.for_firm?.attorneyprofile?.office_name || ""}
                </td>
              </tr>
            ))}
            {renderAdditionalRows()}
          </tbody>
        </Table>
        <AddProviderDirectoryModal
          handleClose={handleClosePopup}
          providerPopUp={showPopup}
          providerData={updateProvider}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default ProviderTable;
