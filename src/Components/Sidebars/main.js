import React, { useEffect, useState } from "react";
import {
  getCaseId,
  getClientId,
  removeToken,
  getToken,
} from "../../Utils/helper";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import UserProfile from "./UserProfile";
import { persistor } from "../../Redux/store";
import { setCurrentTodosTab } from "../../Redux/actions";
import { userLogoutAPI } from "../../Providers/main";
import MedicalTreatmentIcon from "../../assets/images/medical-treatment-icon.svg";
import { setHeaderName } from "../../Redux/header_name/action";

const Sidebar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pages = useSelector((state) => state.caseData?.pages);
  const client = useSelector((state) => state?.caseData?.current?.for_client);
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client_id = getClientId();
  const case_id = getCaseId();
  const isSidebarOpen = useSelector((state) => state.menu.isOpen);

  const [hovered, setHovered] = useState(null);
  const handleLogout = (e) => {
    e.preventDefault();
    userLogoutAPI(getClientId(), getCaseId());
    removeToken();
    persistor.pause();
    persistor.flush().then(() => {
      return persistor.purge();
    });
    navigate("/");
    window.location.reload();
  };

  const addClickRecord = (page) => {
    console.log("page", page.page_url);
    dispatch(setCurrentTodosTab(0));
  };
  useEffect(() => {
    if (isSidebarOpen) {
      // document.body.classList.add(
      //   "modal-open",
      //   "has-blurred-bg",
      //   "has-static-overlay",
      // );
      document.getElementById("page-container")?.classList.add("menu-blur");
    } else {
      // document.body.classList.remove(
      //   "modal-open",
      //   "has-blurred-bg",
      //   "has-static-overlay",
      // );
      document.getElementById("page-container")?.classList.remove("menu-blur");
    }
    return () => {
      document.body.classList.remove(
        "modal-open",
        "has-blurred-bg",
        "has-static-overlay"
      );
    };
    // document.body.classList.add('modal-open has-blurred-bg has-static-overlay')
  }, [isSidebarOpen]);
  return (
    <aside
      id="leftSidebar"
      className={`menu-sidebar responsive-sidebar ${
        isSidebarOpen ? "left-in" : ""
      }`}
    >
      <div className="menu-sidebar__content">
        <nav className="navbar-sidebar position-relative hello">
          <ul className="list-unstyled navbar__list">
            {
              // client &&
              //   currentCase &&
              pages &&
                pages?.map((page) => {
                  return page.show_on_sidebar ? (
                    <li
                      className={`Row hc ${
                        page.page_url === window.location.pathname.split("/")[1]
                          ? "active"
                          : ""
                      } ${page.name === "Case" ? "mt-0" : ""}`}
                      style={{ display: "flex", overflow: "hidden" }}
                      onMouseEnter={() => setHovered(page.page_url)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => {
                        dispatch(setHeaderName(page.name));
                        console.log("page ==>", page.name);
                      }}
                    >
                      {page.name.toLowerCase() == "reports" ? (
                        <Link
                          // href={`${process.env.REACT_APP_BACKEND_URL
                          //   }/api/redirect/reports/?token=${getToken()}`}
                          to={`/bp-reports/${client_id}/${case_id}`}
                          onClick={() => addClickRecord(page)}
                          className="navbar_link_item"
                        >
                          <img src={page.page_icon} />
                          {page.name}
                        </Link>
                      ) : page.name.toLowerCase() == "treatment" ? (
                        <Link to={`/treatment/`}>
                          <img src={MedicalTreatmentIcon} />
                          {page.name}
                        </Link>
                      ) : (
                        <Link
                          to={`/${page.page_url}/${client_id}/${case_id}`}
                          onClick={() => addClickRecord(page)}
                          className="navbar_link_item"
                        >
                          <img src={page.page_icon} />
                          {page.name}
                        </Link>
                      )}
                      {/* {hovered !== page.page_url &&
                      page.page_url ==
                        window.location.pathname.split("/")[1] && (
                        <svg
                          width="12"
                          height="14"
                          viewBox="0 0 14 34"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z"
                            fill="#19395f"
                          />
                        </svg>
                      )} */}
                    </li>
                  ) : null;
                })
            }
          </ul>
          <ul className="list-unstyled navbar__list static-pages p-t-35">
            <li className="Row hc">
              <a
                href="#"
                style={{ textDecoration: "none", paddingLeft: "18px" }}
              >
                <i className="ic ic-23 ic-help-2"></i>
                Help
              </a>
              <div className="blueSpace"> </div>
            </li>
            <li className="Row hc">
              <Link
                to={`/bp-firmsetting/${getClientId()}/${getCaseId()}`}
                style={{ textDecoration: "none", paddingLeft: "18px" }}
              >
                <i className="ic ic-23 ic-settings-2"></i>
                Settings
              </Link>
              <div className="blueSpace"> </div>
            </li>
            <li className="Row hc">
              <a
                onClick={handleLogout}
                style={{ cursor: "pointer", paddingLeft: "18px" }}
              >
                <i className="ic ic-23 ic-logout2"></i>
                Log Out
              </a>
              <div className="blueSpace"> </div>
            </li>
          </ul>
          <UserProfile user={client} />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
