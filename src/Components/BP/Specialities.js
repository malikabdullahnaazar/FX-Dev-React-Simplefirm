import React from "react";
import styled from 'styled-components';


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

const SpecialityNav = styled.a`
position: relative;
  width: 100%;
  padding-left:15px;
  padding-right:15px;

    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      height: 20px;
      transform-origin: bottom left;
      transform: skew(-11.31deg);
  }


    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 0;
      height: 20px;
      transform-origin: bottom left;
    transform: skew(11.31deg, 0deg);
  }

  ${({ speciality, isActive }) => isActive && `
        background-color: ${mixColorWithWhite(speciality.color, 10)} !important;
        padding-left:15px !important;
        padding-right:15px !important;
        &::active {
          background-color: ${mixColorWithWhite(speciality.color, 90)} !important;
        } 
        &::before {
          background-color: ${mixColorWithWhite(speciality.color, 10)} !important;
        //  width: 12px;
         width: 11px !important;
        //  left: -3px;
        left: -5px !important;
          z-index: 1;
        }
        &::after {
          background-color: ${mixColorWithWhite(speciality.color, 10)} !important;
          width: 5px !important;
          right: -5px !important;
          z-index: 1;
        }
    `}

    &:hover {
     background-color: ${({ speciality }) => mixColorWithWhite(speciality.color, 20)} !important;
     color: #fff !important;
     padding-left:15px !important;
     padding-right:15px !important;

     &::before {
        background-color: ${({ speciality }) => mixColorWithWhite(speciality.color, 20)} !important;
        width: 11px !important;
        left: -5px !important;
    }
    &::after {
      background-color: ${({ speciality }) => mixColorWithWhite(speciality.color, 20)} !important;
      width: 5px !important;
      right: -5px !important;
  }
    }
       
`;

const StyledSpan = styled.span`
    color: ${({ speciality, isActive }) => isActive ? mixColorWithWhite(speciality.color, 90) : mixColorWithWhite(speciality.color, 50)} !important;

    &:hover {
     background-color: ${({ speciality }) => mixColorWithWhite(speciality.color, 20)} !important;
     color: #fff !important;
    }

`;


function Specialities({ specialitie, useAbbreviations, onSpecialtyChange, isActive }) {


  const bg_color_3300CC = {
    backgroundColor: "#3300CC",
  };

  return (
    <SpecialityNav
      speciality={specialitie}
      isActive={isActive}
      className="nav-item nav-link Pad8 tab-item spec-tab-item spec-nav-2 pe-auto c-align-speciality"
      onClick={() => onSpecialtyChange(specialitie.id)}
      role="tab"
      style={{cursor:'pointer'}}
    >
      {useAbbreviations ? (
        <span
          className="d-flex align-items-center justify-content-center text-center text-white specialty-icon spec-abbr-span"
          style={{
            backgroundColor: specialitie.color ? specialitie.color : "#19395f",
          }}
        >
          {specialitie.name[0]}
        </span>
      ) : (
        <StyledSpan
        speciality={specialitie}
        isActive={isActive}
        className="spec-name-span nav-title-clr-50-2"
         
        >
          {specialitie.name}
        </StyledSpan>
      )}
    </SpecialityNav>
  );
}

export default Specialities;
