import React, { useEffect, useState } from "react";

const PendingTasks = (chats) => {
  const pendings = chats.chats || [];

  return (
    <>
      <div className="pending-tasks m-b-5" style={{zIndex: "1"}}>
        <div className="background-main-10 height-21">
          <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100 mt-2">
            Pending tasks
          </h4>
        </div>
        <div className="pending-tasks-col-wrapper row no-gutters">
          <div className="task p-t-5 p-r-5 p-b-5 p-l-5">
            <div className="task-count">
              <h2 className="text-lg text-vivid-cerulean">
                {pendings?.notification_count ?? 0}
              </h2>
              <div class="line-chart" id="chats">
                <svg width="100" height="35">
                  <path
                    fill="none"
                    stroke="#43A3E4"
                    stroke-width="2"
                    d="M0,0L3.3333333333333335,1.9444444444444446C6.666666666666667,3.8888888888888893,13.333333333333334,7.777777777777779,20,8.75C26.666666666666668,9.722222222222223,33.333333333333336,7.777777777777778,40,7.291666666666667C46.666666666666664,6.8055555555555545,53.333333333333336,7.777777777777778,60,7.291666666666667C66.66666666666667,6.805555555555556,73.33333333333333,4.861111111111112,80,3.4027777777777786C86.66666666666667,1.9444444444444453,93.33333333333333,0.9722222222222227,96.66666666666667,0.4861111111111113L100,0"
                    stroke-dasharray="102.78759765625 102.78759765625"
                    stroke-dashoffset="0"
                  ></path>
                </svg>
              </div>
            </div>
            <p>New Chats</p>
          </div>
          <div className="task p-t-5 p-r-5 p-b-5 p-l-5">
            <div className="task-count">
              <h2 className="text-lg text-violet">
                {pendings?.tasks_count ?? 0}
              </h2>
              <div class="line-chart" id="tasks">
                <svg width="100" height="35">
                  <path
                    fill="none"
                    stroke="#8265F1"
                    stroke-width="2"
                    d="M0,4.117647058823531L3.3333333333333335,3.83169934640523C6.666666666666667,3.5457516339869293,13.333333333333334,2.973856209150327,20,2.4019607843137254C26.666666666666668,1.8300653594771241,33.333333333333336,1.2581699346405237,40,1.086601307189543C46.666666666666664,0.9150326797385627,53.333333333333336,1.1437908496732025,60,1.029411764705882C66.66666666666667,0.9150326797385615,73.33333333333333,0.45751633986928075,80,0.3431372549019609C86.66666666666667,0.22875816993464101,93.33333333333333,0.45751633986928203,96.66666666666667,0.5718954248366025L100,0.686274509803923"
                    stroke-dasharray="100.13848876953125 100.13848876953125"
                    stroke-dashoffset="0"
                  ></path>
                </svg>
              </div>
            </div>
            <p>Tasks</p>
          </div>
          <div className="task p-t-5 p-r-5 p-b-5 p-l-5">
            <div className="task-count">
              <h2 className="text-lg text-amethyst">
                {pendings?.doc_review_count ?? 0}
              </h2>
              <div class="line-chart" id="reviews">
                <svg width="100" height="35">
                  <path
                    fill="none"
                    stroke="#A85DAB"
                    stroke-width="2"
                    d="M0,5.384615384615385L3.3333333333333335,5.833333333333333C6.666666666666667,6.282051282051282,13.333333333333334,7.179487179487178,20,6.73076923076923C26.666666666666668,6.28205128205128,33.333333333333336,4.4871794871794854,40,4.038461538461537C46.666666666666664,3.589743589743589,53.333333333333336,4.487179487179486,60,4.038461538461538C66.66666666666667,3.58974358974359,73.33333333333333,1.794871794871795,80,1.346153846153846C86.66666666666667,0.8974358974358969,93.33333333333333,1.7948717948717938,96.66666666666667,2.2435897435897423L100,2.6923076923076907"
                    stroke-dasharray="100.55430603027344 100.55430603027344"
                    stroke-dashoffset="0"
                  ></path>
                </svg>
              </div>
            </div>
            <p>Document Reviews</p>
          </div>
          <div className="task p-t-5 p-r-5 p-b-5 p-l-5">
            <div className="task-count">
              <h2 className="text-lg text-carmin-pink">11</h2>
              <div class="line-chart" id="communications">
                <svg width="100" height="35">
                  <path
                    fill="none"
                    stroke="#E16341"
                    stroke-width="2"
                    d="M0,5.833333333333332L3.3333333333333335,5.347222222222221C6.666666666666667,4.861111111111111,13.333333333333334,3.8888888888888893,20,3.4027777777777786C26.666666666666668,2.916666666666668,33.333333333333336,2.916666666666668,40,2.4305555555555567C46.666666666666664,1.9444444444444453,53.333333333333336,0.9722222222222227,60,0.9722222222222227C66.66666666666667,0.9722222222222227,73.33333333333333,1.9444444444444453,80,2.4305555555555567C86.66666666666667,2.916666666666668,93.33333333333333,2.916666666666668,96.66666666666667,2.916666666666668L100,2.916666666666668"
                    stroke-dasharray="100.30804443359375 100.30804443359375"
                    stroke-dashoffset="0"
                  ></path>
                </svg>
              </div>
            </div>
            <p>Client Communications</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingTasks;
