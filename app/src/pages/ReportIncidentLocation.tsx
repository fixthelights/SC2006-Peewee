import React, { useState } from "react";
import Popup from "../components/Popup/Popup"
  
const ReportIncidentLocation = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}> Click to Open Popup</button>
      {open ? <Popup text="Hello there!" closePopup={() => setOpen(false)} /> : null}
    </div>
  );
};
  
export default ReportIncidentLocation

