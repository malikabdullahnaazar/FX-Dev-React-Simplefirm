import React, { useEffect, useState } from "react";
import ModalComponent from "../../common/ModalComponent";
import NavFirmSettingsTab from "../../common/nav-firm-settings-tab";
import RenameDeleteTemplateModalBody from "./tab/rename-delete-template";
import CopyTemplateModalBody from "./tab/copy-template";
import {
  useCopyLetterTemplate,
  useDeleteLetterTemplate,
  useEditLetterTemplate,
} from "../hooks/useGetLetterTemplates";
import useGetUploadLetterTemplate from "../hooks/useUploadLetterTemplate";

const EditCopyLetterTemplateModal = ({
  show,
  handleClose,
  size,
  title,
  refetch,
  data,
}) => {
  const [activeTab, setActiveTab] = useState("rename_delete_template");
  const sidebarItems = [
    { id: "rename_delete_template", name: "Rename / Delete Template" },
    { id: "copy_template", name: "Copy To New Document Generation Button" },
  ];
  const { editLetterTemplate } = useEditLetterTemplate();
  const { deleteTemplate } = useDeleteLetterTemplate();
  const [templateName, setTemplateName] = useState();
  const handleTabChange = (id) => {
    setActiveTab(id);
  };
  const { data: getUploadLetterTemplates } = useGetUploadLetterTemplate();
  const [pageName, setPageName] = useState();
  const [pageId, setPageId] = useState();
  const [pageDropdownName, setPageDropdownName] = useState();
  const [pageDropdownId, setPageDropdownId] = useState();
  const { copyTemplate } = useCopyLetterTemplate();

  useEffect(() => {
    if (data) {
      setTemplateName(data?.for_template?.template_name);
    }
  }, [data]);

  const handleSave = async (tab) => {
    if (tab === "rename_delete_template") {
      await editLetterTemplate({
        template_id: data?.id,
        temp_name: templateName,
      });
      refetch();
      handleClose();
    } else {
      console.log("Copy Save ");
      const payload = {
        template_id: data?.id,
        temp_name: templateName,
        dropdown: pageDropdownId,
        page: pageId,
      };
      await copyTemplate(payload);
      refetch();
      handleClose();
    }
  };

  const handleDelete = async () => {
    await deleteTemplate(data?.id);
    handleClose();
    refetch();
  };

  const editButtonData = [
    { text: "Cancel", variant: "secondary", onClick: handleClose },
    { text: "Delete", variant: "danger", onClick: handleDelete },
    { text: "Save", variant: "success", onClick: () => handleSave(activeTab) },
  ];

  const copyButton = [
    { text: "Cancel", variant: "secondary", onClick: handleClose },
    { text: "Save", variant: "success", onClick: () => handleSave(activeTab) },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "rename_delete_template":
        return (
          <RenameDeleteTemplateModalBody
            data={data}
            templateName={templateName}
            setTemplateName={(e) => setTemplateName(e.target.value)}
          />
        );
      case "copy_template":
        return (
          <CopyTemplateModalBody
            data={data}
            templateName={templateName}
            setTemplateName={(e) => setTemplateName(e.target.value)}
            dropdownData={getUploadLetterTemplates}
            pageId={pageId}
            setPageName={setPageName}
            setPageId={setPageId}
            pageDropdownId={pageDropdownId}
            setPageDropdownName={setPageDropdownName}
            setPageDropdownId={setPageDropdownId}
          />
        );
    }
  };
  return (
    <ModalComponent
      show={show}
      handleClose={handleClose}
      size={size}
      title={title}
      buttonData={
        activeTab === "rename_delete_template" ? editButtonData : copyButton
      }
    >
      <NavFirmSettingsTab
        sidebarItems={sidebarItems}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />
      <div className="tab-content mt-3">{renderActiveTabContent()}</div>
    </ModalComponent>
  );
};

export default EditCopyLetterTemplateModal;
