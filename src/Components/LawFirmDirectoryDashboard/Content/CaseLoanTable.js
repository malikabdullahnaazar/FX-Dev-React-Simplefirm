import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios"; // Ensure axios is imported
import CaseLoanTablePopUp from "../../Modals/CaseLoanTablePopUp";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchCaseLoanData } from "../../../Redux/case-loan/caseLoan";
import { handleLinkClick } from "../main";

const CaseLoanTable = () => {
  const tokenBearer = localStorage.getItem("token");
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  // const clientId = useSelector((state) => state?.client?.current.id);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [error, setError] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [caseLoanPopup, setCaseLoanPopup] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const lastRealRowRef = useRef(null);
  const [numColumns, setNumColumns] = useState(0);
  // const [hasNoData,setHasNoData]=useState(false)
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const dispatch = useDispatch();

  const { caseLoans, loading } = useSelector((state) => state.caseLoan);

  // useEffect(() => {
  //   if (clientId && currentCaseId) {
  //     getCaseLoanHandler();
  //   }
  // }, [clientId, currentCaseId]);

  useEffect(() => {
    if (clientId && currentCaseId) {
      (async () => {
        await dispatch(
          fetchCaseLoanData(
            `${origin}/api/add/case/loan/${clientId}/${currentCaseId}/`
          )
        );
      })();
    }
  }, [clientId, currentCaseId]);

  useEffect(() => {
    if (caseLoans.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [caseLoans]);

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
  }, [caseLoans]);

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

  const handleRowClick = (loan) => {
    setSelectedLoan(loan);
    setCaseLoanPopup(true);
  };

  const handleDelete = () => {
    // setCaseLoan(caseLoan.filter((loan) => loan.id !== selectedLoan.id));
    handleClosePopup();
  };

  const handleClosePopup = () => {
    setCaseLoanPopup(false);
    setSelectedLoan(null);
  };

  const handleSave = (updatedCaseLoan) => {
    const updatedLoans = caseLoans.map((loan) =>
      loan.id === updatedCaseLoan.id ? updatedCaseLoan : loan
    );
    // setCaseLoan(updatedLoans);
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
              <th></th>
              <th>Company</th>
              <th>Contact Information</th>
              <th>Cases With Company</th>
            </tr>
          </thead>
          <tbody>
            {caseLoans.map((loan, index) => {
              const contact = loan.contact;
              return (
                <tr
                  key={loan.id}
                  onClick={() => handleRowClick(loan)}
                  data-toggle="modal"
                  data-target="#edit_caseloan_modal"
                  ref={index === caseLoans.length - 1 ? lastRealRowRef : null}
                >
                  <td className="width-36">{index + 1}</td>
                  <td className="is-search">
                    {loan?.loan_company || ""}
                    <br />
                    {contact && <TableAddress fullAddress={contact} />}
                  </td>
                  <td className="is-search text-nowrap">
                    {contact?.phone_number ? (
                      <>
                        ({contact.phone_number.slice(0, 3)}){" "}
                        {contact.phone_number.slice(3, 6)}-
                        {contact.phone_number.slice(6)}
                        {contact?.phone_ext && (
                          <span className="text-grey">
                            {" ext "}
                            {contact?.phone_ext}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-grey">
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
                      <span className="text-grey">
                        (###) ###-#### - <b>fax</b>
                      </span>
                    )}
                    <br />
                    {contact?.email || (
                      <span className="text-grey">someone@example.com</span>
                    )}
                    <br />
                    {(contact?.website && (
                      <a
                        href={contact.website}
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
                    <div className="row">
                      <div className="col-4 text-right pr-2">Open:</div>
                      <div className="col-8">1</div>
                    </div>
                    <div className="row">
                      <div className="col-4 text-right pr-2">Closed:</div>
                      <div className="col-8">120</div>
                    </div>
                  </td>
                </tr>
              );
            })}
            {renderAdditionalRows()}
          </tbody>
        </Table>
      </div>
      <CaseLoanTablePopUp
        caseLoanPopup={caseLoanPopup}
        handleClose={handleClosePopup}
        handleDelete={handleDelete}
        handleSave={handleSave}
        loanData={selectedLoan}
      />
    </div>
  );
};

export default CaseLoanTable;
