import React, { FC } from "react";
import "./Popup.css";

interface PopupProps {
  text: string;
  closePopup: () => void;
}

const Popup: FC<PopupProps> = ({ text, closePopup }) => {
  return (
    <div className="popup-container">
      <div className="popup-body">
        <h1>{text}</h1>
        <button onClick={closePopup}>Close X</button>
      </div>
    </div>
  );
};

export default Popup;