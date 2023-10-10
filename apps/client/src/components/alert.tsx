import { alertUser } from "@/store/atoms/alert";
import React from "react";
import { useRecoilValue } from "recoil";

const Notify = () => {
  const alerts = useRecoilValue(alertUser);

  const alertArr = alerts.map((elem) => {
    return <Message key={elem.id} type={elem.type} message={elem.message} />;
  });

  return (
    <div className="notify-container">
      <ul>{alertArr}</ul>
    </div>
  );
};

const Message = ({ type, message }: { type: string; message: string }) => {
  return <li className={`app-notification ${type}`}>{message}</li>;
};

export default Notify;
