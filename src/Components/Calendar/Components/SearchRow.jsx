import React from 'react';
import { mediaRoute, calculateAge, formatDate } from "../../../Utils/helper";
import bdayIcon from "../../../assets/images/birthdayicon.svg";
import incidentIcon from "../../../assets/images/incident.svg";

export default function SearchRow({ client, caseSummary }) {
    const separator = client?.first_name && client.last_name ? ' , ' : ' ';
  return (
    <table
      className="table-borderless table-striped theme-colored fake-rows-2 has-height-25 table-earning table-earning-search fixed-table-header mb-1"
      id="main-table"
      style={{ width: "100%" }}
    >
      <tbody>
        <tr className="fake-row-2" style={{ height: "94px" }}>
          <td className="search-row-custom" style={{ cursor: "pointer" }}>
            <div className="d-flex align-items-center client-name-box account_text-ellipsis">
              <span className="d-flex align-items-center text-grey mr-8px width30">
                <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img mr-8px width30">
                  {client?.profile_pic_19p && (
                    <img
                      src={mediaRoute(client.profile_pic_19p)}
                      className="output-3 theme-ring"
                      alt="avatar"
                    />
                  )}
                </span>
              </span>
              <span className="text-black text-black-2 whitespace-nowrap account_text-ellipsis font-600">
                {`${client?.last_name || ""}${separator} ${client?.first_name || ""}`}
              </span>
            </div>
            <p className="text-darker account_text-ellipsis d-flex align-items-center">
              <span className="d-flex align-items-center text-grey mr-8px width30">
                <img className="img-19px" src={bdayIcon} alt="birthday" />
              </span>
              <span>{formatDate(client?.birthday)}</span>
            </p>
            <p className="text-darker account_text-ellipsis d-flex align-items-center">
              <span className="d-flex align-items-center text-grey mr-8px width30">Age</span>
              <span>{calculateAge(client?.birthday)}</span>
            </p>
            <div className="visible-responsi account_text-ellipsis">
              <div className="search-Flex-1">
                {caseSummary?.case_type?.casetype_icon && (
                  <img
                    className="img-19px mr-8px"
                    src={caseSummary.case_type.casetype_icon}
                    alt="case type icon"
                  />
                )}
                <p className="MR8H19 height-21">{caseSummary?.case_type?.name}</p>
              </div>
              <p className="text-darker d-flex align-items-center">
                <span className="d-flex align-items-center text-grey mr-8px width30">
                  <img className="img-19px" src={incidentIcon} alt="incident" />
                </span>
                <span>{formatDate(caseSummary?.incident_date)}</span>
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
