import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";

import { dummyFullAddress, dummyProvider } from "../../Utils/constants";
import LocationsFullAddress from "../common/LocationsFullAddress";
import ProviderModalChunk from "../common/ProviderModalChunk";
import {
  fetchClientProviderSpecialties,
  getProviderInfo,
  setBulkProviderData,
} from "../../Redux/client-providers/clientProviderSlice";
import { Modal } from "react-bootstrap";

function AddProviderDirectoryModal({
  providerPopUp,
  handleClose,
  isEdit,
  providerData,
}) {
  const dispatch = useDispatch();
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [stateData, setStateData] = useState([]);
  const [specialityColumn, setSpecialityColumn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(
    isEdit && providerData ? providerData : dummyProvider
  );
  // useeffects
  useEffect(() => {
    getStateData();
    getSpecialityData();
  }, []);
  useEffect(() => {
    if (providerData) {
      setForm(providerData);
      // console.log(providerData);
    } else {
      setForm(dummyProvider);
    }
  }, [providerData]);

  const handleCheckboxChange = (index, value) => {
    const updatedLocations = structuredClone(form.locations);

    const valueIndex =
      updatedLocations[index].speciality_checkbox.indexOf(value);
    if (valueIndex == -1) {
      updatedLocations[index].speciality_checkbox.push(value);
    } else {
      if (updatedLocations[index].speciality_checkbox.length === 1) {
        updatedLocations[index].speciality_checkbox.length = 0;
      } else {
        updatedLocations[index].speciality_checkbox.splice(valueIndex, 1);
      }
    }

    setForm((prevForm) => ({
      ...prevForm,
      locations: updatedLocations,
    }));
  };
  const getSpecialityData = async () => {
    try {
      const response = await axios.get(`${origin}/api/get/speciality/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      const responseData = response.data;
      setSpecialityColumn([
        ...responseData.speciality_first_column,
        ...responseData.speciality_second_column,
      ]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getStateData = async () => {
    try {
      const response = await axios.get(`${origin}/api/all/states/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setStateData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (parentKey, key, value) => {
    const updatedForm = {
      ...form,
      [parentKey]: {
        ...form[parentKey],

        [key]: value,
      },
    };
    setForm(updatedForm);
  };
  const handleLocationAddressChange = (key, value, locationId) => {
    const updatedLocations = form.locations.map((location) =>
      location.id === locationId
        ? {
            ...location,
            fullAddress: {
              ...location.fullAddress,
              [key]: value,
            },
          }
        : location
    );
    setForm((prev) => ({
      ...prev,
      locations: updatedLocations,
    }));
  };

  const handleAttorneySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isEdit) {
        response = await axios.patch(
          `${origin}/api/add/provider/${clientId}/${currentCaseId}/`,
          form,
          {
            headers: {
              Authorization: tokenBearer,
            },
          }
        );
      } else {
        response = await axios.post(
          `${origin}/api/add/provider/${clientId}/${currentCaseId}/`,
          form,
          {
            headers: {
              Authorization: tokenBearer,
            },
          }
        );
      }
      const data = await getProviderInfo(clientId, currentCaseId);
      dispatch(setBulkProviderData(data));
      setForm(dummyProvider);
      handleClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = (fullAddress, name) => {
    setForm((prev) => {
      if (providerData && isEdit) {
        return {
          ...prev,
          recordRequest: {
            ...fullAddress,
            name: prev.search_name_provider,
            id: prev.recordRequest?.id || null,
          },
          billingRequest: {
            ...fullAddress,
            name: prev.search_name_provider,
            id: prev.billingRequest?.id || null,
          },
          payRecord: {
            ...fullAddress,
            name: prev.search_name_provider,
            id: prev.payRecord?.id || null,
          },
          payBilling: {
            ...fullAddress,
            name: prev.search_name_provider,
            id: prev.payBilling?.id || null,
          },
          lienHolder: {
            ...fullAddress,
            name: prev.search_name_provider,
            id: prev.lienHolder?.id || null,
          },
        };
      }

      return {
        ...prev,
        recordRequest: {
          ...prev.recordRequest,
          ...fullAddress,
          name: prev.name_provider,
        },
        billingRequest: {
          ...prev.billingRequest,
          ...fullAddress,
          name: prev.name_provider,
        },
        payRecord: {
          ...prev.payRecord,
          ...fullAddress,
          name: prev.name_provider,
        },
        payBilling: {
          ...prev.payBilling,
          ...fullAddress,
          name: prev.name_provider,
        },
        lienHolder: {
          ...prev.lienHolder,
          ...fullAddress,
          name: prev.name_provider,
        },
      };
    });
  };

  const handleDeleteClick = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${origin}/api/add/provider/${clientId}/${currentCaseId}/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
          data: {
            id: providerData.id,
          },
        }
      );
      const data = await getProviderInfo(clientId, currentCaseId);
      dispatch(setBulkProviderData(data));

      handleClose();
    } catch (error) {
      console.error("Error deleting litigation events:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      scrollable={true}
      show={providerPopUp}
      onHide={handleClose}
      size="lg"
      className="provider-modal"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        className=" text-center p-0 popup-heading-color justify-content-center"
        style={{ backgroundColor: "#19395F" }}
      >
        {isEdit ? (
          <h5
            className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
            id="exampleModalLabel"
          >
            Edit the Medical Provider
          </h5>
        ) : (
          <h5
            className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
            id="exampleModalLabel"
          >
            Add a New Medical Provider
          </h5>
        )}
      </Modal.Header>
      <Modal.Body className="p-4 ">
        <p className="width-80  text-center">
          Input your new medical provider's information here.
        </p>
        <form className="py-3" onSubmit={handleAttorneySubmit}>
          {isEdit ? (
            ""
          ) : (
            <div className="row">
              <div className="col-md-12">
                <input
                  value={form.search_name_provider}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      search_name_provider: e.target.value,
                    }))
                  }
                  required={true}
                  type="text"
                  name="search_filter_provider_input"
                  placeholder="Type provider name to search directory then click an entry"
                  className="form-control mb-1"
                />
              </div>
            </div>
          )}
          <div className="row align-items-center form-group m-b-5">
            <div className="col-md-4">
              {isEdit ? (
                <input
                  value={form.search_name_provider}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      search_name_provider: e.target.value,
                    }))
                  }
                  required={true}
                  type="text"
                  name="search_filter_provider_input"
                  placeholder="Enter Name of Provider"
                  className="form-control height-25 p-1"
                />
              ) : (
                <input
                  value={form.name_provider}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name_provider: e.target.value,
                    }))
                  }
                  required={true}
                  type="text"
                  name="name_provider"
                  placeholder="Enter Name of Provider"
                  className="form-control height-25 p-1"
                />
              )}
            </div>
            <div className="col-md-4">
              <input
                required={true}
                value={form.website}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    website: e.target.value,
                  }))
                }
                type="url"
                name="website"
                placeholder="Enter Website Url"
                className="form-control height-25 p-1"
              />
            </div>
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-black">Searchable</span>
            </div>
            <div className="col-md-2">
              <input
                type="checkbox"
                checked={form.isSearchable}
                name="searchable"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isSearchable: e.target.checked,
                  }))
                }
                className=""
              />
            </div>
          </div>
          <div className="d-flex justify-content-between py-4 align-items-center">
            <h4 className="text-center text-uppercase color-p0 align-self-end">
              Location
            </h4>
            <div className="d-flex">
              <button
                onClick={() =>
                  setForm((prev) => {
                    return {
                      ...form,
                      locations: [
                        ...prev.locations,
                        {
                          id: prev.locations[-1],
                          speciality_checkbox: [],
                          fullAddress: {
                            address: "",
                            address2: "",
                            city: "",
                            state: "",
                            zip: "",
                            phone: "",
                            fax: "",
                            email: "",
                          },
                        },
                      ],
                    };
                  })
                }
                type="button"
                className="btn btn-primary btn-sm btn-copy d-flex align-items-center height-25 ml-1"
                style={{ color: "white" }}
              >
                <span className="m-l-5 text-white-p" style={{ color: "white" }}>
                  + Add Location
                </span>
              </button>
            </div>
          </div>
          <div id="location_block">
            <div>
              {/* started add location div  */}
              {form.locations.map((location, index) => (
                <div key={location.id} className="row " id="new-flex">
                  <div className="col-md-4  display-flex flex-wrap">
                    <div className="row">
                      {/* <div className="col-md-6"> */}
                      {specialityColumn?.map((i) => (
                        <div
                          className="col-6 display-flex  align-center pt-1 m-0"
                          key={i.id}
                        >
                          <input
                            type="checkbox"
                            style={{ cursor: "pointer" }}
                            className=""
                            value={i.name}
                            // checked={true}
                            checked={
                              location.speciality_checkbox
                                ? location?.speciality_checkbox?.some(
                                    (sp) => sp == i.name
                                  )
                                : false
                            }
                            onChange={(event) =>
                              handleCheckboxChange(index, i.name)
                            }
                          />
                          <label className="mb-0 pl-2 text-nowrap ">
                            {i.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <LocationsFullAddress
                    name={form.name_provider}
                    locationId={location.id}
                    stateData={stateData}
                    FullAddress={location.fullAddress}
                    handleCopyAddress={handleCopyAddress}
                    handleLocationAddressChange={handleLocationAddressChange}
                  />
                </div>
              ))}
              {/* end add location div */}

              {/* reocrds section */}
              <ProviderModalChunk
                formDataChunk={form.recordRequest}
                formDataKey={"recordRequest"}
                handleAddressChange={handleAddressChange}
                stateData={stateData}
                title={"Records Request"}
              />
              {/* Billing Request */}
              <ProviderModalChunk
                formDataChunk={form.billingRequest}
                formDataKey={"billingRequest"}
                handleAddressChange={handleAddressChange}
                stateData={stateData}
                title={"Billing Request"}
              />

              {/* Pay Records Req */}
              <ProviderModalChunk
                formDataChunk={form.payRecord}
                formDataKey={"payRecord"}
                handleAddressChange={handleAddressChange}
                stateData={stateData}
                title={"Pay Records Req"}
              />

              {/* Pay Records Req */}
              <ProviderModalChunk
                formDataChunk={form.payBilling}
                formDataKey={"payBilling"}
                handleAddressChange={handleAddressChange}
                stateData={stateData}
                title={"Pay Billing Req"}
              />

              {/* Pay Records Req */}
              <ProviderModalChunk
                formDataChunk={form.lienHolder}
                formDataKey={"lienHolder"}
                handleAddressChange={handleAddressChange}
                stateData={stateData}
                title={"Lien Holder"}
              />
            </div>
          </div>

          <div className="display-flex justify-content-between pt-4">
            <button
              disabled={loading}
              style={{
                cursor: loading ? "not-allowed" : "default",
              }}
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              data-dismiss="modal"
            >
              Close
            </button>
            {isEdit && (
              <button
                disabled={loading}
                style={{
                  cursor: loading ? "not-allowed" : "default",
                }}
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  console.log("cccccccccccccccddddddddddddd");
                  // setForm(dummyProvider);
                  handleDeleteClick();
                }}
              >
                Delete
              </button>
            )}
            <button
              disabled={loading}
              style={{
                cursor: loading ? "not-allowed" : "default",
              }}
              type="submit"
              className="btn popup-heading-color save-btn-popup"
              onClick={handleAttorneySubmit}
            >
              Save
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default React.memo(AddProviderDirectoryModal);
