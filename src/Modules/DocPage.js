import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import ActionBarComponent from "../Components/common/ActionBarComponent";
import SearchTab from "../Components/DocPage/SearchTab"; // Correct import
import PhotoIcon from "../../public/BP_resources/images/icon/photo-icon-color.svg";

import api from "../api/api";
import AllDocs from "../Components/DocPage/AllDocs";
import Treatment from "../Components/DocPage/Treatment";
import TabData from "../Components/DocPage/TabData";
import Tabs from "../Components/DocPage/Tabs";

import TableLoader from "../Components/Loaders/tableLoader";
import { getClientId, getCaseId, mediaRoute } from "../Utils/helper";
import { useDocumentModal } from "../Components/DocumentModal/DocumentModalContext";
import { setSearchDocument } from "../Redux/search/searchSlice";

function DocPage() {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const client = useSelector((state) => state.todos.client);
  const pages = useSelector((state) => state.todos.pages);
  const currentCase = useSelector((state) => state.todos.currentCase);
  const currentCaseId = getCaseId();
  const [pageSlots, setPageSlots] = useState([]);
 
  const [activeTab, setActiveTab] = useState("all");
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refetchLoading, setrefetchLoading] = useState(false);

  const [allCount, setAllCount] = useState(0);
  const [unsortedCount, setUnsortedCount] = useState(0);
  const [query, setQuery] = useState(0);


  const fetchtabsData = async () => {
    try {
      const response = await api.get(
        `${origin}/api/doc-page/doc-page-api-viewset/`,
        {
          params: {
            case_type_id: currentCaseId ? currentCaseId : "",

          },
        }
      );
      if (response.status === 200) {
        setPageSlots(response.data.data);
        setUnsortedCount(response.data.unsorted_count)
        setAllCount(response.data.all_count)
        
        
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    // if (!loading) setLoading(true);
    if (!refetchLoading) setrefetchLoading(true);
    // Set loading to true before making the API call

    try {
      const response = await api.get(
        `${origin}/api/doc-page/list-page-doc-optimized/`,
        {
          params: {
            page_id: activeTab === "all" ? "" : activeTab,
            case_id: currentCaseId ? currentCaseId : "",
            all_docs: activeTab === "all" ? "True" : false,
          },
        }
      );
      if (response.status === 200) {
        setTabData(response.data);
        setLoading(false);
        setrefetchLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  useEffect(() => {
    fetchtabsData();
  }, []);

  useEffect(() => {
    const fetchDataFirstTime = async () => {
      setLoading(true);
      // Set loading to true before making the API call
      try {
        const response = await api.get(
          `${origin}/api/doc-page/list-page-doc-optimized/`,
          {
            params: {
              page_id: activeTab === "all" ? "" : activeTab,
              case_id: currentCaseId ? currentCaseId : "",
              all_docs: activeTab === "all" ? "True" : false,
            },
          }
        );
        if (response.status === 200) {
          console.log(loading);

          setTabData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataFirstTime();
  }, [currentCaseId]);

  const handleSelect = async (selectedTab) => {
    setActiveTab(selectedTab);
    setTabData(null); // Reset tabData to null when a new tab is selected
    setLoading(true); // Set loading to true before making the API call
    try {
      const response = await api.get(
        `${origin}/api/doc-page/list-page-doc-optimized/`,
        {
          params: {
            page_id: selectedTab === "all" ? "" : selectedTab,
            case_id: currentCaseId ? currentCaseId : "",
            all_docs: selectedTab === "all" ? "True" : false,
            query:query
          },
        }
      );
      if (response.status === 200) {
        setTabData(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false after the API call is complete
    }
  };

  const renderContent = () => {
    if (loading) {
      return <TableLoader />;
    } else {
      switch (activeTab) {
        case "all":
          return (
            <AllDocs
              data={tabData?.data || []}
              loading={loading}
              refetchData={fetchData}
              refetchLoading={refetchLoading}
            />
          );
        case "8":
          return (
            <Treatment
              data={tabData || []}
              loading={loading}
              refetchData={fetchData}
              refetchLoading={refetchLoading}
            />
          );
        default:
          return (
            <TabData
              data={tabData || []}
              loading={loading}
              refetchData={fetchData}
              refetchLoading={refetchLoading}
            />
          );
      }
    }
  };
  return (
    <div className="page-wrapper">
      <Sidebar pages={pages} />
      <div className="page-container">
        <NavBar
          client={client}
          currentCase={currentCase}
          flaggedPageName={"Docs"}
        />
      <div className="main-content" style={{paddingTop: "170px"}}>
        
        <ActionBarComponent
            src={PhotoIcon}
            page_name="Documents"
          />
        <SearchTab setTabData={setTabData} activeTab={activeTab} setAllCount={setAllCount} setPageSlots={setPageSlots} setUnsortedCount={setUnsortedCount}  setLoading={setLoading} setQuery={setQuery} />
        <Tabs onSelect={handleSelect} data={pageSlots} allCount={allCount} unsortedCount={unsortedCount} />
        

        <div className="reports-main-container-modified-custom-top0 z-index-0-custom-class">
          <div className="table--no-card table-img ">{renderContent()}</div>
        
         </div>
    </div>
      </div>
      </div>
  );
}

export default DocPage;
