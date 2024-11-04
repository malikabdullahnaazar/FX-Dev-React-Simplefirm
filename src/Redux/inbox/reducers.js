const initialState = {
  inboxTableLoader: true,
  inboxDocPanels: [],
  inboxTab: "client",
  inboxTabsCount: {
    all: 0,
    client: 0,
    check: 0,
    insurance: 0,
    account: 0,
    ocr_failed: 0,
    unidentified: 0,
    processing: 0,
  },
  inboxDocumentHistory: [],
  inboxProcessingDocuments: [],
  inboxFailedOcrDocuments: [],
  inboxAllDocuments: [],
  inboxRefreshDocuments: false,
  login_user_info: null,
  unsortedCase: true,
  unsortedPage: true,
  tabsToShow: {},
  nestedDropdowns: [],
  selectedPanelId: "-1",
  selectedPanelName: null,
};

const inboxReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_INBOX_TAB":
      return { ...state, inboxTab: action.payload };
    case "SET_INBOX_DOC_PANELS":
      return { ...state, inboxDocPanels: action.payload };
    case "SET_INBOX_ALL_DOCUMENTS":
      return { ...state, inboxAllDocuments: action.payload };
    case "SET_INBOX_TABS_COUNT":
      return { ...state, inboxTabsCount: action.payload };
    case "SET_INBOX_TABLE_LOADER":
      return { ...state, inboxTableLoader: action.payload };
    case "SET_INBOX_DOCUMENT_HISTORY":
      return { ...state, inboxDocumentHistory: action.payload };
    case "SET_INBOX_PROCESSING_DOCUMENTS":
      return { ...state, inboxProcessingDocuments: action.payload };
    case "SET_INBOX_FAILED_OCR_DOCUMENTS":
      return { ...state, inboxFailedOcrDocuments: action.payload };
    case "SET_INBOX_REFRESH_DOCUMENTS":
      return { ...state, inboxRefreshDocuments: action.payload };
    case "SET_LOGIN_USER_INFO":
      return { ...state, login_user_info: action.payload };
    case "SET_UNSORTED_CASE":
      return { ...state, unsortedCase: action.payload };
    case "SET_UNSORTED_PAGE":
      return { ...state, unsortedPage: action.payload };
    case "SET_TABS_TO_SHOW":
      return { ...state, tabsToShow: action.payload };
    case "SET_NESTED_DROPDOWNS":
      return {...state, nestedDropdowns: action.payload };
    case "SET_SELECTED_PANEL_ID":
      return {...state, selectedPanelId: action.payload };
    case "SET_SELECTED_PANEL_NAME":
      return {...state, selectedPanelName: action.payload };
    default:
      return state;
  }
};

export default inboxReducer;
