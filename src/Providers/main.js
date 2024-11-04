// import { data } from "./data";
import {
  setCaseSummary,
  setCurrentCase,
  setPages,
} from "../Redux/caseData/caseDataSlice";
import {
  setToken,
  removeToken,
  setClientId,
  setCaseId,
  getToken,
} from "../Utils/helper";
import api from "../api/api";
import axios from "axios";
import store from "../Redux/store";
import { fetchCaseSummary } from "../api/case";
const origin = process.env.REACT_APP_BACKEND_URL;
const chat_origin = "https://chat-ecs.simplefirm.com";

const auth_config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: getToken(),
  },
};

export const submitLoginForm = async (
  username,
  password,
  setErrorMsg,
  setLoginLoader,
  setInactivityTimeout,
  setToDoCount,
  setFlaggedPageCount,
  dispatch
) => {
  api
    .post(`/api/login/`, {
      username: username,
      password: password,
    })
    .then((res) => {
      setToken(res.data?.access_token);
      localStorage.setItem("username", res.data?.username);
      setClientId(res.data?.data?.client_id);
      setCaseId(res.data?.data?.case_id);
      dispatch(setInactivityTimeout(res.data?.logout_time));
      store.dispatch(setPages(res.data?.data?.pages));
      store.dispatch(setCurrentCase(res.data?.data?.case));
      fetchCaseSummary(res.data?.data?.client_id, res.data?.data?.case_id)
        .then((data) => {
          store.dispatch(setCaseSummary(data));
          setErrorMsg("");
          setLoginLoader(false);
          // window.location.reload();
        })
        .catch((err) => {
          console.log("Error occurred", err);
        });
      api.post(
        `/api/shakespeare_for_flagging/`,
        {
          client_id: res.data?.data?.client_id,
          case_id: res.data?.data?.case_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }
      );
      api
        .get(`/api/todo/notification-count/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        })
        .then((res) => dispatch(setToDoCount(res?.data?.count)));

      api
        .get(`/api/flaggedpage/notification-count/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        })
        .then((res) => dispatch(setFlaggedPageCount(res?.data?.count)));
    })
    .catch((err) => {
      setLoginLoader(false);
      setErrorMsg("Invalid credentials.");
    });
};

export const fetchSearchTabsResult = async (
  currentSearchStatus = "client-name",
  searchText = "",
  dispatch,
  setSearchTabResults,
  setCurrentSearchStatus,
  setTabsResultCount,
  setCurrentTab
) => {
  api
    .get(`/api/search/tabs/?tab=${currentSearchStatus}&query=${searchText}`)
    .then((res) => {
      dispatch(setSearchTabResults(res.data.data));
      dispatch(setCurrentSearchStatus("tabs"));
      let tabs_count = {
        "client-name": res.data?.tabs_count["client-name"],
        "client-email": res.data?.tabs_count["client-email"],
        defendant: res.data?.tabs_count["defendant"],
        witness: res.data?.tabs_count["witness"],
        claim: res.data?.tabs_count["claim"],
        "court-case": res.data?.tabs_count["court-case"],
        otherparty: res.data?.tabs_count["otherparty"],
        address: res.data?.tabs_count["address"],
        notes: res.data?.tabs_count["notes"],
        document: res.data?.tabs_count["document"],
      };
      dispatch(setTabsResultCount(tabs_count));
      let firstNonZeroKey;
      for (const key in tabs_count) {
        if (tabs_count[key] > 0) {
          firstNonZeroKey = key;
          break;
        }
      }
      dispatch(setCurrentTab(firstNonZeroKey));
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const fetchSearchTabsResultTriggeredByTabChange = async (
  currentSearchStatus = "client-name",
  searchText = "",
  dispatch,
  setSearchTabResults,
  setCurrentSearchStatus,
  setTabsResultCount,
  setCurrentTab
) => {
  api
    .get(`/api/search/tabs/?tab=${currentSearchStatus}&query=${searchText}`)
    .then((res) => {
      dispatch(setSearchTabResults(res.data.data));
      dispatch(setCurrentSearchStatus("tabs"));
      let tabs_count = {
        "client-name": res.data?.tabs_count["client-name"],
        "client-email": res.data?.tabs_count["client-email"],
        defendant: res.data?.tabs_count["defendant"],
        witness: res.data?.tabs_count["witness"],
        claim: res.data?.tabs_count["claim"],
        "court-case": res.data?.tabs_count["court-case"],
        otherparty: res.data?.tabs_count["otherparty"],
        address: res.data?.tabs_count["address"],
        notes: res.data?.tabs_count["notes"],
        document: res.data?.tabs_count["document"],
      };
      dispatch(setTabsResultCount(tabs_count));
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const fetchSearchClientResult = async (
  searchName = "A",
  dispatch,
  setSearchTabResults,
  setCurrentSearchStatus,
  setTabsResultCount
) => {
  api
    .post(`/api/search/clients/`, {
      name: searchName,
    })
    .then((res) => {
      dispatch(setSearchTabResults(res.data.data));
      dispatch(setCurrentSearchStatus("clients"));
      dispatch(
        setTabsResultCount({
          "client-name": 0,
          "client-email": 0,
          witness: 0,
          defendant: 0,
          notes: 0,
          claim: 0,
          otherparty: 0,
          invoice: 0,
          incident: 0,
          document: 0,
          address: 0,
          "client-phone": 0,
          "client-ssn": 0,
          "client-birthday": 0,
          "incident-date": 0,
          "defendant-phone": 0,
          "court-case": 0,
          check: 0,
        })
      );
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const AddNotes = async (note, category, case_id, client_id) => {
  api
    .post(`/api/search/notes/add/`, {
      description: note,
      category: category,
      case_id: case_id,
      client_id: client_id,
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        // window.location.reload();
      }
    });
};

export const fetchInboxPage = async (
  dispatch,
  setInboxDocPanels,
  setInboxTableLoader,
  inboxTab
) => {
  if (!inboxTab) {
    inboxTab = "all";
  }
  api
    .get(`/api/inbox/docs/?tab_name=${inboxTab}`)
    .then((res) => {
      console.log(res.data);
      dispatch(setInboxDocPanels(res.data.data?.doc_panels));
      dispatch(setInboxTableLoader(false));
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const fetchInboxDocumentHistory = async (
  dispatch,
  setInboxDocumentHistory,
  setInboxTableLoader
) => {
  api
    .get(`/api/inbox/document/history/`)
    .then((res) => {
      console.log(res.data);
      dispatch(setInboxDocumentHistory(res.data.data?.documents_history));
      dispatch(setInboxTableLoader(false));
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const fetchInboxTabCount = async (dispatch, setInboxTabsCount) => {
  api
    .get(`/api/inbox/tab/count/`)
    .then((res) => {
      console.log(res.data);
      dispatch(setInboxTabsCount(res.data.data));
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const fetchInboxTabs = async (
  dispatch,
  setInboxTableLoader,
  setInboxDocPanels,
  tab_name
) => {
  api
    .get(`/api/inbox/tabs/?tab_name=${tab_name}`)
    .then((res) => {
      console.log(res.data);
      dispatch(setInboxDocPanels(res.data.data));
      dispatch(setInboxTableLoader(false));
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const fetchCaseLoad = async (
  doc_id,
  query,
  setSearchResults,
  setShowTableLoader
) => {
  api
    .get(`/api/caseload/?query=${query}&doc_id=${doc_id}`)
    .then((res) => {
      console.log(res.data.data);
      setSearchResults(res.data.data);
      setShowTableLoader(false);
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const UploadDocumentsForInbox = async (
  files,
  case_id,
  client_id,
  dispatch,
  inboxRefreshDocuments,
  setInboxRefreshDocuments,
  setUploadProgress
) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });
  formData.append("number_of_files", files.length);
  formData.append("case_id", case_id);
  formData.append("client_id", client_id);

  api
    .post(`/api/upload/doc/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    })
    .then((res) => {
      dispatch(setInboxRefreshDocuments(!inboxRefreshDocuments));
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const deleteDocument = async (
  document_id,
  dispatch,
  inboxRefreshDocuments,
  setInboxRefreshDocuments
) => {
  api
    .post(`/api/delete/doc/`, {
      document_id: document_id,
    })
    .then((res) => {
      console.log(res);
      dispatch(setInboxRefreshDocuments(!inboxRefreshDocuments));
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const fetchPagePanels = async (
  case_id,
  page_id,
  page_name,
  setNestedDropdowns,
  dispatch,
) => {
  api
    .get(
      `/api/page_panels/list/?case_id=${case_id}&page_id=${page_id}&page_name=${page_name}`
    )
    .then((res) => {
      console.log(res?.data);
      if(dispatch) {
        dispatch(setNestedDropdowns(res?.data))
      } else {
        setNestedDropdowns(res?.data);
      }
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const attachDocToPage = async (
  page_id,
  case_id,
  panels,
  doc_id,
  slot,
  panel_id,
  insurance_id = null,
  account_id = null,
  type = null,
  unsorted_case,
  unsorted_page,
  load_document_popup
) => {
  api
    .post(`/api/attach_doc_to_page/`, {
      page_id: page_id,
      case_id: case_id,
      panels: panels,
      doc_id: doc_id,
      slot: slot,
      panel_id: panel_id,
      insurance_id: insurance_id,
      account_id: account_id,
      type: type,
      unsorted_case: unsorted_case,
      unsorted_page: unsorted_page,
    })
    .then((res) => {
      console.log(res?.data);
      load_document_popup(res?.data);
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const updateCheckStatus = async (
  check_id,
  doc_id,
  action,
  load_document_popup
) => {
  api
    .post(`/api/inbox/check/update/`, {
      check_id: check_id,
      doc_id: doc_id,
      action: action,
    })
    .then((res) => {
      console.log(res?.data);
      load_document_popup(res?.data);
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const fetchTaskDocumentPopupData = async (
  client_id,
  case_id,
  user_id,
  doc_id,
  setTaskDocumentPopupData
) => {
  api
    .post(`/api/add_task_document_popup/`, {
      client_id: client_id,
      case_id: case_id,
      user_id: user_id,
      doc_id: doc_id,
    })
    .then((res) => {
      console.log(res?.data);
      setTaskDocumentPopupData(res?.data);
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const fetchChatPage = async (
  dispatch,
  client_id,
  case_id,
  setUserProfile,
  setProviders,
  setStaffThreads,
  setCurrentUser,
  setClientThreads,
  setProviderClients,
  setThreads,
  setLoader = null
) => {
  await axios
    .get(`${chat_origin}/api/chat/${client_id}/${case_id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    })
    .then((res) => {
      console.log(res.data);
      dispatch(setUserProfile(res?.data?.userprofile));
      dispatch(setProviders(res?.data?.providers));
      dispatch(setCurrentUser(res?.data?.current_user));
      dispatch(setClientThreads(res?.data?.client_threads));
      dispatch(setProviderClients(res?.data?.provider_clients));
      dispatch(setThreads(res?.data?.threads));
      if (setLoader) {
        setLoader(false);
      }
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const fetchChatStaffThreads = async (
  dispatch,
  client_id,
  case_id,
  setStaffThreads
) => {
  await axios
    .get(`${chat_origin}/api/chat/staff/${client_id}/${case_id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    })
    .then((res) => {
      console.log(res.data);
      dispatch(setStaffThreads(res?.data?.staff_threads));
    })
    .catch((err) => {
      if (err?.response?.status == 401) {
        removeToken();
        window.location.reload();
      }
    });
};

export const updateNotificationChatAPI = async (thread_id) => {
  try {
    const response = await axios.post(
      `${chat_origin}/api/chat/notification-update/`,
      {
        thread_id: thread_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
      }
    );
    return response;
  } catch (err) {
    if (err?.response?.status === 401) {
      removeToken();
    }
    throw err;
  }
};

export const getNotificationCountChatAPI = async (
  dispatch,
  setTotalChatCount
) => {
  try {
    const response = await axios.post(
      `${chat_origin}/api/chat/notification-count/`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
      }
    );
    console.log(response);
    dispatch(setTotalChatCount(response?.data?.count));
    return response;
  } catch (err) {
    if (err?.response?.status === 401) {
      removeToken();
    }
    throw err;
  }
};

export const getToDoCountAPI = async (dispatch, setTotalToDoCount) => {
  try {
    const response = await axios.get(`${origin}/api/todo/notification-count/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    });
    console.log(response);
    dispatch(setTotalToDoCount(response?.data?.count));
    return response;
  } catch (err) {
    if (err?.response?.status === 401) {
      removeToken();
    }
    throw err;
  }
};

export const markReadToDoItemsAPI = async (dispatch, setTotalToDoCount) => {
  try {
    const response = await axios.post(
      `${origin}/api/todo/notification-count/`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
      }
    );
    console.log(response);
    dispatch(setTotalToDoCount(response?.data?.count));
    return response;
  } catch (err) {
    if (err?.response?.status === 401) {
      removeToken();
    }
    throw err;
  }
};

export const getFlaggedPageCountAPI = async (dispatch, setFlaggedPageCount) => {
  try {
    const response = await axios.get(
      `${origin}/api/flaggedpage/notification-count/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
      }
    );
    console.log(response);
    dispatch(setFlaggedPageCount(response?.data?.count));
    return response;
  } catch (err) {
    if (err?.response?.status === 401) {
      removeToken();
    }
    throw err;
  }
};

export const markReadFlaggedPageItemsAPI = async (
  dispatch,
  setFlaggedPageCount
) => {
  try {
    const response = await axios.post(
      `${origin}/api/flaggedpage/notification-count/`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
      }
    );
    console.log(response);
    dispatch(setFlaggedPageCount(response?.data?.count));
    return response;
  } catch (err) {
    if (err?.response?.status === 401) {
      removeToken();
    }
    throw err;
  }
};

export const getUserProfilePicChatAPI = async (user_id) => {
  try {
    const response = await axios.post(
      `${origin}/api/chat/profile/`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
      }
    );
    console.log(response);
    return response;
  } catch (err) {
    if (err?.response?.status === 401) {
      removeToken();
    }
    throw err;
  }
};

export const createVideoChatAPI = async (user_id) => {
  try {
    const response = await axios.post(
      `${chat_origin}/api/create_video_chat/`,
      {
        user_id: user_id,
        is_active: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
      }
    );
    console.log(response?.data?.link);
    return response?.data?.link;
  } catch (err) {
    if (err?.response?.status === 401) {
      removeToken();
      window.location.reload();
    }
    throw err;
  }
};

export const autoLogoutAPI = async (client_id, case_id) => {
  try {
    const response = await axios.post(
      `${origin}/api/logout-inactivity/`,
      {
        case_id: case_id,
        client_id: client_id,
      },
      auth_config
    );
    return response;
  } catch (err) {
    if (err?.response?.status === 401) {
      removeToken();
      window.location.reload();
    }
    throw err;
  }
};

export const userLogoutAPI = async (client_id, case_id) => {
  try {
    const response = await axios.post(
      `${origin}/api/logout/`,
      {
        case_id: case_id,
        client_id: client_id,
      },
      auth_config
    );
    return response;
  } catch (err) {
    if (err?.response?.status === 401) {
      removeToken();
      window.location.reload();
    }
    throw err;
  }
};


export const fetchCalenderEvents = async (client_id, case_id,startDate,endDate) => {
  try {
    const res = await axios.get(`${origin}/api/calendar/items/${client_id}/${case_id}/?date_from=${startDate}&date_to=${endDate}`, auth_config);
    console.log(res)
    return res?.data;
  } catch (err) {
    console.log(err)
    if (err?.response?.status == 401) {

      removeToken();
      window.location.reload();
    } else {
      console.error(err);
    }
  }
};
export const fetchDropdownData = async (client_id, case_id) => {
  try {
    const res = await axios.get(`${origin}/api/calendar/details/${client_id}/${case_id}/`, auth_config);
    return res?.data;
  } catch (err) {
    console.log(err);
    if (err?.response?.status == 401) {
      removeToken();
      window.location.reload();
    } else {
      console.error(err);
    }
  }
};

export const addEvent = async (body) => {
  try {
    console.log(body);
    const res = await axios.post(
      `${origin}/api/calendar/`,
      { body },
      auth_config
    );
    console.log(res);
    return res?.data;
  } catch (err) {
    if (err?.response?.status == 401) {
      removeToken();
      window.location.reload();
    } else {
      console.log(err);
      console.error(err);
    }
    throw err.response?.message || err.message;
  }
};
export const searchUserInEventTab = async (body) => {
  try {
    console.log(body);
    const res = await axios.post(
      `${origin}/api/search/clients/`,
      { name: body },
      auth_config
    );
    console.log(res);

    return res?.data;
  } catch (err) {
    if (err?.response?.status == 401) {
      removeToken();
      window.location.reload();
    } else {
      console.log(err);
      console.error(err);
    }
    throw err.response?.message || err.message;
  }
};
export const fetchCaseProvider = async (case_id) => {
  try {
    const res = await axios.get(
      `${origin}/api/calendar/get_case_providers/${case_id}/`,
      auth_config
    );
    return res?.data;
  } catch (err) {
    if (err?.response?.status == 401) {
      removeToken();
      window.location.reload();
    } else {
      console.log(err);
      console.error(err);
    }
    throw err.response?.message || err.message;
  }
};
