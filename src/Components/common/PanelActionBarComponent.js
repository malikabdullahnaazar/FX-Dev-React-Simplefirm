import React from "react";
import { useSelector } from "react-redux";
import PanelChecklist from "../common/PanelChecklist";

const PanelActionBarComponent = ({
  id,
  page_name,
  title,
  first_name,
  last_name,
  report_type_name = "",
  report_agency_name = "",
  buttons = [],
  panelIconSrc,
  object,
  forInstanceName = "",
  hasGradient = false,
  instanceForName = "",
}) => {
  // console.log(buttons);
  const client = useSelector((state) => state.todos.client);
  return (
    <div
      className="border-box  has-checklist position-relative"
      style={{ zIndex: "2" }}
    >
      <div
        className={`title-bar-main-div d-flex flex-row has-title-bg  ${hasGradient ? "skewed-primary-gradient-new" : ""}`}
      >
        <PanelChecklist
          entity={page_name === "Incident Report" ? "Reports" : page_name}
          entity_id={id}
        />

        {panelIconSrc && (
          <div
            style={{
              position: "absolute",
              left: "7px",
              width: "25px",
              height: "25px",
            }}
          >
            <span className="page-icon">
              <img
                src={panelIconSrc}
                alt="Icon"
                style={{ height: "100%", width: "100%" }}
              />
            </span>
          </div>
        )}

        <div
          style={{ paddingLeft: "50px", marginRight: "5px" }}
          className="top-header height-25 d-flex  responsive-width-of-title "
        >
          <div className="top-head-fixed d-flex align-items-center">
            <h2 className="d-flex align-items-center mr-1">
              {/* IF counsels and insurance on defendants or other page as chaild components */}
              {forInstanceName ? (
                <small style={{ fontWeight: "600" }}>
                  {instanceForName} For {title} {forInstanceName}
                </small>
              ) : (
                <small style={{ fontWeight: "600" }}>{title}</small>
              )}
            </h2>

            <h2 className="d-flex align-items-center mr-1">
              <small className="font-weight-600 custom-font-14px">
                {first_name} {last_name}
              </small>
            </h2>
            {page_name === "Incident Report" && (
              <>
                <h2 className="d-flex align-items-center mr-1">
                  <small className="font-weight-600 custom-font-14px">
                    {report_agency_name}
                  </small>
                </h2>
                <h2 className="d-flex align-items-center mr-1">
                  <small className="font-weight-600 custom-font-14px">
                    {report_type_name}
                  </small>
                </h2>
              </>
            )}
            {page_name === "Defendants" && (
              <>
                <h2 className="d-flex align-items-center mr-1">
                  <small className="font-weight-600 custom-font-14px">
                    {object?.defendantType_name === "Private Individual"
                      ? `${object?.first_name} ${object?.last_name}`
                      : object?.entity_name}
                  </small>
                </h2>
              </>
            )}
          </div>
        </div>

        {page_name === "Defendants" ? (
          <div
            class="btn-wrapper justify-content-end align-items-center"
            style={{ marginRight: "13rem" }}
          >
            <p
              className="custom-font-14px dynamic-margin-class-2"
              style={{ color: "white", fontWeight: "600" }}
            >
              {page_name} Notes
            </p>
            {buttons.map((button, index) => (
              <button
                key={index}
                type={button.type || "button"}
                className={`${button.className} d-flex align-items-center justify-content-center`}
                data-toggle={button.dataToggle}
                data-target={button.dataTarget}
                onClick={button.onClick}
                style={{ zIndex: "1", height: "20px" }}
              >
                <span className="font-weight-bold pr-2 text-gold">
                  {button.icon}
                </span>
                {button.label}
              </button>
            ))}
          </div>
        ) : (
          <p
            className="d-flex align-items-center position-relative "
            style={{ right: "0px", zIndex: "1" }}
          >
            <small
              style={{ fontSize: "14px", color: "#ffffff", fontWeight: "600" }}
            >
              {report_type_name} Notes
            </small>
          </p>
        )}

        {/* <div
          className="d-flex align-items-center position-relative w-75 justify-content-center"
          style={{ gap: "5px" }}
        >
          {buttons.map((button, index) => (
            <button
              key={index}
              type={button.type || "button"}
              className={`${button.className} d-flex align-items-center justify-content-center`}
              data-toggle={button.dataToggle}
              data-target={button.dataTarget}
              onClick={button.onClick}
              style={{ zIndex: "1", height: "20px" }}
            >
              <span className="font-weight-bold pr-2 text-gold">
                {button.icon}
              </span>
              {button.label}
            </button>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default PanelActionBarComponent;
