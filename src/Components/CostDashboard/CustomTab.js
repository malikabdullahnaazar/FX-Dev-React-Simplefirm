import React, { useState } from "react";
import "./custom-tab.css";
import { useSelector } from "react-redux";

const CustomTab = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  const getTabContent = (key) => {
    const activeTab = tabs.find((tab) => tab.key === key);
    return activeTab ? activeTab.content : null;
  };
  const open = useSelector((state) => state?.open?.open);
  return (
    <>
      <nav className="m-l-10 w-100 background-temp p-x-10" style={{ marginLeft: "16px"}}>

        <div className="row">
          <div
            className="nav nav-tabs"
            id="nav-tab-costs"
            role="tablist"
            style={{ display: "flex", flexWrap: "wrap", width: "600px" }}
          >
            {tabs.map((tab) => (
              <a
                key={tab.key}
                className={`custom-tab-cost-page nav-item nav-link tab-item no-wrap ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                style={{ flex: "1 1 auto" ,width: "100px" }}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <div
        className="tab-content"
        id="nav-tabContent"
        style={{ zIndex: open ? "0" : "" }}
      >
        {getTabContent(activeTab)}
      </div>
    </>
  );
};

export default React.memo(CustomTab);
