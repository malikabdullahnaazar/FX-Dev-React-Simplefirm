import React from "react";

function ExpertContact({ object, onSelectExpert }) {
  // Formating phone number if exist
  const formatPhoneNumber = (number) => {
    if (!number) return null;
    const areaCode = number.slice(0, 3);
    const firstPart = number.slice(3, 6);
    const secondPart = number.slice(6);
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  };

  return (
    <>
      <div className="info-div">
        <div className="" onClick={onSelectExpert}>
          <div>
            <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
              Expert
            </p>


            {object?.expert_catagery_names?.length ? (
              <p className="text-capitalize">{object.expert_catagery_names[0]}</p>
            ) : (
              <p className="text-primary-50">Category</p>
            )}

            {object?.expert_contact?.first_name ? (
              <p className="text-capitalize">
                {object?.title ? <>{object.title} {" "}</>: ''}
                {object.expert_contact.first_name}{" "}
                {object.expert_contact.last_name}
              </p>
            ) : (
              <p className="text-primary-50">Full Name</p>
            )}
            <div>
            <p className='inline-row-h-21 text-capitalize ' style={{textWrap:'nowrap'}}>
                {object?.expert_contact?.address1 || object?.expert_contact?.address2 ? (
                  <>
                    {object?.expert_contact?.address1 && (
                      <span>{object?.expert_contact?.address1}, </span>
                    )}
                    {object?.expert_contact?.address2 && (
                      <span>{object?.expert_contact?.address2}</span>
                    )}
                  </>
                ) : (
                  <span className="text-primary-50">Address</span>
                )}
              </p>
              <p className="inline-row-h-21 text-capitalize">
                {object?.expert_contact?.city ? (
                  object.expert_contact.city
                ) : (
                  <span className="text-primary-50">city</span>
                )}{" "}
                {object?.expert_contact?.state ? (
                  object.expert_contact.state
                ) : (
                  <span className="text-primary-50">state</span>
                )}
                ,{" "}
                {object?.expert_contact?.zip ? (
                  object.expert_contact.zip
                ) : (
                  <span className="text-primary-50">zip</span>
                )}
              </p>
            </div>
            <div>
              <p className="inline-row-h-21">
                {object?.expert_contact?.phone_number ? (
                  formatPhoneNumber(object.expert_contact.phone_number)
                ) : (
                  <span className="text-primary-50">(###) ###-####</span>
                )}
                <small className="ml-1 mr-1 text-primary-50">ext</small>{object?.expert_contact?.phone_ext||""}
              </p>
              <p className="inline-row-h-21">
                {object?.expert_contact?.fax ? (
                  formatPhoneNumber(object.expert_contact.fax)
                ) : (
                  <span className="text-primary-50">(###) ###-####</span>
                )}
                <small className="ml-1 text-primary-50">fax</small>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <a
            style={{ height: "25px" }}
            href="#"
            className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center overflow-hidden info_email m-b-5 p-l-6 p-r-6"
          >
            <i className="ic ic-19 ic-email-3d mr-1"></i>
            <p className="overflow-hidden">{object?.expert_contact?.email}</p>
          </a>
          <a
            style={{ height: "25px" }}
            href="#"
            className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
          >
            <i className="ic ic-19 ic-generate-document mr-1"></i>
            Generate Document
          </a>
        </div>
      </div>
    </>
  );
}

export default ExpertContact;
