import React from 'react';
import Select from 'react-select';
import "./customStyle.css"

// Reusable SelectComponent
const SelectComponent = ({ options, value, onChange, placeholder, isLoading, maxWidth = "240px", minWidth = "240px", fontSize = "0.9rem" }) => {
  const handleSelectChange = (selectedOption) => {
    onChange(selectedOption ? selectedOption.value : '');
  };

  return (
    <div className='select-width' style={{minWidth:minWidth}}>
      {isLoading ? (
        <Select
          options={[]}
          isDisabled
          placeholder="Loading..."
        />
      ) : (
        <Select
          value={options?.find(option => option.value === value)}
          onChange={handleSelectChange}
          options={options}
          placeholder={placeholder}
          styles={{
            control: (base) => ({
              ...base,
              fontSize,
              border: "1px solid #ccc", // Set your default border style
              boxShadow: "none", // Remove the blue focus box shadow
              "&:hover": {
                border: "1px solid #ccc", // Ensure the border stays consistent on hover
              },
              "&:focus": {
                border: "1px solid #ccc", // Ensure border does not change on focus
              },
              
            }),
            option: (styles, { isFocused, isSelected }) => ({
                ...styles,
                    backgroundColor: isSelected ? "#19395f" : isFocused ? "#25568f" : "white",
                    color:isSelected?"white":isFocused?"white":"black",
            }),
            menu: (base) => ({
                ...base,
                maxHeight: '300px',  // Smaller dropdown height
                overflowY: 'auto',
                zIndex: 99999999  // Control the max height of the options
              }),
              menuList: (base) => ({
                ...base,
                maxHeight: '300px',
                zIndex: 99999999  // Control the max height of the options
              }),
              menuPortal: (base) => ({ ...base, zIndex: 99999999 }),
          }}
        />
      )}
    </div>
  );
};

export default SelectComponent;
