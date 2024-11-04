import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Avatar from "../../../../assets/images/avatar.png";
import axios from 'axios';
import { getCaseId, getClientId, getToken } from "../../../../Utils/helper";

const ProviderCharges = forwardRef((props, ref) => {
  const {
    handleClose, caseProviderId
  } = props;

    // Hasnat

    const origin = process.env.REACT_APP_BACKEND_URL;

    const [providerAmount, setProviderAmount] = useState('');
    const [providerInsPaid, setProviderInsPaid] = useState('');
    const [providerWriteOff, setProviderWriteOff] = useState('');
    const [providerMedPay, setProviderMedPay] = useState('');
    const [providerReduction, setProviderReduction] = useState('');
    const [providerPatientPaid, setProviderPatientPaid] = useState('');
    const [providerFinalAmount, setProviderFinalAmount] = useState('');
    const [providerLiens, setProviderLiens] = useState('');


    useEffect(() => {
        console.log("caseProviderId has been updated:", caseProviderId);
        const fetchData = async () => {
            try {
                const response = await 
                axios.get(`${origin}/api/treatment/medical-provider-charges/${caseProviderId}/`);
                const data = response.data;
                console.log("charges:", data);
                console.log('Type of providerAmount:', typeof data.providerAmount);
                setProviderAmount(parseFloat(data.providerAmount).toFixed(2));
                setProviderInsPaid(parseFloat(data.providerInsPaid).toFixed(2));
                setProviderWriteOff(parseFloat(data.providerWriteOff).toFixed(2));
                setProviderMedPay(parseFloat(data.providerMedPay).toFixed(2));
                setProviderReduction(parseFloat(data.providerReduction).toFixed(2));
                setProviderPatientPaid(parseFloat(data.providerPatientPaid).toFixed(2));
                setProviderFinalAmount(parseFloat(data.providerFinalAmount).toFixed(2));
                setProviderLiens(parseFloat(data.providerLiens).toFixed(2));
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, [caseProviderId]);

    useEffect(() => {
      calculateFinalAmount();
    }, [providerAmount, providerInsPaid, providerWriteOff, providerMedPay, providerReduction, providerPatientPaid]);

    const calculateFinalAmount = () => {
        const total = parseFloat(providerAmount) - parseFloat(providerInsPaid) + parseFloat(providerWriteOff)
         + parseFloat(providerMedPay) + parseFloat(providerReduction) + parseFloat(providerPatientPaid);
        setProviderLiens(total.toFixed(2));
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const floatValue = parseFloat(value).toFixed(2);

        switch (name) {
            case "provider-amount":
                setProviderAmount(floatValue);
                break;
            case "provider-ins_paid":
                setProviderInsPaid(floatValue);
                break;
            case "provider-write_off":
                setProviderWriteOff(floatValue);
                break;
            case "provider-medpaypaip":
                setProviderMedPay(floatValue);
                break;
            case "provider-reduction":
                setProviderReduction(floatValue);
                break;
            case "provider-patient_paid":
                setProviderPatientPaid(floatValue);
                break;
            default:
                break;
        }
        //setTimeout(calculateFinalAmount, 0);
        calculateFinalAmount;
    };

    useImperativeHandle(ref, () => ({
      save: async () => {

        const total = parseFloat(providerAmount) + parseFloat(providerInsPaid) + parseFloat(providerWriteOff) + 
          parseFloat(providerMedPay) + parseFloat(providerReduction) + parseFloat(providerPatientPaid);
          const formattedTotal = total.toFixed(2);
          setProviderFinalAmount(formattedTotal);
      

        try {
            const response = await axios.post(`${origin}/api/treatment/medical-provider-charges-edit/`, { 
                caseProviderId,
                'provider-amount': parseFloat(providerAmount).toFixed(2),
                'provider-ins_paid': parseFloat(providerInsPaid).toFixed(2),
                'provider-write_off': parseFloat(providerWriteOff).toFixed(2),
                'provider-medpaypaip': parseFloat(providerMedPay).toFixed(2),
                'provider-reduction': parseFloat(providerReduction).toFixed(2),
                'provider-patient_paid': parseFloat(providerPatientPaid).toFixed(2),
                'provider_final_amount': formattedTotal
            });

            console.log('Submit response:', response.data);
            handleClose();
        } catch (error) {
            console.error('Error submitting data', error);
        }
      }
    }));

    

  return (
    <div
      className="tab-pane fade"
      id="provider-charges-tab"
      role="tabpanel"
      aria-labelledby="provider-charges-link"
    >
        <input
          type="hidden"
          name="csrfmiddlewaretoken"
          value="N6M9Uf6bX2Q7qRbnGgRqvl0siI0yBtbyY1vqFdZxsOiZYgVn1aZKPvl5F7qaxvvU"
        />

        <input type="text" id="provider-id" name="provider-id" hidden />

        <div className="row align-items-end form-group">
          <div className="col-md-2 text-left labe-col">
            <span className="d-block text-grey" id="modal-med-provider-name">
              Medical Provider
            </span>
            <span className="d-block text-grey" id="modal-firm-name">
              Law Firm
            </span>
          </div>
          <div className="col-md-10">
            <div className="row pr-3">
              <div className="col p-1">
                <span className="d-block top-label">Original</span>
                <div className="form-group">
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      name="orignal"
                      placeholder="999,999.99"
                      value=""
                      className="form-control border-0 text-grey"
                      readonly
                    />
                  </div>
                </div>
                <div className="form-group mb-0">
                  <div className="input-group-charge">
                    <div className=" input-group-text-charge pr-1">$</div>

                    <input
                      type="number"
                      name="provider-amount"
                      value={providerAmount}
                      onChange={handleInputChange}
                      className="form-control right-align-price"
                    />
                  </div>
                </div>
              </div>
              <div className="col p-1">
                <span className="d-block top-label">HI Paid</span>
                <div className="form-group">
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text border-0 text-grey">
                        $
                      </div>
                    </div>
                    <input
                      type="text"
                      name="ins_paid"
                      placeholder="999,999.99"
                      value=""
                      className="form-control border-0 text-grey"
                      readonly
                    />
                  </div>
                </div>
                <div className="form-group mb-0">
                  <div className="input-group-charge">
                    <div className="input-group-text-charge pr-1">$</div>
                    <input
                      type="number"
                      name="provider-ins_paid"
                      value={providerInsPaid}
                      onChange={handleInputChange}
                      className="form-control right-align-price"
                    />
                  </div>
                </div>
              </div>
              <div className="col p-1">
                <span className="d-block top-label">HI Reduction</span>
                <div className="form-group">
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text border-0 text-grey">
                        $
                      </div>
                    </div>
                    <input
                      type="text"
                      name="ins_reduction"
                      placeholder="999,999.99"
                      value=""
                      className="form-control border-0 text-grey"
                      readonly
                    />
                  </div>
                </div>
                <div className="form-group  mb-0">
                  <div className="input-group-charge">
                    <div className="input-group-text-charge pr-1">$</div>

                    <input
                      type="number"
                      name="provider-write_off"
                      value={providerWriteOff}
                      onChange={handleInputChange}
                      className="form-control right-align-price"
                    />
                  </div>
                </div>
              </div>
              <div className="col p-1">
                <span className="d-block top-label">MP / PIP</span>
                <div className="form-group">
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text border-0 text-grey">
                        $
                      </div>
                    </div>
                    <input
                      type="text"
                      name="medpaypaip"
                      placeholder="999,999.99"
                      value=""
                      className="form-control border-0 text-grey"
                      readonly
                    />
                  </div>
                </div>
                <div className="form-group  mb-0">
                  <div className="input-group-charge">
                    <div className="input-group-text-charge pr-1">$</div>
                    <input
                      type="number"
                      name="provider-medpaypaip"
                      value={providerMedPay}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="col p-1">
                <span className="d-block top-label">Reduc.</span>
                <div className="form-group">
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text border-0 text-grey">
                        $
                      </div>
                    </div>
                    <input
                      type="text"
                      name="reduction"
                      placeholder="999,999.99"
                      value=""
                      className="form-control border-0 text-grey"
                      readonly
                    />
                  </div>
                </div>
                <div className="form-group  mb-0">
                  <div className="input-group-charge">
                    <div className="input-group-text-charge pr-1">$</div>

                    <input
                      type="number"
                      name="provider-reduction"
                      value={providerReduction}
                      onChange={handleInputChange}
                      className="form-control right-align-price"
                    />
                  </div>
                </div>
              </div>
              <div className="col p-1">
                <span className="d-block top-label">Client Paid</span>
                <div className="form-group">
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text border-0 text-grey">
                        $
                      </div>
                    </div>
                    <input
                      type="text"
                      name="patient_paid"
                      value=""
                      className="form-control border-0 text-grey"
                      readonly
                    />
                  </div>
                </div>
                <div className="form-group  mb-0">
                  <div className="input-group-charge">
                    <div className="input-group-text-charge pr-1">$</div>

                    <input
                      type="number"
                      name="provider-patient_paid"
                      value={providerPatientPaid}
                      onChange={handleInputChange}
                      className="form-control right-align-price"
                    />
                  </div>
                </div>
              </div>
              <div className="col p-1">
                <span className="d-block top-label">Lien</span>
                <div className="form-group">
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text border-0 text-grey">
                        $
                      </div>
                    </div>
                    <input
                      type="text"
                      name="final_amount"
                      placeholder="999,999.99"
                      value=""
                      className="form-control border-0 text-grey"
                      readOnly
                    />
                  </div>
                </div>
                <div className="form-group  mb-0">
                  <div className="input-group-charge">
                    <div className="input-group-text-charge pr-1">$</div>

                    <input
                      type="number"
                      name="provider_final_amount"
                      value={providerLiens}
                      onChange={handleInputChange}
                      className="form-control right-align-price"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="col p-1">
                <span className="d-block top-label">Final Amount</span>
                <div className="form-group">
                  <div className="input-group mb-2">
                    <div className="input-group-prepend">
                      <div className="input-group-text border-0 text-grey">
                        $
                      </div>
                    </div>
                    <input
                      type="text"
                      name="final"
                      value=""
                      className="form-control border-0 text-grey"
                      readonly
                    />
                  </div>
                </div>
                <div className="form-group  mb-0">
                  <div className="input-group-charge">
                    <div className="input-group-text-charge no-border pr-1">$</div>

                    <input
                      type="number"
                      name="final"
                      value={providerFinalAmount}
                      onChange={handleInputChange}
                      className="form-control right-align-price"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
);
}
);

export default ProviderCharges;
