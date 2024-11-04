import React from "react";
import { useSelector } from "react-redux";
import PanelChecklist from "../../common/PanelChecklist";

function TitleBar({ object, name , letterTemps=[] }) {
  const client = useSelector((state) => state.todos.client);
  return (
    <div
      className="border-box  has-checklist position-relative"
      style={{ zIndex: "2", left: "-2px" }}
    >
      <div className=" d-flex flex-row has-title-bg">
        <PanelChecklist entity={"Litigarion"} entity_id={object?.id} />

        <div style={{ position: "absolute", left: "7px", zIndex: "2" }}>
          <span className="page-icon">
            <i class={`ic ic-${name} ic-25`}></i>
          </span>
        </div>

        {/* <div class="panel-icon">
          <i class="ic ic-{{litigation_act.event_type_id.litigation_event_type}} ic-25"></i>
        </div> */}

        <div
          style={{ paddingLeft: "50px" }}
          className="top-header height-25 d-flex  responsive-width-of-title "
        >
          <div
            style={{
              fontWeight: "600",
            }}
            className="top-head-fixed d-flex align-items-center custom-font-14px"
          >

            <div className="d-flex align-items-center">
              {object?.date_name ? (
                <h2 className="d-flex align-items-center">
                  <small className="font-weight-bold">{object?.date_name}</small>
                </h2>
              ) : (
                <h2 className="d-flex align-items-center">
                  <small className="font-weight-bold">
                    {object?.event_type_id?.litigation_event_type}
                  </small>
                </h2>
              )}
              <p className="m-l-5 m-r-5 textWrap-NW">
                {object?.name}
              </p>

              {letterTemps && (
                 <div className="btn-wrapper ml-2">
                 {letterTemps?.map(
                   (temp) =>
                     temp.litigation_event === object.event_id && (
                       <>
                         {temp.template_type === "Question" && (
                           <button
                             className="btn btn-primary rounded-0"
                             onClick={() =>
                               selectTemplate(
                                 event,
                                 temp.question_template.id,
                                 "letter_template_hearing",
                                 "Question",
                                 object.documents
                                   .filter(
                                     (doc) => doc.document_slot.slot_number === 1
                                   )
                                   .map((doc) => doc.id)
                                   .join(","),
                                 temp.litigation_event.id,
                                 temp.letter_template.id,
                                 object.id
                               )
                             }
                           >
                             Generate Question
                           </button>
                         )}
                         {temp.template_type === "Answer" && (
                           <button
                             className="btn btn-primary rounded-0"
                             onClick={() =>
                               selectTemplate(
                                 event,
                                 temp.question_template.id,
                                 "letter_template_hearing",
                                 "Answer",
                                 object.documents
                                   .filter(
                                     (doc) => doc.document_slot.slot_number === 1
                                   )
                                   .map((doc) => doc.id)
                                   .join(","),
                                 temp.litigation_event.id,
                                 temp.letter_template.id,
                                 object.id
                               )
                             }
                           >
                             Generate Answer
                           </button>
                         )}
                       </>
                     )
                 )}
               </div>
              )}
            </div>
          </div>
        </div>

        <p
          className="d-flex align-items-center position-relative text-white custom-font-14px"
          style={{
            right: "0px",
            zIndex: "1",
            fontWeight: "600",
          }}
        >
          {name} Notes
        </p>
      </div>
    </div>
  );
}

export default TitleBar;
