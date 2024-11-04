import React from "react";
import { useSelector } from "react-redux";
import { mediaRoute } from "../../Utils/helper";

const Tabs = ({ data , onSelect, allCount, unsortedCount}) => {
 
    

  return (
    <div
    className="nav nav-tabs directory-tab-box h-25px"
    id="nav-tab"
    role="tablist"
    style={{ paddingRight: "16px" }}
  >   
      <a
    className="nav-item nav-link PT9-LFD"
    id="-nav-tab"
    data-toggle="tab"
    href="#unsorted-nav-home"
    role="tab"
    aria-controls="unsorted-nav-home"
    aria-selected="false"
    onClick={() => onSelect("unsorted")}

    style={{
      transition: "all -0.1s ease",
      // padding: "7px 10px",
      margin: "0",
      border: "none",
      boxSizing: "border-box",
    }}
    data-text="Unsorted"
  > <div className="d-flex align-items-center">
  <span>
      Unsorted
  </span>
  <span className="badge badge-primary ml-1">{unsortedCount}</span>
</div></a>


  <a
  className="nav-item nav-link active PT9-LFD me-3"
  id="all-nav-home-tab"
  data-toggle="tab"
  href="#all-nav-home"
  role="tab"
  aria-controls="all-nav-home"
  aria-selected="true"
  onClick={() => onSelect("all")}
  style={{
    transition: "all -0.1s ease",
    // padding: "7px 10px",
    margin: "0",
    border: "none",
    boxSizing: "border-box",
  }}
  data-text="All"
> <div className="d-flex align-items-center">
    <span>
        All
    </span>
    <span className="badge badge-primary ml-1">{allCount}</span>
  </div>

</a>

{data?.map((tab) => (
<a
className={`nav-item nav-link PT9-LFD ${tab?.name.toLowerCase()}-nav-tab`} // Dynamic class based on tab name
id={`${tab?.name.toLowerCase()}-nav-tab`} // Dynamic id based on tab name
data-toggle="tab"
href={`#${tab?.name.toLowerCase()}-nav-home`}
role="tab"
aria-controls={`${tab?.name.toLowerCase()}-nav-home`}
aria-selected="false"
onClick={() => onSelect(tab?.id)}

style={{
  transition: "all -0.1s ease",
  // padding: "7px 10px",
  margin: "0",
  border: "none",
  boxSizing: "border-box",
}}
data-text={tab?.name}
>

  <div className="d-flex align-items-center">
    <span className="ic ic-19">
        <img  src={mediaRoute(tab?.page_icon)}></img>                                                                   
    </span>
    <span className="ml-1">
        {tab?.name} 
    </span>
    <span className="badge badge-primary ml-1">{tab?.doc_count}</span>
  </div>



</a>
))}


</div>
  );
};

export default Tabs;
