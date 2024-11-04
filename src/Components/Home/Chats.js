import React, { useEffect, useState } from "react";
import "../../../public/BP_resources/css/home_component.css";
import UserPreference from "./UserPrefrence";
import settingsIcon from "../../assets/images/settings_icon.png";
import axios from "axios";
import { standardFormatDate } from "../../Utils/helper";

const Chats = () => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [pinnedCases, setPinnedCases] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState(5); // Default number of visible cards

  const fetchPinnedCase = async () => {
    try {
      const response = await axios.get(origin + "/api/home/pinned-cases/", {
        headers: {
          Authorization: token,
        },
      });
      const pinnnedArr = [
        response.data?.p1,
        response.data?.p2,
        response.data?.p3,
        response.data?.p4,
        response.data?.p5,
        response.data?.p6,
        response.data?.p7,
        response.data?.p8,
        response.data?.p9,
        response.data?.p10,
      ];

      setPinnedCases(pinnnedArr);
    } catch (error) {
      console.log("Failed to fetch Pinned Data:", error);
    }
  };
  useEffect(() => {
    fetchPinnedCase();
  }, []);

  useEffect(() => {
    const updateVisibleCards = () => {
      const container = document.querySelector(".pinned-casses-main-container");
      if (container) {
        const containerWidth = container.clientWidth;
        const maxVisibleCards = Math.floor(containerWidth / 275);

        const newVisibleCards = pinnedCases?.map(
          (_, index) => index < maxVisibleCards
        );
        setVisibleCards(newVisibleCards);
      }
    };

    // Initial calculation
    updateVisibleCards();

    // Listen for window resize events
    window.addEventListener("resize", updateVisibleCards);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", updateVisibleCards);
    };
  }, [pinnedCases]);

  return (
    <div className="content-top" style={{ marginTop: "5px" }}>
      <div
        className="top-row"
        style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
      >
        <div className="client-communication-wrapper w-100 custom-gutter">
          <div className="pinned-casses-main-container">
                {pinnedCases?.length > 0 &&
                  pinnedCases?.map((caseItem, index) => {
                    if (
                      !caseItem ||
                      !visibleCards[index] ||
                      !caseItem.for_client?.first_name ||
                      !caseItem.for_client?.last_name
                    ) {
                      return null;
                    }
                
                    const { profile_pic, first_name, last_name } =
                      caseItem.for_client || {
                        profile_pic: "",
                        first_name: "",
                        last_name: "",
                      };
                    const { case_type, incident_date } = caseItem || {
                      case_type: "",
                      incident_date: "",
                    };

                    return (
                      <div key={index} className="pinned-casse-card-secondary">
                        <div className="d-flex flex-row justify-content-between">
                          <div className="d-flex align-items-center">
                            <span className="ic ic-avatar-secondary ic-29 has-cover-img">
                              <img
                                className="output-3 theme-ring"
                                // src={profile_pic}
                                // alt="Profile"
                              />
                            </span>
                
                            <div className="pinned-case-user-info">
                              <span>
                                {first_name} {last_name}
                              </span>
                            </div>
                          </div>
                
                          <div className="pinned-casse-case-info">
                            <span className="inline-row-h-21">
                              {case_type?.casetype_icon ? (
                                <img
                                  src={case_type?.casetype_icon}
                                  alt="Case Icon"
                                />
                              ) : (
                                ""
                              )}{" "}
                              {case_type?.name || ""}
                            </span>
                            <p className="inline-row-h-21">
                              {standardFormatDate(incident_date) || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="background-main-10 pinned-casse-btn"
            >
              <img
                src={settingsIcon}
                alt="Settings Icon"
                style={{ width: "32px", height: "32px" }}
              />
              User <br /> Options
            </button>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <UserPreference
          UserPreference={isSettingsOpen}
          handleClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default Chats;
