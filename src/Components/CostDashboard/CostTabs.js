import React from "react";
import CustomTab from "./CustomTab";
import CostTable from "./CostTable";

const CostTabs = ({
  costs,
  openCosts,
  requestedCosts,
  paidCosts,
  creditCardCosts,
  slotDetails,
  onEditCost = () => {},
}) => {
  const tabs = [
    {
      key: "all",
      label: "All",
      content: (
        <CostTable
          onEditCost={onEditCost}
          costs={costs}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "open",
      label: "Open",
      content: (
        <CostTable
          onEditCost={onEditCost}
          costs={openCosts}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "requested",
      label: "Requested",
      content: (
        <CostTable
          onEditCost={onEditCost}
          costs={requestedCosts}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "paid",
      label: "Paid",
      content: (
        <CostTable
          onEditCost={onEditCost}
          costs={paidCosts}
          slotDetails={slotDetails}
        />
      ),
    },
    {
      key: "creditCard",
      label: "Credit Card",
      content: (
        <CostTable
          onEditCost={onEditCost}
          costs={creditCardCosts}
          slotDetails={slotDetails}
        />
      ),
    },
  ];
  return (
    <div
      className="card row col-lg-12"
      style={{
        border: "none",
        paddingRight: "5px"
      }}
    >
      <CustomTab tabs={tabs} />
    </div>
  );
};

export default React.memo(CostTabs);
