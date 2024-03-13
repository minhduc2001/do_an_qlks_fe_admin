import { Tabs, TabsProps } from "antd";
import { useMemo } from "react";
import TypeRoomManagement from "./components/TypeRoomManagement";
import StatusRoomManagement from "./components/StatusRoomManagement";

export default function RoomManagement() {
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
    <div className="room-management-page">
      <Tabs items={items} defaultActiveKey="1"></Tabs>
    </div>
  );
}
