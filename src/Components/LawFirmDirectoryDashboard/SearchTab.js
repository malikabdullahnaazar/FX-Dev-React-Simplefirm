import React, { useState, useRef, useEffect } from "react";
import ReportingAgencyPopUp from "../Modals/ReportingAgencyPopUp";
import ReportingAgencyPopUpDuplicate from "../Modals/ReportingAgencyPopUpDuplicate";
import InsuranceCompanyPopUp from "../Modals/InsuranceCompanyPopUp";
import InsuranceAdjusterPopUp from "../Modals/InsuranceAdjusterPopUp";
import ExpertPopUp from "../Modals/ExpertPopUp";
import LawFirmModal from "../Modals/LawFirmModal";
import AttorneyModal from "../Modals/AttorneyModal";
import LoanCaseModal from "../Modals/LoanCaseModal";
import CourtDirectoryModal from "../Modals/CourtDirectoryModal";
import JudgeDirectoryModal from "../Modals/JudgeDirectoryModal";
import AddDepartmentModal from "../Modals/AddDepartmentModal";
import LitigationEventModal from "../Modals/LitigationEventModal";
import TimeCodeModal from "../Modals/TimeCodeModal";
import AddStatutesModal from "../Modals/AddStatutesModal";
import AddProcessorServerModal from "../Modals/AddProcessorServerModal";
import AddProviderDirectoryModal from "../Modals/AddProviderDirectoryModalS";
import $ from "jquery";
import "./directory-47.css";
import { useSelector } from "react-redux";
import DirectorySearchDropdown from "../common/DirectorySearchDropdown";
import AddFederalCourtDistrictModal from "../Modals/AddFederalCourtDistrictModal";

function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

const SearchTab = () => {
  const [activeTabText, setActiveTabText] = useState("Accounts");
  const searchInputRef = useRef(null);
  const [buttonText, setButtonText] = useState("Accounts");
  const [popups, setPopups] = useState({
    "Reporting Ag": false,
    "Insurance Co": false,
    "Insurance Ad": false,
    Expert: false,
    "Law Firm": false,
    Attorney: false,
    "Case Loan": false,
    Court: false,
    Judge: false,
    Department: false,
    Provider: false,
    "Litigation Event": false,
    "Time Codes": false,
    Statute: false,
    "Process Server": false,
    Federal: false,
  });

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 1000);

    window.addEventListener("resize", debouncedHandleResize);

    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  const turncatetext = (text) => {
    let num = 15;
    if (dimensions.width > 2000) {
      num = 13;
    } else if (dimensions.width > 1500 && dimensions.width < 2000) {
      num = 12;
    } else if (dimensions.width > 1000 && dimensions.width < 1500) {
      num = 10;
    } else if (dimensions.width > 768 && dimensions.width < 1000) {
      num = 9;
    } else num = 7;
    if (text.length < num) {
      return text;
    } else return text.slice(0, num) + "...";
  };

  const togglePopup = (popupName) => {
    setPopups((prevPopups) => ({
      ...prevPopups,
      [popupName]: !prevPopups[popupName],
    }));
  };

  function getOutputText(input) {
    switch (true) {
      case input.includes("Accounts"):
        return "Accounts";
      case input.includes("Reporting"):
        return "Reporting Agency";

      case input.includes("Insurance Ad"):
        return "Insurance Adjuster";

      case input.includes("Insurance Co..."):
        return "Insurance Company";
      case input.includes("Expert"):
        return "Expert";
      case input.includes("Law Firm"):
        return "Law Firm";
      case input.includes("Attorney"):
        return "Attorney";
      case input.includes("Case Loan"):
        return "Case Loan";
      case input.includes("Courts"):
        return "Courts";
      case input.includes("Judge"):
        return "Judge";
      case input.includes("Department"):
        return "Department";
      case input.includes("Provider"):
        return "Provider";
      case input.includes("Litigation"):
        return "Litigation Event";
      case input.includes("Time Codes"):
        return "Time Codes";
      case input.includes("Statute"):
        return "Statute";
      case input.includes("Process"):
        return "Process Server";
      case input.includes("Federal"):
        return "Federal Court District";
      default:
        return "Insurance Company";
    }
  }

  useEffect(() => {
    setActiveTabText($(".PT9-LFD.active > nobr").text() || "Accounts");
    const handleTabClick = (e) => {
      const text = $(e.target).text();
      setActiveTabText(text);

      setButtonText(text);

      if (searchInputRef.current) {
        searchInputRef.current.value = "";
        filterTabEntries();
      }
    };

    $(".PT9-LFD").on("click", handleTabClick);

    return () => {
      $(".PT9-LFD").off("click", handleTabClick);
    };
  }, []);

  const filterTabEntries = () => {
    const searchText = searchInputRef.current.value.toLowerCase().trim();
    const tables = document.querySelectorAll(
      ".custom-table-directory, .law-firm-list"
    );

    tables.forEach((table) => {
      const rows = table.querySelectorAll("tbody tr");
      let visibleRowIndex = 1; // Start indexing from 1
      const colSpan = table.querySelectorAll("thead tr th").length;

      rows.forEach((row) => {
        if (searchText.length > 1) {
          let shouldShow = false;

          const cellsToSearch = [...row.querySelectorAll(".is-search")];

          // Split the cleaned search text into individual words
          const searchWords = searchText
            .split(" ")
            .filter((word) => word.length > 0);

          // Check if any cell matches the search words starting from the beginning of the word
          shouldShow = cellsToSearch.some((cell) => {
            if (cell) {
              const cellText = cell.textContent.toLowerCase().trim();
              const cellWords = cellText.split(" ");

              // Check if every search word matches the start of at least one word in the cell
              return searchWords.every(
                (searchWord) =>
                  cellWords.some((cellWord) => cellWord.startsWith(searchWord)) // Changed to startsWith
              );
            }
            return false;
          });

          row.classList.remove("filtered-row", "even", "odd");
          // if (row.classList.contains("no-search")) {
          //   shouldShow = false;
          // }
          if (shouldShow) {
            row.style.display = "table-row";
            row.querySelector("td:first-child").textContent = visibleRowIndex;
            visibleRowIndex += 1;
            row.classList.add("filtered-row");
            row.classList.add(visibleRowIndex % 2 === 1 ? "odd" : "even");
          } else {
            row.style.display = "none";
          }
        } else {
          row.style.display = "table-row";
        }
      });

      const tbody = table.querySelector("tbody");

      const fakeRows = table.querySelectorAll(".fake-row-2");
      fakeRows.forEach((fakeRow) => {
        if (fakeRow.parentNode) {
          fakeRow.remove();
        }
      });

      if (searchText !== "") {
        const tableBottom = table.getBoundingClientRect().bottom;
        const pageHeight = window.innerHeight;

        const rowHeight = 70; // Assuming each row is 70px high
        const remainingHeight = pageHeight - tableBottom;

        let rowsNeeded = Math.ceil(remainingHeight / rowHeight);
        if (rowsNeeded > 0) {
          rowsNeeded -= 1;
        }

        for (let i = 0; i < rowsNeeded; i++) {
          const fakeRow = document.createElement("tr");
          fakeRow.className = "fake-row-2";
          fakeRow.style.height = `${rowHeight}px`;

          const td = document.createElement("td");
          td.colSpan = colSpan;
          td.innerHTML = "&nbsp;";
          fakeRow.appendChild(td);
          tbody.appendChild(fakeRow);
        }
      }
    });
  };

  const handleInputChange = () => {
    filterTabEntries();
  };

  useEffect(() => {
    filterTabEntries();

    const handleResize = () => {
      filterTabEntries();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleInputLowercase = (e) => {
    e.target.value = e.target.value.toLowerCase();
  };

  useEffect(() => {
    const inputsEmail = document.querySelectorAll("input[name*=email]");
    const inputsWebsite = document.querySelectorAll("input[name*=website]");

    inputsEmail.forEach((input) =>
      input.addEventListener("keyup", handleInputLowercase)
    );
    inputsWebsite.forEach((input) =>
      input.addEventListener("keyup", handleInputLowercase)
    );

    return () => {
      inputsEmail.forEach((input) =>
        input.removeEventListener("keyup", handleInputLowercase)
      );
      inputsWebsite.forEach((input) =>
        input.removeEventListener("keyup", handleInputLowercase)
      );
    };
  }, []);

  const handleButtonClick = () => {
    const popupName = buttonText;
    togglePopup(popupName);
  };

  const isSearchDisabled = useSelector(
    (state) => state.directory.isSearchDisabled
  );

  return (
    <div className="nav nav-tabs mb-1 h-auto overflow-visible" role="tablist">
      <div
        className="d-flex align-items-center w-100"
        style={{ marginTop: "5px" }}
      >
        <div className="height-35 d-flex align-items-center p-l-5 p-r-5 text-white search_filter_dir_label_div">
          <label
            htmlFor="search_filter_directories"
            className="search_filter_directories_label font-weight-bold btn btn-primary m-2 p-0"
          >
            {/* {activeTabText} */}
            {getOutputText(activeTabText)}
          </label>
        </div>
        <input
          type="text"
          style={{
            flex: 1,
          }}
          className="form-control"
          placeholder="Type Something to Filter"
          ref={searchInputRef}
          id="search_filter_directories"
          onChange={handleInputChange}
          disabled={isSearchDisabled}
        />
        {(buttonText == "Courts" ||
          buttonText == "Judge" ||
          buttonText == "Department") && <DirectorySearchDropdown />}
        <div className="d-flex justify-content-end p-l-5">
          <button
            className="font-weight-bold btn btn-primary mr-3"
            onClick={handleButtonClick}
          >
            <span style={{ color: "gold", paddingRight: "6px" }}>+</span>{" "}
            {getOutputText(buttonText)}
          </button>
        </div>
      </div>
      <>
        {Object.keys(popups).map((popupName, index) => (
          <React.Fragment key={index}>
            {popupName === turncatetext("Reporting Agency") && (
              <ReportingAgencyPopUp
                reportingAgencyPopup={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Insurance Company") && (
              <InsuranceCompanyPopUp
                insuranceCompanyPopup={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Insurance Ad" && (
              <InsuranceAdjusterPopUp
                insuranceAdjusterPopup={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Expert") && (
              <ExpertPopUp
                expertPopup={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Law Firm") && (
              <LawFirmModal
                lawFirmPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Attorney") && (
              <AttorneyModal
                attorneyPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Case Loan") && (
              <LoanCaseModal
                loanCasePopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Courts") && (
              <CourtDirectoryModal
                courtPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Judge") && (
              <JudgeDirectoryModal
                judgePopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Department") && (
              <AddDepartmentModal
                departmentPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Provider") && (
              <AddProviderDirectoryModal
                providerPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Litigation Event") && (
              <LitigationEventModal
                litigationEventPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Time Codes") && (
              <TimeCodeModal
                timeCodePopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Statute") && (
              <AddStatutesModal
                statuesPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Process Server") && (
              <AddProcessorServerModal
                addProcessorServer={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === turncatetext("Federal Court District") && (
              <AddFederalCourtDistrictModal
                addFederalCourtDistrict={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
          </React.Fragment>
        ))}
      </>
    </div>
  );
};

export default SearchTab;
