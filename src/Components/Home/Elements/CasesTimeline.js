import React from "react";
import { standardFormatDate } from "../../../Utils/helper";

const CasesTimeline = (chats) => {
  const case_timeline = chats?.chats?.timeline_events;
  let lastDay = "";
  let lastDate = "";

  return (
    <div className="case-timeline right-calendar border-0 w-250 h-100">
      <div className="background-main-10 height-21 has-sticky-header">
        <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
          All Cases Timeline
        </h4>
      </div>
      <div className="calendar-borders position-relative border-0">
        {case_timeline && case_timeline.length > 0 ? (
          case_timeline.map((item, index) => (
            <div key={index}>
              {item.events.map((event, i) => {
                const currentDay = event.day_of_week;
                const currentDate = standardFormatDate(event.date);

                // Only display the day and date if they're different from the last one
                const displayDay = currentDay !== lastDay;
                const displayDate = currentDate !== lastDate;

                // Update last day and date
                if (displayDay) lastDay = currentDay;
                if (displayDate) lastDate = currentDate;

                return (
                  <div key={i}>
                      {displayDay && displayDate && (
                    <div className="d-flex justify-content-between task">
                        <div>
                          <strong>{currentDay}</strong>
                        </div>                    
                        <div>
                          <strong>{currentDate}</strong>
                        </div>
                      </div>
                      )}

                    {/* Always display the provider information */}
                    <div className="task d-block">
                      {event && event.type === "Litigation" ? (
                        event.is_allday ? (
                          <div className="d-flex justify-content-between">
                            <span>all-day</span>
                            <span className="text-right d-block">
                              {event.event_name}
                            </span>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between">
                            <span>
                              {standardFormatDate(event.date, "g:ia")}
                            </span>
                            <span className="text-right d-block full-width">
                              {event.event_name}
                            </span>
                          </div>
                        )
                      ) : event && event.type === "TreatmentDates" ? (
                        <span className="text-right d-block full-width">
                          {event.for_provider?.provider?.providerprofile
                            ?.office_name || "New Test Provider"}
                        </span>
                      ) : (
                        <span className="text-right d-block full-width">
                          New Test Provider
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default CasesTimeline;
