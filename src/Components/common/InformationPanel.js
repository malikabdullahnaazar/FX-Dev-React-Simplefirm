import React, { useState } from "react";

const InformationPanel = ({
  id,
  // title,
  // first_name,
  // last_name,
  panel_name,
  data,
  onSelectReport,
  hasBtn = false,
  imgSrc,
  buttonText,
  className,
  imgClassName,
  iconClassName,
  onClick = () => console.log("Hi"),
  panelClassName = "",
}) => {
  return (
    <>
      <div className={`info-div ${panelClassName}`} onClick={onSelectReport}>
        <div className=" ">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "var(--primary-10)", height: "25px" }}
          >
            <p className="columnsTitle text-center d-flex text-primary font-weight-semibold text-uppercase">
              {panel_name}
            </p>
          </div>

          {/* <div className="row mb-0 colFont">
            <div className="col text-left">
              <span className="d-inline-block">No Report Taken:</span>
            </div>
            <div className="col-auto text-left font-weight-semibold">
              {report_taken ?  <p>{formatDate(date_taken)}</p> : <p>No</p>}
            </div>
          </div>

          <div className="row mb-0 colFont">
            <div class="col text-left">
              <span class="d-inline-block">Report No:</span>
            </div>
            <div class="col-auto text-left font-weight-semibold">
              {report_number ? (
                <p>{report_number}</p>
              ) : (
                <p className="text-primary-50">####</p>
              )}
            </div>
          </div>

          <div className="row mb-0 colFont">
            <div className="col text-left">
              <span className="d-inline-block">Complete:</span>
            </div>
            <div className="col-auto text-left font-weight-semibold">
              <p>{formatDate(complete)}</p>
            </div>
          </div>
          <div className="row mb-0 colFont">
            <div className="col text-left">
              <span className="d-inline-block">Cost:</span>
            </div>
            <div className="col-auto text-left font-weight-semibold">
              <p>{cost}</p>
            </div>
          </div>
          <div className="row mb-0 colFont font-weight-semibold">
            <div className="col text-left">
              <span className="d-inline-block ">Requested:</span>
            </div>
            <div className="col-auto text-left font-weight-semibold">
              <p>{formatDate(date_ordered)}</p>
            </div>
          </div> */}
          {data.map((item, index) => (
            <div
              className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap"
              key={index}
            >
              <div className="col text-left p-0">
                <span className="d-inline-block">{item.label}</span>
              </div>
              <div className="col-auto p-0 text-left font-weight-semibold">
                <p>{item.value}</p>
              </div>
            </div>
          ))}
          {data.length < 7 &&
            Array.from({ length: 7 - data.length }).map((_, index) => (
              <div
                className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap"
                style={{ height: "21px" }}
                key={`${index}`}
              ></div>
            ))}
        </div>
        {hasBtn && (
          <div className="mt-auto" id={id}>
            <a
              href="#"
              className={`btn btn-primary-lighter-2 btn-white-hover font-weight-semibold text-lg height-25 rounded-0 d-flex align-items-center justify-content-center mt-3 ${className}`}
              onClick={() => onClick(id)}
            >
              {iconClassName && <i className={`${iconClassName} mr-1`}></i>}
              {imgSrc && (
                <img className={imgClassName} src={imgSrc} alt="icon" />
              )}
              {buttonText}
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default InformationPanel;
