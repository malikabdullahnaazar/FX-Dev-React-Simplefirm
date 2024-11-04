import React from 'react';
import { useState,useRef,useEffect,useContext} from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import AutoCompleteSearch from '../../Insurance/AutoCompleteSearch';
import api from '../../../api/api';
import { getCaseId, getClientId, getToken } from '../../../Utils/helper';
import { createInsurance } from '../../../Redux/insurance/insuranceSlice';
import axios from 'axios';
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";



const AddDefendantInsuranceModal = ({ show, handleClose,setReducer,reducerValue, handleInsuranceSubmit,currentDefendantId, client, otherParties = [], defendants = [], insuranceTypes = [],  litigation , }) => {
  const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm();
  const [openDropdown,setOpenDropDown] = useState(false)
  const[searchedCompany,setSearchedCompany] = useState([])
  const[searchedAdjuster,setSearchedAdjuster] = useState([])
  const[currentDefendantName,setCurrentDefendantName]=useState('')
  const searchType = useRef('')
  const dropdownRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const dispatch = useDispatch()
  const {isPanelChecklistUpdated, setIsPanelChecklistUpdated } = useContext(ClientDataContext);
  const [states, setStates] = useState([]); //state abrs
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken()
 
  const [selectedCompanyId , setSelectedComponyId] = useState('')

  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/` , {
        headers: {
          Authorization: accessToken,
        },
      });
      if (response.status === 200) {
        setStates(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const onSubmit = async (data) => {
    // const defendant_ids = document.querySelector(".defendant-ids").value
    await dispatch(createInsurance({client_id:getClientId(),case_id:getCaseId(),data:{...data,defendant_id:currentDefendantId}}))
    setReducer(reducerValue)
    setIsPanelChecklistUpdated(!isPanelChecklistUpdated)
    handleClose()
    handleInsuranceSubmit()

  };

  const formatNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };


  const selectedInsuranceTypeId = parseInt(watch('insuranceTypeId'));

  // Handling Searching 
  const handleSearch =  async(event,type)=>{
    searchType.current = type
    let companies=[]
    let adjusters=[]


    if (event.target.value.length >= 2) {
      if (type === "company") {
        const response = await axios.get(`${origin}/api/insurances/search/`);
        companies = response.data.data.filter(insurance => 
          // Check if the insurance type matches the selected insurance type
          parseInt(insurance.insurance_type) === selectedInsuranceTypeId && (
            insurance?.company_name?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.adjuster_firstname?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.adjuster_lastname?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.address1?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.address2?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.city?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.state?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.zip?.toLowerCase().startsWith(event.target.value.toLowerCase())
          )
        );
      } else if (type === "adjuster") {
        const response = await axios.get(`${origin}/api/general/search_filter_adjuster_directoires/` , {
          params:{
            company_id: selectedCompanyId ? selectedCompanyId:""
          }
        });
        console.log(response)
        adjusters = response.data.data.filter(insurance => 
          (
            insurance?.company_name.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.adjuster_firstname?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.adjuster_lastname?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.address1?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.address2?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.city?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.state?.toLowerCase().startsWith(event.target.value.toLowerCase()) ||
            insurance?.zip?.toLowerCase().startsWith(event.target.value.toLowerCase())
          )
        );
      }
    }

     setSearchedCompany(companies)
     setSearchedAdjuster(adjusters)
    
  }



function handleChange(event,inputType) {
  if(inputType == "phoneNumber")
   {
       let formattedValue = formatNumber(event.target.value);
       setValue('phoneNumber', formattedValue);
   }
   if (inputType == "fax")
       {
       let formattedValue = formatNumber(event.target.value);
       setValue('fax', formattedValue);
       }
}
const handleSelectedInsurance = (id)=>{
  if(searchType.current == "company")
    {
      let selectedCompany = searchedCompany.filter(insurance=> insurance.id == id)
      selectedCompany = {...selectedCompany[0]}
      setValue('phoneNumber',formatNumber(selectedCompany?.phone))
      setValue('fax',formatNumber(selectedCompany?.fax))
      setValue('email',selectedCompany?.email)
      setValue('companyName',selectedCompany?.company_name)
      setValue('website',selectedCompany?.website)
      setValue('address1',selectedCompany?.address1)
      setValue('address2',selectedCompany?.address2)
      setValue('zip',selectedCompany?.zip)
      setValue('city',selectedCompany?.city)
      setValue('state',selectedCompany?.state)
      setValue('extension',selectedCompany?.extension)
      setSelectedComponyId(selectedCompany?.company_id)
      setSearchedCompany([])
    }

    if(searchType.current == "adjuster")
      {
        let selectedAdjuster = searchedAdjuster.filter(insurance=> insurance.id == id)
        selectedAdjuster = {...selectedAdjuster[0]}
        setValue('adjuster_fname',selectedAdjuster?.adjuster_firstname)
        setValue('adjuster_lname',selectedAdjuster?.adjuster_lastname)

        setSearchedAdjuster([])
      }
}

useEffect(() => {
  fetchSatesData();

  const currentDefendant = defendants.find(defendant => defendant.id === currentDefendantId);

  if (currentDefendant) {
    if (currentDefendant.defendantType_name === 'Private Individual') {
      const name = `${currentDefendant.first_name} ${currentDefendant.last_name}`;
      setCurrentDefendantName(name);
    } else {
      setCurrentDefendantName(currentDefendant.entity_name);
    }
  }
}, []);


  // function select_multiple_defendant(this_el) {
  //   var id = this_el.getAttribute('data-id');
  //   var name = this_el.textContent.trim();

  //   var defendantNamesInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".defendant-names");
  //   var defendantIdsInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".defendant-ids");
  //   var names = defendantNamesInput.value.trim();
  //   var ids = defendantIdsInput.value.trim();

  //   if (names && ids) {
     
  //     names = names.split(", ");
  //     ids = ids.split(",");
  //   } else {
     
  //     names = [];
  //     ids = [];
  //   }

  //   var index = names.indexOf(name);
  //   if (index === -1) {
  //     names.push(name);
  //     ids.push(id);
  //     defendantNamesInput.value = names.join(", ");
  //     defendantIdsInput.value = ids.join(",");
  //     this_el.classList.add("selected");
  //     // document.getElementById("defendant-names-container").insertAdjacentHTML('beforeend', '<span class="defendant-tag" data-id="'+id+'">'+name+'<span class="remove-defendant">x</span></span>');
  //   } else {
  //     names.splice(index, 1);
  //     ids.splice(index, 1);
  //     defendantNamesInput.value = names.join(", ");
  //     defendantIdsInput.value = ids.join(",");
  //     this_el.classList.remove("selected");
  //     var tagToRemove = document.querySelector("#defendant-names-container [data-id='" + id + "']");
  //     if (tagToRemove) {
  //       tagToRemove.remove();
  //     }
  //   }
  // }


 


 
  // useEffect(() => {
  //   if (dropdownRef.current) {
  //     const listItems = dropdownRef.current.querySelectorAll('li');
  //     for (let i = 0; i < listItems.length; i++) {
  //        const this_el = listItems[i]
  //         const id = this_el.getAttribute('data-id'); // Perform your logic here
  //         if(id == currentDefendantId)
  //         {
  //           var name = this_el.textContent.trim();
          
        
  //           var defendantNamesInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".defendant-names");
            
  //           var defendantIdsInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".defendant-ids");
           
  //           var names = defendantNamesInput.value.trim();
      
  //           var ids = defendantIdsInput.value.trim();
        
        
  //           if (names && ids) {
         
  //             names = names.split(", ");
              
  //             ids = ids.split(",");
             
  //           } else {
             
  //             names = [];
  //             ids = [];
  //           }
        
  //           var index = names.indexOf(name);
  //           if (index === -1) {
  //             names.push(name);
  //             ids.push(id);
  //             defendantNamesInput.value = names.join(", ");
  //             defendantIdsInput.value = ids.join(",");
  //             this_el.classList.add("selected");
  //             // document.getElementById("defendant-names-container").insertAdjacentHTML('beforeend', '<span class="defendant-tag" data-id="'+id+'">'+name+'<span class="remove-defendant">x</span></span>');
  //           } 
  //         }
       
  //     };
  //   }
  // }, []);

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="modal-dialog-centered INS-max-width-1000px custom-insurance-dialog">
      <div>
        <Modal.Header className="text-center bg-primary-fixed" style={{padding:"5px",color:"#ffffff"}}>
          <Modal.Title className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500 modal-title h4">ADD {currentDefendantName && currentDefendantName} INSURANCE</Modal.Title>
          <Button variant="close" onClick={handleClose} aria-label="Close"></Button>
        </Modal.Header>
        <Modal.Body className="panel-popups-body">
          <Form id="addinsurance_form" onSubmit={handleSubmit(onSubmit)}>
            <Row className='custom-margin-bottom'>
              <Col md={3} style={{display:"flex",alignItems:"center"}}>
                <p className="text-secondary text-darker">Insurance for Defendant :</p>
              </Col>
              <Col md={9}>
                {/* <div className="dropdown-defendant form-control">
                  <input
                    type="text"
                    className="defendant-names"
                    placeholder="select a defendant"
                    onClick={()=> setOpenDropDown(!openDropdown)}
                    readOnly
                    style={{border: "none"}}
                  />
                  <input
                    type="hidden"
                    ref={hiddenInputRef}
                    className="defendant-ids"
                  />
                  <span className="dropdown-arrow"  onClick={()=> setOpenDropDown(!openDropdown)}></span>
                  <div ref={dropdownRef} className={`dropdown-content-defendant ${openDropdown ? 'd-block': ''}`}>
                    <ul className="defendant-list ">
                      {defendants && defendants.map((defendant, index) => (
                        <li key={index} data-id={defendant.id}
                         onClick={() => select_multiple_defendant(event.target)}>
                          {defendant?.first_name} {defendant?.last_name}
                          </li>
                      ))}
                    </ul>
                  </div>
                </div> */}
                <Form.Control type='text' value={currentDefendantName} disabled/>
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter Policy#"
                  {...register('policyNumber')}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter Claim#"
                  {...register('claimNumber')}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  as="select"
                  className={`custom-margin-bottom  dropdown-h-35px ${errors.insuranceTypeId && "is-invalid"}`}
                  {...register('insuranceTypeId')}
                >
                  <option value="" disabled selected>Select Coverage Type</option>
                  {insuranceTypes && insuranceTypes?.map(insuranceType => {
                    if (!insuranceType?.state || (insuranceType?.state && insuranceType?.state?.id === litigation?.state?.id)) {
                      return (
                        <option key={insuranceType?.id} value={insuranceType?.id}>
                          {insuranceType?.name}
                        </option>
                      );
                    }
                    return null;
                  })}
                </Form.Control>
              </Col>
            </Row>
            <Row className="custom-margin-bottom">
              <Col md={12}>
                <Form.Control
                  type="text"
                  placeholder="Type Insurance Company Name to add from library"
                  onKeyUp={()=> handleSearch(event,'company')}
                  disabled = {!selectedInsuranceTypeId}
                 
                />
                 { searchedCompany.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedCompany} selectedInsurance={handleSelectedInsurance} isCompany={true}/>}
              </Col>
            </Row>
           

            <Row className="align-items-center custom-margin-bottom">
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter company name"
                  {...register('companyName')}
                />
              </Col>
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter website"
                  {...register('website')}
                />
              </Col>
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  {...register('phoneNumber')}
                  onKeyUp={() => handleChange(event,'phoneNumber')}
                />
              </Col>
              <Col md={4} className=''>
                <Form.Control
                  type="text"
                  placeholder="Enter Fax"
                  onKeyUp={() => handleChange(event,'fax')}
                  {...register('fax')}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter Email"
                  {...register('email')}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter extension"
                  {...register('extension')}
                />
              </Col>
            </Row>
           

            <Row className="align-items-center custom-margin-bottom">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Address 1"
                  {...register('address1')}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Address 2"
                  {...register('address2')}
                />
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom ">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
                  {...register('city')}
                />
              </Col>
              <Col md={4}>
                <Form.Select
                  {...register('state')}
                  className={`custom-margin-bottom ${errors.state && 'is-invalid'}`}
                >
                  <option value=''  disabled selected>Select State</option>
                  {states?.map(state => (
                    <option key={state.StateAbr} value={state.StateAbr}>
                      {state.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter ZIP"
                  {...register('zip')}
                />
              </Col>
            </Row>
            

            <Row className="custom-margin-bottom">
              <Col md={12}>
                <Form.Control
                  type="text"
                  placeholder="Type Adjuster Name to add from library"
                  onKeyUp={()=> handleSearch(event,'adjuster')}
                  disabled = {!selectedCompanyId}
                  
                />
                 { searchedAdjuster.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedAdjuster} selectedInsurance={handleSelectedInsurance} isAdjuster={true}/>}
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Adjuster First Name"
                  {...register('adjuster_fname')}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Adjuster Last Name"
                  {...register('adjuster_lname')}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className="INS-float-margin;">
            Cancel
          </Button>
          <Button variant="success" type="submit" form="addinsurance_form">
            Save
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );


};

export default AddDefendantInsuranceModal;

