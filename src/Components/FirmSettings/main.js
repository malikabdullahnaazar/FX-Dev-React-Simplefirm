import React, { useEffect, useState } from "react";
import ActionBarComponent from "../common/ActionBarComponent";
import "./main.css";
import UserAccounts from "./user-accounts/user-account";
import UserPermissions from "./user-permissions/user-permissions";
import UserRoles from "./user-roles/user-roles";
import UserAvatar from "./user-avatar/user-avatar";
import RedFlagAuto from "./red-flag-auto/red-flag-auto";
import DefaultHeader from "./common/default-header";
import CaseTypeRoles from "./case-type-roles/case-type-roles";
import CoPilot from "./co-pilot/co-pilot";
import ClientCommunication from "./client-communication/client-comm";
import HippaMaker from "./hippa-maker/hippa-maker";
import Values from "./values/values";
import AutoTasks from "./auto-taks-tab/auto-task";
import Shakespare from "./shakespare/shakespare";
import FirmAddress from "./firm-address/firm-address";
import AddUsers from "./add-user-tab/add-user";
import AddTeams from "./add-team-tab/add-team";
import LetterTemplates from "./letter-templates/letter-templates";
import FirmBranding from "./firm-branding/firm-branding";
import OfficeIntegration from "./office-integration/office-integration";
import Calendars from "./calendars/calendars";
import GoogleDocs from "./google-docs/google-docs";
import CloudStorage from "./cloud-storage/cloudstorage";

function FirmSettingsMain() {
  const [activeTab, setActiveTab] = useState("user-accounts");
  const sidebarItems = [
    { id: "user-accounts", name: "User Accounts", component: <UserAccounts /> },
    {
      id: "user-permissions",
      name: "User Permissions",
      component: <UserPermissions />,
    },
    { id: "user-roles", name: "User Roles", component: <UserRoles /> },
    { id: "user-avatars", name: "User Avatars", component: <UserAvatar /> },
    { id: "red-flag-auto", name: "Red Flag Auto", component: <RedFlagAuto /> },
    { id: "copilot", name: "CoPilot", component: <CoPilot /> },
    {
      id: "case-type-roles",
      name: "Case Type Roles",
      component: <CaseTypeRoles />,
    },
    {
      id: "client-comm",
      name: "Client Comm",
      component: <ClientCommunication />,
    },
    { id: "hipaa-maker", name: "HIPAA Maker", component: <HippaMaker /> },
    { id: "values", name: "Values", component: <Values /> },
    { id: "auto-tasks", name: "Auto Tasks", component: <AutoTasks /> },
    { id: "shakespeare", name: "Shakespeare", component: <Shakespare /> },
    {
      id: "firm-addresses",
      name: "Firm Addresses",
      component: <FirmAddress />,
    },
    { id: "add-users", name: "Add Users", component: <AddUsers /> },
    { id: "add-teams", name: "Add Teams", component: <AddTeams /> },
    {
      id: "bank-accounts",
      name: "Bank Accounts",
      component: <DefaultHeader />,
    },
    { id: "templates", name: "Templates", component: <LetterTemplates /> },
    {
      id: "firm-branding",
      name: "Firm Branding",
      component: <FirmBranding />,
    },
    {
      id: "office-integration",
      name: "Office Integration",
      component: <OfficeIntegration />,
    },
    { id: "calendars", name: "Calendars", component: <Calendars /> },
    { id: "google-docs", name: "Google Docs", component: <GoogleDocs /> },
    {
      id: "cloud-storage",
      name: "Cloud Storage",
      component: <CloudStorage />,
    },
    { id: "quickbooks", name: "QuickBooks", component: <DefaultHeader /> },
    { id: "e-signature", name: "E-Signature", component: <DefaultHeader /> },
    { id: "objections", name: "Objections", component: <DefaultHeader /> },
    {
      id: "client-portal",
      name: "Client Portal",
      component: <DefaultHeader />,
    },
    {
      id: "wordpress-settings",
      name: "WordPress Settings",
      component: <DefaultHeader />,
    },
    {
      id: "task-defaults",
      name: "Task Defaults",
      component: <DefaultHeader />,
    },
    { id: "cards", name: "Cards", component: <DefaultHeader /> },
    { id: "client-merge", name: "Client Merge", component: <DefaultHeader /> },
    {
      id: "firm-email-contact",
      name: "Firm Email Contact",
      component: <DefaultHeader />,
    },
    { id: "paid-slots", name: "Paid Slots", component: <DefaultHeader /> },
    { id: "top-up", name: "Top Up", component: <DefaultHeader /> },
    { id: "firm-billing", name: "Firm Billing", component: <DefaultHeader /> },
  ];

  const handleTabChange = (id) => {
    setActiveTab(id);
  };

  return (
    <div>
      <div className="main-content" id="padding-top-165">
        <ActionBarComponent
          src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/settings-logo-icon.svg"
          page_name={"Settings"}
        />
        <div className="section__content section__content--p30 photos-page firm-setting m-l-15 m-r-15 overflow-visible">
          <div className="firm-settings-container m-l-5">
            <div className="row flex-nowrap align-items-start m-t-5">
              <div className="col-md-auto p-0 m-r-5 h-100" id="nav-cols-parent">
                <nav id="myTab firmsettingsnav">
                  <div className="firm-settings-nav firm-settings-nav-tabs firm-settings-vertical-tabs remove-angles sidebar-tabs Left-bar-f">
                    {sidebarItems.map((item) => (
                      <a
                        key={item.id}
                        className={`nav-item nav-link active tab-firm-settings-hover ${activeTab === item.id ? "active-tab-firm-settings show" : ""}`}
                        onClick={() => handleTabChange(item.id)}
                        role="tab"
                        aria-selected={activeTab === item.id}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </nav>
              </div>

              <div className="d-flex-1 ">
                <div className="tab-content">
                  {sidebarItems.map((item) =>
                    activeTab === item.id ? (
                      <div key={item.id}>{item.component}</div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirmSettingsMain;
