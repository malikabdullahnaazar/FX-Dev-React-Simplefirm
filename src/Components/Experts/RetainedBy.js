import React from 'react'

function RetainedBy({object , onSelectExpert}) {
    
  return (
    <>
      <div className="info-div" onClick={onSelectExpert}>
        <div className="p-l-5">
          <div>
            <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
              Retained By
            </p>
            <div>
              {/* <div className="d-flex justify-content-between">
                
                {object?.expert_contact.name ? (
              <p>{object.expert_contact.name}</p>

            ):
            <p className="text-primary-50">Name</p>
          
          }
              </div> */}

              <div className="row mb-0 colFont">
                <div className="col text-left">
                  <span className="d-inline-block">Field:</span>
                </div>
                <div className="col-auto text-left font-weight-semibold">
                  <p>{object?.field}</p>
                </div>
              </div>
              <div className="row mb-0 colFont">
                <div className="col text-left">
                  <span className="d-inline-block">Retained By:</span>
                </div>
                <div className="col-auto text-left font-weight-semibold">
                  <p>{object?.retained_by_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="mt-auto">
          <a
            style={{ height: "25px" }}
            href="#"
            className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
          >
            <i className="ic ic-19 ic-generate-document mr-1"></i>
            Generate Document
          </a>
        </div> */}
      </div>
    </>
  )
}

export default RetainedBy