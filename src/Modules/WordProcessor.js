import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useReducer,
  useMemo,
} from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import ActionBarComponent from "../Components/common/ActionBarComponent";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";
import { useSearchParams } from "react-router-dom";
import { getToken } from "../Utils/helper";

DocumentEditorContainerComponent.Inject(Toolbar);

function WordProcessor() {
  const container = useRef(null);
  const [searchParams] = useSearchParams();
  const docId = searchParams.get("docId");
  const userId = searchParams.get("userId");
  const type = searchParams.get("type");
  const dynamic_template_id = searchParams.get("dynamic_template_id");
  const draft_id = searchParams.get("draftId") || "";
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const token = getToken();

  // UseReducer to manage state to avoid excessive re-renders
  const initialState = {
    filename: "",
    updatedFileName: "",
    show: false,
    loading: true,
    error: false,
    status: "",
    draftId: "",
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_LOADING":
        return { ...state, loading: action.payload };
      case "SET_ERROR":
        return { ...state, error: action.payload };
      case "SET_FILENAME":
        return { ...state, filename: action.payload };
      case "SET_UPDATED_FILENAME":
        return { ...state, updatedFileName: action.payload };
      case "SHOW_MODAL":
        return { ...state, show: true, status: action.payload };
      case "HIDE_MODAL":
        return { ...state, show: false };
      case "SET_DRAFT_ID":
        return { ...state, draftId: action.payload };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const loadFile = useCallback(
    async (file) => {
      try {
        const ajax = new XMLHttpRequest();
        ajax.open("POST", container.current?.serviceUrl + "Import", true);
        ajax.onreadystatechange = () => {
          if (ajax.readyState === 4 && ajax.status === 200) {
            container.current?.documentEditor.open(ajax.responseText);
            dispatch({ type: "SET_LOADING", payload: false });
          } else if (ajax.readyState === 4) {
            dispatch({ type: "SET_ERROR", payload: true });
          }
        };
        const formData = new FormData();
        formData.append("files", file);
        ajax.send(formData);
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: true });
      }
    },
    [container]
  );

  const getDocument = useCallback(async () => {
    try {
      const documentRes = await fetch(`${origin}/30/ListDoc/?doc_id=${docId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const documentData = await documentRes.json();

      const fileResponse = await fetch(documentData?.data?.upload);
      const fileBlob = await fileResponse.blob();

      dispatch({
        type: "SET_FILENAME",
        payload: documentData?.data?.file_name,
      });
      dispatch({
        type: "SET_UPDATED_FILENAME",
        payload: documentData?.data?.file_name,
      });
      loadFile(fileBlob);

      if (dynamic_template_id) {
        const templateRes = await fetch(
          `${origin}/30/getTemplateData/?template_id=${dynamic_template_id}&draft_id=${draft_id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const templateData = await templateRes.json();
        const fileName = draft_id
          ? `${templateData?.name}`
          : `${templateData?.name} Draft ${templateData?.count + 1}`;

        dispatch({ type: "SET_FILENAME", payload: fileName });
        dispatch({ type: "SET_UPDATED_FILENAME", payload: fileName });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: true });
    }
  }, [docId, dynamic_template_id, draft_id, loadFile]);

  useEffect(() => {
    if (container.current) {
      getDocument();
    }
  }, [getDocument]);

  const saveDocument = useCallback(async () => {
    try {
      const content =
        await container.current?.documentEditor.saveAsBlob("Docx");

      if (!content) {
        console.error("Error: Document content is undefined or invalid.");
        return;
      }

      const formData = new FormData();
      formData.append("file", content);
      formData.append("id", docId);
      formData.append("user_id", userId);
      formData.append("dynamic_template_id", dynamic_template_id);
      formData.append("file_name", state.updatedFileName);

      if (state.draftId) formData.append("draft_id", state.draftId);

      const response = await fetch(
        `${origin}/30/${type === "Draft" ? "updateDraftDoc" : "updateWordProcessorDoc"}/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseData = await response.json();
      console.log("Save Response:", responseData);

      if (responseData?.draft_id) {
        dispatch({ type: "SET_DRAFT_ID", payload: responseData.draft_id });
      }
    } catch (error) {
      console.error("Error saving document:", error);
    }
    dispatch({
      type: "SHOW_MODAL",
      payload: `${state.updatedFileName} saved successfully!`,
    });
  }, [
    container,
    docId,
    dynamic_template_id,
    state.updatedFileName,
    type,
    userId,
  ]);

  const downloadDocument = useCallback(async () => {
    try {
      const content =
        await container.current?.documentEditor.saveAsBlob("Docx");
      console.log(content);
      if (!content) {
        console.error("Error: Document content is undefined or invalid.");
        return;
      }

      const formData = new FormData();
      formData.append("file", content);
      formData.append("id", docId);
      formData.append("user_id", userId);
      formData.append("dynamic_template_id", dynamic_template_id);
      formData.append("file_name", state.updatedFileName);

      if (state.draftId) formData.append("draft_id", state.draftId);

      const response = await fetch(
        `${origin}/30/${type === "Draft" ? "updateDraftDoc" : "updateWordProcessorDoc"}/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseData = await response.json();
      console.log("Save Response:", responseData);

      if (responseData?.draft_id) {
        dispatch({ type: "SET_DRAFT_ID", payload: responseData.draft_id });
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${state.updatedFileName}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error saving document:", error);
    }
  }, [
    container,
    docId,
    dynamic_template_id,
    state.updatedFileName,
    type,
    userId,
  ]);

  const onToolbarClick = useCallback(
    (args) => {
      switch (args.item.id) {
        case "download":
          downloadDocument();
          break;
        case "save":
          saveDocument();
          break;
        default:
          break;
      }
    },
    [saveDocument]
  );

  const toolbarItems = useMemo(() => {
    const baseItems = [
      "New",
      "Open",
      "Separator",
      "Undo",
      "Redo",
      "Separator",
      "Image",
      "Table",
      "Hyperlink",
      "Bookmark",
      "TableOfContents",
      "Separator",
      "Header",
      "Footer",
      "PageSetup",
      "PageNumber",
      "Break",
      "InsertFootnote",
      "InsertEndnote",
      "Separator",
      "Find",
      "Separator",
      "Comments",
      "TrackChanges",
      "Separator",
      "LocalClipboard",
      "RestrictEditing",
      "Separator",
      "FormFields",
      "UpdateFields",
    ];

    const customItems = [
      {
        prefixIcon: "e-de-ctnr-lock",
        tooltipText: "Save",
        text: "Save",
        id: "save",
      },
      {
        prefixIcon: "e-de-ctnr-download",
        tooltipText: "Download",
        text: "Download",
        id: "download",
      },
    ];

    return baseItems.concat(customItems);
  }, []);
  const updateFileName = async () => {
    dispatch({ type: "SET_FILENAME", payload: state.updatedFileName });
    await saveDocument();
  };

  if (!docId || state.error) {
    return (
      <div className="doc-error">
        <p>Document not found!</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar flaggedPageName="Word Processor" />
        <div className="main-content" id="padding-top-165">
          <ActionBarComponent
            src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/settings-logo-icon.svg"
            page_name={state?.filename || "Word Processor"}
          />
          <div className="row d-flex align-items-center justify-content-end col-sm-12 m-t-5 m-b-5">
            <input
              type="text"
              className="form-control col-sm-1"
              value={state.updatedFileName}
              onChange={(e) =>
                dispatch({
                  type: "SET_UPDATED_FILENAME",
                  payload: e.target.value,
                })
              }
            />
            <button
              type="button"
              className="btn btn-primary font-weight-bold ml-2"
              onClick={updateFileName}
            >
              Save Draft
            </button>
          </div>
          <div
            style={{
              opacity: state.loading ? 0 : 1,
              pointerEvents: state.loading ? "none" : "auto",
              minWidth: "1200px",
            }}
          >
            <DocumentEditorContainerComponent
              id="container"
              height="100vh"
              ref={container}
              serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
              toolbarClick={onToolbarClick}
              enableToolbar={true}
              toolbarItems={toolbarItems}
              style={{
                minWidth: "1200px",
              }}
            />
          </div>
          {state.loading && (
            <div className="loader-wrapper">
              <div className="loader"></div>
            </div>
          )}
          <Modal
            show={state.show}
            onHide={() => dispatch({ type: "HIDE_MODAL" })}
          >
            <Modal.Header closeButton>
              <Modal.Title>{state.status}</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => dispatch({ type: "HIDE_MODAL" })}
              >
                Dismiss
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default WordProcessor;
