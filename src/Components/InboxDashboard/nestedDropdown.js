import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { fetchPagePanels } from '../../Providers/main';
import { useDispatch, useSelector } from "react-redux";
// import { setUnsortedCase, setUnsortedPage, setTabsToShow } from '../../Redux/inbox/actions';

const NestedDropdown = (props) => {
  const dispatch = useDispatch()
  
  const [showNestedDropdown, setShowNestedDropdown] = useState(true);
  const [selectedItem, setSelectedItem] = useState(`Unsorted to Case`);
  const [selectedPage, setSelectedPage] = useState(`Select Document Row Icon for Document`);
  const [selectedPageName, setSelectedPageName] = useState();
  const [selectedPageId, setSelectedPageId] = useState();
  const [selectedPageHasPanels, setSelectedPageHasPanels] = useState(false);
  
  const [selectedPanelId, setSelectedPanelId] = useState("-1");
  const [selectedPanelName, setSelectedPanelName] = useState("");
  const [nestedDropdowns, setNestedDropdowns] = useState([])

  const [unsortedCase, setUnsortedCase] = useState(true)
  const [unsortedPage, setUnsortedPage] = useState(true)
  const [tabsToShow, setTabsToShow] = useState({})

  // unsortedCase: true,
  // unsortedPage: true,
  // tabsToShow: {},
  // const unsortedCase = useSelector((state) => state.inbox.unsortedCase);
  // const unsortedPage = useSelector((state) => state.inbox.unsortedPage);
  // const tabsToShow = useSelector((state) => state.inbox.tabsToShow);


  // const nestedDropdowns = useSelector((state) => state.inbox.nestedDropdowns);
  // const selectedPanelId = useSelector((state) => state.inbox.selectedPanelId);
  // const selectedPanelName = useSelector((state) => state.inbox.selectedPanelName);
  
  const handlePanelClick = (panel_id, panel_name, unsorted=false) => {
    window.document.getElementById("dropdown-2").classList.remove("show")
    console.log(panel_id, panel_name, unsorted)
    if(unsorted) {
      setUnsortedPage(true)
      setSelectedPanelId("-1")
      setSelectedPanelName("")
    } else {
      setUnsortedPage(false)
      setSelectedPanelId(panel_id.toString())
      setSelectedPanelName(panel_name)
    }
  };

  const handleItemClick = (item, page_id, slot, unsorted=false) => {
    window.document.getElementById("dropdown-3").classList.remove("show")
    if(unsorted) {
      setUnsortedPage(true)
    } else {
      setUnsortedPage(false)
      setSelectedPage(item)
      props.setSelectedData({"page_id": page_id, "slot": slot, "panel": selectedPanelId})
    }
  };

  const handlePageSelect = (page_id, page_name, panels, unsorted=false) => {
    window.document.getElementById("dropdown-1").classList.remove("show")
    if (unsorted) {
      setUnsortedCase(true)
      setTabsToShow({"page": true,"panels": false, "rows": false})
    } else {
      setTabsToShow({"page": true,"panels": true, "rows": true})
      setUnsortedCase(false)
      setSelectedPageHasPanels(panels)
      setSelectedPageId(page_id)
      setSelectedPageName(page_name)
      // setSelectedPage("Attach to "+page_name)
      setSelectedItem(`Save Document To ${page_name}`);
      fetchPagePanels(props.case?.id, page_id, page_name, setNestedDropdowns)
    }
  };
  console.log(`unsorted to Case: ${unsortedCase}`)
  console.log(`unsorted to Page: ${unsortedPage}`)
  console.log(`nested dropdown: ${JSON.stringify(nestedDropdowns)}`)
  console.log(`tabs to show: ${JSON.stringify(tabsToShow)}`)
  console.log(`panel name: ${selectedPanelName}`)
  console.log(`case ID: ${props.case?.id}`)
  return (
    <>
    <Dropdown id='dropdown-1' style={{width: "100%"}}   className="mb-2 custom-dropdown-wrapper d-inline-block1"
    >
        <div style={{width: "100%"}}  className='position custom-dropdown-opener'>
            <Dropdown.Toggle
                id="dropdown-custom"
                className={`bg-white dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text`}
                variant="secondary"
                style={{width: "100%", content: "none"}} 
                >
                <b>{ unsortedCase ? "Unsorted to Case" : selectedItem }</b>
                <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                    <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                    </svg>
                </span>
            </Dropdown.Toggle>
        </div>

      <Dropdown.Menu className="dropdown-menu w-100 p-0 add-menu" id="dropdown-custom-menu" style={{backgroundColor: "#fafbfc"}}>     
        <div className="row" style={{ width: "inherit" }}>
                <div className="col-3" style={{backgroundColor: "#fafbfc"}}>
                    <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit" }}>
                      <Dropdown.Toggle 
                            className='dropdown-submenu dropdown-item w-100 pl-3'
                            variant="secondary"
                            style={{width: "100%", height: "inherit"}}
                            as={"a"}
                            onClick={(event) => handlePageSelect(null, null, null, true)}
                        >
                            <span className="has-no-after text-primary width-17 right-0 m-r-5 pr-2" style={{ display: "inline-block"}}>
                                <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                                </svg>
                            </span>        
                            Unsorted to Case
                        </Dropdown.Toggle>
                    </Dropdown>
                </div>
            {props.case ? props.case?.selected_pages?.map((selected_page, index) => (
                <div key={index} className="col-3" style={{backgroundColor: "#fafbfc"}}>
                    <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit" }}>
                        <Dropdown.Toggle 
                            className='dropdown-submenu dropdown-item w-100 pl-3'
                            variant="secondary"
                            style={{width: "100%", height: "inherit"}}
                            as={"a"}
                            onClick={(event) => handlePageSelect(selected_page?.id, selected_page?.name, selected_page?.panels)}
                        >
                            <span className="has-no-after text-primary width-17 right-0 m-r-5" style={{ display: "inline-block"}}>
                                <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                                </svg>
                            </span>        
                            {selected_page?.page_icon && 
                                <img
                                    src={selected_page?.page_icon}
                                    alt="Page Icon"
                                    className="mr-2 inbox-width-15px-height-15px"
                                />
                            }
                            {selected_page?.name}
                        </Dropdown.Toggle>
                    </Dropdown>
                </div>
            )) : null}
        </div>
    </Dropdown.Menu>

      {/* End Nested Dropdown */}
    </Dropdown>
    




    {
     ((nestedDropdowns?.data == undefined) || (nestedDropdowns?.data?.length == 0))
    ?
    <Dropdown id='dropdown-3' style={{width: "100%"}}   className="mb-2 custom-dropdown-wrapper d-inline-block"
    >
        <div style={{width: "100%"}}  className='position custom-dropdown-opener'>
            <Dropdown.Toggle
                id="dropdown-custom"
                className={`${tabsToShow ? (tabsToShow['rows'] == true ? "bg-white":"grey-out"): "grey-out"} dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text`}
                variant="secondary"
                style={{width: "100%"}} 
                >
                <b>{(nestedDropdowns?.data?.length == 0 && unsortedPage) ? `Unsorted to ${selectedPageName}` : selectedPage }</b>
                <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                    <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                    </svg>
                </span>
            </Dropdown.Toggle>
        </div>

      <Dropdown.Menu className="dropdown-menu w-100 p-0 add-menu" id="dropdown-custom-menu" style={{backgroundColor: "#fafbfc"}}>     
      <div className="row" style={{ width: "inherit" }}>
          {nestedDropdowns?.data?.length == 0 ? 
          <div className="col-3" style={{backgroundColor: "#fafbfc"}}>
            <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
              <Dropdown.Toggle 
                className='dropdown-submenu dropdown-item w-100 pl-3'
                variant="secondary"
                style={{width: "100%", height: "inherit"}}
                as={"a"}
                onClick={() => handleItemClick(null, null, null, true)}
              >
                <span className="has-no-after text-primary width-17 right-0 m-r-5 pr-2" style={{ display: "inline-block"}}>
                    <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                    </svg>
                </span>   
                Unsorted to {selectedPageName}
              </Dropdown.Toggle>
            </Dropdown>
          </div>
          : null}
          
        {nestedDropdowns?.document_slots && nestedDropdowns?.document_slots?.length > 0 ? nestedDropdowns?.document_slots?.map((dropdown, index) => dropdown?.slot_number != 0 ?
          <div key={index} className="col-3" style={{backgroundColor: "#fafbfc"}}>
          <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
            <Dropdown.Toggle 
              className='dropdown-submenu dropdown-item w-100 pl-3'
              variant="secondary"
              style={{width: "100%", height: "inherit"}}
              as={"a"}
              onClick={() => handleItemClick(`${dropdown?.slot_number}. ${dropdown?.slot_name ? dropdown?.slot_name : "Available"}`, selectedPageId, dropdown?.id)}
            >
              <span className="has-no-after text-primary width-17 right-0 m-r-5 pr-2" style={{ display: "inline-block"}}>
                  <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                  </svg>
              </span>   
              {dropdown?.slot_number}. {dropdown?.slot_name ? dropdown?.slot_name : "Available"}
            </Dropdown.Toggle>
          </Dropdown>
          </div>
          : 
          null
          )
          : null}
          {/* <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
            <Dropdown.Toggle 
              className='dropdown-submenu dropdown-item w-30 pl-4 ml-2'
              variant="secondary"
              style={{width: "30%", height: "50%"}}
              as={"a"}

              onClick={() => handleItemClick(selectedItem?.replace("Save Document To", "Attach to"), selectedPageId, "")}  
            >
              <span className="has-no-after text-primary right-0" style={{ display: "inline-block"}}>
                  <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                  </svg>
              </span>
              {selectedItem?.replace("Save Document To", "Attach to")}
            </Dropdown.Toggle>
          </Dropdown> */}
      </div>
      </Dropdown.Menu>
    </Dropdown>
    : null
    }



    {
      true &&
        <Dropdown id='dropdown-2' style={{width: "100%"}}   className="mb-2 custom-dropdown-wrapper d-inline-block"
        >
          <div style={{width: "100%"}}  className='position custom-dropdown-opener'>
              <Dropdown.Toggle
                  id="dropdown-custom"
                  className={`${tabsToShow ? ((tabsToShow['panels'] == true && nestedDropdowns?.data?.length > 0) ? "bg-white":"grey-out"): "grey-out"} dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text`}
                  variant="secondary"
                  style={{width: "100%"}} 
                  >
                  <b>{ unsortedPage ? `Unsorted to ${selectedPageName ? selectedPageName : "Page"}` : (!selectedPanelName?.includes("Select Panel") ? ("Selected Panel: "+(selectedPanelName ? selectedPanelName:"")): selectedPanelName) }</b>
                  <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                      <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                      </svg>
                  </span>
              </Dropdown.Toggle>
          </div>

        <Dropdown.Menu className="dropdown-menu w-100 p-0 add-menu" id="dropdown-custom-menu" style={{backgroundColor: "#fafbfc"}}>     
          <div className="row" style={{ width: "inherit" }}>

            <div className="col-3" style={{backgroundColor: "#fafbfc"}}>
              <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
                <Dropdown.Toggle 
                  className='dropdown-submenu dropdown-item w-100 pl-3'
                  variant="secondary"
                  style={{width: "100%", height: "inherit"}}
                  as={"a"}
                  onClick={() => handlePanelClick(null, null, true)}
                >
                  <span className="has-no-after text-primary width-17 right-0 m-r-5 pr-2" style={{ display: "inline-block"}}>
                      <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                      </svg>
                  </span>   
                  Unsorted to {selectedPageName}
                </Dropdown.Toggle>
              </Dropdown>
            </div>

          {nestedDropdowns?.data ? nestedDropdowns?.data?.map((dropdown, index) => dropdown?.panel_name != "" ?
              <div key={index} className="col-3" style={{backgroundColor: "#fafbfc"}}>
                <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
                  <Dropdown.Toggle 
                    className='dropdown-submenu dropdown-item w-100 pl-3'
                    variant="secondary"
                    style={{width: "100%", height: "inherit"}}
                    as={"a"}
                    onClick={() => handlePanelClick(dropdown.id, dropdown.panel_name)}
                  >
                    <span className="has-no-after text-primary width-17 right-0 m-r-5 pr-2" style={{ display: "inline-block"}}>
                        <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                        </svg>
                    </span>
                    {index+1}. {dropdown?.panel_name}
                  </Dropdown.Toggle>
                </Dropdown>
              </div>
              : 
              null
              )
              : null}
              <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
                <Dropdown.Toggle 
                  className='dropdown-submenu dropdown-item w-100 pl-3'
                  variant="secondary"
                  style={{width: "100%"}}
                  as={"a"}
                  onClick={() => handlePanelClick("-1", "")}  
                >
                  Select Panel
                </Dropdown.Toggle>
              </Dropdown>
            </div>
          </Dropdown.Menu>
        </Dropdown>
    }
    
    
    {
    nestedDropdowns?.data?.length > 0 ?
    <Dropdown id='dropdown-3' style={{width: "100%"}}   className="custom-dropdown-wrapper d-inline-block"
    >
        <div style={{width: "100%"}}  className='position custom-dropdown-opener'>
            <Dropdown.Toggle
                id="dropdown-custom"
                className={`${tabsToShow ? ((tabsToShow['rows'] == true && selectedPanelName) ? "bg-white":"grey-out"): "grey-out"} dropdown-toggle form-select has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text`}
                variant="secondary"
                style={{width: "100%"}} 
                >
                <b>{(nestedDropdowns?.data?.length == 0 && unsortedPage) ? `Unsorted to ${selectedPageName}` : selectedPage }</b>
                <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
                    <svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                    </svg>
                </span>
            </Dropdown.Toggle>
        </div>

      <Dropdown.Menu className="dropdown-menu w-100 p-0 add-menu" id="dropdown-custom-menu" style={{backgroundColor: "#fafbfc"}}>     
      <div className="row" style={{ width: "inherit" }}>
          {nestedDropdowns?.data?.length == 0 ? 
          <div className="col-3" style={{backgroundColor: "#fafbfc"}}>
            <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
              <Dropdown.Toggle 
                className='dropdown-submenu dropdown-item w-100 pl-3'
                variant="secondary"
                style={{width: "100%", height: "inherit"}}
                as={"a"}
                onClick={() => handleItemClick(null, null, null, true)}
              >
                <span className="has-no-after text-primary width-17 right-0 m-r-5 pr-2" style={{ display: "inline-block"}}>
                    <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                    </svg>
                </span>   
                Unsorted to {selectedPageName}
              </Dropdown.Toggle>
            </Dropdown>
          </div>
          : null}
          
        {nestedDropdowns?.document_slots && nestedDropdowns?.document_slots?.length > 0 ? nestedDropdowns?.document_slots?.map((dropdown, index) => dropdown?.slot_number != 0 ?
          <div key={index} className="col-3" style={{backgroundColor: "#fafbfc"}}>
          <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
            <Dropdown.Toggle 
              className='dropdown-submenu dropdown-item w-100 pl-3'
              variant="secondary"
              style={{width: "100%", height: "inherit"}}
              as={"a"}
              onClick={() => handleItemClick(`${dropdown?.slot_number}. ${dropdown?.slot_name ? dropdown?.slot_name : "Available"}`, selectedPageId, dropdown?.id)}
            >
              <span className="has-no-after text-primary width-17 right-0 m-r-5 pr-2" style={{ display: "inline-block"}}>
                  <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                  </svg>
              </span>   
              {dropdown?.slot_number}. {dropdown?.slot_name ? dropdown?.slot_name : "Available"}
            </Dropdown.Toggle>
          </Dropdown>
          </div>
          : 
          null
          )
          : null}
          <Dropdown show={showNestedDropdown} className='dropdown-submenu w-100' style={{ height: "30px", minWidth: "inherit", backgroundColor: "#fafbfc" }}>
            <Dropdown.Toggle 
              className='dropdown-submenu dropdown-item w-30 pl-4 ml-2'
              variant="secondary"
              style={{width: "30%", height: "50%"}}
              as={"a"}

              onClick={() => handleItemClick(selectedItem?.replace("Save Document To", "Attach to"), selectedPageId, "")}  
            >
              <span className="has-no-after text-primary right-0" style={{ display: "inline-block"}}>
                  <svg width="15" className="vertical-align-mid remove-hover-effect Rot-270Deg" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="#203f64"></path>
                  </svg>
              </span>
              {selectedItem?.replace("Save Document To", "Attach to")}
            </Dropdown.Toggle>
          </Dropdown>
      </div>
      </Dropdown.Menu>
    </Dropdown>
    : null
    }
    </>
  );
}

export default NestedDropdown;
