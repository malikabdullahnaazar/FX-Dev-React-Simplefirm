import React, { useEffect, useState, useContext } from "react";
import ContactInfo from "./ContactInfo";
import PreviewPortalModal from "./modals/ClientPortalModal";
import SsnModalBody from "./modals/ssnModal";
import { getCaseId, getClientId } from "../../Utils/helper";
import axios from "axios";
import ClientNameModal from "./modals/modal";
import ModalBodyMessage from "./modals/clientMessageModal";
import { ClientDataContext } from "./shared/DataContext";
import "./../../../public/BP_resources/css/client-4.css";
import { useMediaQuery } from "react-responsive";
import ClientPortalButton from "./clientPortalButton";
import GenrateDocument from "../GenrateDocument/GenrateDocument";

const ClientRightPanelCards = ({
  CardsData,
  isPhoneShow,
  isEmailShow,
  isAddress1Show,
  isAddress2Show,
  isNameShow,
}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin = node_env === 'production' ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem('token');
  const currentCaseId = getCaseId();
  const clientId = getClientId();

  const [showClientPortalModal, setShowClientPortalModal] = useState(false);

  //Edit Modal Values
  const [showEditModal, setshowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("edit-name"); // State to store the active tab

  // Handle Edit Modal value
  const handleEditModalOpen = (value, tabKey = "edit-name") => {
    setshowEditModal(value);
    setActiveTab(tabKey); // Set the tab key based on which element is clicked
  };

  //Button Modal Values
  const [showSSNModal, setShowSSNModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);

  const [showGenreateDocumentModal, setShowGenreateDocumentModal] = useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);
  const [dropdownName , setDropdownName] = useState('')

  //handle BUTTON MODAL values to open
  const handleSsnModalOpen = (value) => {
    setShowSSNModal(value);
  };

  //to close the modals
  function handleClientPortalClose() {
    setShowClientPortalModal(false);
  }

  function handleSsnModalClose() {
    setShowSSNModal(false);
  }

  function handleEditModalClose() {
    setshowEditModal(false);
  }

  function handleEmailModalClose() {
    setShowEmailModal(false);
  }

  //handle BUTTON MODAL values to open for Email
  const handleEmailModalOpen = (value) => {
    setShowEmailModal(value);
  };

  function handleTextModalClose() {
    setShowTextModal(false);
  }

  //handle BUTTON MODAL values to open for text
  const handleTextModalOpen = (value) => {
    setShowTextModal(value);
  };

  // Media queries
  const isFiveCards = useMediaQuery({ minWidth: 2400 });
  const isFourCards = useMediaQuery({ minWidth: 2100, maxWidth: 2350 });
  const isThreeCards = useMediaQuery({ minWidth: 1850, maxWidth: 2100 });
  const isTwoCards = useMediaQuery({ minWidth: 1650, maxWidth: 1850 });
  const isOneCards = useMediaQuery({ minWidth: 1450, maxWidth: 1650 });
  const isNoCards = useMediaQuery({ minWidth: 1050, maxWidth: 1450 });

  return (
    <div>
        {/*<button
          onClick={() => setShowClientPortalModal(true)}
          className={`client-portal-btn btn btn-primary-lighter-2 portal-btn font-weight-semibold has-left-skew text-lg text-capitalize height-30 rounded-0 d-flex align-items-center justify-content-center col ml-lg-3 client-portalButton margin-top-9r mr-15 SkewX-client ${isFiveCards ? 'client-portal-btn-five' : isFourCards ? 'client-portal-btn-four' : isThreeCards ? 'client-portal-btn-three' : isTwoCards ? 'client-portal-btn-two' : isOneCards ? 'client-portal-btn-one': isNoCards ? 'client-portal-btn-no' : 'client-portal-btn'}`}
        >
          <span className="ic-custom">
            <i className="ic ic-24 ic-portal m-r-5 Anti-SkewX-client "></i>
          </span>
          <span
            style={{ marginBottom: "7px" }}
            className="Anti-SkewX-client mr-4"
          >
            Client portal settings
          </span>
           <span class="left-0 custom-1-client-CPS" id="skewed-client-portal"></span> 
        </button>*/}
        <ClientPortalButton/>
      {isNameShow && (
        <div className="m-r-5">
          <ContactInfo
            headingToShow={"CLIENT NAMES"}
            type={"names"}
            data={CardsData?.names}
            buttonText={"Chat Client"}
            buttonStyleClass={"ic ic-19 ic-chat-3d m-r-5"}
            modalEditShowValue={() => handleEditModalOpen(true, "edit-name")}
            modalButtonShowValue={handleTextModalOpen}
          />
        </div>
      )}
      {isPhoneShow && (
        <div className="m-r-5">
          <ContactInfo
            headingToShow={"CLIENT PHONE"}
            type={"phoneNumbers"}
            data={CardsData?.phone_numbers}
            buttonText={"Text Client"}
            buttonStyleClass={"ic ic-19 ic-sms-3d m-r-5"}
            modalEditShowValue={() => handleEditModalOpen(true, "edit-phone")}
            modalButtonShowValue={handleTextModalOpen}
            primary_phone={CardsData?.primaryPhone}
          />
        </div>
      )}
      {isEmailShow && (
        <div className="m-r-5">
          <ContactInfo
            headingToShow={"CLIENT EMAIL"}
            type={"emailAddresses"}
            data={CardsData?.Emails}
            buttonText={"Email Client"}
            buttonStyleClass={"ic ic-19 ic-email-3d m-r-5"}
            modalEditShowValue={() => handleEditModalOpen(true, "edit-emails")}
            modalButtonShowValue={handleEmailModalOpen}
            primary_email_id={CardsData?.primaryEmail?.primary_id}
          />
        </div>
      )}
      {isAddress1Show && (
        <div className="m-r-5">
          <ContactInfo
            headingToShow={"CLIENT ADDRESS 1"}
            type={"homeAddress"}
            data={CardsData?.Address1}
            buttonText={"Generate Document"}
            buttonStyleClass={"ic ic-19 ic-generate-document m-r-5"}
            modalEditShowValue={() =>
              handleEditModalOpen(true, "edit-address1")
            }
            modalButtonShowValue={()=> {
              setDropdownName('Client Address 1')
              setInstanceIdForGenragteDoc(CardsData?.Address1?.currentId)
              setShowGenreateDocumentModal(true);
            }}

            mail_contact_id={CardsData?.mailingContact?.primary_id}
          />
        </div>
      )}
      {isAddress2Show && (
        <div className="chat-communication-sec m-r-5">
          <ContactInfo
            headingToShow={"CLIENT ADDRESS 2"}
            type={"homeAddress2"}
            data={CardsData?.Address2}
            buttonText={"Generate Document"}
            buttonStyleClass={"ic ic-19 ic-generate-document m-r-5"}
            modalEditShowValue={() =>
              handleEditModalOpen(true, "edit-address2")
            }
            modalButtonShowValue={()=> {
              setDropdownName('Client Address 2')
              setInstanceIdForGenragteDoc(CardsData?.Address2?.currentId)
              setShowGenreateDocumentModal(true);
            }}
            mail_contact_id={CardsData?.mailingContact?.primary_id}
          />
        </div>
      )}
      <div className="identification-communication-sec m-r-5">
        <ContactInfo
          headingToShow={"CLIENT IDENTIFICATION"}
          type={"clientIdentification"}
          data={CardsData?.identification}
          buttonText={"View SSN"}
          buttonStyleClass={"ic ic-19 ic-ssn m-r-5"}
          modalButtonShowValue={handleSsnModalOpen}
          modalEditShowValue={() =>
            handleEditModalOpen(true, "edit-identification")
          }
        />
      </div>
      <div className="chat-communication-sec m-r-5">
        <ContactInfo
          headingToShow={"CLIENT SPOUSE CONTACT"}
          type={"spouseContact"}
          data={CardsData?.spouseContact}
          buttonText={"Generate Document"}
          buttonStyleClass={"ic ic-19 ic-generate-document m-r-5"}
          modalEditShowValue={() =>
            handleEditModalOpen(true, "edit-spouse-contact")
          }
          modalButtonShowValue={()=> {
            setDropdownName('Client Spouse Address')
            setInstanceIdForGenragteDoc(CardsData?.spouseContact?.currentId)
            setShowGenreateDocumentModal(true);
          }}
        />
      </div>
      <div className="chat-communication-sec m-r-5">
        <ContactInfo
          headingToShow={"CLIENT SPOUSE INFORMATION"}
          type={"spouseInformation"}
          data={CardsData?.spouseInfo}
          buttonText={"Email Contact"}
          buttonStyleClass={"ic ic-19 ic-email-3d m-r-5"}
          modalEditShowValue={() =>
            handleEditModalOpen(true, "edit-spouse-information")
          }
        />
      </div>
      <div className="chat-communication-sec m-r-5">
        <ContactInfo
          headingToShow={"EMERGENCY CONTACT"}
          type={"emergencyContact"}
          data={CardsData?.emergencyContact}
          buttonText={"Generate Document"}
          buttonStyleClass={"ic ic-19 ic-generate-document m-r-5"}
          modalEditShowValue={() =>
            handleEditModalOpen(true, "edit-emergency-contact")
          }
          modalButtonShowValue={()=> {
            setDropdownName('Client Emergency Contact')
            setInstanceIdForGenragteDoc(CardsData?.emergencyContact?.currentId)
            setShowGenreateDocumentModal(true)
          }}
        />
      </div>
      <div className="chat-communication-sec m-r-5">
        <ContactInfo
          headingToShow={"EMERGENCY INFORMATION"}
          type={"emergencyInformation"}
          data={CardsData?.emergencyInfo}
          buttonText={"Email Contact"}
          buttonStyleClass={"ic ic-19 ic-email-3d m-r-5"}
          modalEditShowValue={() =>
            handleEditModalOpen(true, "edit-emergency-information")
          }
          modalButtonShowValue={handleEmailModalOpen}
        />
      </div>
      {showClientPortalModal && (
        <PreviewPortalModal
          show={showClientPortalModal}
          handleClose={handleClientPortalClose}
        />
      )}
      {showSSNModal && (
        <SsnModalBody
          show={showSSNModal}
          handleClose={handleSsnModalClose}
          clientName={CardsData.first_name + " " + CardsData.last_name}
          clientSSN={CardsData.identification?.ssn || "Not Provided"}
        />
      )}
      {showEditModal && (
        <ClientNameModal
          show={showEditModal}
          handleClose={handleEditModalClose}
          clientData={CardsData}
          defaultTab={activeTab}
        />
      )}
      {showTextModal && (
        <ModalBodyMessage
          show={showTextModal}
          handleClose={handleTextModalClose}
          clientName={CardsData?.first_name + " " + CardsData?.last_name}
          typeComm={"Text"}
          mainHead={"TEXT"}
          client_pic={CardsData?.Avatars?.avatar1}
        />
      )}
      {showEmailModal && (
        <ModalBodyMessage
          show={showEmailModal}
          handleClose={handleEmailModalClose}
          clientName={CardsData?.first_name + " " + CardsData?.last_name}
          typeComm={"Email"}
          mainHead={"EMAIL"}
          client_pic={CardsData?.Avatars?.avatar1}
          primary_email={CardsData?.primaryEmail?.email}
        />
      )}

      {showGenreateDocumentModal && instanceIdForGenrateDoc && (
        <GenrateDocument
            show={true}
            handleClose={()=> {
              setDropdownName(null)
              setInstanceIdForGenragteDoc(null)
              setShowGenreateDocumentModal(false)
            }}
            dropdownName= {dropdownName}
            PageEntity="Client"
            instanceId={instanceIdForGenrateDoc}
          />
      )}
    </div>
  );
};

export default ClientRightPanelCards;
