import { Tabs, TabsProps } from "antd";
import { useMemo } from "react";
import TypeRoomManagement from "./components/TypeRoomManagement";
import StatusRoomManagement from "./components/StatusRoomManagement";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.scss";

export default function RoomManagement() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (key: string) => {
    navigate(`${location.pathname}?tabs=${key}`);
  };

  const items: TabsProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: "Quản lý phòng",
        children: <TypeRoomManagement />,
      },
      {
        key: "2",
        label: "Trạng thái ",
        children: <StatusRoomManagement />,
      },
    ],
    []
  );

  return (
    <div className="room-management-home">
      <Tabs
        items={items}
        defaultActiveKey={location?.search?.split("=")?.at(-1) ?? "1"}
        onChange={handleTabChange}
      ></Tabs>
    </div>
  );
}
