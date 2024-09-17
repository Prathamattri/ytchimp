import { AlertType, alertUser } from "@/store/atoms/alert";
import React, { CSSProperties, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function Notify() {
  const alerts = useRecoilValue(alertUser);

  const alertArr = alerts
    .filter((elem) => !elem.markShown)
    .map((elem) => {
      return (
        <Message
          key={elem.id}
          id={elem.id}
          type={elem.type}
          message={elem.message}
          markShown={elem.markShown}
        />
      );
    });

  return (
    <div className="notify-container">
      <ul>{alertArr}</ul>
    </div>
  );
}

const Message = ({ type, message, id }: AlertType) => {
  const setAlerts = useSetRecoilState(alertUser);

  const alertDisplayTime = 6500;
  useEffect(() => {
    setTimeout(
      () =>
        setAlerts((prevAlerts) => {
          let copyAlertsArray = [];
          for (let i = 0; i < prevAlerts.length; i++) {
            let alert = { ...prevAlerts[i] };
            if (alert.id == id) alert.markShown = true;
            copyAlertsArray.push(alert);
          }
          return copyAlertsArray;
        }),
      alertDisplayTime,
    );
  }, []);
  return <li className={`app-notification ${type}`} style={{ '--display-time': alertDisplayTime } as CSSProperties}>{message}</li>;
};
