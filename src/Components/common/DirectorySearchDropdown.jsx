import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./directorySearchDropdown.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedState } from "../../Redux/selectedState/actions";

const DirectorySearchDropdown = () => {
  const [states, setStates] = useState([]);
  const [selectedStateLocal, setSelectedStateLocal] = useState([]);
  const selectedState = useSelector((state) => state.selectedState);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const dispatch = useDispatch();

  const fetchStates = async () => {
    try {
      const response = await axios.get(origin + `/api/all/states/`);
      if (response.data && Array.isArray(response.data.data)) {
        setStates(response.data.data);
      } else {
        console.error("Invalid data structure", response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (state) => {
    setSelectedStateLocal([state.StateAbr, state.name]);
    dispatch(setSelectedState(state.StateAbr));
    setIsOpen(false);
  };

  const handleStatesReset = () => {
    dispatch(setSelectedState(""));
  };

  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="dropdown position-relative d-inline-block p-1"
      ref={dropdownRef}
    >
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
        <input
          type="text"
          value={selectedStateLocal.join(", ")}
          placeholder="Select a State"
          readOnly
          className="form-control bg-white"
        />
      </div>
      {isOpen && (
        <div
          id="state-dropdown"
          className="position-absolute top-0 bg-white border border-secondary overflow-hidden"
          style={{
            maxHeight: "200px",
            zIndex: 9999,
            width: "96%",
            marginTop: "4px",
          }}
        >
          <input
            type="text"
            placeholder="Search states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{
              marginBottom: "4px",
            }}
          />
          <div className="dropdown-items">
            <div
              key={0}
              onClick={() => handleStatesReset()}
              className="dropdown-item"
              style={{ cursor: "pointer" }}
            >
              <span className="p-1">All States</span>
            </div>
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => (
                <div
                  key={state.id}
                  onClick={() => handleSelect(state)}
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                >
                  <span className="p-1">
                    {state.StateAbr}, {state.name}
                  </span>
                </div>
              ))
            ) : (
              <div className="dropdown-item">No states found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorySearchDropdown;
