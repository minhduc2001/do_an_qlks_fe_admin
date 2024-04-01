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
import { Col, DatePicker, Descriptions, Row, Space, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { useState } from "react";
import { checkPermission, groupPermission1 } from "@/lazyLoading";
import store from "@/redux/store";
import ApiStatistic, { IGetServiceStatisticParams } from "@/api/ApiStatistic";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
const dateFormat = "YYYY/MM/DD";
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

export default function RoomManagement() {
  const [selectedBooking, setSelectedBooking] = useState<IBookingRes>();
  const [isOpenModal, setIsOpenModal] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [bookingParams, setBookingParams] = useState<IGetBookingsParams>({
    page: 0,
    limit: TABLE_DEFAULT_VALUE.defaultPageSize,
  });

  const [serviceStatisticParams, setServiceStatisticParams] =
    useState<IGetServiceStatisticParams>({
      startDate: dayjs().subtract(30, "day").format(dateFormat).toString(),
      endDate: dayjs().format(dateFormat),
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

  const handleRangeChange = (dates: any, dateStrings: any) => {
    setServiceStatisticParams({
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    });
  };

  const exportExcelMutation = useMutation(ApiStatistic.exportExcelBooking);
  const handleExportExcel = () => {
    exportExcelMutation.mutate(serviceStatisticParams);
  };

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
                  if (
                    ![EBookingState.Done, EBookingState.Reject].includes(
                      record.state
                    )
                  ) {
                    setSelectedBooking(record);
                    setIsOpenModal("updateService");
                  }
                }}
                style={{
                  cursor: [EBookingState.Done, EBookingState.Reject].includes(
                    record.state
                  )
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                <EditOutlined />
              </span>
            </Tooltip>
            <Tooltip title="Check-in" placement="topLeft">
              <span
                className="p-2 cursor-pointer"
                style={{
                  color: record.is_checked_in ? "#49CC90" : undefined,
                  cursor:
                    record.is_checked_in ||
                    [EBookingState.Reject].includes(record.state)
                      ? "not-allowed"
                      : "pointer",
                }}
                role="presentation"
                onClick={() => {
                  if (
                    !record.is_checked_in ||
                    ![EBookingState.Reject, EBookingState.Done].includes(
                      record.state
                    )
                  )
                    handleCheckIn(record.id);
                }}
              >
                <CheckCircleOutlined />
              </span>
            </Tooltip>
            <Tooltip title="Check-out" placement="topLeft">
              <span
                className="p-2"
                style={{
                  color:
                    record.state === EBookingState.Done ? "#49CC90" : undefined,
                  cursor: [EBookingState.Done, EBookingState.Reject].includes(
                    record.state
                  )
                    ? "not-allowed"
                    : "pointer",
                }}
                role="presentation"
                onClick={() => {
                  if (
                    ![EBookingState.Done, EBookingState.Reject].includes(
                      record.state
                    )
                  )
                    handleCheckOut(record.id);
                }}
              >
                <LoginOutlined />
              </span>
            </Tooltip>
            <Tooltip title="Hủy đặt phòng" placement="topLeft">
              <span
                className="p-2"
                style={{
                  color:
                    record.state === EBookingState.Reject ? "red" : undefined,
                  cursor:
                    [EBookingState.Done, EBookingState.Reject].includes(
                      record.state
                    ) || record.is_checked_in
                      ? "not-allowed"
                      : "pointer",
                }}
                role="presentation"
                onClick={() => {
                  if (
                    ![EBookingState.Done, EBookingState.Reject].includes(
                      record.state
                    ) ||
                    !record.is_checked_in
                  )
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
      render: (value) => value.toLocaleString() + " đ",
    },

    {
      title: "Số lượng",
      dataIndex: ["quantity"],
      align: "center",
    },

    {
      title: "Ngày sử dụng",
      dataIndex: ["createdAt"],
      align: "center",
      render: (value) => moment(value).format("hh:mm:ss . DD/MM/YYYY"),
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
          {/* @ts-ignore */}
          <DatePicker.RangePicker
            format={dateFormat}
            defaultValue={[
              dayjs(dayjs().subtract(30, "day"), dateFormat),
              dayjs(dayjs(), dateFormat),
            ]}
            disabledDate={(d) => d >= moment()}
            onChange={handleRangeChange}
          />
          <ButtonGlobal title="Xuất excel" onClick={handleExportExcel} />
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
                  scroll={{ y: 300 }}
                ></TableGlobal>
              </Col>

              <Col span={24}>
                <Row gutter={66}>
                  <Col span={8}>
                    <TableGlobal
                      columns={columns2}
                      dataSource={record.booked_rooms}
                      pagination={false}
                      scrollX={500}
                      scroll={{ y: 300 }}
                    ></TableGlobal>
                  </Col>
                  <Col span={16}>
                    {/* <Space> */}
                    <Descriptions title="Thông tin đặt phòng">
                      <Descriptions.Item label="Nhân viên phụ trách">
                        {record?.user?.username}
                      </Descriptions.Item>
                      <Descriptions.Item label="Tên khách hàng">
                        {record?.customer?.username}
                      </Descriptions.Item>
                      <Descriptions.Item label="CCCD">
                        {record?.customer?.cccd}
                      </Descriptions.Item>
                      <Descriptions.Item label="Địa chỉ">
                        {record?.customer?.address}
                      </Descriptions.Item>
                      <Descriptions.Item label="Tổng giá dịch vụ">
                        {record?.used_services
                          ?.map(
                            (service: any) => service.price * service.quantity
                          )
                          ?.reduce(
                            (accumulator: number, currentValue: number) =>
                              accumulator + currentValue,
                            0
                          )
                          .toLocaleString()}{" "}
                        đ
                      </Descriptions.Item>

                      <Descriptions.Item label="Giá phòng">
                        {(record?.price * record?.quantity).toLocaleString()} đ
                      </Descriptions.Item>

                      <Descriptions.Item label="Giảm giá">
                        {record?.discount} %
                      </Descriptions.Item>

                      <Descriptions.Item label="Tổng cộng">
                        <strong>
                          {(
                            record?.price * record?.quantity -
                            (record?.price *
                              record?.quantity *
                              record?.discount) /
                              100 +
                            record?.used_services
                              ?.map(
                                (service: any) =>
                                  service.price * service.quantity
                              )
                              ?.reduce(
                                (accumulator: number, currentValue: number) =>
                                  accumulator + currentValue,
                                0
                              )
                          ).toLocaleString()}{" "}
                          đ
                        </strong>
                      </Descriptions.Item>
                    </Descriptions>
                    {/* </Space> */}
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
