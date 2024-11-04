import { Table } from "react-bootstrap";
import axios from "axios";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchDistrictData } from "../../../Redux/district-table/districtSlice";
import DistrictTableModal from "../../Modals/DistrictTableModal";

const FederalCourtDistrictTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [error, setError] = useState(null);
  const [districtPopUp, setDistrictPopUp] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const { districts, loading } = useSelector((state) => state.districts);
  const [numColumns, setNumColumns] = useState(0);

  useEffect(() => {
    if (clientId && currentCaseId) {
      (async () => {
        dispatch(
          fetchDistrictData(
            `${origin}/api/add/districts/directory/${clientId}/${currentCaseId}/`,
            {
              headers: {
                Authorization: tokenBearer,
              },
            }
          )
        );
      })();
    }
  }, [clientId, currentCaseId]);

  useEffect(() => {
    if (!loading && districts.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else if (!loading && districts.length > 0) {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [districts]);

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
  }, [districts]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData || districts.length == 0) {
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
  }, [hasNoData, loading, districts.length]);

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

  const handleRowClick = (district) => {
    setSelectedDistrict(district);
    setDistrictPopUp(true);
  };

  const handleClosePopUp = () => {
    setDistrictPopUp(false);
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
              <th>District</th>
              <th>State</th>
              <th>County</th>
              <th>Cases With Federal Court District</th>
            </tr>
          </thead>
          <tbody>
            {console.log("data here", districts)}
            {districts?.map((district, index) => {
              return (
                <tr
                  key={district.id}
                  onClick={() => handleRowClick(district)}
                  ata-toggle="modal"
                  data-target="#edit_district_modal"
                  ref={index === districts.length - 1 ? lastRealRowRef : null}
                >
                  <td className="width-36">{index + 1}</td>
                  <td className="is-search text-nowrap">
                    {district?.name || ""}
                  </td>
                  <td>
                    {district?.state?.StateAbr}, {district?.state?.name}
                  </td>
                  <td className="text-nowrap">
                    {district?.counties?.length > 0 ? (
                      district?.counties?.map((county, index) => (
                        <span className="row" key={index}>
                          {county.name},
                        </span>
                      ))
                    ) : (
                      <span className="text-grey">List of Counties</span>
                    )}
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
              );
            })}
            {!districts.length && renderAdditionalRows()}
          </tbody>
        </Table>
      </div>

      {districtPopUp && (
        <DistrictTableModal
          districtPopUp={districtPopUp}
          handleClose={handleClosePopUp}
          districtData={selectedDistrict}
        />
      )}
    </div>
  );
};

export default FederalCourtDistrictTable;
