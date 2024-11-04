import React from "react";

const CaseCompletion = () => {
  return (
    <div className="case-completion col-12 column order-1 m-b-5">
      <div className="bg-primary-2 h-100">
        <div className="background-main-10 height-21">
          <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
            Case Load Completion %
          </h4>
        </div>
        <div className="case-completion-chart p-t-10 p-b-10">
          <div className="circlechart" data-percentage="75">
            <svg
              className="circle-chart"
              viewBox="0 0 33.83098862 33.83098862"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="circle-chart__background"
                cx="16.9"
                cy="16.9"
                r="15.9"
              ></circle>
              <circle
                className="circle-chart__circle stroke-carrot-orange"
                stroke-dasharray="75,100"
                cx="16.9"
                cy="16.9"
                r="15.9"
              ></circle>
              <g className="circle-chart__info">
                {" "}
                <text className="circle-chart__percent" x="17.9" y="12.5">
                  75%
                </text>{" "}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseCompletion;
