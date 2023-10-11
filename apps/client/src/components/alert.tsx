import { alertUser } from "@/store/atoms/alert";
import React from "react";
import { useRecoilValue } from "recoil";

const Alert = () => {
  const alerts = useRecoilValue(alertUser);

  const alertArr = alerts.map((elem) => {
    return (
      <li key={elem.id} className={`app-alert ${elem.type}`}>
        {elem.message}
      </li>
    );
  });

  return (
    <div className="alert-container">
      <ul>{alertArr}</ul>
    </div>
  );
};

export default Alert;
