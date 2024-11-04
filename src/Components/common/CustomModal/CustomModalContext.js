import React, { createContext, useContext, useMemo, useState } from "react";

const DocumentModalContext = createContext({});

export const useDocumentModal = () => useContext(DocumentModalContext);

export const DocumentModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPhotoModal, setIsPhotoModal] = useState(false);
  const [documentURL, setDocumentURL] = useState("");
  const [documentURLfordownload, setDocumentURLfordownload] = useState("");
  const [documentData, setDocumentData] = useState({});
  const [photoListData, setPhotoListData] = useState({});
  const [toggleVar, setToggleVar] = useState(true);
  const [currentFetchPhotoListData, setCurrentFetchPhotoListData] =
    useState(null);

  const showDocumentModal = (
    componentId,
    data,
    documentData = {},
    photoListData = {},
    fetchPhotoListData,
    documenturl2
  ) => {
    console.log("Document Data ===>", documentData);
    console.log("Document Photo List Data ===>", photoListData);
    console.log("data ===>", data);
    console.log("Document URL FOR DOWNLOAD ===>", documenturl2);

    setDocumentURL(data);
    setDocumentURLfordownload(documenturl2 || "");
    setDocumentData(documentData);
    setPhotoListData(photoListData || {});
    setCurrentFetchPhotoListData(() => fetchPhotoListData || null);
    if (componentId === "document") {
      setIsVisible(true);
      setIsPhotoModal(false);
    } else if (
      componentId === "photo" &&
      photoListData &&
      Object.keys(photoListData).length > 0
    ) {
      setIsPhotoModal(true);
      setIsVisible(false);
    }
    if (photoListData && Object.keys(photoListData).length > 0) {
      setIsPhotoModal(true);
    } else {
      setIsVisible(true);
    }
  };

  const hideDocumentModal = async () => {
    if (currentFetchPhotoListData) {
      await currentFetchPhotoListData();
    }
    setDocumentURL("");
    setIsVisible(false);
    setIsPhotoModal(false);
    setCurrentFetchPhotoListData(null);
  };

  const toggle = () => setToggleVar(!toggleVar);

  const providerValue = useMemo(
    () => ({
      toggleVar,
      toggle,
      isVisible,
      isPhotoModal,
      documentURL,
      documentData,
      photoListData,
      documentURLfordownload,
      showDocumentModal,
      hideDocumentModal,
      setDocumentData,
      setDocumentURL,
    }),
    [
      isVisible,
      isPhotoModal,
      documentURL,
      documentData,
      photoListData,
      toggle,
      documentURLfordownload,
    ]
  );

  return (
    <DocumentModalContext.Provider value={providerValue}>
      {children}
    </DocumentModalContext.Provider>
  );
};
