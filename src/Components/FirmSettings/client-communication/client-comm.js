import React, { useEffect, useState } from "react";
import CommonHeader from "../common/common-header";
import "./client-comm.css";
import Input from "../common/Input";
import useClientCommuincation, {
  useSaveClientCommunication,
} from "./hooks/useClientCommunication";
import useFetchNumbers, { usePurchaseNumber } from "./hooks/useFetchNumbers";

const ClientCommunication = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [fetchTriggered, setFetchTriggered] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState("");
  const [debouncedAreaCode, setDebouncedAreaCode] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleAreaCodeChange = (e) => {
    setAreaCode(e.target.value);
    setFetchTriggered(false);
  };
  const handleNumberSelect = (e) => setSelectedNumber(e.target.value);

  const { data, refetch } = useClientCommuincation();

  const { SaveClientCommunication } = useSaveClientCommunication();

  const {
    data: numbers,
    loading,
    error,
  } = useFetchNumbers(
    debouncedAreaCode && fetchTriggered ? debouncedAreaCode : null
  );

  const { savePhoneNumber } = usePurchaseNumber();

  useEffect(() => {
    if (data) {
      setEmail(data.attorneyprofile.mailing_email);
      setPassword(data.attorneyprofile.mailing_password);
    }
  }, [data]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (areaCode) {
        setDebouncedAreaCode(areaCode);
      }
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [areaCode]);

  const handleSave = async () => {
    console.log("email", email, password);
    await SaveClientCommunication({
      mailing_email: email,
      mailing_password: password,
    });
    refetch();
  };

  const fetchNumbers = () => {
    if (debouncedAreaCode) {
      setFetchTriggered(true);
    }
  };

  const handlePurchaseNumber = async () => {
    console.log("selectedNumber", selectedNumber);
    // Purchase
    await savePhoneNumber({
      selectNum: selectedNumber,
    });
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      {/* Client Comm Nav */}
      <div className="col-lg-12">
        <h3 className="mt-2 mb-3">Client Communication</h3>
        <Input
          label="Email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={handleEmailChange}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
        />
        <small
          id="emailHelp"
          className="form-text text-muted mt-0 m-b-5 col-sm-6"
        >
          Goto{" "}
          <a href="https://myaccount.google.com/security" class="blue-color">
            Gmail Settings
          </a>{" "}
          Gmail Settings, and make sure that Multi-Factor Authentication is
          turned on. Generate an App password and enter the value above.
        </small>
        <div className="col-sm-6">
          <button className="btn btn-success " onClick={handleSave}>
            Save Credentials
          </button>
        </div>
      </div>
      <div className="col-lg-12">
        {data && data?.existing_num && (
          <>
            <h3 className="mt-5 mb-3">Firm Texting Phone Number</h3>
            <div id="existing-db" className="col-sm-6 top-head">
              <div className="d-flex align-items-center">
                <label className="mr-2  m-b-0">Number: </label>
                <input
                  type="text"
                  value={data?.existing_num?.number}
                  readonly=""
                  style={{ border: "none" }}
                ></input>
              </div>
              <div className="d-flex align-items-center">
                <label className="mr-2 m-b-0">Country Code: </label>
                <input
                  type="text"
                  value={data?.existing_num?.country_code}
                  readonly=""
                  style={{ border: "none" }}
                ></input>
              </div>
            </div>
          </>
        )}
        {data && !data?.existing_num && (
          <>
            <h3 className="mt-5 mb-3">Purchase Phone Numbers</h3>
            <div className="col-sm-6">
              <label>Enter Area Code:</label>
              <input
                type="text"
                value={areaCode}
                onChange={handleAreaCodeChange}
                className="form-control mb-3"
                placeholder="Enter area code"
              />
              {numbers && (
                <div id="existing-db" className=" top-head m-b-5">
                  <div className="d-flex align-items-center">
                    <select
                      className="form-control m-r-5"
                      value={selectedNumber}
                      onChange={handleNumberSelect}
                    >
                      <option value="">Select a number</option>
                      {numbers.data.map((num) => (
                        <option key={num.id} value={num.e164}>
                          {num.international_number_formatted} -{" "}
                          {num.country_code}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-success"
                      onClick={handlePurchaseNumber}
                      disabled={!selectedNumber}
                    >
                      Purchase Number
                    </button>
                  </div>
                </div>
              )}
              <button className="btn btn-primary" onClick={fetchNumbers}>
                Fetch Numbers
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientCommunication;
