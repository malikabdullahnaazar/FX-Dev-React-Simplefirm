import React, { useEffect, useState, useContext } from 'react';
import ClientName from "./clientName";
import ClientHistory from "./clientHistory";
import ClientImages from "./clientImages";
import ClientTable from "./clientTable";
import Button from './shared/button';
import ModalBodyMessage from './modals/clientMessageModal';
import ClientNameModal from './modals/modal';
import axios from "axios";
import { getCaseId, getClientId } from "../../Utils/helper";
import ContactInfo from './ContactInfo';
import { ClientDataContext } from './shared/DataContext';
import "./../../../public/BP_resources/css/client-4.css"
import { mediaRoute } from '../../Utils/helper';

export default function ClientInfo({ CardsData, clientNames, clientCases, isScreen14k, isScreen100_1, isScreen50_2, isScreen4k, isScreen5k, isScreen6k, isScreen7k, isScreen8k, isScreen9k, isScreen10k, isScreen11k, isScreen12k, isScreen13k, isScreen50, isScreen57, isScreen67, isScreen75, isScreen80, isScreen90, isScreen100, isNameShow, isPhoneShow, isEmailShow, isAddress1Show, isAddress2Show }) {


  //Button Modal Values
  const [showChatModal, setShowChatModal] = useState(false);
  const [showEditModal, setshowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('edit-name'); // State to store the active tab
  const [showTextModal, setShowTextModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  function handleChatModalClose() {
    setShowChatModal(false);

  }

  //handle BUTTON MODAL values to open
  const handleChatModalOpen = () => {
    setShowChatModal(true);
  }

  // Handle Edit Modal value
  const handleEditModalOpen = (value, tabKey = 'edit-name') => {
    setshowEditModal(value);
    setActiveTab(tabKey); // Set the tab key based on which element is clicked
  }

  function handleEditModalClose() {
    setshowEditModal(false);
  }

  function handleTextModalClose() {
    setShowTextModal(false);
  }

  //handle BUTTON MODAL values to open for text
  const handleTextModalOpen = (value) => {
    setShowTextModal(value);
  }

  function handleEmailModalClose() {
    setShowEmailModal(false);
  }

  //handle BUTTON MODAL values to open for Email
  const handleEmailModalOpen = (value) => {
    setShowEmailModal(value);
  }


  {/*Sample data For ClientHostory Comp */ }
  const client = {
    first_name: "Iqrma",
    last_name: "Amir"
  }

  {/*Sample data For clientTable Comp */ }
  const sortedAllMsgData = [
    {
      type: "Note",
      obj: {
        created_by: {
          first_name: "John",
          last_name: "Doe",
          bp_userprofile: {
            account_type: "Attorney",
            bp_attorney_userprofile: {
              profile_pic: {
                url: "https://via.placeholder.com/150"
              }
            }
          }
        },
        timestamp: new Date().toISOString(),
        text: "This is a note message. It contains important information.",
        user: 1,
      },
    },
    {
      type: "Email",
      obj: {
        created_by: {
          first_name: "Jane",
          last_name: "Smith",
          bp_userprofile: {
            account_type: "Staff",
            bp_attorneystaff_userprofile: {
              profile_pic: {
                url: "https://via.placeholder.com/150"
              }
            }
          }
        },
        timestamp: new Date().toISOString(),
        subject: "This is an email subject. It provides a brief overview of the email content.",
        user: 2,
      },
    },
    {
      type: "ChatMessage",
      obj: {
        created_by: {
          first_name: "Emily",
          last_name: "Johnson",
          bp_userprofile: {
            account_type: "Attorney",
            bp_attorney_userprofile: {
              profile_pic: {
                url: "https://via.placeholder.com/150"
              }
            }
          }
        },
        timestamp: new Date().toISOString(),
        text: "This is a chat message. It is a short and quick communication.",
        user: 3,
      },
    },
  ];

  const clientTab = {
    client_user: 1,
    first_name: "Michael",
    last_name: "Brown",
    profile_pic: {
      url: "https://via.placeholder.com/150"
    }
  };




  return (
    <>{
      typeof (CardsData) == typeof (false) ? <></> :
        <div style={{ marginTop: isScreen8k || isScreen9k || isScreen10k || isScreen11k || isScreen12k || isScreen13k || isScreen14k ? "5px" : "0" }}>
          <div className="col-lg-custome-20 col-md-16 col-sm-16 col-16">
            <div className="overflow-hidden row table-messages-wrapper no-gutters flex-g-1 f-gap-05">
              <div className="col has-white-bg" style={{ paddingLeft: "12px", paddingRight: "10px" }}>
                <ClientHistory
                  first_name={CardsData?.first_name}
                  last_name={CardsData?.last_name}
                  clientCasesProp={clientCases}
                />
              </div>
              {isNameShow && <div className="min-w-260px-client">
                <div onClick={handleEditModalOpen}>
                  <ClientName
                    first_name={CardsData.first_name}
                    middle_name={CardsData.middle_name}
                    last_name={CardsData.last_name}
                  />
                </div>
                <div onClick={() => handleChatModalOpen(true, "edit-name")}>
                  <Button
                    showButton={true}
                    icon="ic ic-19 ic-chat-3d m-r-5"
                    buttonText="Chat Client"
                  />
                </div>
              </div>
              }
              {isPhoneShow && <div>
                <ContactInfo headingToShow={"CLIENT PHONE"} type={'phoneNumbers'} data={CardsData?.phone_numbers} buttonText={"Text Client"} buttonStyleClass={"ic ic-19 ic-sms-3d m-r-5"} modalEditShowValue={() => handleEditModalOpen(true, 'edit-phone')} modalButtonShowValue={handleTextModalOpen} topMargin={false} primary_phone={CardsData?.primaryPhone} />
              </div>
              }
              {isEmailShow && <div>
                <ContactInfo headingToShow={"CLIENT EMAIL"} type={'emailAddresses'} data={CardsData?.Emails} buttonText={"Email Client"} buttonStyleClass={"ic ic-19 ic-email-3d m-r-5"} modalEditShowValue={() => handleEditModalOpen(true, 'edit-emails')} modalButtonShowValue={handleEmailModalOpen} topMargin={false} primary_email_id={CardsData?.primaryEmail?.primary_id} />
              </div>
              }
              {isAddress1Show &&
                <div>
                  <ContactInfo headingToShow={"CLIENT ADDRESS 1"} type={'homeAddress'} data={CardsData?.Address1} buttonText={"Generate Document"} buttonStyleClass={"ic ic-19 ic-generate-document m-r-5"} modalEditShowValue={() => handleEditModalOpen(true, 'edit-address1')} topMargin={false} mail_contact_id={CardsData?.mailingContact?.primary_id} />
                </div>
              }
              {isAddress2Show &&
                <div>
                  <ContactInfo headingToShow={"CLIENT ADDRESS 2"} type={'homeAddress2'} data={CardsData?.Address2} buttonText={"Generate Document"} buttonStyleClass={"ic ic-19 ic-generate-document m-r-5"} modalEditShowValue={() => handleEditModalOpen(true, 'edit-address2')} topMargin={false} mail_contact_id={CardsData?.mailingContact?.primary_id} />
                </div>
              }
              <div style={{ marginLeft: "-5px" }}>
                <ClientImages modalEditShowValue={() => handleEditModalOpen(true, 'edit-avatar')} middle_name={CardsData?.middle_name} first_name={CardsData?.client?.first_name} last_name={CardsData?.client?.last_name} Avatars={CardsData?.Avatars} photos={CardsData?.photos} image1={CardsData.Avatars?.avatar1} image2={CardsData.Avatars?.avatar2} image3={CardsData.Avatars?.avatar3} />
              </div>
            </div>
            {/* table components */}
            <div className="overflow-hidden row table-messages-wrapper no-gutters flex-g-1 f-gap-05" style={{ paddingTop: "5px", paddingRight: "5px", height: isScreen50 ? "31rem" : isScreen57 ? "38rem" : isScreen67 ? "45.2rem" : isScreen75 ? "52.2rem" : isScreen80 ? "53rem" : isScreen90 ? "60rem" : isScreen14k ? "32rem" : isScreen100 ? "68rem" : "31rem", marginTop: isScreen100 ? "-0.2rem" : "", }}>
              <div className="container-PLC">
                {CardsData?.CommPhoto1?.photoURL ? (
                  <div className="scalable-box-image">
                    <img src={mediaRoute(CardsData?.CommPhoto1?.photoURL)} style={{ width: "100%", height: "100%", maxHeight: "100%", maxWidth: "100%" }} />
                  </div>
                ) : (
                  <div className="scalable-box overflow-hidden">
                    <svg width="90px" height={"5rem"} viewBox="10 2 4 22" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <g>
                          <path
                            d="M8,13L12,18L10,18L9,17L8,18L7,17L6,18L4,18L8,13Z"
                            style={{ fill: 'rgb(220,225,230)', fillRule: 'nonzero' }}
                          />
                          <path
                            d="M1,20L8,13L15,20"
                            style={{ fill: 'none', stroke: 'rgb(165,175,190)', strokeWidth: '2px' }}
                          />
                          <path
                            d="M23,20L19,16L12,23"
                            style={{ fill: 'none', stroke: 'rgb(165,175,190)', strokeWidth: '2px' }}
                          />
                          <path
                            d="M8.508,5C7.729,5 7.132,5.482 6.762,6.109C5.99,5.876 5.296,6.344 5.113,7.16C4.499,7.348 4,7.828 4,8.5C4,9.323 4.677,10 5.5,10L10.5,10C11.323,10 12,9.323 12,8.5C12,7.718 11.371,7.105 10.604,7.043C10.55,5.918 9.645,5 8.508,5Z"
                            style={{ fill: 'rgb(220,225,230)', fillRule: 'nonzero' }}
                          />
                          <path
                            d="M17.212,5.339C17.114,5.183 16.886,5.183 16.788,5.339L16.282,6.149C16.274,6.162 16.261,6.172 16.245,6.177C16.23,6.182 16.213,6.181 16.198,6.173L15.353,5.724C15.19,5.637 14.993,5.751 14.986,5.936L14.953,6.87C14.952,6.892 14.943,6.913 14.928,6.928C14.913,6.943 14.892,6.952 14.87,6.953L13.936,6.986C13.751,6.992 13.637,7.19 13.724,7.353L14.173,8.199C14.181,8.213 14.182,8.229 14.177,8.245C14.172,8.26 14.162,8.274 14.149,8.282L13.339,8.788C13.183,8.886 13.183,9.114 13.339,9.212L14.149,9.718C14.163,9.726 14.172,9.74 14.177,9.755C14.182,9.77 14.181,9.787 14.173,9.802L13.724,10.647C13.637,10.81 13.751,11.008 13.936,11.014L14.87,11.047C14.892,11.048 14.913,11.057 14.928,11.072C14.943,11.087 14.952,11.108 14.953,11.13L14.986,12.064C14.993,12.249 15.19,12.363 15.353,12.276L16.198,11.827C16.213,11.819 16.23,11.818 16.245,11.823C16.261,11.828 16.274,11.838 16.282,11.851L16.788,12.661C16.886,12.817 17.114,12.817 17.212,12.661L17.717,11.852C17.726,11.838 17.74,11.828 17.756,11.822C17.77,11.817 17.787,11.819 17.801,11.827L18.647,12.276C18.81,12.363 19.008,12.249 19.014,12.064L19.047,11.13C19.048,11.108 19.057,11.087 19.072,11.072C19.087,11.057 19.108,11.048 19.13,11.047L20.064,11.014C20.249,11.008 20.363,10.81 20.276,10.647L19.827,9.801C19.819,9.787 19.818,9.771 19.823,9.755C19.828,9.74 19.838,9.726 19.851,9.718L20.661,9.212C20.817,9.114 20.817,8.886 20.661,8.788L19.851,8.282C19.838,8.274 19.828,8.26 19.823,8.245C19.818,8.229 19.819,8.213 19.827,8.199L20.276,7.353C20.363,7.19 20.249,6.992 20.064,6.986L19.13,6.953C19.108,6.952 19.087,6.943 19.072,6.928C19.057,6.913 19.048,6.892 19.047,6.87L19.014,5.936C19.008,5.751 18.81,5.637 18.647,5.724L17.802,6.173C17.787,6.181 17.77,6.182 17.755,6.177C17.74,6.172 17.726,6.162 17.718,6.149L17.212,5.339Z"
                            style={{ fill: 'rgb(165,175,190)', fillRule: 'nonzero' }}
                          />
                          <circle cx="17" cy="9" r="2" style={{ fill: 'white' }} />
                        </g>
                      </g>
                    </svg>
                  </div>
                )}
                {CardsData?.CommPhoto2?.photoURL ? (
                  <div className="scalable-box-image mt-1 overflow-hidden">
                    <img src={mediaRoute(CardsData?.CommPhoto2?.photoURL)} style={{ width: "100%", height: "100%", maxHeight: "100%", maxWidth: "100%" }} />
                  </div>
                ) : (
                  <div className="scalable-box mt-1 overflow-hidden">
                    <svg width="109px" height={"5rem"} viewBox="10 2 4 22" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <g>
                          <path
                            d="M8,13L12,18L10,18L9,17L8,18L7,17L6,18L4,18L8,13Z"
                            style={{ fill: 'rgb(220,225,230)', fillRule: 'nonzero' }}
                          />
                          <path
                            d="M1,20L8,13L15,20"
                            style={{ fill: 'none', stroke: 'rgb(165,175,190)', strokeWidth: '2px' }}
                          />
                          <path
                            d="M23,20L19,16L12,23"
                            style={{ fill: 'none', stroke: 'rgb(165,175,190)', strokeWidth: '2px' }}
                          />
                          <path
                            d="M8.508,5C7.729,5 7.132,5.482 6.762,6.109C5.99,5.876 5.296,6.344 5.113,7.16C4.499,7.348 4,7.828 4,8.5C4,9.323 4.677,10 5.5,10L10.5,10C11.323,10 12,9.323 12,8.5C12,7.718 11.371,7.105 10.604,7.043C10.55,5.918 9.645,5 8.508,5Z"
                            style={{ fill: 'rgb(220,225,230)', fillRule: 'nonzero' }}
                          />
                          <path
                            d="M17.212,5.339C17.114,5.183 16.886,5.183 16.788,5.339L16.282,6.149C16.274,6.162 16.261,6.172 16.245,6.177C16.23,6.182 16.213,6.181 16.198,6.173L15.353,5.724C15.19,5.637 14.993,5.751 14.986,5.936L14.953,6.87C14.952,6.892 14.943,6.913 14.928,6.928C14.913,6.943 14.892,6.952 14.87,6.953L13.936,6.986C13.751,6.992 13.637,7.19 13.724,7.353L14.173,8.199C14.181,8.213 14.182,8.229 14.177,8.245C14.172,8.26 14.162,8.274 14.149,8.282L13.339,8.788C13.183,8.886 13.183,9.114 13.339,9.212L14.149,9.718C14.163,9.726 14.172,9.74 14.177,9.755C14.182,9.77 14.181,9.787 14.173,9.802L13.724,10.647C13.637,10.81 13.751,11.008 13.936,11.014L14.87,11.047C14.892,11.048 14.913,11.057 14.928,11.072C14.943,11.087 14.952,11.108 14.953,11.13L14.986,12.064C14.993,12.249 15.19,12.363 15.353,12.276L16.198,11.827C16.213,11.819 16.23,11.818 16.245,11.823C16.261,11.828 16.274,11.838 16.282,11.851L16.788,12.661C16.886,12.817 17.114,12.817 17.212,12.661L17.717,11.852C17.726,11.838 17.74,11.828 17.756,11.822C17.77,11.817 17.787,11.819 17.801,11.827L18.647,12.276C18.81,12.363 19.008,12.249 19.014,12.064L19.047,11.13C19.048,11.108 19.057,11.087 19.072,11.072C19.087,11.057 19.108,11.048 19.13,11.047L20.064,11.014C20.249,11.008 20.363,10.81 20.276,10.647L19.827,9.801C19.819,9.787 19.818,9.771 19.823,9.755C19.828,9.74 19.838,9.726 19.851,9.718L20.661,9.212C20.817,9.114 20.817,8.886 20.661,8.788L19.851,8.282C19.838,8.274 19.828,8.26 19.823,8.245C19.818,8.229 19.819,8.213 19.827,8.199L20.276,7.353C20.363,7.19 20.249,6.992 20.064,6.986L19.13,6.953C19.108,6.952 19.087,6.943 19.072,6.928C19.057,6.913 19.048,6.892 19.047,6.87L19.014,5.936C19.008,5.751 18.81,5.637 18.647,5.724L17.802,6.173C17.787,6.181 17.77,6.182 17.755,6.177C17.74,6.172 17.726,6.162 17.718,6.149L17.212,5.339Z"
                            style={{ fill: 'rgb(165,175,190)', fillRule: 'nonzero' }}
                          />
                          <circle cx="17" cy="9" r="2" style={{ fill: 'white' }} />
                        </g>
                      </g>
                    </svg>
                  </div>
                )}
              </div>
              <div className="col w-100 has-white-bg" >
                <div>
                  <ClientTable client={CardsData?.first_name + " " + CardsData?.last_name} sortedAllMsgData={sortedAllMsgData} isScreen100={isScreen100 && true} isScreen90={isScreen90 && true} isScreen80={isScreen80 && true} isScreen75={isScreen75 && true} isScreen57={isScreen57 && true} isScreen50={isScreen50 && true} isScreen67={isScreen67 && true} />
                </div>
              </div>
            </div>
          </div>
          {showChatModal && <ModalBodyMessage show={showChatModal} handleClose={handleChatModalClose} clientName={clientNames.first_name + " " + clientNames.last_name} typeComm={'Chat'} mainHead={'CHAT'} client_pic={CardsData.Avatars?.avatar1} />}
          {showTextModal && <ModalBodyMessage show={showTextModal} handleClose={handleTextModalClose} clientName={CardsData.first_name + " " + CardsData.last_name} typeComm={'Text'} mainHead={'TEXT'} primary_number={CardsData.primaryPhone?.phone_number} client_pic={CardsData.Avatars?.avatar1} />}
          {showEditModal && <ClientNameModal show={showEditModal} handleClose={handleEditModalClose} clientData={CardsData} defaultTab={activeTab} />}
          {showEmailModal && <ModalBodyMessage show={showEmailModal} handleClose={handleEmailModalClose} clientName={CardsData.first_name + " " + CardsData.last_name} typeComm={'Email'} mainHead={'EMAIL'} primary_email={CardsData.primaryEmail?.email} client_pic={CardsData.Avatars?.avatar1} />}
        </div >}
    </>
  )
}


