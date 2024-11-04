import React from 'react'

const DocumentHistoryTableRow = (props) => {
  return (
    <>
        <tr className="fake-row-2 p-3 vertical-align-middle">

            <td className="text-dark-grey text-center" id='document-row-table-data'>
                {props.index}
            </td>

            <td id='document-row-table-data' style={{ paddingTop: "20px" }}>
                <div className="d-flex align-items-center">

                    <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                     {props.doc?.for_client?.profile_pic_19p?.url && <img class="output-3 theme-ring" src={props.doc?.for_client?.profile_pic_19p?.url} />}
                        
                    </span>
                    <span className="ml-2 text-black text-black-2 whitespace-nowrap">
                        {props.doc?.for_client?.last_name}, {props.doc?.for_client?.first_name}
                    </span>
                </div>
                <p className="text-darker whitespace-nowrap mb-0">
                    <span className="d-inline-block text-dark-grey mr-1">DOB</span>
                    {props.doc?.for_client?.birthday}
                </p>
                <div className="visible-responsive">
                    <p className="mb-0">
                        {props.doc?.for_case?.case_type?.casetype_icon && <img src={props.doc?.for_case?.case_type?.casetype_icon} />}
                        &nbsp;&nbsp;{props.doc?.for_case?.case_type?.name}
                    </p>
                                                                                
                    <p className="text-darker">
                        <span className="d-inline-block text-dark-grey mr-1">DOI</span>
                        {props.doc?.for_case?.incident_date}
                    </p>
                </div>
            </td>

            <td id='document-row-table-data'>
                <div className="icon-text-boxes" >
                    <div className="col-xl icon-text-box bg-grey-500 text-center document-name-width">
                        <p className="date">6/6/2023</p>
                        <span className="icon-wrap"> <i className="ic ic-35 ic-file-colored cursor-pointer"></i> </span>
                        <p class="name pt-3">{props.doc?.file_name}</p>
                    </div>
                </div>
            </td>
            
            <td className="document-full-width-column text-right whitespace-nowrap " id='document-row-table-data'>
                <div className="d-flex align-items-center justify-content-end">
                    {props.doc?.pages && <img src={props.doc?.pages?.find(obj => obj["name"] === props.doc?.page?.name)['page_icon']} class="document-page-name-icon" />}
                    {props.doc?.page?.name}
                </div>
            </td>

            <td className="whitespace-nowrap " id='document-row-table-data'>
                {props.doc?.page_name}
            </td>


            <td className="document-full-width-column whitespace-nowrap " id='document-row-table-data'>
            {props.doc?.document_slot?.slot_name ? 
                (props.doc?.document_slot?.slot_number+". "+props.doc?.document_slot?.slot_name)
                : (props.doc?.document_slot?.slot_number + ". Available")
            }
            </td>

            <td>
                <div className="d-flex user-date-area-wrap">

                    <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                        {props.doc?.attached_by?.bp_userprofile?.account_type == 'Attorney'
                            && props.doc?.attached_by?.bp_userprofile?.bp_attorney_userprofile?.profile_pic
                            &&  <img class="output-3 theme-ring" src={props.doc?.attached_by?.bp_userprofile?.bp_attorney_userprofile?.profile_pic?.url} />
                        }
                        {props.doc?.attached_by?.bp_userprofile?.account_type != 'Attorney'
                            && props.doc?.attached_by?.bp_attorneystaff_userprofile?.profile_pic
                            &&  <img class="output-3 theme-ring" src={props.doc?.attached_by?.bp_attorneystaff_userprofile?.profile_pic?.url} />
                        }
                    </span>
                    <div className="user-sorting-info ml-2">
                        <span className="text-black text-black-2 whitespace-nowrap">
                            {props.doc?.attached_by?.first_name} {props.doc?.attached_by?.last_name}
                        </span>
                        <div className="visible-docuemnt-date-area">
                            <div className="history-date whitespace-nowrap">
                                {props.doc?.created?.date}
                            </div>
                            <div className="history-date whitespace-nowrap">
                                {props.doc?.created?.time}
                            </div>
                        </div>
                    </div>
                </div>
            </td>
            <td className="hidden-docuemnt-date-area " id='document-row-table-data'>
                <div className="history-date whitespace-nowrap">
                    {props.doc?.created?.date}
                </div>
                <div className="history-date whitespace-nowrap">
                    {props.doc?.created?.time}
                </div>
            </td>
            <td id='document-row-table-data'>
                <input hidden id="-slot"/>
                <input hidden id="-panel"/>
                <input hidden id="-page"/>
            </td>

        </tr>
    </>
  )
}

export default DocumentHistoryTableRow;