import React from 'react'
import DocumentRow from '../../DocumentRow/DocumentRow'
import NotesPanel from '../../NotesPanelSection/NotesPanel'
import { formatDateForPanelDisplay } from '../../../Utils/helper'
import TitleBar from './TitleBar'

function ExamContent({object , name }) {
  return (
    <div
      className="expert"
      style={{ marginTop: "5px", overflow: "hidden" }}
      key={object?.id}
    >
      <TitleBar object={object} name={name} />
      <div className="flex-row d-flex overflow-hidden">
        <div className="reports-data row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels padding-t-5">
          <div className="info-div">
            <div className="p-l-5">
              <div>
                <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
                  label
                </p>

                <div>


                  {object.dependant_date ? (
                    object.date_name ? (
                      <div className="litigation-row d-flex dependent-dates-wrap">
                        <span className="text-row-wrap text-left inline-row-h-21">
                          <p className="gray-label ml-2 mr-1">
                            {object?.date_name}:
                          </p>
                        </span>
                        <span className="text-row-wrap d-block overflow-hidden ml-2 text-left inline-row-h-21">
                          <p>
                            {formatDateForPanelDisplay(object?.dependant_date)}
                          </p>
                        </span>
                      </div>
                    ) : (
                      <div className="litigation-row d-flex dependent-dates-wrap">
                        <span className="text-row-wrap text-left inline-row-h-21">
                          <p className="gray-label ml-2 mr-1">Filing date</p>
                        </span>
                        <span className="text-row-wrap d-block overflow-hidden ml-2 text-left inline-row-h-21">
                          <p>
                            {formatDateForPanelDisplay(object?.dependant_date)}
                          </p>
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="litigation-row d-flex dependent-dates-wrap">
                      <span className="text-row-wrap text-left inline-row-h-21">
                        <p className="gray-label ml-2 mr-1">
                          {object?.event_type_id?.litigation_event_type} date
                        </p>
                      </span>
                      <span className="text-row-wrap d-block overflow-hidden ml-2 text-left inline-row-h-21">
                        <p>
                          New {object?.event_type_id?.litigation_event_type}{" "}
                          Date
                        </p>
                      </span>
                    </div>
                  )}

                  <p class="m-l-5 m-r-5 textWrap-NW">
                    {object?.event_id?.event_name}
                  </p>
                </div>


              </div>
            </div>

            <div className="mt-auto">
              <a
                style={{ height: "25px" }}
                className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
              >
                <i className="ic ic-19 ic-generate-document mr-1"></i>
                Generate Document
              </a>
            </div>
          </div>

          <div className="info-div" id="calculated-dates-div">
            <div className="p-l-5">
              <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
                Dates
              </p>

              {object?.calculated_dates?.length > 0 ? (
                object.calculated_dates.map((calDate, index) => (
                  <div key={index} className="litigation-row d-flex justify-content-between text-overflow-hidden">
                    <span className="text-row-wrap text-left inline-row-h-21 ">
                      <p className="black-text">{calDate?.date_name}</p>
                      {/* <p className="gray-label ml-2 mr-1">:</p> */}
                    </span>
                    <span className="text-row-wrap d-block overflow-hidden text-left inline-row-h-21">
                      <p className="black-text">{formatDateForPanelDisplay(calDate?.date_val)}</p>
                    </span>
                  </div>
                ))
              ) : object?.event_id?.calculated_dates_id?.length > 0 ? (
                object.event_id.calculated_dates_id.map((calDate, index) => (
                  <div key={index} className="litigation-row d-flex text-overflow-hidden">
                    <span className="text-row-wrap text-left inline-row-h-21">
                      <p className="black-text">{calDate?.calculated_date_name}</p>
                      <p className="gray-label ml-2 mr-1">:</p>
                    </span>
                    <span className="text-row-wrap d-block overflow-hidden text-left inline-row-h-21">
                      <p className="black-text">{calDate?.day_count} {calDate?.day_count_type} before</p>
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-primary-50">No calculated dates available.</p>
              )}
            </div>
          </div>

          <div className="info-div">
            <div className="info-div-witness-statement-summary">
              <div className="p-l-5 ">
                <div>
                  <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase ">
                    Notes
                  </p>
                  {object?.notes ? (
                    object.notes.length > 200 ? (
                      <span title={object.notes}>
                        {object.notes.slice(0, 200) + "..."}
                      </span>
                    ) : (
                      <span>{object?.notes}</span>
                    )
                  ) : (
                    <p className="text-primary-50"> Notes </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <NotesPanel
          entity_type={'LitigationAct'}
          record_id={object?.id}
          module={"litigation"}
          pagePanels={3}
        />
      </div>
      <div className="row documents-wrapper m-t-5">
        <div className="col-12">
          <div className="height-25">
            <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
              &nbsp;Document Row
            </h4>
          </div>
          <DocumentRow clientProvider={object} page="Discovery" />
        </div>
      </div>
    </div>
  )
}

export default ExamContent