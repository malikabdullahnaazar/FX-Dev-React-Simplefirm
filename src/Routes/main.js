import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router";
import SearchPage from "../Modules/SearchPage";
import RedirectPage from "../Modules/RedirectPage";
// import ClientPage from "../Modules/ClientPage";
import LoginPage from "../Modules/LoginPage";
import { getCaseId, getClientId, getToken, removeToken } from "../Utils/helper";
import InboxPage from "../Modules/InboxPage";
import { useDispatch, useSelector } from "react-redux";
import CostPage from "../Modules/CostPage";
import CasePage from "../Modules/CasePage";
import AccidentPage from "../Modules/AccidentPage";
import ToDoPage from "../Modules/ToDoPage";
import InjuryPage from "../Modules/InjuryPage";
// import { DocumentModalProvider } from "../Components/DocumentModal/DocumentModalContext";
import DocumentModal from "../Components/DocumentModal";
import { DocumentModalProvider as PhotoDocumentModalProvider } from "../Components/PhotoDocumentModal/DocumentModalContext";
import PhotoDocumentModal from "../Components/PhotoDocumentModal/index";
import EditCaseProviderModal from "../Components/EditCaseProviderModal";
import { fetchCurrentClient } from "../Redux/client/clientSlice";

import {
  fetchAllPages,
  fetchAllStages,
  fetchCommutativeChecklist,
  fetchCurrentCase,
} from "../Redux/caseData/caseDataSlice";
import ChatPage from "../Modules/ChatPage";
// import Treatment from "../Components/BP/treatment"
// import Simple from "../Components/BP/simple"
import { useIdleTimer } from "react-idle-timer";
import {
  autoLogoutAPI,
  getNotificationCountChatAPI,
  getToDoCountAPI,
  markReadToDoItemsAPI,
  markReadFlaggedPageItemsAPI,
  getFlaggedPageCountAPI,
} from "../Providers/main";
import EditCaseTypeDateModal from "../Components/EditCaseTypeDateModal";
import TreatmentPage from "../Modules/TreatmentPage";
import SimplePage from "../Modules/SimplePage";
import DatesPage from "../Modules/DatesPage";
import { persistor } from "../Redux/store";
import InactivityModal from "../Components/Modals/inactivityModal";
import WorkListPage from "../Modules/WorkListPage";
import ClientPage from "../Modules/ClientPage";
import LitigationPage from "../Modules/LitigationsPage";
import ImageGalleryModal from "../Components/CaseAccident/ImageGalleryModal";
import EditNote from "../Components/Modals/EditNote";
import VehicleLocationModal from "../Components/Modals/VehicleLocationModal";
import CarDetailsModal from "../Components/Modals/CarDetailsModal";
import VehicleDescriptionModal from "../Components/Modals/VehicleDescriptionModal";
import WitnessesPage from "../Modules/WitnessesPage";
import IndividualNotesModal from "../Components/CaseAccident/IndividualNotesModal";
import AttachUserModal from "../Components/CaseDashboard/AttachUserModal";
import Calendar from "../Components/Calendar/Calendar";
// import AddFirmUserModal from "../Components/CaseDashboard/AddFirmUserModal";
import NotesSectionPage from "../Modules/NotesSectionPage";
import ReportPage from "../Modules/ReportPage";
import InsurancePage from "../Modules/InsurancePage";
import PhotoPage from "../Modules/PhotoPage";
import DocPage from "../Modules/DocPage";
import CoPilotPage from "../Modules/CoPilotPage";

import LawFirmDirectory from "../Modules/LawFirmDirectory";
import ExpertsPage from "../Modules/ExpertsPage";
import CaseNavigatorPage from "../Modules/CaseNavigatorPage";
import FlaggedCasesPage from "../Modules/FlaggedCasesPage";
import DefendantPage from "../Modules/DefendantPage";
import { setTotalChatCount } from "../Redux/chat/actions";
import { setToDoCount, setFlaggedPageCount } from "../Redux/general/actions";
import useWebSocket, { ReadyState } from "react-use-websocket";
import WitnessesPage2 from "../Modules/WitnessesPage2";

import CheckListPage from "../Modules/CheckListPage"; // checklist page
import TimePage from "../Modules/TimePage";
import HomePage from "../Components/Home/HomePage";
import EmploymentPage from "../Modules/EmploymentPage";
import ESignPage from "../Components/DocumentModal/DocumentSideBar/ESignPage";
import { DocumentModalProvider } from "../Components/common/CustomModal/CustomModalContext";
import CheckListsPage from "../Modules/CheckListsPage";
import FirmSetting from "../Modules/FirmSettingsPage";
import WordProcessor from "../Modules/WordProcessor";
// import { DocumentModalProvider } from "../Components/DocumentModal/DocumentModalContext";

const Main = () => {
  // console.log("=================>");
  // console.log(getCaseId());
  // console.log("=================>");
  console.error = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.warn = () => {};
  const dispatch = useDispatch();
  let token = getToken();

  const webSocketLink = process.env.REACT_APP_BACKEND_URL.includes("http://")
    ? `ws://${process.env.REACT_APP_BACKEND_URL.replace("http://", "")}`
    : `wss://${process.env.REACT_APP_BACKEND_URL.replace("https://", "")}`;
  const [socketUrl, setSocketUrl] = useState(
    `${webSocketLink}/30/32/${getClientId()}/${getCaseId()}/?chat_token=12345&username=${localStorage.getItem("username")}`
  );
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    share: false,
    shouldReconnect: () => true,
  });

  useEffect(() => {
    getNotificationCountChatAPI(dispatch, setTotalChatCount);
  }, [lastMessage]);

  const [socketUrlToDo, setSocketUrlToDo] = useState(
    `${webSocketLink}/todo/?username=${localStorage.getItem("username")}`
  );
  const { lastMessage: lastMessageToDo, readyState: readyStateToDo } =
    useWebSocket(socketUrlToDo, {
      share: false,
      shouldReconnect: () => true,
    });

  useEffect(() => {
    console.log("RECEIVED TODO NOTIFICATION");

    getToDoCountAPI(dispatch, setToDoCount);
    getFlaggedPageCountAPI(dispatch, setFlaggedPageCount);

    if (window.location.href.includes("work-list")) {
      markReadToDoItemsAPI(dispatch, setToDoCount);
    }
    if (window.location.href.includes("flaggedcases")) {
      markReadFlaggedPageItemsAPI(dispatch, setFlaggedPageCount);
    }
    if (lastMessageToDo !== null) {
      console.log(
        "Received message from ToDo WebSocket:",
        lastMessageToDo.data
      );
    }
    if (lastMessageToDo?.data) {
      let message = JSON.parse(lastMessageToDo?.data);
      if (message?.flagged_page_unread_count) {
        dispatch(setFlaggedPageCount(message.flagged_page_unread_count));
      }
      if (message?.unread_count) {
        dispatch(setToDoCount(message.unread_count));
      }
    }
  }, [lastMessageToDo]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const connectionStatusToDo = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyStateToDo];

  const [inactivityModalShow, setInactivityModalShow] = useState(false);
  const [timeoutTime, setTimeoutTime] = useState(null);
  const inactivityTimeout = useSelector(
    (state) => state.general.inactivityTimeout
  );

  const onIdle = () => {
    if (getToken()) {
      console.log("Logging out due to inactivity.");
      autoLogoutAPI(getClientId(), getCaseId());
      removeToken();
      persistor.pause();
      persistor.flush().then(() => {
        return persistor.purge();
      });
      window.location.href = "/";
      window.location.reload();
    } else {
      console.log("Already logged out.");
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimeoutTime(parseInt(getRemainingTime() / 1000));
  //   }, 1000);
  // }, []);

  const onIdleWarning = () => {
    if (getToken()) {
      console.log("Inactivity Warning");
      setInactivityModalShow(true);
    } else {
      console.log("Already logged out.");
    }
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    onIdle: onIdle,
    timeout: parseInt(inactivityTimeout) * 60 * 1000,
    throttle: 500,
  });

  useIdleTimer({
    onIdle: onIdleWarning,
    timeout: parseInt(inactivityTimeout) * 60 * 1000 - 60 * 1000,
    throttle: 500,
  });

  useEffect(() => {
    token = getToken();
    if (token) {
      console.log("I am running");
      dispatch(fetchCurrentClient(getClientId()));
      dispatch(fetchCurrentCase(getClientId(), getCaseId()));
      dispatch(fetchAllPages(getCaseId()));
      dispatch(fetchAllStages());
      dispatch(fetchCommutativeChecklist(getClientId(), getCaseId()));
    }
  }, [token]);

  useEffect(() => {
    const handleUnload = (event) => {
      const [navigation] = performance.getEntriesByType("navigation");

      if (navigation && navigation.type !== "reload") {
        console.log("Tab or window closed");
        // autoLogoutAPI(getClientId(), getCaseId());
        // removeToken();
        return "logout";
      } else {
        console.log("Page refresh");
      }
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  const loggedInRoutes = [
    <Route
      key="inbox-page"
      exact
      path={"/inbox/" + getClientId() + "/" + getCaseId()}
      element={<InboxPage />}
    />,
    <Route
      key="client-page"
      exact
      path={"/bp-client/:clientId/:caseId"}
      element={<ClientPage />}
    />,
    // <Route key="cost-page" exact path="/bp-costs" element={<CostPage />} />,
    <Route
      exact
      path={`/bp-todo/${getClientId()}/${getCaseId()}`}
      element={<ToDoPage />}
    />,
    <Route
      exact
      path={`/work-list/${getClientId()}/${getCaseId()}`}
      element={<WorkListPage />}
    />,
    <Route
      exact
      path={`/bp-injuriessub/${getClientId()}/${getCaseId()}`}
      element={<InjuryPage />}
    />,
    <Route
      exact
      path={`/bp-witnesses/${getClientId()}/${getCaseId()}`}
      element={<WitnessesPage2 />}
    />,
    <Route
      key="case-page"
      exact
      // path={"/bp-case/" + getClientId() + "/" + getCaseId()}
      path={"/bp-case/:clientId/:caseId"}
      element={<CasePage />}
    />,
    <Route
      key="cost-page-2"
      exact
      path={"/bp-costs/:clientId/:caseId"}
      // path={"/bp-costs/" + getClientId() + "/"+ getCaseId()}
      element={<CostPage />}
    />,
    <Route
      key="chat-page"
      exact
      path={"/chat/" + getClientId() + "/" + getCaseId()}
      element={<ChatPage />}
    />,
    <Route
      key="flaggedcases-page"
      exact
      path={"/bp-flaggedcases/:clientId/:caseId"}
      element={<FlaggedCasesPage />}
    />,
    <Route
      key="chat-page"
      exact
      path={"/bp-caraccident/" + getClientId() + "/" + getCaseId()}
      element={<AccidentPage />}
    />,

    <Route
      key="treamtment-page"
      exact
      path="/treatment/"
      element={<TreatmentPage case_id={getCaseId()} />}
    />,

    <Route
      key="insurance-page"
      exact
      path={"/bp-insurance/" + getClientId() + "/" + getCaseId()}
      element={<InsurancePage />}
    />,

    <Route
      path="/simple/"
      element={<SimplePage case_id={getCaseId()} />}
      exact
    />,

    <Route
      path="/dates/"
      element={<DatesPage case_id={getCaseId()} />}
      exact
    />,
    <Route
      key="search-page"
      exact
      path={"/search/"}
      element={<SearchPage />}
    />,
    <Route
      key="note-page"
      exact
      path={"/bp-note/" + getClientId() + "/" + getCaseId()}
      element={<NotesSectionPage />}
    />,
    <Route
      path={"/bp-lawfirmdirectory/" + getClientId() + "/" + getCaseId()}
      element={<LawFirmDirectory />}
    />,
    <Route
      path={"bp-employment/" + getClientId() + "/" + getCaseId()}
      element={<EmploymentPage />}
    />,
    <Route
      path={"/bp-reports/" + getClientId() + "/" + getCaseId()}
      element={<ReportPage />}
      exact
    />,
    <Route
      path={"/bp-photo/:clientId/:caseId"}
      element={<PhotoPage client_id={getClientId()} case_id={getCaseId()} />}
      exact
    />,
    <Route
      path={"/bp-documents/" + getClientId() + "/" + getCaseId()}
      element={<DocPage />}
      exact
    />,
    <Route
      path={"/bp-navigator/" + getClientId() + "/" + getCaseId()}
      element={<CaseNavigatorPage />}
      exact
    />,
    <Route
      path={"/bp-defendants/" + getClientId() + "/" + getCaseId()}
      element={<DefendantPage />}
      exact
    />,
    <Route
      path={"/bp-checkLists/" + getClientId() + "/" + getCaseId()}
      element={<CheckListsPage />}
      exact
    />,
    <Route
      path={"/bp-experts/" + getClientId() + "/" + getCaseId()}
      element={<ExpertsPage />}
      exact
    />,
    <Route
      path={"/bp-calendar/" + getClientId() + "/" + getCaseId()}
      element={<Calendar />}
      exact
    />,

    <Route
      // path={"/checklist/" + getClientId() + "/" + getCaseId()}
      path={"/checklist/"}
      element={<CheckListPage />}
      exact
    />,

    <Route
      key="litigation-page"
      exact
      path={"/bp-litigation/" + getClientId() + "/" + getCaseId()}
      element={<LitigationPage />}
    />,

    <Route
      path={"/bp-timepage/" + getClientId() + "/" + getCaseId()}
      element={<TimePage />}
    />,

    <Route
      key="bp-home"
      exact
      path={"/bp-home/:clientId/:caseId"}
      element={<HomePage />}
    />,

    <Route
      key="esign-page"
      path="/esign/:docId/:clientId/:caseId"
      element={<ESignPage />}
    />,
    <Route
      path={"/bp-firmsetting/" + getClientId() + "/" + getCaseId()}
      element={<FirmSetting />}
      exact
    />,
    <Route
      path={"/bp-wordprocessor/" + getClientId() + "/" + getCaseId()}
      element={<WordProcessor />}
      exact
    />,

    <Route
      path={"/bp-copilot/" + getClientId() + "/" + getCaseId()}
      element={<CoPilotPage />}
    />,
  ];

  const loggedOutRoutes = [
    <Route key="login-page" exact path="/*" element={<LoginPage />} />,
  ];

  return (
    <>
      <Router>
        <InactivityModal
          timeoutTime={timeoutTime}
          show={inactivityModalShow}
          onHide={() => setInactivityModalShow(false)}
        />
        <VehicleLocationModal />
        <CarDetailsModal />
        <VehicleDescriptionModal />
        <EditNote />
        <ImageGalleryModal />
        <EditCaseProviderModal />
        <EditCaseTypeDateModal />
        <IndividualNotesModal />
        <AttachUserModal />
        {/* <AddFirmUserModal /> */}
        <DocumentModalProvider>
          <DocumentModal />
          {/* <PhotoDocumentModalProvider> */}
          <PhotoDocumentModal />
          <Routes>
            <Route
              key="inbox-page"
              exact
              path={"/redirect/inbox/"}
              element={<RedirectPage />}
            />
            <Route
              key="case-page"
              exact
              path={"/redirect/case/"}
              element={<RedirectPage />}
            />
            <Route
              key="bp-todo"
              exact
              path={"/redirect/todo/"}
              element={<RedirectPage />}
            />
            <Route
              key="bp-injuriessub"
              exact
              path={"/redirect/injury/"}
              element={<RedirectPage />}
            />
            ,
            {/* {[
                          !token && loggedOutRoutes,
                          token && loggedInRoutes
                      ]} */}
            {token
              ? loggedInRoutes.map((route) => route)
              : loggedOutRoutes.map((route) => route)}
          </Routes>
          {/* </PhotoDocumentModalProvider> */}
        </DocumentModalProvider>
      </Router>
    </>
  );
};

export default Main;
