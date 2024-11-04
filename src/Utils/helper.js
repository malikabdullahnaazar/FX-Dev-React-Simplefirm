import api from "../api/api";
import { setStatusLoader } from '../Redux/general/actions';
import { format, formatISO, parseISO } from 'date-fns';

export const getToken = () => {
  return localStorage.getItem("token", false);
};

export const setToken = (token) => {
  return localStorage.setItem("token", "Bearer " + token);
};

export const removeToken = (token) => {
  return localStorage.removeItem("token");
};

export const getClientId = () => {
  return localStorage.getItem("client_id");
};

export const setClientId = (client_id) => {
  return localStorage.setItem("client_id", client_id);
};

export const getCaseId = () => {
  return localStorage.getItem("case_id");
};

export const setCaseId = (case_id) => {
  return localStorage.setItem("case_id", case_id);
};

export function calculateAge(birthdate) {
  if (!birthdate) return ""; // Check for falsy birthdate value and return empty string

  const birthdateObj = new Date(birthdate);
  if (isNaN(birthdateObj)) return ""; // Check if birthdate conversion is invalid and return empty string

  const today = new Date();
  let age = today.getFullYear() - birthdateObj.getFullYear();
  const m = today.getMonth() - birthdateObj.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdateObj.getDate())) {
    age--;
  }
  return age >= 0 ? age : ""; // Ensure age is not negative; return age or empty string
}

export const currencyFormat = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
    .format(amount)
    .replace("$", "$ ");
};

export function formatDate(dateStr) {
  if (
    !dateStr ||
    dateStr === "" ||
    dateStr === "__/__/___" ||
    dateStr === "Invalid Date"
  ) {
    return "";
  }
  // Convert the input string to a Date object
  const date = new Date(dateStr);
  // Get the day, month, and year from the Date object
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString();
  const year = date.getFullYear();

  // Format the date in dd/mm/yyyy format
  return `${month}/${day}/${year}`;
}

export function formatDateUTC(dateStr) {
  if (
    !dateStr ||
    dateStr === "" ||
    dateStr === "__/__/___" ||
    dateStr === "Invalid Date"
  ) {
    return "";
  }

  const date = new Date(dateStr);

  if (isNaN(date)) {
    return "";
  }

  const day = date.getUTCDate().toString();
  const month = (date.getUTCMonth() + 1).toString();
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
}

export function formatPhoneNumber(phoneNumber) {
  // Remove non-digit characters from the phone number
  phoneNumber = phoneNumber?.replace(/\D/g, "");

  // Format the phone number as (XXX) XXX-XXXX
  return phoneNumber?.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

export function formatPhoneToDashes(phoneNumber) {
  if (phoneNumber && phoneNumber !== "") {
    if (phoneNumber.length >= 10) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    }
    return phoneNumber;
  } else {
    return "(###) ###-####";
  }
}

// media files route resolver
// U2024/31/5/3:19AM
export function mediaRoute(route) {
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;

  let absoluteUrl = media_origin + route;
  return absoluteUrl;
}

//U2024/12/6|10:58PM
export const fetchShakespeareStatus = async (caseId, clientId, entity, dispatch) => {
  dispatch(setStatusLoader(true))
  const baseUrl =
    process.env.REACT_APP_BACKEND_URL + "/api/shakespeare_status_api/";
  const url = `${baseUrl}?case_id=${caseId}&client_id=${clientId}&entity=${entity}`;
  console.log("Shakespear method get called!!!!!!!!!!!!!!!!!!");
  try {
    const response = await api.get(url);
    if (!response.ok) {
      throw new Error(`Shakespeare HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Shakespare", data)
    dispatch(setStatusLoader(false))
    
    return data;
  } catch (error) {
    console.error("Error fetching Shakespeare status:", error);
  }
  finally {
    dispatch(setStatusLoader(false));
  }
};

// FUNCTION FOR FORMATING DATE TO STANDARD FORMAT (MM/DD/YYYY)
export function standardFormatDate(date) {
  return date
    ? new Date(date)
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/^0+/, "")
    : "";
}

// FUNCTION FOR FORMATING DATE TIME TO STANDARD FORMAT (MM/DD/YYYY)
export function standardFormatDateTime(isoDate) {
  const date = new Date(isoDate);
  // Format the date and time
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .replace(",", " at");
  return formattedDate;
}

//US:2024/AUG/6
export function isValidUSPhoneNumber(phoneNumber) {
  const usPhonePattern = /^(\+1|1)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return usPhonePattern.test(phoneNumber);
}

// Set width of a table columns Equal. 
export const setEqualColumnWidths = (tableRef) => {
  const table = tableRef.current;

  if (table) {
    const tableRect = table.getBoundingClientRect(); // Get the table's dimensions and position
    const availableWidth = window.innerWidth - tableRect.left; // Calculate the available width

    const headers = table.querySelectorAll('th');
    const numColumns = headers.length;

    if (numColumns > 0 && availableWidth > 0) {
      const columnWidth = Math.floor(availableWidth / numColumns);

      headers.forEach(header => {
        header.style.minWidth = `${columnWidth}px`;
        header.style.maxWidth = `${columnWidth}px`;
      });

      const cells = table.querySelectorAll('td');
      cells.forEach(cell => {
        cell.style.minWidth = `${columnWidth}px`;
        cell.style.maxWidth = `${columnWidth}px`;
      });
    }
  }
};

export const getLoggedInUserId = () => {
  const userId = localStorage.getItem("loggedInUser") || null;
  return userId
}


//DEV_RK 9/5/2024
// :: These formatting functions address the issue of day shift bugs for ISO dates. ::

// Formats date to ISO 8601 format (complete representation) for posting data
export const formatDateForSubmission = (date) => {
  const parsedDate = parseISO(date);
  return formatISO(parsedDate, { representation: 'complete' }); // Ensures date is in complete ISO 8601 format in UTC
};

// Formats date to 'yyyy-MM-dd' format for populating fields in modals
export const formatDateForModalFields = (date) => {
  if (!date) return "";
  const parsedDate = parseISO(date);
  return format(parsedDate, 'yyyy-MM-dd'); // Formats date for display in input fields within modals
};

// Formats date to 'M/dd/yyyy' format for rendering in UI panels
export const formatDateForPanelDisplay = (date) => {
  if (!date) return "";
  const parsedDate = parseISO(date);
  return format(parsedDate, 'M/dd/yyyy'); // Formats date for displaying in various panels in the application
};