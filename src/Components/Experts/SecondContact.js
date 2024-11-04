import React from "react";

function SecondContact({ object, onSelectExpert }) {
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
              Expert Agency
            </p>

            <p className="inline-row-h-21">
              {object?.second_contact?.name ? (
                <>{object.second_contact.name}</>
              ) : (
                <span className="text-primary-50 text-capitalize">Agency name</span>
              )}
            </p>

            {object?.second_contact?.first_name ? (
              <p>
                {object.second_contact.first_name}{" "}
                {object.second_contact.last_name}
              </p>
            ) : (
              <p className="text-primary-50">Full Name</p>
            )}
            <div>
            <p className='inline-row-h-21 text-capitalize ' style={{textWrap:'nowrap'}}>
                {object?.second_contact?.address1 || object?.second_contact?.address2 ? (
                  <>
                    {object?.second_contact?.address1 && (
                      <span>{object?.second_contact?.address1}, </span>
                    )}
                    {object?.second_contact?.address2 && (
                      <span>{object?.second_contact?.address2}</span>
                    )}
                  </>
                ) : (
                  <span className="text-primary-50">Address</span>
                )}
              </p>

              <p className="inline-row-h-21 text-capitalize">
                {object?.second_contact?.city ? (
                  object.second_contact.city
                ) : (
                  <span className="text-primary-50">city</span>
                )}{" "}
                {object?.second_contact?.state ? (
                  object.second_contact.state
                ) : (
                  <span className="text-primary-50">state</span>
                )}
                ,{" "}
                {object?.second_contact?.zip ? (
                  object.second_contact.zip
                ) : (
                  <span className="text-primary-50">zip</span>
                )}
              </p>
            </div>
            <div>
              <p className="inline-row-h-21">
                {object?.second_contact?.phone_number ? (
                  formatPhoneNumber(object.second_contact.phone_number)
                ) : (
                  <span className="text-primary-50">(###) ###-####</span>
                )}
                <small className="ml-1 mr-1 text-primary-50">ext</small>{object?.second_contact?.phone_ext||""}
              </p>
              <p className="inline-row-h-21">
                {object?.second_contact?.fax ? (
                  formatPhoneNumber(object.second_contact.fax)
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
            <p className="overflow-hidden">{object?.second_contact?.email}</p>
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

export default SecondContact;
