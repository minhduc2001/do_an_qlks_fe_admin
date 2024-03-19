import ApiBookRoom, {
  EBookingState,
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
import { Col, Popover, Row, Space, Tooltip } from "antd";
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

  const renderBookingState = (state: EBookingState) => {
    switch (state) {
      case EBookingState.AdminInit:
        return "Đặt phòng trực tiếp";
      case EBookingState.Done:
        return "Check out";
      case EBookingState.Reject:
        return "Hủy đặt phòng";
      case EBookingState.Success:
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

  // {
  //   title: "Dịch vụ sử dụng",
  //   dataIndex: "state",
  //   align: "center",
  //   render: (_, record) => (
  //     <ul>
  //       {record.used_services?.map((item) => (
  //         <li>
  //           <Popover
  //             title={
  //               <ul>
  //                 <li>
  //                   Ngày đặt: {moment(item.createdAt).format("YYYY-MM-DD")}
  //                 </li>
  //                 <li>Số lượng: {item.quantity}</li>
  //                 <li>
  //                   Đơn giá: {item.service?.price?.toLocaleString() + " vnđ"}
  //                 </li>
  //               </ul>
  //             }
  //           >
  //             {item.name}
  //           </Popover>
  //         </li>
  //       ))}
  //     </ul>
  //   ),
  // },

  const columns: ColumnsType<IBookingRes> = [
    {
      title: "STT",
      align: "center",
      render: (_, __, i) => i + 1,
      width: 50,
    },
    {
      title: "Loại phòng",
      dataIndex: ["room"],
      align: "center",
      render: (_, record) => {
        return record?.booked_rooms?.[0].room?.type_room.name;
      },
    },
    {
      title: "Tên khách hàng",
      dataIndex: ["customer", "username"],
      align: "center",
    },
    {
      title: "email",
      dataIndex: ["customer", "email"],
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: ["customer", "phone"],
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
      dataIndex: "state",
      align: "center",
      render: (value) => renderBookingState(value),
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
                style={{ color: record.is_checked_in ? "#49CC90" : undefined }}
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
                  color:
                    record.state === EBookingState.Done ? "#49CC90" : undefined,
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
                  color:
                    record.state === EBookingState.Reject ? "red" : undefined,
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

  const columns2: ColumnsType<any> = [
    {
      title: "STT",
      align: "center",
      render: (_, __, i) => i + 1,
      width: 100,
    },
    {
      title: "Phòng",
      dataIndex: ["room", "name"],
      align: "center",
    },
  ];

  const columns1: ColumnsType<any> = [
    {
      title: "STT",
      align: "center",
      render: (_, __, i) => i + 1,
      width: 50,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: ["name"],
      align: "center",
    },

    {
      title: "Đơn giá",
      dataIndex: ["price"],
      align: "center",
    },

    {
      title: "Số lượng",
      dataIndex: ["quantity"],
      align: "center",
    },

    {
      title: "Ngày sử dụng",
      dataIndex: ["createAt"],
      align: "center",
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
        expandable={{
          expandedRowRender: (record) => (
            <Row gutter={[0, 33]}>
              <Col span={24}>
                <TableGlobal
                  columns={columns1}
                  dataSource={record.used_services}
                  pagination={false}
                ></TableGlobal>
              </Col>

              <Col span={24}>
                <Row gutter={66}>
                  <Col span={12}>
                    <TableGlobal
                      columns={columns2}
                      dataSource={record.booked_rooms}
                      pagination={false}
                      scrollX={500}
                    ></TableGlobal>
                  </Col>
                  <Col span={12}>
                    <></>
                  </Col>
                </Row>
              </Col>
            </Row>
          ),
        }}
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
