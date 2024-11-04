import React, { useState } from "react";
import SendEmailBtn from "../Modals/SendEmailBtn";


const ContactPanel = ({
  id,
  panel_name,
  title,
  name,
  address1,
  address2,
  city,
  state,
  zip_code,
  phone_number,
  ext = "",
  fax_number,
  email,
  onSelectObject,
  buttonData,
  className = "",
  dynamic_label,
  genrate_doc_address,
}) => {
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
      <div className={`info-div ${className}`}>
        <div className="" onClick={onSelectObject}>
          <div>
            <p
              className="columnsTitle text-center text-primary font-weight-semibold text-uppercase d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "var(--primary-10)", height: "25px" }}
            >
              {panel_name}
            </p>
            {name?.trim() ? (
                <p style={{ backgroundColor: "var(--primary-2)" }} className="font-weight-semibold text-capitalize">{name}</p>
              ) : (
                <p
                  className="text-primary-50 font-weight-normal text-capitalize"
                  style={{ backgroundColor: "var(--primary-2)" }}
                >
                  {dynamic_label?.trim() ? dynamic_label : "Full Name"}
                </p>
              )}
            <div>
              <p
                className="inline-row-h-21 text-capitalize"
                style={{ backgroundColor: "var(--primary-4)" }}
              >
                {address1 || address2 ? (
                  <p className="font-weight-semibold ">
                  {address1 && <span>{address1}</span>}
                  {address1 && address2 && <span>, </span>} {/* Render comma only if both addresses exist */}
                  {address2 && <span>{address2}</span>}
                </p>
                ) : (
                  <span
                    className="text-primary-50 font-weight-normal text-capitalize"
                    style={{ backgroundColor: "var(--primary-4)" }}
                  >
                    Address
                  </span>
                )}
              </p>

              <p
                className="inline-row-h-21 text-capitalize"
                style={{ backgroundColor: "var(--primary-2)" }}
              >
                {city ?<span className="font-weight-semibold">{city},</span> : <span className="text-primary-50 font-weight-normal">city,</span>}{" "}
                {state ? <span className="font-weight-semibold">{state}</span>  : <span className="text-primary-50 font-weight-normal">state</span>}
                {" "}
                {zip_code ? (
                  <span className="font-weight-semibold">{zip_code}</span>
                ) : (
                  <span className="text-primary-50 font-weight-normal " style={{textTransform: "uppercase"}}>zip</span>
                )}
              </p>
            </div>
            <div>
              <p
                className="inline-row-h-21"
                style={{ backgroundColor: "var(--primary-4)" }}
              >
                {phone_number ? (
                 <span className="font-weight-semibold">{formatPhoneNumber(phone_number)}</span>
                ) : (
                  <span className="text-primary-50 font-weight-normal">(###) ###-####</span>
                )}
                {ext && (
                  <>
                  <small className="ml-1 text-primary-50 font-weight-normal">ext</small>{" "}
                  <span className="font-weight-semibold">{ext}</span>
                  </>
                )}
              </p>
              <p
                className="inline-row-h-21"
                style={{ backgroundColor: "var(--primary-2)" }}
              >
                {fax_number ? (
                  <span className="font-weight-semibold">{formatPhoneNumber(fax_number)}</span>
                  
                ) : (
                  <span className="text-primary-50 font-weight-normal">(###) ###-####</span>
                )}
                <small className="ml-1 text-primary-50 font-weight-normal">fax</small>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <SendEmailBtn email={email} />
          {buttonData?.map((button, index) => (
            <a
              href="#"
              id={index}
              style={button.style}
              className={`btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center ${button.className}`}
              onClick={() => button.onClick(id , genrate_doc_address)}
            >
              {button.iconClassName && (
                <i className={`${button.iconClassName} mr-1`}></i>
              )}
              {button.imgSrc && (
                <img
                  className={button.imgClassName}
                  src={button.imgSrc}
                  alt="icon"
                />
              )}
              {button.buttonText}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default ContactPanel;
