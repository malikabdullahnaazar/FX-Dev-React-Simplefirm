import React, { useEffect,useRef,useState } from 'react';
import { Modal, Button, Nav, Form, Col, Row,Tab } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { editInsurance  } from '../../Redux/insurance/insuranceSlice';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import api from '../../api/api';
import AutoCompleteSearch from './AutoCompleteSearch';
import { format } from 'date-fns';
import { formatDateForModalFields ,formatDateForSubmission, getToken } from '../../Utils/helper';
import axios from 'axios';

function InsuranceModal({ show, handleClose,handleInsuranceCreation,insurance={},insuranceTypes=[],states=[],litigation={},activeTab,deleteInsuranceHandler }) {
  const { register,setValue, handleSubmit,watch ,formState: { errors } } = useForm();
  const dispatch = useDispatch()
  const [searchedInsurances,setSerachInsurances] = useState([])
  const [searchedAjusters,setSerachAdjusters] = useState([])
  const [searchedSupervisors,setSerachSupervisors] = useState([])
  const[showDeleteModal,setShowDeleteModal] = useState(false)

  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken()
 
  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/` , {
        headers: {
          Authorization: accessToken,
        },
      });
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    fetchSatesData()
  },[])

  const typeTab = useRef('')
  let search_input = ''

    //   Extracting the client_id and case_id from URL which is expected to /some/client_id/case_id
    const regex = /\d+/g;
    const {pathname} = useLocation()
    // Use match method to find all numbers
    const numbers = pathname.match(regex);
   // Convert the array of string numbers to an array of integers
     const URLParams = numbers.map(Number);


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
  


useEffect(()=>{

  // Setting the Company Fields
 setValue("company_name",insurance?.company_contact?.name || '' )
 setValue("company_address1",insurance?.company_contact?.address1 || '' )
 setValue("company_address2",insurance?.company_contact?.address2 || '' )
 setValue("company_city",insurance?.company_contact?.city || '' )
 setValue("company_fax",insurance?.company_contact?.fax && formatNumber(insurance?.company_contact?.fax) || '' )
 setValue("company_phone",insurance?.company_contact?.phone_number && formatNumber(insurance?.company_contact?.phone_number) || '' )
 setValue("company_zip",insurance?.company_contact?.zip || '' )
 setValue("company_state",insurance?.company_contact?.state || '' )
 setValue("company_email",insurance?.company_contact?.email || '' )
 setValue("insurance_website",insurance?.company_contact?.website || '' )
 setValue("company_extension_field",insurance?.company_contact?.phone_ext || '' )
//  setValue("insurance_type_id",insurance?.insurance_type?.id || '' )


//  Setting the Adjuster Fields
setValue("adjuster_address1",insurance?.adjuster?.address1 || '' )
setValue("adjuster_address2",insurance?.adjuster?.address2 || '' )
setValue("adjuster_city",insurance?.adjuster?.city || '' )
setValue("adjuster_email",insurance?.adjuster?.email || '' )
setValue("adjuster_fax",insurance?.adjuster?.fax && formatNumber(insurance?.adjuster?.fax) || '' )
setValue("adjuster_first_name",insurance?.adjuster?.first_name || '' )
setValue("adjuster_last_name",insurance?.adjuster?.last_name || '' )
setValue("adjuster_phone",insurance?.adjuster?.phone_number && formatNumber(insurance?.adjuster?.phone_number) || '' )
setValue("adjuster_state",insurance?.adjuster?.state || '' )
setValue("adjuster_zip",insurance?.adjuster?.zip || '' )
setValue("adjuster_extension_field",insurance?.adjuster?.phone_ext || '' )


// Setting the Supervisor Fields
setValue("supervisor_address1",insurance?.supervisor?.address1 || '' )
setValue("supervisor_address2",insurance?.supervisor?.address2 || '' )
setValue("supervisor_city",insurance?.supervisor?.city || '' )
setValue("supervisor_email",insurance?.supervisor?.email || '' )
setValue("supervisor_fax",insurance?.supervisor?.fax && formatNumber(insurance?.supervisor?.fax) || '' )
setValue("supervisor_first_name",insurance?.supervisor?.first_name || '' )
setValue("supervisor_last_name",insurance?.supervisor?.last_name || '' )
setValue("supervisor_phone",insurance?.supervisor?.phone_number && formatNumber(insurance?.supervisor?.phone_number) || '' )
setValue("supervisor_state",insurance?.supervisor?.state || '' )
setValue("supervisor_zip",insurance?.supervisor?.zip || '' )
setValue("supervisor_extension_field",insurance?.supervisor?.phone_ext || '' )

// Setting the claim fields
setValue("claim_number",insurance?.claim_number || '')
if(insurance?.Dateconfirmedactive !=null)
  {

    setValue("confirmed_date", formatDateForModalFields(insurance?.Dateconfirmedactive) )
  }else{
    setValue("confirmed_date", '' )
  }
// setValue("insurance_website")
setValue("liability_limit",insurance?.liabilityLimit || '')
setValue("policy_number",insurance?.policy_number || '')
setValue("insurance_type_id",insurance?.insurance_type?.id || '')
setValue("liability_limit_all",insurance?.liabilityLimitAll || '')

},[])  




function handleChange(event,inputType) {
    let formattedValue = formatNumber(event.target.value);
    setValue(`${inputType}`, formattedValue);
}


const onSubmit = async (data) => {
  // Handle form submission, send data to the backend
  
    if (data.confirmed_date != '')
      {
        data.confirmed_date = formatDateForSubmission(data.confirmed_date);
      }else{
        data.confirmed_date = null
      }
    
   await dispatch(editInsurance({...data,client_id:URLParams[0],case_id:URLParams[1],insurance_id:insurance.id}))
    
   handleInsuranceCreation()
   handleClose()

   
};



// Search functionlity for searching the Insurance company, adjuster,supervisor 
const fetchData = async (search,type) => {
  typeTab.current = type
  let response=''
  try {
    if(type == "insurance" )
      {
       
        response = await axios.get(`${origin}/api/insurances/search/`);

      }else if (type == "adjuster" )
      {
       
        response = await axios.get(`${origin}/api/general/search_filter_adjuster_directoires/`);

      }else if (type="supervisor"){

        
        response = await axios.get(`${origin}/api/general/search_filter_adjuster_directoires/`);
      }
      const searchedData = response.data.data.filter(insurance => 
        insurance?.adjuster_firstname?.toLowerCase().startsWith(search.toLowerCase()) ||
        insurance?.adjuster_lastname?.toLowerCase().startsWith(search.toLowerCase()) ||
        
        (insurance.company_name?.toLowerCase() || '').startsWith(search.toLowerCase()) ||
        (insurance.address1?.toLowerCase() || '').startsWith(search.toLowerCase()) ||
        (insurance.address2?.toLowerCase() || '').startsWith(search.toLowerCase()) ||
        (insurance.city?.toLowerCase() || '').startsWith(search.toLowerCase()) ||
        (insurance.state?.toLowerCase() || '').startsWith(search.toLowerCase()) ||
        (insurance.zip?.toLowerCase() || '').startsWith(search.toLowerCase())
      );
    if (type == "insurance")
      {
        setSerachInsurances(searchedData);
        setSerachAdjusters([])
        setSerachSupervisors([])
      }

    if (type == "adjuster")
      {
        setSerachAdjusters(searchedData)
        setSerachInsurances([])
        setSerachSupervisors([])
      }  

    if(type == "supervisor")
      {
        setSerachSupervisors(searchedData)
        setSerachInsurances([])
        setSerachAdjusters([])
      }  
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // setDataLoading(false);
  }
};


// Handler for Searching Insurances
const handleSearchInsurances =  (event,type)=>{
  // console.log("yes clicked")
  search_input = event.target.value
  if (search_input.length >= 2)
   {
      fetchData(search_input,type)
   }else{
     setSerachInsurances([])
     setSerachAdjusters([])
     setSerachSupervisors([])
   }
}

// Populate the fields of Company tab
const handleSelectedInsuranceTabs = (id)=>{
  if(typeTab.current == "insurance")
    {
      let selectedInsurance = searchedInsurances.filter(insurance=> insurance.id == id)
      selectedInsurance = {...selectedInsurance[0]}
      setValue('company_address1',selectedInsurance.address1)
      setValue('company_address2',selectedInsurance.address2)
      setValue('company_city',selectedInsurance.city)
      setValue('company_phone',formatNumber(selectedInsurance.phone))
      setValue('company_state',selectedInsurance.state)
      setValue('company_fax',formatNumber(selectedInsurance.fax))
      setValue('company_zip',selectedInsurance.zip)
      setValue('insurance_type_id',selectedInsurance.insurance_type)
      setValue('company_email',selectedInsurance.email)
      setValue('company_name',selectedInsurance.company_name)
      setValue("company_extension_field",selectedInsurance?.extension || '' )
      
    }

    if (typeTab.current =="adjuster")
      {
        let selectedAdjuster = searchedAjusters.filter(adjuster=> adjuster.id == id)
        selectedAdjuster = {...selectedAdjuster[0]}
        setValue('adjuster_first_name',selectedAdjuster.adjuster_firstname)
        setValue('adjuster_last_name',selectedAdjuster.adjuster_lastname)
        setValue('adjuster_address1',selectedAdjuster.address1)
        setValue('adjuster_address2',selectedAdjuster.address2)
        setValue('adjuster_city',selectedAdjuster.city)
        setValue('adjuster_state',selectedAdjuster.state)
        setValue('adjuster_phone',formatNumber(selectedAdjuster.phone))
        setValue('adjuster_zip',selectedAdjuster.zip)
        setValue('adjuster_fax',formatNumber(selectedAdjuster.fax))
        setValue('adjuster_extension_field',selectedAdjuster.extension)
        setValue('adjuster_email',selectedAdjuster.email)
        
      }

      if(typeTab.current == "supervisor")
        {
          let selectedSupervisor = searchedSupervisors.filter(supervisor=> supervisor.id == id)
          selectedSupervisor = {...selectedSupervisor[0]}
          setValue('supervisor_first_name',selectedSupervisor.adjuster_firstname)
          setValue('supervisor_last_name',selectedSupervisor.adjuster_lastname)
          setValue('supervisor_address1',selectedSupervisor.address1)
          setValue('supervisor_address2',selectedSupervisor.address2)
          setValue('supervisor_city',selectedSupervisor.city)
          setValue('supervisor_state',selectedSupervisor.state)
          setValue('supervisor_zip',selectedSupervisor.zip)
          setValue('supervisor_phone',formatNumber(selectedSupervisor.phone))
          setValue('supervisor_fax',formatNumber(selectedSupervisor.fax))
          setValue('supervisor_extension_field',selectedSupervisor.extension)
          setValue('supervisor_email',selectedSupervisor.email)
        }
  
      setSerachAdjusters([])
      setSerachInsurances([])
      setSerachSupervisors([])
}

const handleBlur = ()=>{
  // setSerachInsurances([])
}

const SelectedCompanyState = watch("company_state");
  const SelectedAdjusterState = watch("adjuster_state");
  const SelectedSupervisorState = watch("supervisor_state");



  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-800p custom-insurance-dialog"
    
     
      
    >
      <Modal.Header className="text-center p-0 bg-primary popup-heading-color justify-content-center">
        <Modal.Title
          className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
          id="modal_title"
        >
          Insurance
        </Modal.Title>
      </Modal.Header>
      <p className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center" id="popup-paragraph"></p>
      <Modal.Body>

        <div className="custom-tab mt-3">
          <Tab.Container defaultActiveKey={activeTab} >
          <Nav variant="tabs" className="justify-content-around" >
          
              <Nav.Link eventKey="company">
                Company
              </Nav.Link>
            
    
              <Nav.Link  eventKey="adjuster">
                Adjuster
              </Nav.Link>
      
    
              <Nav.Link  eventKey="supervisor">
                Supervisor
              </Nav.Link>
      
    
              <Nav.Link eventKey="claim">
                Claim
              </Nav.Link>
      
          </Nav>
          <Form id="insurance_contacts_form" onSubmit={handleSubmit(onSubmit)} style={{ height: "235px" }}>
            <input type="hidden" name="csrfmiddlewaretoken" value="O2Ft8rMsd5q4FU1rvKFz2PGxAwffHBfGDcOH0reVbGCMGC8pPPACv1qfqaC3huT1" />
            <input type="text" name="block_name" hidden value="" />
            <input type="text" name="insurance_id" hidden value="" />
            <div className="custom-margin-top" >
              <div>
               
                <Tab.Content>
                  <Tab.Pane  eventKey="company">
                  <Row className="mx-0">
                  <Col md={12}>
                    <Form.Control
                      type="text"
                      name="search_filter_insurance_input"
                      placeholder="Type insurance company name to search directory then click an entry"
                      className="custom-margin-top custom-margin-bottom"
                      onKeyUp={()=> handleSearchInsurances(event,"insurance")}
                      
                     
                    />
                     { searchedInsurances.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedInsurances} selectedInsurance={handleSelectedInsuranceTabs} isCompany={true}/>}
                  </Col>
                </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                            <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey contact_name_title">Name :</span>
                            </Col>
                            <Col md={10}>
                              <Form.Control type="text" placeholder="Enter name" {...register("company_name")} />
                            </Col>
                            {/* <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey Text-w-NW-INS">Coverage Type</span>
                            </Col>
                            <Col md={4}>
                              <Form.Control as="select"   {...register("insurance_type_id")}>
                              {insuranceTypes && insuranceTypes?.map(insuranceType => {
                                      if (!insuranceType.state || (insuranceType.state && insuranceType.state.id === litigation?.state.id)) {
                                        return (
                                          <option key={insuranceType.id} value={insuranceType.id}>
                                            {insuranceType.name}
                                          </option>
                                        );
                                      }
                                      return null;
                                    })}
                              </Form.Control>
                                </Col>
                               */}
                          </Row>
                          <Row className="align-items-center custom-margin-bottom mx-0">
                            <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Address 1 :</span>
                            </Col>
                            <Col md={4}>
                              <Form.Control type="text" placeholder="Address 1"  {...register("company_address1")} />
                            </Col>
                            <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Address 2 :</span>
                            </Col>
                            <Col md={4}>
                              <Form.Control type="text" placeholder="Address 2" {...register("company_address2")}  />
                            </Col>
                          </Row>
                          <Row className="align-items-center custom-margin-bottom mx-0">
                            <Col md={2} className="d-flex">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-70">City :</span>
                            </Col>  
                            <Col md={2}>
                              <Form.Control type="text"  placeholder="City" className="form-control " {...register("company_city")} />
                            </Col>
                            <Col md={4} className="d-flex">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">State :</span>
                              <Form.Control as="select"  className="form-control City-Width-OP" {...register("company_state")}
                                value={SelectedCompanyState || ""}
                                onChange={(e) => setValue("company_state", e.target.value)}
                              >
                              <option  value="">
                                    Select state
                                  </option>
                              {statesAbrs?.map(state => (
                                <option key={state.StateAbr} value={state.StateAbr}>
                                  {state.name}
                                </option>
                              ))}
                                
                              </Form.Control>
                            </Col>
                            <Col md={4} className="d-flex">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">Zip :</span>
                              <Form.Control type="text"  placeholder="Zip" {...register("company_zip")} />
                            </Col>
                          </Row>
                          <Row className="align-items-center custom-margin-bottom mx-0">
                            <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Phone :</span>
                            </Col>
                            <Col md={4}>
                              <Form.Control type="text" placeholder="(###) ###-####" onKeyUp={(e)=> handleChange(e,"company_phone")} {...register("company_phone")} />
                            </Col>
                            <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Extension :</span>
                            </Col>
                            <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Extension"
                                className="form-control"
                                {...register("company_extension_field")}
                              />
                            </Col>
                          </Row>
                          <Row className="align-items-center custom-margin-bottom mx-0">
                          <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Fax :</span>
                            </Col>
                            <Col md={4}>
                              <Form.Control type="text" placeholder="(###) ###-####" onKeyUp={(e)=> handleChange(e,"company_fax")} {...register("company_fax")}/>
                            </Col>
                            <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey">Email :</span>
                            </Col>
                            <Col md={4}>
                              <Form.Control type="text" placeholder="Enter Email"  {...register("company_email")} />
                            </Col>
                            {/* <Col md={2} className="text-left">
                              <span className="d-inline-block text-grey Text-w-NW-INS">Website URL :</span>
                            </Col>
                            <Col md={4}>
                              <Form.Control type="text" placeholder="www.insurancecompany.com" {...register("insurance_website")} />
                            </Col> */}
                          </Row>
                  </Tab.Pane>
                  <Tab.Pane  eventKey="adjuster">
                  <Row className="mx-0">
                    <Col md={12}>
                      <Form.Control
                        type="text"
                        name="search_filter_insurance_input"
                        placeholder="Type insurance company name or Adjuster name to search directory then click an entry"
                        className="custom-margin-top custom-margin-bottom"
                        onKeyUp={()=> handleSearchInsurances(event,"adjuster")}
                        onBlur={handleBlur}
                      
                      />
                      { searchedAjusters.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedAjusters} selectedInsurance={handleSelectedInsuranceTabs} isAdjuster={true}/>}
                    </Col>
                </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                      <Col md={2} className="text-left">
                        <span className="d-inline-block text-grey Text-w-NW-INS">First Name :</span>
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="Enter first name"
                          
                          className="form-control"
                          {...register("adjuster_first_name")}
                        />
                      </Col>
                      <Col md={2} className="text-left">
                        <span className="d-inline-block text-grey Text-w-NW-INS">Last Name :</span>
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="Enter last name"
                          className="form-control"
                          {...register("adjuster_last_name")}
                        />
                      </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                      <Col md={2} className="text-left">
                        <span className="d-inline-block text-grey">Address 1 :</span>
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="Address 1"
                          className="form-control"
                          {...register("adjuster_address1")}
                        />
                      </Col>
                      <Col md={2} className="text-left">
                        <span className="d-inline-block text-grey">Address 2 :</span>
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="Address 2"
                          
                          className="form-control"
                          {...register("adjuster_address2")}
                        />
                      </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                      <Col md={2} className="d-flex">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-70">City :</span>
                        </Col>  
                        <Col md={2}>
                          <Form.Control type="text"  placeholder="City" className="form-control " {...register("adjuster_city")} />
                        </Col>
                        <Col md={4} className="d-flex">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">State :</span>
                          <Form.Control as="select"  className="form-control City-Width-OP" {...register("adjuster_state")}
                            value={SelectedAdjusterState || ""}
                            onChange={(e) => setValue("adjuster_state", e.target.value)}
                          >
                          <option  value="">
                                    Select state
                                  </option>
                          {statesAbrs?.map(state => (
                            <option key={state.StateAbr} value={state.StateAbr}>
                              {state.name}
                            </option>
                          ))}
                            
                          </Form.Control>
                        </Col>
                        <Col md={4} className="d-flex">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">Zip :</span>
                          <Form.Control type="text"  placeholder="Zip" {...register("adjuster_zip")} />
                      </Col>
                      
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                      <Col md={2} className="text-left">
                        <span className="d-inline-block text-grey">Phone :</span>
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="(###) ###-####"
                          onKeyUp={(e) => handleChange(e,"adjuster_phone")}
                          className="form-control"
                          {...register("adjuster_phone")}
                        />
                      </Col>
                      <Col md={2} className="text-left">
                        <span className="d-inline-block text-grey">Extension :</span>
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="Extension"
                          className="form-control"
                          {...register("adjuster_extension_field")}
                        />
                      </Col>
                    </Row>
                    <Row className="align-items-center custom-margin-bottom mx-0">
                      <Col md={2} className="text-left">
                        <span className="d-inline-block text-grey">Fax :</span>
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="(###) ###-####"
                          onKeyUp={(e) => handleChange(e,"adjuster_fax")}
                          className="form-control"
                          {...register("adjuster_fax")}
                        />
                      </Col>
                      <Col md={2} className="text-left">
                        <span className="d-inline-block text-grey">Email :</span>
                      </Col>
                      <Col md={4}>
                        <Form.Control
                          type="text"
                          placeholder="Enter Email"
                          className="form-control"
                          {...register("adjuster_email")}
                        />
                      </Col>
                    </Row>
                   
                  </Tab.Pane>
                  <Tab.Pane eventKey="supervisor">
                  <Row className="mx-0">
                  <Col md={12}>
                    <Form.Control
                      type="text"
                     
                      placeholder="Type insurance company name to search directory then click an entry"
                      className="custom-margin-top custom-margin-bottom"
                      onKeyUp={()=> handleSearchInsurances(event,"supervisor")}
                      onBlur={handleBlur}
                     
                    />
                     { searchedSupervisors.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedSupervisors} selectedInsurance={handleSelectedInsuranceTabs}/>}
                  </Col>
                </Row>
                        <Row className="align-items-center custom-margin-bottom mx-0">
                          <Col md={2} className="text-left">
                            <span className="d-inline-block text-grey Text-w-NW-INS">First Name :</span>
                          </Col>
                          <Col md={4}>
                            <Form.Control
                              type="text"
                              placeholder="Enter first name"
                              className="form-control"
                              {...register("supervisor_first_name")}
                            />
                          </Col>
                          <Col md={2} className="text-left">
                            <span className="d-inline-block text-grey Text-w-NW-INS">Last Name :</span>
                          </Col>
                          <Col md={4}>
                            <Form.Control
                              type="text"
                              placeholder="Enter last name"
                              className="form-control"
                              {...register("supervisor_last_name")}
                            />
                          </Col>
                        </Row>
                        <Row className="align-items-center custom-margin-bottom mx-0">
                          <Col md={2} className="text-left">
                            <span className="d-inline-block text-grey">Address 1 :</span>
                          </Col>
                          <Col md={4}>
                            <Form.Control
                              type="text"
                              placeholder="Address 1"
                              className="form-control"
                              {...register("supervisor_address1")}
                            />
                          </Col>
                          <Col md={2} className="text-left">
                            <span className="d-inline-block text-grey">Address 2 :</span>
                          </Col>
                          <Col md={4}>
                            <Form.Control
                              type="text"
                              placeholder="Address 2"
                              className="form-control"
                              {...register("supervisor_address2")}
                            />
                          </Col>
                        </Row>
                        <Row className="align-items-center custom-margin-bottom mx-0">
                        <Col md={2} className="d-flex">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-70">City :</span>
                            </Col>  
                            <Col md={2}>
                              <Form.Control type="text"  placeholder="City" className="form-control " {...register("supervisor_city")} />
                            </Col>
                            <Col md={4} className="d-flex">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">State :</span>
                              <Form.Control as="select"  className="form-control City-Width-OP" {...register("supervisor_state")}
                              value={SelectedSupervisorState || ""}
                              onChange={(e) => setValue("supervisor_state", e.target.value)}
                              >
                              <option  value="">
                                    Select state
                                  </option>
                              {statesAbrs?.map(state => (
                                <option key={state.StateAbr} value={state.StateAbr}>
                                  {state.name}
                                </option>
                              ))}
                                
                              </Form.Control>
                            </Col>
                            <Col md={4} className="d-flex">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">Zip :</span>
                              <Form.Control type="text"  placeholder="Zip" {...register("supervisor_zip")} />
                            </Col>

                        </Row>
                        <Row className="align-items-center custom-margin-bottom mx-0">
                          <Col md={2} className="text-left">
                            <span className="d-inline-block text-grey">Phone :</span>
                          </Col>
                          <Col md={4}>
                            <Form.Control
                              type="text"
                              placeholder="(###) ###-####"
                              onKeyUp={(e) => handleChange(e,"supervisor_phone")}
                              className="form-control"
                              {...register("supervisor_phone")}
                            />
                          </Col>
                          <Col md={2} className="text-left">
                            <span className="d-inline-block text-grey">Extension :</span>
                          </Col>
                          <Col md={4}>
                            <Form.Control
                              type="text"
                              placeholder="Extension"
                              className="form-control"
                              {...register("supervisor_extension_field")}
                            />
                          </Col>
                        </Row>
                        <Row className="align-items-center custom-margin-bottom mx-0">
                          <Col md={2} className="text-left">
                            <span className="d-inline-block text-grey">Fax :</span>
                          </Col>
                          <Col md={4}>
                            <Form.Control
                              type="text"
                              placeholder="(###) ###-####"
                              onKeyUp={(e) => handleChange(e,"supervisor_fax")}
                              className="form-control"
                              {...register("supervisor_fax")}
                            />
                          </Col>
                          <Col md={2} className="text-left">
                            <span className="d-inline-block text-grey">Email :</span>
                          </Col>
                          <Col md={4}>
                            <Form.Control
                              type="text"
                              placeholder="Enter Email"
                              className="form-control"
                              {...register("supervisor_email")}
                            />
                          </Col>
                        </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="claim">
                          <Row className="align-items-center custom-margin-bottom mx-0">
                            <Col md={3} className="text-left">
                              <span className="d-inline-block text-grey">Coverage Type :</span>
                            </Col>
                            <Col md={9}>
                              <Form.Control as="select" className="" id="insurance_type_id"  {...register("insurance_type_id")}>
                                {insuranceTypes && insuranceTypes?.map(insuranceType => {
                                        if (!insuranceType.state || (insuranceType.state && insuranceType.state.id === litigation?.state?.id)) {
                                          return (
                                            <option key={insuranceType.id} value={insuranceType.id}>
                                              {insuranceType.name}
                                            </option>
                                          );
                                        }
                                        return null;
                                      })}
                              </Form.Control>
                            </Col>
                          </Row>
                          <Row className="align-items-center custom-margin-bottom mx-0">
                            <Col md={3} className="text-left">
                              <span className="d-inline-block text-grey">Liability Limit :</span>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="number"
                                placeholder="Enter Liability Limit"
                                className="form-control"
                                {...register("liability_limit")}
                              />
                            </Col>
                          </Row>
                          <Row className="align-items-center custom-margin-bottom mx-0">
                            <Col md={3} className="text-left">
                              <span className="d-inline-block text-grey">Liability Limit All :</span>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="number"
                                placeholder="Enter Liability Limit All"
                                className="form-control"
                                {...register("liability_limit_all")}
                              />
                            </Col>
                          </Row>
                          <Row className="align-items-center custom-margin-bottom mx-0">
                            <Col md={3} className="text-left">
                              <span className="d-inline-block text-grey">Policy # :</span>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                placeholder="Enter Policy Number"
                                className="form-control"
                                {...register("policy_number")}
                              />
                            </Col>
                          </Row>
                          <Row className="align-items-center custom-margin-bottom mx-0">
                            <Col md={3} className="text-left">
                              <span className="d-inline-block text-grey">Claim # :</span>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="text"
                                placeholder="Enter Claim Number"
                                className="form-control"
                                
                                {...register("claim_number")}
                              />
                            </Col>
                          </Row>
                          <Row className="align-items-center custom-margin-bottom mx-0">
                            <Col md={3} className="text-left">
                              <span className="d-inline-block text-grey">Confirmed Date :</span>
                            </Col>
                            <Col md={9}>
                              <Form.Control
                                type="date"
                                placeholder="Enter Confirmed Date"
                                className="form-control"
                                min="1000-01-01"
                                max="9999-12-31"
                                
                                {...register("confirmed_date")}
                              />
                            </Col>
                          </Row>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </div>
          </Form>
        </Tab.Container>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-between pt-4">
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="danger"  onClick={() => {
                                              deleteInsuranceHandler(insurance.id);
                                              handleClose();
                                            }}>Delete</Button>
        <Button form="insurance_contacts_form" type='submit' className="btn popup-heading-color save-btn-popup">Save</Button>
      </Modal.Footer>

      
      
    </Modal>
  );
}

export default InsuranceModal;
