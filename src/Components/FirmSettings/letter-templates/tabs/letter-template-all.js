import React, { useState } from "react";
import useGetLetterTemplates from "../hooks/useGetLetterTemplates";
import TableFirmSettings from "../../common/table-firm-settings";
import { formatDate, getLoggedInUserId } from "../../../../Utils/helper";
import Button from "../../common/button";
import api from "../../../../api/api";
import EditCopyLetterTemplateModal from "../modals/EditLetterTemplateModal";

const LetterTemplatesALL = () => {
  const { data: getLetterTemplates, refetch } = useGetLetterTemplates();
  const userId = getLoggedInUserId();
  const handleEditButton = (docId, loggedInUserId, templateId) => {
    window.open(
      `https://wordprocessor.simplefirm.com/?docId=${docId}&userId=${loggedInUserId}&dynamic_template_id=${templateId}`
    );
  };
  const [editData, setEditData] = useState();
  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditModalShow = async (templateId) => {
    try {
      const response = await api.get(
        `/api/firmsetting-page/edit-dl-template/`,
        {
          params: {
            template_id: templateId,
          },
        }
      );
      setEditData(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TableFirmSettings>
        <thead>
          <tr>
            <th></th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>
              Template File Name
            </th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>Page</th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>
              Generate Document Popup
            </th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>Document</th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>
              Date Uploaded
            </th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>Firm User</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {getLetterTemplates &&
            getLetterTemplates?.map((letter, idx) => {
              return (
                <tr style={{ height: "37px" }}>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    {letter?.for_template?.template_name}
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    <span className="d-flex align-items-center">
                      <span className="ic ic-20">
                        <img
                          src={letter?.for_page?.page_icon}
                          alt={`${letter?.for_page?.page_icon} Icon`}
                        ></img>
                      </span>
                      <span
                        style={{ fontSize: "13px" }}
                        className="m-l-5 text-black text-black-2 whitespace-nowrap account_text-ellipsis"
                      >
                        {letter?.for_page?.name}
                      </span>
                    </span>
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    {letter?.for_dropdown?.name}
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    {letter?.for_template?.template?.file_name}
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    {formatDate(letter?.for_template?.template?.created)}
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    <span className="d-flex align-items-center">
                      {letter?.profile_pic ? (
                        <span
                          className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"
                          id={`letter-template-profile-${idx + 1}`}
                        >
                          <img id="output" src={letter?.profile_pic} />
                        </span>
                      ) : (
                        <span className="ic ic-29 ic-avatar"></span>
                      )}
                      <span
                        style={{ fontSize: "13px" }}
                        className="m-l-5 text-black text-black-2 whitespace-nowrap account_text-ellipsis"
                      >
                        {letter?.for_firm_user?.first_name}{" "}
                        {letter?.for_firm_user?.last_name}
                      </span>
                    </span>
                  </td>
                  <td>
                    <Button
                      text={"Edit"}
                      className={"btn-primary"}
                      onClick={() =>
                        handleEditButton(
                          letter?.for_template?.template?.id,
                          userId,
                          letter?.id
                        )
                      }
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </TableFirmSettings>
      {showEditModal && (
        <EditCopyLetterTemplateModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          size={"lg"}
          title={"Document Template Controls"}
          data={editData}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default LetterTemplatesALL;
