import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ClientModal from "../Modals/clientModal";
import EmailModal from "../Modals/emailModal";
import TextModal from "../Modals/textModal";
import { useSelector } from "react-redux";
import bdayIcon from "../../assets/images/birthdayicon.svg";
import TableLoader from "../Loaders/tableLoader";
import { formatDateForPanelDisplay, getCaseId, getClientId, mediaRoute, setCaseId, setClientId } from "../../Utils/helper";
import NotesCategoryDropdown from "./NotesCategoryDropdown";
import { useDispatch } from "react-redux";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import incidentIcon from "../../assets/images/incident.svg";
import phoneIcon from "../../assets/images/phone-icon.svg";
import { setHasData,setCurrentCase,setShowAssignTodoModal,setshowAssignTodoModalMessage,setSearchRecordId, setSearchNoteId, setSearchDocument, } from "../../Redux/search/searchSlice";
import { fetchAllPages,
          fetchCurrentCase,
          setCaseSummary, } from "../../Redux/caseData/caseDataSlice";
import { fetchCaseSummary } from "../../api/case";
import api from "../../api/api";


const TabsTable = ({ tabsPage = [], addNotesHandler }) => {
  const defaltImagePath = "bp_assets/img/avatar.png";
  const DOIImage = "bp_assets/img/incident.svg";
  const navigate = useNavigate();
  // Redux
  const searchResult = useSelector((state) => state.searchS.searchResult);
  const currentTab = useSelector((state) => state.searchS.currentTab);
  const searchRecordId = useSelector((state) => state.searchS.searchRecordId);
  const hasData = useSelector((state) => state.searchS.hasData);
  const [data, setData] = useState([]);
  const[fakeRows,setFakeRows]=useState([])
  const dispatch = useDispatch();
  const textareaRefs = useRef({});
  const [notes, setNotes] = useState({});
  const firmUserPreferences = useSelector((state)=> state.searchS.firmUserPreferences)
  
  const [checkedPreferences, setCheckedPreferences] = useState([]);
  const [checkedRenderingPreferences, setCheckedRenderingPreferences] = useState([]);
  const [isBirthdayChecked,setIsBirthdayChecked]=useState(false)
  const removalRef = useRef(false);
  const dropdownOpen = useRef(false);


  const toggleDropDown = (state)=>{
      dropdownOpen.current = state
  }

    const getTrueFields = (preferences) => {
        return Object.entries(preferences)
            .filter(([key, value]) => value === true)
            .map(([key, value]) => ({ [key]: value }));
    };

    useEffect(() => {
        if (firmUserPreferences) {
            const trueFields = getTrueFields(firmUserPreferences);
            setCheckedPreferences(trueFields);
        }
    }, [firmUserPreferences]);
 

// Sorting functions for sorting the usePrefrences array
// Define the sort order mapping
      const sortOrder = [
        'SRincidentdate',  // 0. Incident Date
        'srcasestage',     // 1. Case Stage
        'sropendate',      // 2. Open Date
        'srcloseddate',    // 3. Closed Date
        'srlastaccessed',  // 4. Last Accessed Date
        'srmainemail',     // 5. Client Email
        'srmainphone'      // 6. Client Phone
      ];

// Function to sort the array based on the custom order
const sortArrayByCustomOrder = (arr) => {
  return arr.sort((a, b) => {
    const keyA = Object.keys(a)[0];
    const keyB = Object.keys(b)[0];

    // Get the index of the keys in the sortOrder array
    const indexA = sortOrder.indexOf(keyA);
    const indexB = sortOrder.indexOf(keyB);

    // If the key is not found in sortOrder, treat it as last in the order
    const normalizedIndexA = indexA === -1 ? sortOrder.length : indexA;
    const normalizedIndexB = indexB === -1 ? sortOrder.length : indexB;

    return normalizedIndexA - normalizedIndexB;
  });
};


    // Setting  and checking if birthday key exist in the FirmUserPrefernces table to set it second in the order 
    useEffect(()=>{
      if(checkedPreferences.length > 0 && !removalRef.current)
      {
        let updatedPreferences;
        const exists = checkedPreferences.some(obj => obj.hasOwnProperty('srclientbday'));
        setIsBirthdayChecked(exists)
        if (exists) {
          // Remove the object with 'srclientbday'
          updatedPreferences = checkedPreferences.filter(obj => !obj.hasOwnProperty('srclientbday'));
          // Sort the array
          const sortedArray = sortArrayByCustomOrder(updatedPreferences);
          setCheckedRenderingPreferences(sortedArray);
        }else{
          // Sort the array
          const sortedArray = sortArrayByCustomOrder(updatedPreferences);
          setCheckedRenderingPreferences(sortedArray);
        }

      }

    },[checkedPreferences])
    
    useEffect(()=>{
        console.log("Prefereces = ",checkedRenderingPreferences)
    },[checkedRenderingPreferences])

  useEffect(() => {
    let found = false;
    if(searchResult)
    {
    for (const [key, value] of Object.entries(searchResult)) {
      if(key == currentTab)
      {
            if(value.length==0)
            {
             dispatch(setHasData(false))
             break
            }else{
              setData(value)
              found=true
              break
            }  
      }
    }
  }
    if (!found) {
      setData([]);
    }
  }, [currentTab, searchResult]);


  // States
  const [customModalShow, setcustomModalShow] = useState(false);
  const [textModalShow, setTextModalShow] = useState(false);
  const [emailModalShow, setEmailModalShow] = useState(false);
  const { isClientDataUpdated, setIsClientDataUpdated } = useContext(ClientDataContext);

 

  const openCase = (record) => {
    if (dropdownOpen.current){
      console.log("Drop is open so can,t redirect")
      return
    }
    let client_id = record?.case_data?.for_client.id
    let case_id = record?.case_data.id
    setIsClientDataUpdated(!isClientDataUpdated);
    if(client_id!=getClientId() || case_id!=getCaseId())
    {
      api.get(
        `/api/switch_client/${client_id}/${case_id}/Flagged%20Cases%20Page/`
      );
      dispatch(fetchCurrentCase(client_id, case_id));
      fetchCaseSummary(client_id, case_id)
        .then((data) => {
          dispatch(setCaseSummary(data));
          dispatch(fetchAllPages(case_id));
          setClientId(client_id)
          setCaseId(case_id) 
          if(currentTab=='client-phone' || currentTab=='client-name' || currentTab =='client-email' || currentTab=='client-SSN' || currentTab=='client-birthday')
            {
              navigate(`/bp-client/${client_id}/${case_id}`, {
              replace: true,
            });
          }else if(currentTab == 'client-lastname' || currentTab=='incident-date')
            {
              navigate(`/bp-case/${client_id}/${case_id}`, {
                replace: true,
              });
          }else if (currentTab=='invoice')
            {
              navigate(`/bp-costs/${client_id}/${case_id}`, {
                replace: true,
              });
          }else if (currentTab=="court-case")
            {
              navigate(`/bp-litigation/${client_id}/${case_id}`, {
                replace: true,
              });
          }else if(currentTab=="defendant-phone" || currentTab=="defendant")
            {
              dispatch(setSearchRecordId(record?.defendent_record_id))
              navigate(`/bp-defendants/${client_id}/${case_id}`, {
                replace: true,
              });
          }else if(currentTab=="witness")
              {
               
                dispatch(setSearchRecordId(record?.witness_id))
                navigate(`/bp-witnesses/${client_id}/${case_id}`, {
                  replace: true,
                });
          }else if(currentTab=="notes")
              {
                if(record?.page_url)
                  {
                    dispatch(setSearchNoteId(record?.note_id))
                    navigate(`/${record.page_url}/${client_id}/${case_id}`, {
                      replace: true,
                    });
                  }else{
                    dispatch(setSearchNoteId(record?.note_id))
                    navigate(`/bp-case/${client_id}/${case_id}`, {
                      replace: true,
                    });
                  }
          }else if(currentTab=="document"){
                if(record?.document_slot)
                  {
                    dispatch(setSearchDocument(record.doc))
                    navigate(`/${record?.doc.document_slot.page.page_url}/${client_id}/${case_id}`, {
                      replace: true,
                    });
                  }else{
                    dispatch(setSearchDocument(record.doc))
                    navigate(`/bp-documents/${client_id}/${case_id}`, {
                      replace: true,
                    });
                  }
          }else if (currentTab=="address"){
              if(record?.page == "defendant")
                {
                  dispatch(setSearchRecordId(record?.defendant_id))
                  navigate(`/bp-defendants/${client_id}/${case_id}`, {
                    replace: true,
                  });
              }else if(record?.page=="witness"){
                  dispatch(setSearchRecordId(record?.witness_id))
                  navigate(`/bp-witnesses/${client_id}/${case_id}`, {
                    replace: true,
                  });
                }else if(record?.page=="otherparty")
                {
                  // Write the code for when the page is done for otherparty. Now the page is not yet been live
                }else if (record?.page=='case')
                {
                  navigate(`/bp-case/${client_id}/${case_id}`, {
                    replace: true,
                  });
                }
          }else if (currentTab=="claim")
          {
            dispatch(setSearchRecordId(record?.insurance.id))
              navigate(`/bp-insurance/${client_id}/${case_id}`, {
                replace: true,
              });
          }
        })
        .catch((err) => {
          console.log("Error occurred", err);
        });
    }else{
        if(currentTab=='client-phone' || currentTab=='client-name' || currentTab =='client-email' || currentTab=='client-SSN' || currentTab=='client-birthday')
        {
          navigate(`/bp-client/${client_id}/${case_id}`, {
          replace: true,
        });
  
        }else if(currentTab == 'client-lastname' || currentTab=='incident-date')
        {
          navigate(`/bp-case/${client_id}/${case_id}`, {
            replace: true,
          });
  
        }else if (currentTab=='invoice')
        {
          navigate(`/bp-costs/${client_id}/${case_id}`, {
            replace: true,
          });
        }else if (currentTab=="court-case")
        {
          navigate(`/bp-litigation/${client_id}/${case_id}`, {
            replace: true,
          });
        }else if(currentTab=="defendant-phone" || currentTab=="defendant")
          {
            dispatch(setSearchRecordId(record?.defendent_record_id))
            navigate(`/bp-defendants/${client_id}/${case_id}`, {
              replace: true,
            });
        }else if(currentTab=="witness")
        {
          dispatch(setSearchRecordId(record?.witness_id))
          navigate(`/bp-witnesses/${client_id}/${case_id}`, {
            replace: true,
          });
        }else if(currentTab=="notes")
          {
            if(record?.page_url)
            {
              dispatch(setSearchNoteId(record?.note_id))
              navigate(`/${record.page_url}/${client_id}/${case_id}`, {
                replace: true,
              });
            }else{
              dispatch(setSearchNoteId(record?.note_id))
              navigate(`/bp-case/${client_id}/${case_id}`, {
                replace: true,
              });
            }
        }else if(currentTab=="document"){
            if(record?.document_slot)
            {
              dispatch(setSearchDocument(record.doc))
              navigate(`/${record?.doc.document_slot.page.page_url}/${client_id}/${case_id}`, {
                replace: true,
              });
            }else{
              dispatch(setSearchDocument(record.doc))
              navigate(`/bp-documents/${client_id}/${case_id}`, {
                replace: true,
              });
            }
        }else if (currentTab=="address"){
            if(record?.page == "defendant")
            {
              dispatch(setSearchRecordId(record?.defendant_id))
              navigate(`/bp-defendants/${client_id}/${case_id}`, {
                replace: true,
              });
            }else if(record?.page=="witness"){
              dispatch(setSearchRecordId(record?.witness_id))
              navigate(`/bp-witnesses/${client_id}/${case_id}`, {
                replace: true,
              });
            }
        }else if (currentTab=="claim")
          {
            dispatch(setSearchRecordId(record?.insurance.id))
              navigate(`/bp-insurance/${client_id}/${case_id}`, {
                replace: true,
              });
          }else if (record?.page=='case')
            {
              navigate(`/bp-case/${client_id}/${case_id}`, {
                replace: true,
              });
            }
    }  
  };
 


// handlind Assign Todo Task functionality
const handleAssignTask = (data)=>{
  dispatch(setCurrentCase(data.case_data))
  dispatch(setShowAssignTodoModal(true))
  if (notes.hasOwnProperty(`textarea${data.id}`))
     {
      dispatch(setshowAssignTodoModalMessage(notes[`textarea${data.id}`]))
     }
}

// handle values for textAreas
const handleTextareaChange = (e, textareaId) => {
  setNotes({ ...notes, [textareaId]: e.target.value });

};


  const handleNoteCreateFormSubmission = async (category, textAreaId,case_id,client_id) => {
    if(textareaRefs.current[`textarea${textAreaId}`])
      {
        addNotesHandler(category, case_id, client_id,textareaRefs.current[`textarea${textAreaId}`].value)
        setNotes({ ...notes, [`textarea${textAreaId}`]: '' });
      }
  };


const getTextValue = (type, case_id, client_id,textareaId)=>{
  if(textareaRefs.current[`textarea${textareaId}`])
    {
      addNotesHandler(type, case_id, client_id,textareaRefs.current[`textarea${textareaId}`].value)
      setNotes({ ...notes, [`textarea${textareaId}`]: '' });
    }
}



// Calculate fake rows for no data div 
useEffect(()=>{
  const handleResize = ()=>{
    if(!hasData)
      {
  
        const targetElement = document.getElementById('fake-rows-space');
        const viewportHeight = window.innerHeight;
        const elementPosition = targetElement?.getBoundingClientRect();
        const tableHeight = tableRef.current ? tableRef.current.clientHeight : 0;
        const spaceAfterElement = viewportHeight - tableHeight;
        let total_row = Math.ceil(spaceAfterElement/57)
        total_row > 5 && (total_row -= 5);
        if(total_row>0)
        {
          const fakeRows = [...Array(total_row).keys()];
          setFakeRows(fakeRows)
        }
        
      }
  }
  handleResize()
  window.addEventListener('resize', handleResize);
  window.addEventListener('DOMContentLoaded', handleResize);
  window.addEventListener('load', handleResize);

  return ()=>{

    window.removeEventListener('resize', handleResize);
    window.removeEventListener('DOMContentLoaded', handleResize);
    window.removeEventListener('load', handleResize);

  }
},[hasData])



const [additionalRows, setAdditionalRows] = useState(0);
const tableRef = useRef(null);

useEffect(() => {
  const calculateAdditionalRows = () => {
    setTimeout(() => {
    const rowHeight = 57; // height of each row in px
    const viewportHeight = window.innerHeight;
    let tableHeight = tableRef.current ? tableRef.current.clientHeight : 0;
    if(tableHeight> viewportHeight)
    {
        tableHeight = rowHeight*data.length
    }
    const availableHeight = viewportHeight - tableHeight;
    let additionalRows = Math.max(0, Math.ceil(availableHeight / rowHeight));
    
    setAdditionalRows(additionalRows)
    }, 300);
  };
  calculateAdditionalRows();

  window.addEventListener('resize', calculateAdditionalRows);
 
  return () => {
    window.removeEventListener('resize', calculateAdditionalRows);
   
  };
}, [data,hasData]);


const childRefs = useRef([]);
const handleParentButtonClick = (index,case_id, client_id,textareaId) => {
  // Call the child function using the ref
  if (childRefs.current[index]) {
    const selectedCategoryFromChild = childRefs.current[index].childFunction();
    getTextValue(selectedCategoryFromChild,case_id,client_id,textareaId)
  }
};

let divIndex = 1;
let zIndexCounter = 2000; // Starting high zIndex
  return (
    <>
      {hasData==false ? <div id="fake-rows-space" className="m-t-25">
      {fakeRows?.map((value, index) => (
        <tr key={index} style={{ height: "57px", width: "100%" }} className="search-row fake-row-2 p-5">
          <td style={{ width: "25vw" }}></td>
          <td style={{ width: "25vw" }}></td>
          <td style={{ width: "25vw" }}></td>
          <td style={{ width: "25vw" }}></td>
        </tr>
      ))}
  </div>: data && data?.length < 1 ?<TableLoader/>:
       <table className="table-borderless table-striped  theme-colored fake-rows-2  has-height-25 table-earning table-earning-search m-t-25 fixed-table-header"  ref={tableRef} id='main-table'>
        <thead>
          {data?.length > 0 && (
            <tr>
            <th class="" style={{width:"1%"}}></th>
            <th class="text-center" style={{width:"10%"}}>CASE</th>
            <th class="text-center" style={{width:"55%"}}>RESULT</th>
            <th class="text-center" style={{width:"30%"}}>NOTES AND TODOS</th>
          </tr>
          )}
        </thead>
        <tbody>
          {data
            ? data?.map((record, index) => (
                <tr className="fake-row-2" style={{height: "57px" , position: "relative" ,zIndex : zIndexCounter--}}>
                  <span style={{display:'none'}}>{divIndex=1}</span>
                  <td style={{cursor:"pointer",color:'#808080'}} className="td-autosize text-center search-row-custom width-36"  onClick={()=> openCase(record)}>&nbsp;&nbsp; {index +1}</td>
                     <td className="search-row-custom" style={{cursor:"pointer"}} onClick={()=> openCase(record)}> 
                      <div className="dynamic-layout pt-5px">
                        <div className="first-section">
                            <div className="d-flex align-items-center row-21px">
                              <span  className="index-no">{divIndex++}</span>
                              <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mr-5px">
                                {record?.case_data?.for_client?.profile_pic_19p && (
                                  <img
                                    src={
                                      mediaRoute(record["case_data"]["for_client"][
                                        "profile_pic_19p"
                                      ])
                                    }
                                    class="output-3 theme-ring"
                                  />
                                )}
                              </span>
                              <span className=" text-black text-black-2 whitespace-nowrap font-600">
                                  {record?.case_data?.for_client?.last_name &&
                                    record["case_data"]["for_client"]["last_name"]}
                                  ,{" "}
                                  {record?.case_data?.for_client?.first_name &&
                                    record["case_data"]["for_client"]["first_name"]}
                                </span>
                              </div>
                              {isBirthdayChecked && (
                                <div className="d-flex align-items-center row-21px">
                                   <span  className="index-no">{divIndex++}</span>
                                  <span className=" d-flex align-items-center text-grey mr-5px">
                                    <img className="img-19px" src={bdayIcon} alt="icon" />
                                  </span>
                                  <span style={{textWrap : "nowrap"}}  className="font-600">
                                    {record?.case_data?.for_client?.birthday &&
                                      record["case_data"]["for_client"]["birthday"]}
                                  </span>
                                </div>
                              )}

                             
                                <div key={index} className="d-flex align-items-center row-21px">
                                <span className="index-no">{divIndex++}</span>
                                  <div className="search-Flex-1">
                                    {record?.case_data?.case_type?.casetype_icon && (
                                      <img
                                        className="img-19px mr-5px"
                                        src={mediaRoute(
                                          record["case_data"]["case_type"][
                                            "casetype_icon"
                                          ]
                                        )}
                                      />
                                    )}
                                    <p className="MR8H19 height-21 font-600">
                                      {record?.case_data?.case_type?.name &&
                                        record["case_data"]["case_type"]["name"]}
                                    </p>
                                  </div>
                              </div>
                              {checkedRenderingPreferences.length <=2 ? checkedRenderingPreferences.map((check, index) => (
                                  <>
                                    {renderField(record, check,divIndex++)} 
                                  </>
                                )) : checkedRenderingPreferences.slice(0, 2).map((check, index) => ( 
                                  <>
                                    {renderField(record, check,divIndex++)} 
                                  </>
                                )) }

                          </div>

                          <div className="second-section">
                         

                                {checkedRenderingPreferences.slice(2).map((check, index) => (
                                  <>
                                    {renderField(record, check,divIndex++)} 
                                  </>
                                ))}
                          </div>
                      </div>
                      
                    </td>

                    <td
                      className="td-autosize text-left search-row-custom text-center"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        openCase(
                         record
                        )
                      }
                    >
                      <div style={{textWrap:"wrap"}}
                        dangerouslySetInnerHTML={{ __html: record?.result }}
                      />
                    </td>
                    <td
                      className="text-center  search-row-custom-p-r-0 notes_todos_row_padding"
                      id="notes_todos_row_padding"
                    >
                      <div className="d-flex justify-content-end align-items-center">
                        <NotesCategoryDropdown
                          handleNoteCreateFormSubmission={
                            handleNoteCreateFormSubmission
                          }
                          textAreaId={ record?.id}
                          case_id={record?.case_data?.id}
                          client_id = {record?.case_data?.for_client?.id}
                          tabsPage={tabsPage}
                          toggleDropDownParent = {toggleDropDown}
                          ref={(el) => (childRefs.current[index] = el)}
                        />
                         <div className="height-100" style={{marginLeft:'-8px',marginRight:'0px'}}>
                          <form
                            id="notes-form p-r-0-i"
                            style={{ paddingLeft: "0px", height: "47px" }}
                            className="input-text-note"
                          >
                            <div
                              className="notes-text-area height-100 MRL15Px primary-border-2"
                              style={{
                                paddingLeft: "10px",
                                paddingRight: "10px",
                              }}
                            >
                              <input
                                hidden
                                type="text"
                                id="category"
                                name="category"
                                className="testSearch-margin-right-0px"
                              />
                              <textarea
                                id={
                                  record
                                    ? "case-note-" + record.id.toString()
                                    : "case-note"
                                }
                                required
                                name="description"
                                placeholder="Input a text for a note"
                                className="form-control d-inline-block height-100 ML5PX-PLC border-0 w-300p px-0 anti-skew"
                                ref={(el) =>
                                  (textareaRefs.current[`textarea${record?.id}`] = el)
                                }
                                value={notes[`textarea${record?.id}`]}
                                onChange={(e) => handleTextareaChange(e, `textarea${record?.id}`)}
                              ></textarea>
                            </div>
                          </form>
                        </div>

                        {/* Five Buttons */}
                       <div className="d-flex five-btn-main">
                          <div className="d-flex first-div">
                            <div style={{width:"90px",marginRight:'-10px'}} className="h-47">
                                <button
                                  // className="btn btn-primary rounded-0 skewed-button   control-btn h-100 mt-0"
                                  className="btn btn-primary mb-1 height-100 Width-75-ic-1 d-flex align-items-center justify-content-center no-border-radius angle-skew-11"
                                  type="button"
                                  style={{whiteSpace:'normal'}}
                                  onClick={()=>handleParentButtonClick(index, record?.case_data?.id,
                                    record?.case_data?.for_client?.id,
                                    record?.id)}
                                > 
                                  {/* <span  className="btn-text-holder text-left z-skew-text font-weight-bold"> */}
                                  <span className="anti-skew btn-text-holder Pos-Rel-1T p-l-5 text-left" style={{marginBottom:'20px',marginLeft:'-10px'}}>
                                  Save 
                                </span>
                  
                                <span style={{marginTop:"22px",marginLeft:"-29px"}}> Note</span>
                                </button>
                            </div>

                            <div className="h-47">
                              <button
                                onClick={() =>
                                  getTextValue(
                                    "critical",
                                    record?.case_data?.id,
                                    record?.case_data?.for_client?.id,
                                    record?.id
                                  )
                                }
                                className="btn btn-primary mb-1 height-100 Width-75-ic-1 d-flex align-items-center justify-content-center no-border-radius angle-skew-11"
                                style={{ whiteSpace: "normal", marginRight: "5px" }}
                              >
                                <span className="anti-skew btn-text-holder Pos-Rel-1T p-l-5 text-left" style={{marginBottom:'20px',marginLeft:'-10px'}}>
                                  Critical 
                                </span>
                  
                                <span style={{marginTop:"22px",marginLeft:"-38px"}}> Note</span>
                              </button>
                            </div>
                            <div  className="h-47 div-3">
                              <button
                                onClick={() =>
        
                                  getTextValue(
                                    "update",
                                    record?.case_data?.id,
                                    record?.case_data?.for_client?.id,
                                    record?.id
                                  )
                                }
                                className="btn btn-primary mb-1 height-100 Width-75-ic-1 d-flex align-items-center justify-content-center no-border-radius angle-skew-11 btn-3"
                                style={{ whiteSpace: "normal", marginRight: "5px" }}
                              >
                                <span className="anti-skew btn-text-holder Pos-Rel-1T p-l-5 text-left span-1" style={{marginBottom:'20px',marginLeft:'-10px'}}>
                                  Update 
                                </span>
                  
                                <span style={{marginTop:"22px",marginLeft:"-43px"}} className="span-2"> Status</span>
                              </button>
                            </div>
                       </div>
                        <div className="d-flex second-div">
                            <div  className="h-47">
                              <button
                                onClick={() => handleAssignTask(record)}
                                className="btn btn-primary mb-1 height-100 Width-75-ic-1 d-flex align-items-center justify-content-center no-border-radius angle-skew-11 btn-1"
                                style={{ whiteSpace: "normal" }}
                              >
                                <span class="font-weight-bold text-gold margin-b-08 transform-skewX-12 p-r-5">
                                  +
                                </span>
                                <span className="anti-skew btn-text-holder Pos-Rel-1T text-left">
                                Task
                                </span>
                              </button>
                            </div>
                            <div  className="h-47"
                            
                            >
                              <button
                                className="btn btn-primary mb-1 height-100  d-flex align-items-center justify-content-center no-border-radius btn-2"
                                style={{ whiteSpace: "normal",width:"95px",clipPath:"polygon(11% 0%, 100% 0%, 100% 100%, 1% 100%)",borderRadius:'0px' }}
                              >
                                <span class="font-weight-bold text-gold margin-b-08  p-r-5">
                                  +
                                </span>
                                <span className=" btn-text-holder Pos-Rel-1T text-left">
                                Event
                                </span>
                              </button>
                            </div>
                        </div>
                        </div>
                      </div>
                    </td>
                    {/* <td className="text-center pl-0 search-row-custom-p-l-0 d-flex " >
             </td> */}

                 
                  

                 
                 
                </tr>
              ))
            : null}
          {[...Array(additionalRows)]?.map((_, index) => (
              <tr key={`additional-${index}`} className="fake-row-2" style={{ height: "57px" }}>
                <td colSpan="4">&nbsp;</td>
              </tr>
            ))}
          
        </tbody>
        
      </table>}
      <ClientModal
        show={customModalShow}
        onHide={() => setcustomModalShow(false)}
      />
      <EmailModal
        show={emailModalShow}
        onHide={() => setEmailModalShow(false)}
      />
      <TextModal show={textModalShow} onHide={() => setTextModalShow(false)} />
    </>
  );
};

export default TabsTable;

const renderField = (record, check,divIndex) => {
  const fieldKey = Object.keys(check)[0]; // Extract the key from the object
  switch (fieldKey) {
    // case 'srclientbday':
    //   return (
    //     <div className="d-flex align-items-center row-21px">
                      
    //     <span className=" d-flex align-items-center text-grey mr-5px">
    //       <img className="img-19px" src={bdayIcon} alt="icon" />
    //     </span>
    //     <span style={{textWrap : "nowrap"}}>
    //       {record?.case_data?.for_client?.birthday &&
    //         record["case_data"]["for_client"]["birthday"]}
    //     </span>
    //   </div>
    //   )
    case 'SRincidentdate':
      return  (
              <div className="d-flex align-items-center row-21px">
                <span className="index-no">{divIndex}</span>
                <p className="text-darker d-flex align-items-center ">
                  <span className=" d-flex align-items-center text-grey mr-5px">
                    <img
                      className="img-19px"
                      src={incidentIcon}
                      alt="incident-icon"
                    />
                  </span >
                  <span style={{textWrap : "nowrap"}} className="font-600">
                    {record?.case_data?.incident_date &&
                      record["case_data"]["incident_date"]}
                  </span>
                </p>
              </div>
      )
      case 'srcasestage':
        return (
          <div className="d-flex align-items-center row-21px">
            <span className="index-no">{divIndex}</span>
            <p className="text-darker d-flex align-items-center ">
              <span className=" d-flex align-items-center text-grey mr-5px">
                <p >
                Case Stage
                </p>
              </span>
              <span style={{textWrap : "nowrap"}} className="primary-color font-600">
              {record?.case_data?.case_stage &&
                 record["case_data"]["for_client"]["case_stage"]
                        }
              </span>
            </p>
          </div>
        )  
        case 'sropendate':
          return (
            <div className="d-flex align-items-center row-21px">
              <span className="index-no">{divIndex}</span>
              <p className="text-darker d-flex align-items-center ">
                <span className=" d-flex align-items-center text-grey mr-5px">
                  <p className="color-green">
                    OPEN
                  </p>
                </span>
                <span style={{textWrap : "nowrap"}}  className="font-600">
                {record?.case_data?.date_open &&
                    formatDateForPanelDisplay(record["case_data"]["date_open"])
                          }
                </span>
              </p>
            </div>
          ) 
          case 'srcloseddate':
            return (
              <div className="d-flex align-items-center row-21px">
                <span className="index-no">{divIndex}</span>
                <p className="text-darker d-flex align-items-center ">
                  <span className=" d-flex align-items-center text-grey mr-5px">
                  {/* <i className="ic ic-19 ic-email-3d"></i> */}
                  CLOSED
                  </span>
                  <span style={{textWrap : "nowrap"}}  className="font-600">
                  {record?.case_data?.date_closed &&
                      formatDateForPanelDisplay(record["case_data"]["date_closed"])
                            }
                  </span>
                </p>
              </div>
            )   
            case 'srlastaccessed':
              return (
                <div className="d-flex align-items-center row-21px">
                  <span className="index-no">{divIndex}</span>
                  <p className="text-darker d-flex align-items-center ">
                    <span className=" d-flex align-items-center text-grey mr-5px">
                      <p >
                      Last  Accessed
                      </p>
                    </span>
                    <span style={{textWrap : "nowrap"}}  className="font-600">
                    {record?.case_data?.lastaccessed &&
                        formatDateForPanelDisplay(record["case_data"]["lastaccessed"])
                              }
                    </span>
                  </p>
                </div>
              )          
    case 'srmainemail':
      return (
        <div className="d-flex align-items-center row-21px">
          <span className="index-no">{divIndex}</span>
          <p className="text-darker d-flex align-items-center "
          style={{overflow: 'hidden' , textOverflow: 'ellipsis'}}
          >
            <span className=" d-flex align-items-center text-grey mr-5px">
            <i className="ic ic-19 ic-email-3d"></i>
            </span>
            <span style={{textWrap : "nowrap" , overflow: 'hidden' , textOverflow: 'ellipsis'}}  className="font-600">
            {record?.case_data?.for_client?.birthday &&
              record["case_data"]["for_client"]["email"]}
            </span>
          </p>
        </div>
      )
    case 'srmainphone':
      return (
        <div className="d-flex align-items-center row-21px">
          <span className="index-no">{divIndex}</span>
          <p className="text-darker d-flex align-items-center ">
          <span className=" d-flex align-items-center text-grey mr-5px">
                    <img
                      className="img-19px"
                      src={phoneIcon}
                      alt="phone-icon"
                    />
                  </span >
            <span style={{textWrap : "nowrap"}}  className="font-600">
            {record?.case_data?.for_client?.phone &&
              record["case_data"]["for_client"]["phone"]}
            </span>
          </p>
        </div>
      )
    default:
      return null; // Handle cases where key is not recognized
  }
};