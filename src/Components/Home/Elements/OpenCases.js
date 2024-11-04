import React from "react";

const OpenCases = () => {
  return (
    <div className="bg-primary-2 h-100">
      <div className="background-main-10 height-21">
        <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
          Attached to 987 Open Cases
        </h4>
      </div>
      <div className="open-case-row">
        <div className="case-type d-flex align-items-center">
          <img
            src="https://simplefirm-bucket.s3.amazonaws.com/static/images/food-poisoning-icon-color.svg"
            className="m-r-5 ic-19"
          />
          345 Food Poisoning Cases:
        </div>
        <div data-percentage="35" className="progress-container">
          <span className="progress-bar-chart__label">35% </span>
          <svg
            className="progress-bar-chart"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              className="progress-bar-chart__background"
              width="100"
              height="8"
            ></rect>
            <rect
              className="progress-bar-chart__bar fill-blueberry"
              width="35"
              height="8"
              style={{ display: "inline-block", width: "35%" }}
            ></rect>
          </svg>
        </div>
      </div>
      <div className="open-case-row">
        <div className="case-type d-flex align-items-center">
          <i className="ic ic-19 ic-accident m-r-5"></i>
          235 Car Accident Cases:
        </div>
        <div data-percentage="45" className="progress-container">
          <span className="progress-bar-chart__label">45% </span>
          <svg
            className="progress-bar-chart"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              className="progress-bar-chart__background"
              width="100"
              height="8"
            ></rect>
            <rect
              className="progress-bar-chart__bar fill-violet"
              width="45"
              height="8"
              style={{ display: "inline-block", width: "45%" }}
            ></rect>
          </svg>
        </div>
      </div>
      <div className="open-case-row">
        <div className="case-type d-flex align-items-center">
          <img
            src="https://simplefirm-bucket.s3.amazonaws.com/static/images/animal-bite-icon.svg"
            className="m-r-5 ic-19"
          />
          123 Dog Bite Cases:
        </div>
        <div data-percentage="12" className="progress-container">
          <span className="progress-bar-chart__label">12% </span>
          <svg
            className="progress-bar-chart"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              className="progress-bar-chart__background"
              width="100"
              height="8"
            ></rect>
            <rect
              className="progress-bar-chart__bar fill-sky-blue"
              width="12"
              height="8"
              style={{ display: "inline-block", width: "12%" }}
            ></rect>
          </svg>
        </div>
      </div>
      <div className="open-case-row">
        <div className="case-type d-flex align-items-center">
          <i className="ic ic-19 ic-accident m-r-5"></i>
          321 Defective Product Cases:
        </div>
        <div data-percentage="24" className="progress-container">
          <span className="progress-bar-chart__label">24% </span>
          <svg
            className="progress-bar-chart"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              className="progress-bar-chart__background"
              width="100"
              height="8"
            ></rect>
            <rect
              className="progress-bar-chart__bar fill-vivid-cerulean"
              width="24"
              height="8"
              style={{ display: "inline-block", width: "24%" }}
            ></rect>
          </svg>
        </div>
      </div>
    </div>
  );
};
export default OpenCases;
