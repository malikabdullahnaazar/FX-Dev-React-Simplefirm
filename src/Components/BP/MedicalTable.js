import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import EditDeleteTreatmentDateModal from './modals/EditDeleteTreatmentDateModal'


function mixColorWithWhite(hex, percentage) {
    const whitePercentage = (100 - percentage) / 100;

    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    // Mix each channel with white
    r = Math.floor(r + (255 - r) * whitePercentage);
    g = Math.floor(g + (255 - g) * whitePercentage);
    b = Math.floor(b + (255 - b) * whitePercentage);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const MainTd = styled.td`
background-color: ${({ speciality }) => mixColorWithWhite(speciality.color, 10)} !important;
   
`;

const StyledSpan = styled.span`
    background-color: ${({ speciality }) => speciality.color} !important;
`;

function MedicalTable({ date, specialitie, contact, setAllTreatmentDates }) {
    const bg_color_3300CC = {
        backgroundColor: '#3300CC'
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    return (

        <>
            <EditDeleteTreatmentDateModal 
                date={date}
                show={show}
                handleClose={handleClose}
                setAllTreatmentDates={setAllTreatmentDates}
                key={date.id}
                />
            <tr id="client_provider_treatment_date"
                className="black-color"
                onClick={handleShow}
            >
                <MainTd speciality={specialitie} className="td-autosize client-location-class bg-speciality-10">
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center justify-content-center">
                            <StyledSpan speciality={specialitie}
                                className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
                                style={bg_color_3300CC}>{specialitie.name[0]}</StyledSpan>
                        </div>
                        <p className="m-l-5 m-r-5">{contact.name}</p>
                    </div>
                </MainTd>

                <td className="td-autosize client-location-class">
                    {date.date ? formatDate(date.date.split('T')[0]) : ''}</td>

                <td className="td-autosize py-2 treatment-note-doc">

                </td>
                <td className="client-location-class line-height-26">
                    {date.description}</td>
                <td className="client-location-class line-height-26">
                </td>
            </tr>
        </>

    )
}

export default MedicalTable
