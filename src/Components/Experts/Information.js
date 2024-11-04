import React from "react";

function Information({object , onSelectExpert}) {


  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  
  return (
    <>
      <div className="info-div" onClick={onSelectExpert}>
        <div className="p-l-5">
          <div>
            <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
              Retained Information
            </p>
            <div>
              
              {/* <div className="d-flex justify-content-between">
                <div>Field:</div>
                <div style={{ fontWeight: "bold" }}>
                  <p>{object?.field}</p>
                </div>
              </div> */}

              <div className="row mb-0 colFont">
                <div className="col text-left">
                  <span className="d-inline-block">Retainer:</span>
                </div>
                <div className="col-auto text-left font-weight-semibold">
                  <p>{object?.retainer}</p>
                </div>
              </div>
              <div className="row mb-0 colFont">
                <div className="col text-left">
                  <span className="d-inline-block">Rate:</span>
                </div>
                <div className="col-auto text-left font-weight-semibold">
                  <p>{object?.rate}</p>
                </div>
              </div>

              <div className="row mb-0 colFont">
                <div className="col text-left">
                  <span className="d-inline-block">Retained:</span>
                </div>
                <div className="col-auto text-left font-weight-semibold">
                  <p>{formatDate(object?.retained)}</p>
                </div>
              </div>

              <div className="row mb-0 colFont">
                <div className="col text-left ">
                  <p className="overflow-x-hidden">{object?.url}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <a
            style={{ height: "25px" }}
            href="#"
            className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
          >
            <i className="ic ic-19 ic-generate-document mr-1"></i>
            Generate Document
          </a>
        </div>
      </div>
    </>
  );
}

export default Information;
