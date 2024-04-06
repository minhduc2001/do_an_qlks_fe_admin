import ApiRoom, { IGetRoomsParams, IRoomRes } from "@/api/ApiRoom";
import { InputSearchGlobal } from "@/components/AntdGlobal";
import ButtonGlobal from "@/components/ButtonGlobal";
import ModalCreateEditRoom from "@/components/ModalGlobal/ModalCreateEditRoom";
import ModalUpdateRoomName from "@/components/ModalGlobal/ModalUpdateRoomName";
import TableGlobal, {
  IChangeTable,
  TABLE_DEFAULT_VALUE,
} from "@/components/TableGlobal";
import { checkPermission, groupPermission2 } from "@/lazyLoading";
import store from "@/redux/store";
import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Popover, Row, Space, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

const TypeRoomManagement = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalRoomName, setIsOpenModalRoomName] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [roomParams, setRoomParams] = useState<IGetRoomsParams>({
    page: 1,
    limit: TABLE_DEFAULT_VALUE.defaultPageSize,
  });
  const [roomSelected, setRoomSelected] = useState<IRoomRes>();

  const { data: rooms } = useQuery(
    ["get_rooms", roomParams],
    () => ApiRoom.getRooms(roomParams),
    {
      keepPreviousData: true,
    }
  );

  const handleCloseModal = () => {
    setRoomSelected(undefined);
    setIsOpenModal(false);
  };

  const handleChangeTable = (value: IChangeTable) => {
    setRoomParams({
      ...roomParams,
      page: value.page,
      limit: value.pageSize,
    });
  };

  const columns: ColumnsType<IRoomRes> = [
    {
      title: "STT",
      align: "center",
      width: 50,
      render: (_, __, i) => i + 1,
    },
    {
      title: "Tên phòng",
      align: "center",
      width: 200,
      render: (_, record) => {
        return !record.rooms?.length ? (
          "Trống"
        ) : (
          <ul>
            {record.rooms.map((item) => {
              return (
                <li>
                  <Popover
                    title={
                      <ul>
                        <li>
                          Trạng thái:{" "}
                          {item.is_booking ? "Đã được dùng" : "Chưa được dùng"}
                        </li>
                        <li>
                          Ngày thêm:{" "}
                          {moment(item.createdAt).format("YYYY-MM-DD")}
                        </li>
                      </ul>
                    }
                  >
                    {item.name} - {item.is_booking ? "Được đặt" : "Trống"}
                  </Popover>
                </li>
              );
            })}
          </ul>
        );
      },
    },
    {
      title: "Loại phòng",
      dataIndex: "name",
      align: "center",
      width: 220,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      align: "center",
      width: 200,
    },
    {
      title: "Giá phòng (vnđ)",
      dataIndex: "price",
      align: "center",
      width: 100,
      render: (value) => value?.toLocaleString(),
    },

    {
      title: "Tiện nghi",
      align: "center",
      width: 500,
      render: (_, record) => {
        const tempArray = record.feature_rooms?.map((item) => item.name) ?? [];
        return tempArray.join(", ");
      },
    },
    {
      title: "Hành động",
      align: "center",
      width: 100,
      fixed: "right",
      render: (_, record) =>
        checkPermission(groupPermission2, [store.getState().user?.role]) && (
          <Space>
            <Tooltip title="Sửa tên phòng con" placement="topLeft">
              <span
                className="p-2 cursor-pointer"
                role="presentation"
                onClick={() => {
                  setRoomSelected(record);
                  setIsOpenModalRoomName(true);
                }}
              >
                <IoMdAdd />
              </span>
            </Tooltip>
            <Tooltip title="Sửa thông tin phòng" placement="topLeft">
              <span
                className="p-2 cursor-pointer"
                role="presentation"
                onClick={() => {
                  setRoomSelected(record);
                  setIsOpenModal(true);
                }}
              >
                <EditOutlined />
              </span>
            </Tooltip>
          </Space>
        ),
    },
  ];
  return (
    <>
      <Row className="mb-5" justify="space-between">
        <Space>
          <InputSearchGlobal
            onChange={(e) => setSearchValue(e.target.value.trim())}
            onSearch={() =>
              setRoomParams({ ...roomParams, search: searchValue })
            }
            placeholder="Nhập loại phòng"
          />
        </Space>
        {checkPermission(groupPermission2, [store.getState().user?.role]) && (
          <Space>
            <ButtonGlobal
              title="Thêm phòng"
              onClick={() => setIsOpenModal(true)}
            />
          </Space>
        )}
      </Row>
      <TableGlobal
        total={rooms?.metadata.totalItems}
        dataSource={rooms?.results}
        columns={columns}
        onChangeTable={handleChangeTable}
        scrollX={1300}
      />
      <ModalCreateEditRoom
        isOpenModal={isOpenModal}
        handleCloseModal={handleCloseModal}
        roomSelected={roomSelected}
      />
      {roomSelected ? (
        <ModalUpdateRoomName
          isOpenModal={isOpenModalRoomName}
          handleCloseModal={() => setIsOpenModalRoomName(false)}
          selectedRoom={roomSelected}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default TypeRoomManagement;
