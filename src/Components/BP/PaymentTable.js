import React from 'react'

function PaymentTable({ tfAccounting, type }) {
    return (
        <tbody id="table-body-cat">
            <tr>
                <td className="td-autosize text-end">
                    <p id="client_prov_amount92">
                        $ <span>{ type === 'tf'? tfAccounting.original : tfAccounting.amount}</span>
                    </p>
                </td>
                <td className="td-autosize text-end">
                    <p id="client_prov_ins_paid92">
                        <span>{ type === 'tf'? '$'+tfAccounting.hi_paid : '-$'+tfAccounting.ins_paid}</span></p>
                </td>
                <td className="td-autosize text-end">
                    <p id="client_prov_write_off92">
                        -$ <span>{ type === 'tf'? tfAccounting.hi_reduction : tfAccounting.write_off}</span></p>
                </td>
                <td className="td-autosize text-end">
                    <p id="client_prov_medpaypaip92">
                        -$ <span>{ type === 'tf'? tfAccounting.mp_paid : tfAccounting.medpaypaip}</span></p>
                </td>
                <td className="td-autosize text-end">
                    <p id="client_prov_reduction92">
                        -$ <span>{ type === 'tf'? tfAccounting.reduction : tfAccounting.reduction}</span></p>
                </td>
                <td className="td-autosize text-end">
                    <p className="text-lg" id="client_prov_patient_paid92">
                        -$ <span>{ type === 'tf'? tfAccounting.patient_payment_value : tfAccounting.patient_paid}</span></p>
                </td>
                <td className="td-autosize text-end">
                    <p className="font-weight-bold" id="client_prov_final_amount92">
                        $ <span>{ type === 'tf'? tfAccounting.liens : tfAccounting.liens}</span></p>
                </td>
                <td className="td-autosize text-end">
                    <p className="font-weight-bold" id="client_prov_final92">
                        $ <span>{ type !== 'tf'? tfAccounting.final : null }</span></p>
                </td>
            </tr>
        </tbody>
    )
}

export default PaymentTable
