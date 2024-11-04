import React from 'react';
import { useMediaQuery } from "react-responsive";
const LitigationTimeLines = ({ timeline_events, sol_events }) => {
    // Media queries
    const isScreen50 = useMediaQuery({ minWidth: 2400 });
    const isScreen57 = useMediaQuery({ minWidth: 2100, maxWidth: 2350 });
    const isScreen67 = useMediaQuery({ minWidth: 1850, maxWidth: 2100 });
    const isScreen75 = useMediaQuery({ minWidth: 1650, maxWidth: 1850 });
    const isScreen90 = useMediaQuery({ minWidth: 1450, maxWidth: 1650 });
    const isScreen100 = useMediaQuery({ minWidth: 1050, maxWidth: 1450 });

    const emptyRows = (count) => {
        let rows = [];
        for (let i = 0; i < count; i++) {
            rows.push(
                <div className="d-flex justify-content-between task" key={`empty-${i}`}>
                    <div>
                        <strong>&nbsp;</strong>
                    </div>
                    <div>
                        <strong>&nbsp;</strong>
                    </div>
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="calendar-borders position-relative border-0" style={{ height: isScreen50 ? "16.5rem" : isScreen57 ? "19rem" : isScreen67 ? "15rem" : isScreen75 ? "55rem" : isScreen90 ? "58rem" : isScreen100 ? "65rem" : "30rem", overflowY: "scroll", scrollbarWidth: "none" }}>
            <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center">
                Litigation Timeline
            </h4>
            {timeline_events?.map((temp, index) => (
                <>
                    <div key={index} className="d-flex justify-content-between task">
                        <div>
                            <strong>{temp?.day_of_week}</strong>
                        </div>
                        <div>
                            <strong>{temp?.date}</strong>
                        </div>
                    </div>
                    {temp?.events.map((event, eventIndex) => {
                        if (event?.type === "Litigation") {
                            if (event?.is_allday) {
                                return (
                                    <div key={eventIndex} className="d-flex justify-content-between">
                                        <span>all-day</span>
                                        <span className="text-right d-block"><i></i> {event?.event_id?.event_name}</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={eventIndex} className="d-flex justify-content-between task">
                                        <div><strong>{event?.time}</strong></div>
                                        <div><strong>{event?.event_name}</strong></div>
                                    </div>
                                );
                            }
                        } else {
                            return (
                                <div class="d-flex justify-content-between">
                                    <span>all-day</span>
                                    <span class="text-right d-block full-width"><i></i> Served Date</span>
                                </div>
                            );
                        }
                    })}
                </>
            ))}
            {sol_events && sol_events?.map((sol, index) => (<>
                <div key={index} className="d-flex justify-content-between task">
                    <div><strong>{sol?.date}</strong></div>
                    <div><strong>{sol?.formatted_date}</strong></div>
                </div>
                {index === sol_events?.length - 1 && (
                    <div class="task justify-content-between">
                        <span>all-day</span>
                        <span class="text-right"><i></i> SOL Date</span>
                    </div>
                )}
            </>
            ))}
        </div>
    )
}
export default LitigationTimeLines