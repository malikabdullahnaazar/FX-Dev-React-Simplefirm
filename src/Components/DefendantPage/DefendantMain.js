import React, { useState } from "react";
import DocumentRow from "../DocumentRow/DocumentRow";
import NotesPanel from "../NotesPanelSection/NotesPanel";
import PanelActionBarComponent from "../common/PanelActionBarComponent";
import ContactPanel from "../common/ContactPanel";
import InformationPanel from "../common/InformationPanel";
import { formatDateForPanelDisplay } from "../../Utils/helper";

function DefendantMain({
  object,
  selecetedEditableTapPanel,
  setSelectedDefendant,
  setForDeleteDefendatsId,
  setAddInsuranceModalShow,
  setAddCounselModalShow,
  setCurrentDefendantId,
  handleGenrateDocument,
})
 {

  const handeInsuranceShow = () => {
    setAddInsuranceModalShow(true);
    setCurrentDefendantId(object.id);
  }
  const handeCounselShow = () => {
    setAddCounselModalShow(true);
    setCurrentDefendantId(object.id);
  }

   

  function roundToInt(value) {
    const number = parseFloat(value) || 0; // Convert value to a float
    return Math.round(number); // Proper rounding without skewing
  }

  const buttonsConfig = [
    {
      label: "Insurance",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addInsurance",
      onClick: () => handeInsuranceShow (),
    },
    {
      label: "Counsel",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addCounsel",
      onClick: () => handeCounselShow (),
    },
  ];
  const DefendantButtonsConfig = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "p-l-6 p-r-5",
      style: { height: "25px" },
      onClick: handleGenrateDocument,
    },
  ];

  const EmploymentButtonsConfig = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "p-l-6 p-r-5",
      style: { height: "25px" },
      onClick : (id, name ) => {}
    },
  ];


  return (
    <div className="expert" key={object?.id}>
      <PanelActionBarComponent
        id={object?.id}
        title={object?.title}
        object={object}
        buttons={buttonsConfig}
        page_name={"Defendants"}
        hasGradient={true}
      />
      <div className="flex-row d-flex"
        style={{overflow:'hidden'}}
      >
        <div className="reports-data row no-gutters equal-column-wrapper position-relative panels-direction-secondary insurance-col-panels padding-t-5">
         

            <ContactPanel
              id={object?.id}
              name={object?.defendantType_name === "Private Individual" ?(`${object?.first_name}  ${object?.last_name}`) :(object?.entity_name) }
              dynamic_label={object?.defendantType_name !== "Private Individual" ? "Entity Name" : ""}
              panel_name={"defendant"}
              className="m-b-5"
              phone_number={object?.home_contact?.phone_number}
              fax_number={object?.home_contact?.fax}
              email={object?.home_contact?.email}
              address1={object?.home_contact?.address1}
              address2={object?.home_contact?.address2}
              city={object?.home_contact?.city}
              state={object?.home_contact?.state}
              zip_code={object?.home_contact?.zip}
              ext={object?.home_contact?.phone_ext}
              buttonData={DefendantButtonsConfig}
              genrate_doc_address={'Defendant Address'}
              onSelectObject={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "defendant"),
                setForDeleteDefendatsId(object?.id)
              )}
            />

            <ContactPanel
              id={object?.id}
              name={object?.defendant_employer}
              panel_name={"employment"}
              className="m-b-5"
              phone_number={object?.work_contact?.phone_number}
              email={object?.work_contact?.email}
              address1={object?.work_contact?.address1}
              address2={object?.work_contact?.address2}
              city={object?.work_contact?.city}
              state={object?.work_contact?.state}
              zip_code={object?.work_contact?.zip}
              ext={object?.work_contact?.phone_ext}
              fax_number={object?.work_contact?.fax}
              buttonData={EmploymentButtonsConfig}
              onSelectObject={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "employment"),
                setForDeleteDefendatsId(object?.id)
              )}
            />


      
            <InformationPanel
            panel_name={"Information"}
            className="m-b-5"
              data={[
                {
                  label: "Type:",
                  value: `${object?.gender} ${object?.defendantType_name}`,
                },
                {
                  label: "DOB:",
                  value: formatDateForPanelDisplay(object?.birthday)
                },
                {
                  label: "Liability%:",
                  value: `${roundToInt(object?.liability_estimate)} %/ ${roundToInt(object?.liability_percent)} %`
                },
                {
                  label: "Rep Letter:",
                  value: formatDateForPanelDisplay(object?.repr_letter_sent)
                },
                {
                  label: "Contact:",
                  value: formatDateForPanelDisplay(object?.contact_date)
                },
                {
                  label: "Served:",
                  value: formatDateForPanelDisplay(object?.defServedDate)
                },
              ]}
              onSelectReport={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "information"),
                setForDeleteDefendatsId(object?.id)
              )}
            />


            <ContactPanel
              id={object?.id}
              className="m-b-5"
              name={object?.process_server?.contact_id?.name}
              panel_name={"process-server"}
              phone_number={object?.process_server?.contact_id?.phone_number}
              email={object?.process_server?.contact_id?.email}
              address1={object?.process_server?.contact_id?.address1}
              address2={object?.process_server?.contact_id?.address2}
              city={object?.process_server?.contact_id?.city}
              state={object?.process_server?.contact_id?.state}
              zip_code={object?.process_server?.contact_id?.zip}
              ext={object?.process_server?.contact_id?.phone_ext}
              fax_number={object?.process_server?.contact_id?.fax}
              buttonData={EmploymentButtonsConfig}
              onSelectObject={() => (
                setSelectedDefendant(object),
                (selecetedEditableTapPanel.current = "process-server"),
                setForDeleteDefendatsId(object?.id)
              )}
            />

        </div>

        <NotesPanel
          entity_type={"Defendants"}
          record_id={object.id}
          module={"Defendants"}
        />
      </div>
      <div className="row documents-wrapper">
      <div className="col-12">
        <div className="height-25">
          <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
            &nbsp;Document Row
          </h4>
        </div>
        <DocumentRow clientProvider={object} page="Defendants" />
      </div>
    </div> 
    </div>
    
  );
}

export default DefendantMain;
