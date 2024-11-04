import React, { useState } from 'react';
import styled from 'styled-components';
import EditDeleteTreatmentDateModal from '../EditDeleteTreatmentDateModal'

function TreatmentDatesRow({ treatmentDate, specialitie, contact, setAllTreatmentDates }) {


    const StyledSpan = styled.span`
    background-color: ${({ speciality }) => speciality.color} !important;`;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
        <EditDeleteTreatmentDateModal 
            date={treatmentDate}
            show={show}
            handleClose={handleClose}
            setAllTreatmentDates={setAllTreatmentDates}
            key={treatmentDate.id}
        />
        <tr id="client_provider_treatment_date" className="black-color" onClick={handleShow}>
            <td className="td-autosize client-location-class bg-speciality-10">
                <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center justify-content-center">
                        <StyledSpan speciality={specialitie} className="d-flex align-items-center justify-content-center text-center text-white specialty-icon">
                            {specialitie.name ? specialitie.name[0] : ''}
                        </StyledSpan>
                    </div>
                    <p className="m-l-5 m-r-5">{contact.name}</p>
                </div>
            </td>
            <td className="td-autosize client-location-class">{treatmentDate.date ? treatmentDate.date.split('T')[0] : ''}</td>
            <td className="td-autosize py-2 treatment-note-doc"></td>
            <td className="client-location-class line-height-26">{treatmentDate.description}</td>
            <td className="client-location-class line-height-26"></td>
        </tr>
        </>
    )
}

export default TreatmentDatesRow
