import React from "react";
import { useSelector } from "react-redux";

export default function AddFirmUserModal() {
  const add_firm_user = useSelector((state) => state.accident?.add_firm_user);

  return (
    <div
      className="modal fade"
      id="add_firm_user"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">
              <i className="fas fa-lock"></i>
              &nbsp; You do not have permission to add firm user
            </h5>
          </div>
          <div className="modal-body">
            <p>
              You can send a message to other team members on this case who have
              this user permission here:
            </p>
            <div className="mt-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Message"
                id="permission-message-add_firm_user"
              />
            </div>
            <div>
              {add_firm_user &&
                add_firm_user.map((case_user) => (
                  <button
                    className="mt-3 btn btn-success"
                    onclick="sendMessageCustom('{{case_user.id}}', '{{case_user.thread_message.id}}', 'add_firm_user')"
                  >
                    {case_user.profile_pic ? (
                      <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                        <img src="{{ case_user.profile_pic.url }}" alt="" />
                      </span>
                    ) : (
                      <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span>
                    )}

                    {case_user.user.first_name}
                    {case_user.user.last_name}
                  </button>
                ))}
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-start">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              id="cancel-modal-add_firm_user"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}