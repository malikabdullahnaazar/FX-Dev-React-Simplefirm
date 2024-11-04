import React, { useEffect, useState, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import { Modal, Nav, Tab, Table, TabPane } from "react-bootstrap";
import api, { cancelPendingRequests } from "../../api/api";
import "../../../public/BP_resources/css/client-4.css";
import "../../../public/BP_resources/css/litigation.css";
import {
  getCaseId,
  getClientId,
  standardFormatDateTime,
} from "../../../src/Utils/helper";
import avatar from "../../../public/bp_assets/img/avatar_new.svg"
import { ClientDataContext } from "./shared/DataContext";
import axios from 'axios';

const ClientTable = ({ sortedAllMsgData, client, isScreen100, isScreen90, isScreen80, isScreen75, isScreen57, isScreen50, isScreen67 }) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("chat"); // State to track active tab
  const clientId = getClientId();
  const caseId = getCaseId();
  const [allEmails, setAllEmails] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [textMessages, setTextMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  // Calculate real message counts
  const chatMessageCount = allMessages?.filter(message => message?.type === "ChatMessage").length;
  const textMessageCount = allMessages?.filter(message => message?.type === "TextMessage" || message?.type === "IncomingTextMessage").length;
  const emailMessageCount = allEmails.length;

  const { isClientDataUpdated, setIsClientDataUpdated } =
    useContext(ClientDataContext);
  const [firstTimeMessageData, setFirstTimeMessageData] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/client/all_messages/?client_id=${clientId}&case_id=${caseId}`,
        {
          headers: { Authorization: token },
        }
      );
      if (firstTimeMessageData) {
        setAllMessages(response?.data?.all_messages);
        setFirstTimeMessageData(false);
      }
      if (isClientDataUpdated) {
        setAllMessages(response?.data?.all_messages);
        isClientDataUpdated(false);
      }
      if (allMessages.length > 0) {
        
        setChatMessages(
          allMessages.map((message) => {
            if (message.type === "ChatMessage") {
              return message;
            }
          })
        );
        setTextMessages(
          allMessages.map((message) => {
            if (message.type === "TextMessage") {
              return message;
            }
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmailsAPI = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/client-page/fetch-mails/${clientId}/`,
        {
          headers: { Authorization: token },
        }
      );
      if (firstTimeMessageData) {
        setAllEmails(response.data);
        setFirstTimeMessageData(false);
      }
      if (isClientDataUpdated) {
        setAllEmails(response.data);
        isClientDataUpdated(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchEmailsAPI();
    if (isClientDataUpdated) {
      setIsClientDataUpdated(false);
    }

    return () => {
      cancelPendingRequests();
    };
  }, [clientId, caseId, isClientDataUpdated, allEmails, allMessages]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId); // Update active tab when clicked
  };

  // Initialize fake rows based on screen size
  const initialFakeRows = isScreen100
    ? 30
    : isScreen90
      ? 27
      : isScreen80
        ? 25
        : isScreen75
          ? 21
          : isScreen67
            ? 20
            : isScreen57
              ? 16
              : isScreen50
                ? 15
                : 15;

  // Subtract real message count from fake rows for each tab
  const chatFakeRows = Math.max(0, initialFakeRows - chatMessageCount);
  const textFakeRows = Math.max(0, initialFakeRows - textMessageCount);
  const emailFakeRows = Math.max(0, initialFakeRows - emailMessageCount);
  
  return (
    <div>
      {/* Nav Tabs Email, Text, Chat */}

      <Tab.Container defaultActiveKey={"chat"}>
        <div>
          <Nav
            className="nav nav-tabs flex-nowrap  background-main-10"
            id="nav-tab"
            role="tablist"
            style={{ width: "100%" }}
          >
            <Nav.Link eventKey="chat" className="nav-item nav-link first-child">
              <i className="ic ic-19 ic-chat-3d m-r-5"></i>
              <span className="text">Chat</span>
            </Nav.Link>
            <Nav.Link eventKey="text" className="nav-item nav-link">
              <i className="ic ic-19 ic-sms-3d m-r-5"></i>
              <span className="text">Text</span>
            </Nav.Link>
            <Nav.Link eventKey="email" className="nav-item nav-link">
              <i className="ic ic-19 ic-email-3d m-r-5"></i>
              <span className="text">Email</span>
            </Nav.Link>
            <div className="background-main-10 height-25 d-flex justify-content-center" style={{paddingTop:"3px", width: isScreen100 ? "70%" : "75%" }}>
              <h4 className="client-contact-title d-flex h-100">
                Client Communication
              </h4>
            </div>
          </Nav>
        </div>
        <Tab.Content style={{ height: isScreen50 ? "30rem" : isScreen57 ? "36rem" : isScreen67 ? "43rem" : isScreen75 ? "51rem" : isScreen80 ? "51rem" : isScreen90 ? "58rem" : isScreen100 ? "65rem" : "30rem", overflowY: "scroll", scrollbarWidth: "none" }}>
          <TabPane eventKey={"chat"}>
            <div
              className="tab-pane fade show active cutom1111"
              id="client-tab-content"
              role="tabpanel"
              aria-labelledby="client-tab"
            >
              {/* Chat Tab */}

              {/* added this table to make the header separate to put the scroll this table just showing body */}
              <div
                className="table--no-card rounded-0 border-0 w-100 custom1212"
                style={{
                  overflow: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <table className="table table-borderless table-striped table-earning"
                >
                  <thead className="sticked-head">
                    <tr id="tb-header">
                      <th scope="col" className="width-1"></th>
                      <th className="width-6-padding-left-42 text-center">
                        Sent by
                      </th>
                      <th className="width-6 text-center">Sent To</th>
                      <th className="width-6 text-center">Received</th>
                      <th className="width-1"></th>
                      <th className="width-78 text-center">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody id="group_chat_body"
                  >
                    {allMessages.length > 0 ? (
                      allMessages?.map((message, index) => {
                        if (message?.type === "ChatMessage") {
                          return (
                            <tr key={message?.obj?.id}>
                              {/* Counter */}
                              <td scope="row">{index + 1}</td>

                              {/* Sent by */}
                              {message?.obj?.user?.bp_userprofile
                                ?.account_type === "Attorney" ? (
                                <td className="text-black td-autosize d-flex align-items-center">
                                  <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    {message?.obj?.user?.bp_userprofile
                                      ?.bp_attorney_userprofile?.profile_pic ? (
                                      <img
                                        className="theme-ring"
                                        src={
                                          message?.obj?.user.bp_userprofile
                                            ?.bp_attorney_userprofile
                                            ?.profile_pic
                                        }
                                        alt="Attorney Avatar"
                                      />
                                    ) : (
                                      <img
                                        className=""
                                        src={avatar}
                                        alt="Default Avatar"
                                      />
                                    )}
                                  </span>
                                  <span className="ml-2 text-black">
                                    {`${message?.obj?.user?.first_name} ${message?.obj?.user?.last_name}`}
                                  </span>
                                </td>
                              ) : (
                                <td className="text-black td-autosize d-flex align-items-center">
                                  <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    {message?.obj?.user
                                      ?.bp_attorneystaff_userprofile
                                      ?.profile_pic ? (
                                      <img
                                        className="theme-ring"
                                        src={
                                          message?.obj?.user
                                            ?.bp_attorneystaff_userprofile
                                            ?.profile_pic
                                        }
                                        alt="Staff Avatar"
                                      />
                                    ) : (
                                      <img
                                        className=""
                                        src={avatar}
                                        alt="Default Avatar"
                                      />
                                    )}
                                  </span>
                                  <span className="ml-2 text-black">
                                    {`${message?.obj?.user?.first_name || ""} ${message?.obj?.user?.last_name || ""}`}
                                  </span>
                                </td>
                              )}

                              {/* Sent To */}
                              <td className="td-autosize"></td>

                              {/* Received */}
                              <td className="white-space-nowrap">
                                {new Date(
                                  message?.obj?.timestamp
                                ).toLocaleDateString()}{" "}
                                <b className="text-transform-font-weight">
                                  {new Date(
                                    message?.obj?.timestamp
                                  ).toLocaleTimeString()}
                                </b>
                              </td>

                              {/* Icon */}
                              <td className="padding-010">
                                <i className="ic ic-19 ic-chat-3d m-r-5"></i>
                              </td>

                              {/* Message Body */}
                              {message?.obj?.content?.length > 50 ? (
                                <td className="text-black white-space-text-overflow text-left">
                                  {message?.obj?.content?.slice(0, 50)}
                                </td>
                              ) : (
                                <td className="text-black white-space-text-overflow text-left">
                                  {message?.obj?.content?.slice(0, 50)}
                                </td>
                              )}
                            </tr>
                          );
                        }
                        return null; // Return null if condition is not met
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No messages available
                        </td>
                      </tr>
                    )}

                    {[...Array(chatFakeRows)].map((_, index) => (
                      <tr key={`additional-${index}`} className="fake-row-2" style={{ height: "25px" }}>
                        <td colSpan="12">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPane>
          <TabPane eventKey={"text"}>
            <div
              className="tab-pane fade show active cutom1111"
              id="client-tab-content"
              role="tabpanel"
              aria-labelledby="client-tab"
            >
              {/* Chat Tab */}

              {/* added this table to make the header separate to put the scroll this table just showing body */}
              <div
                className="table--no-card rounded-0 border-0 w-100 custom1212"

              >
                <table className="table table-borderless table-striped table-earning"
                >
                  <thead className="sticked-head">
                    <tr id="tb-header">
                      <th scope="col" className="width-1"></th>
                      <th className="width-6-padding-left-42 text-center">
                        Sent by
                      </th>
                      <th className="width-6 text-center">Sent To</th>
                      <th className="width-6 text-center">Received</th>
                      <th className="width-1"></th>
                      <th className="width-78 text-center">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody id="group_chat_body"
                  >
                    {allMessages.length > 0 ? (
                      allMessages?.map((message, index) => {
                        if (
                          message?.type === "TextMessage" ||
                          message?.type === "IncomingTextMessage"
                        ) {
                          return (
                            <tr key={message?.obj?.id}>
                              {/* Counter */}
                              <td scope="row">{index + 1}</td>

                              {/* Sent by */}
                              {message?.obj?.sender?.bp_userprofile
                                ?.account_type === "Attorney" ? (
                                <td className="text-black td-autosize d-flex align-items-center">
                                  <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    {message?.obj?.sender?.bp_userprofile
                                      ?.bp_attorney_userprofile?.profile_pic ? (
                                      <img
                                        className="theme-ring"
                                        src={
                                          message?.obj?.sender.bp_userprofile
                                            ?.bp_attorney_userprofile
                                            ?.profile_pic
                                        }
                                        alt="Attorney Avatar"
                                      />
                                    ) : (
                                      <img
                                        className=""
                                        src={avatar}
                                        alt="Default Avatar"
                                      />
                                    )}
                                  </span>
                                  <span className="ml-2 text-black">
                                    {`${message?.obj?.sender?.first_name} ${message?.obj?.sender?.last_name}`}
                                  </span>
                                </td>
                              ) : (
                                <td className="text-black td-autosize d-flex align-items-center">
                                  <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    {message?.obj?.sender
                                      ?.bp_attorneystaff_userprofile
                                      ?.profile_pic ? (
                                      <img
                                        className="theme-ring"
                                        src={
                                          message?.obj?.sender
                                            ?.bp_attorneystaff_userprofile
                                            ?.profile_pic
                                        }
                                        alt="Staff Avatar"
                                      />
                                    ) : (
                                      <img
                                        className=""
                                        src={avatar}
                                        alt="Default Avatar"
                                      />
                                    )}
                                  </span>
                                  <span className="ml-2 text-black">
                                    {`${message?.obj?.sender?.first_name || ""} ${message?.obj?.sender?.last_name || ""}`}
                                  </span>
                                </td>
                              )}

                              {/* Sent To */}
                              <td className="td-autosize">
                                {message["phone_no:"]}
                              </td>

                              {/* Received */}
                              <td className="white-space-nowrap">
                                {new Date(
                                  message?.obj?.created_at
                                ).toLocaleDateString()}{" "}
                                <b className="text-transform-font-weight">
                                  {new Date(
                                    message?.obj?.created_at
                                  ).toLocaleTimeString()}
                                </b>
                              </td>

                              {/* Icon */}
                              <td className="padding-010">
                                <i className="ic ic-19 ic-sms-3d m-r-5"></i>
                              </td>

                              {/* Message Body */}
                              {message.obj.body.length > 50 ? (
                                <td className="text-black white-space-text-overflow text-left">
                                  {message?.obj?.body?.slice(0, 50)}
                                </td>
                              ) : (
                                <td className="text-black white-space-text-overflow text-left">
                                  {message?.obj?.body?.slice(0, 50)}
                                </td>
                              )}
                            </tr>
                          );
                        }
                        return null; // Return null if condition is not met
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No messages available
                        </td>
                      </tr>
                    )}

                    {[...Array(textFakeRows)].map((_, index) => (
                      <tr key={`additional-${index}`} className="fake-row-2" style={{ height: "25px" }}>
                        <td colSpan="12">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPane>
          <TabPane eventKey={"email"}>
            <div
              className="tab-pane fade show active cutom1111"
              id="client-tab-content"
              role="tabpanel"
              aria-labelledby="client-tab"
            >
              {/* Added table to the email tab, similar to Chat and Text tabs */}
              <div
                className="table--no-card rounded-0 border-0 w-100 custom1212"
              >
                <table
                  className="table table-borderless table-striped table-earning "
                >
                  <thead className="sticked-head">
                    <tr id="tb-header">
                      <th scope="col" className="width-1"></th>
                      <th className="width-6-padding-left-42 text-center">Sender</th>
                      <th className="width-6 text-center">Date Received</th>
                      <th className="width-10 text-center">Subject</th>
                      <th className="width-78 text-center">Message</th>
                    </tr>
                  </thead>
                  <tbody id="group_chat_body">
                    {allEmails.length > 0 ? (
                      allEmails.map((email, index) => (
                        <tr key={index}>
                          {/* Row Number */}
                          <td scope="row">{index + 1}</td>

                          {/* Sender */}
                          <td className="text-black td-autosize text-left">
                            {email.sender}
                          </td>

                          {/* Date Received */}
                          <td className="white-space-nowrap text-center">
                            {standardFormatDateTime(email.date_received)}
                          </td>

                          {/* Subject */}
                          <td className="text-black white-space-text-overflow text-left">
                            {email.subject}
                          </td>

                          {/* Message Body */}
                          <td className="text-black white-space-text-overflow text-left">
                            {email.body.length > 50
                              ? `${email.body.slice(0, 50)}...`
                              : email.body}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No emails available
                        </td>
                      </tr>
                    )}

                    {[...Array(emailFakeRows)].map((_, index) => (
                      <tr key={`additional-${index}`} className="fake-row-2" style={{ height: "25px" }}>
                        <td colSpan="12">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPane>
        </Tab.Content>
      </Tab.Container>

      {/* </div > */}
    </div>
  );
};

export default ClientTable;
