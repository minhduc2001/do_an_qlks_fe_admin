import ApiBookRoom, {
  IBookingRes,
  IGetBookingsParams,
} from "@/api/ApiBookRoom";
import { InputSearchGlobal } from "@/components/AntdGlobal";
import ButtonGlobal from "@/components/ButtonGlobal";
import ModalCreateBooking from "@/components/ModalGlobal/ModalCreateBooking";
import ModalUpdateService from "@/components/ModalGlobal/ModalUpdateService";
import Notification from "@/components/Notification";
import TableGlobal, {
  IChangeTable,
  TABLE_DEFAULT_VALUE,
} from "@/components/TableGlobal";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Popover, Row, Space, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { useState } from "react";
import { checkPermission, groupPermission1 } from "@/lazyLoading";
import store from "@/redux/store";

export default function RoomManagement() {
  const [selectedBooking, setSelectedBooking] = useState<IBookingRes>();
  const [isOpenModal, setIsOpenModal] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [bookingParams, setBookingParams] = useState<IGetBookingsParams>({
    page: 0,
    limit: TABLE_DEFAULT_VALUE.defaultPageSize,
  });

  const { data: bookings, refetch } = useQuery(
    ["get_bookings", bookingParams],
    () => ApiBookRoom.getBookings(bookingParams),
    {
      keepPreviousData: true,
    }
  );

  const renderBookingState = (
    state: "Init" | "AdminInit" | "Success" | "Done" | "Reject"
  ) => {
    switch (state) {
      case "AdminInit":
        return "Đặt phòng trực tiếp";
      case "Done":
        return "Check out";
      case "Reject":
        return "Hủy đặt phòng";
      case "Success":
        return "Đặt phòng qua web (Đã thanh toán)";
      default:
        return "Đặt phòng qua web";
    }
  };

  const checkInMutation = useMutation(ApiBookRoom.checkIn);
  const handleCheckIn = (roomId: string) => {
    checkInMutation.mutate(roomId, {
      onSuccess: () => {
        Notification.notificationSuccess("Check-in thành công");
        refetch();
      },
    });
  };

  const checkOutMutation = useMutation(ApiBookRoom.checkOut);
  const handleCheckOut = (roomId: string) => {
    checkOutMutation.mutate(roomId, {
      onSuccess: () => {
        Notification.notificationSuccess("Check-out thành công");
        refetch();
      },
    });
  };

  const downloadBillMutation = useMutation(ApiBookRoom.downloadBill);
  const handleDownloadBill = (roomId: string) => {
    downloadBillMutation.mutate(roomId);
  };

  const cancelRoomMutation = useMutation(ApiBookRoom.cancelRoom);
  const handleCancelRoom = (roomId: string) => {
    cancelRoomMutation.mutate(roomId, {
      onSuccess: () => {
        Notification.notificationSuccess("Hủy phòng thành công");
        refetch();
      },
    });
  };

  const handleChangeTable = (value: IChangeTable) => {
    setBookingParams({
      ...bookingParams,
      page: value.page - 1,
      limit: value.pageSize,
    });
  };

  const columns: ColumnsType<IBookingRes> = [
    {
      title: "STT",
      align: "center",
      render: (_, __, i) => i + 1,
    },
    {
      title: "Tên phòng",
      dataIndex: ["room", "name"],
      align: "center",
    },
    {
      title: "Tên khách hàng",
      dataIndex: ["client", "name"],
      align: "center",
      render: (_, record) =>
        `${record.client?.lastName} ${record.client?.firstName}`,
    },
    {
      title: "email",
      dataIndex: ["client", "email"],
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: ["client", "tel"],
      align: "center",
    },
    {
      title: "Ngày check-in",
      align: "center",
      render: (_, record) => moment(record.checkin).format("DD-MM-YYYY"),
    },
    {
      title: "Ngày check-out",
      align: "center",
      render: (_, record) => moment(record.checkout).format("DD-MM-YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "bookingState",
      align: "center",
      render: (value) => renderBookingState(value),
    },
    {
      title: "Dịch vu sử dụng",
      dataIndex: "bookingState",
      align: "center",
      render: (_, record) => (
        <ul>
          {record.usedServices?.map((item) => (
            <li>
              <Popover
                title={
                  <ul>
                    <li>
                      Ngày đặt: {moment(item.createdAt).format("YYYY-MM-DD")}
                    </li>
                    <li>Số lượng: {item.quantity}</li>
                    <li>Đơn giá: {item.price?.toLocaleString() + " vnđ"}</li>
                  </ul>
                }
              >
                {item.name}
              </Popover>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Hành động",
      align: "center",
      width: 210,
      fixed: "right",
      render: (_, record) =>
        checkPermission(groupPermission1, [store.getState().user.role]) && (
          <Space>
            <Tooltip title="Thêm dịch vụ">
              <span
                className="p-2 cursor-pointer"
                role="presentation"
                onClick={() => {
                  setSelectedBooking(record);
                  setIsOpenModal("updateService");
                }}
              >
                <EditOutlined />
              </span>
            </Tooltip>
            <Tooltip title="Check-in" placement="topLeft">
              <span
                className="p-2 cursor-pointer"
                style={{ color: record.checkedIn ? "#49CC90" : undefined }}
                role="presentation"
                onClick={() => {
                  handleCheckIn(record.id);
                }}
              >
                <CheckCircleOutlined />
              </span>
            </Tooltip>
            <Tooltip title="Check-out" placement="topLeft">
              <span
                className="p-2 cursor-pointer"
                style={{
                  color: record.bookingState === "Done" ? "#49CC90" : undefined,
                }}
                role="presentation"
                onClick={() => {
                  handleCheckOut(record.id);
                }}
              >
                <LoginOutlined />
              </span>
            </Tooltip>
            <Tooltip title="Hủy đặt phòng" placement="topLeft">
              <span
                className="p-2 cursor-pointer"
                style={{
                  color: record.bookingState === "Reject" ? "red" : undefined,
                }}
                role="presentation"
                onClick={() => {
                  handleCancelRoom(record.id);
                }}
              >
                <CloseCircleOutlined />
              </span>
            </Tooltip>
            <Tooltip title="Tải xuống bill" placement="topLeft">
              <span
                className="p-2 cursor-pointer"
                role="presentation"
                onClick={() => {
                  handleDownloadBill(record.id);
                }}
              >
                <DownloadOutlined />
              </span>
            </Tooltip>
          </Space>
        ),
    },
  ];

  return (
    <div className="room-management-page">
      <Row className="mb-5" justify="space-between">
        <Space>
          <InputSearchGlobal
            onChange={(e) => setSearchValue(e.target.value.trim())}
            onSearch={() =>
              setBookingParams({ ...bookingParams, search: searchValue })
            }
            placeholder="Nhập tên, số điện thoại, email, ..."
          />
        </Space>
        <Space>
          <ButtonGlobal
            title="Đặt phòng"
            onClick={() => setIsOpenModal("bookRoom")}
          />
        </Space>
      </Row>
      <TableGlobal
        total={bookings?.metadata?.totalItems}
        dataSource={bookings?.results}
        columns={columns}
        onChangeTable={handleChangeTable}
        scrollX={1300}
      />
      <ModalCreateBooking
        isOpenModal={isOpenModal === "bookRoom"}
        handleCloseModal={() => setIsOpenModal("")}
      />
      {selectedBooking && (
        <ModalUpdateService
          isOpenModal={isOpenModal === "updateService"}
          handleCloseModal={() => setIsOpenModal("")}
          selectedBooking={selectedBooking}
        />
      )}
    </div>
  );
}
