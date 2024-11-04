import React from 'react'
import { formatDateForPanelDisplay } from '../../Utils/helper';


function Retained({object , onSelectExpert}) {


  return (
    <>
    <div className="info-div-3 " >
      <div className="" onClick={onSelectExpert}>
        <div>
          <p className="columnsTitle text-center text-primary  text-uppercase">
            Retained 
          </p>
          <div>
            
          <div className="row mb-0 colFont">
                <div className="col text-left">
                  <span className="d-inline-block">Field</span>
                </div>
                <div className="col-auto text-left ">
                  <p>{object?.field}</p>
                </div>
              </div>
              <div className="row mb-0 colFont">
                <div className="col text-left">
                  <span className="d-inline-block">Retained By</span>
                </div>
                <div className="col-auto text-left ">
                  <p>{object?.retained_by_name}</p>
                </div>
              </div>

            <div className="row mb-0 colFont">
              <div className="col text-left">
                <span className="d-inline-block">Retainer</span>
              </div>
              <div className="col-auto text-left ">
                <p>{object?.retainer}</p>
              </div>
            </div>
            <div className="row mb-0 colFont">
              <div className="col text-left">
                <span className="d-inline-block">Rate</span>
              </div>
              <div className="col-auto text-left ">
                <p>{object?.rate}</p>
              </div>
            </div>

            <div className="row mb-0 colFont">
              <div className="col text-left">
                <span className="d-inline-block">Retained</span>
              </div>
              <div className="col-auto text-left ">
                <p>{formatDateForPanelDisplay(object?.retained)}</p>
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
          style={{ height :"25px" }}
          href="#"
          className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
        >
          <i className="ic ic-19 ic-costs mr-1"></i>
          Experts Cost Request                                                
        </a>
      </div>
    </div>
  </>
  )
}

export default Retained