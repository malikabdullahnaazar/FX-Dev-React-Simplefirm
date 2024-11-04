import React, { createContext, useState } from 'react';

export const ClientDataContext = createContext();

export const ClientDataProvider = ({ children }) => {

  
  const [isClientDataUpdated, setIsClientDataUpdated] = useState(false);
  const [isPanelChecklistUpdated, setIsPanelChecklistUpdated] = useState(false);
  const [isLitigationDataUpdate, setLitigationDataUpdated] = useState(false);
  const [isLitigationDashboardDataUpdate, setLitigationDashboardDataUpdated] = useState(false);

  return (
    <ClientDataContext.Provider value={{ isClientDataUpdated, setIsClientDataUpdated, isPanelChecklistUpdated, setIsPanelChecklistUpdated, isLitigationDataUpdate, setLitigationDataUpdated, isLitigationDashboardDataUpdate, setLitigationDashboardDataUpdated }}>
      {children}
    </ClientDataContext.Provider>
  );
};
