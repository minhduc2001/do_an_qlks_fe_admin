import { Col, Collapse, Empty, Row } from "antd";
import "./index.scss";
import { useQuery } from "@tanstack/react-query";

import ApiRoom from "@/api/ApiRoom";

import moment from "moment";
import TableGlobal from "@/components/TableGlobal";
import { ColumnsType } from "antd/lib/table";

const StatusRoomManagement = () => {
  const { data: rooms, isLoading } = useQuery(
    ["get_rooms_with_relation"],
    () => ApiRoom.getRoomsWithRelation(),
    {
      // keepPreviousData: true,
    }
  );

  const columns: ColumnsType<any> = [
    {
      title: "Tên Khách hàng",
      align: "center",
      dataIndex: ["booking", "customer", "username"],
      width: 200,
    },
    {
      title: "Ngày checkin",
      align: "center",
      width: 220,
      render: (_, record) => {
        return moment(record.booking.checkin).format("DD/MM/YYYY");
      },
    },
    {
      title: "Ngày checkout",
      align: "center",
      width: 200,
      render: (_, record) => {
        return moment(record.booking.checkout).format("DD/MM/YYYY");
      },
    },
    {
      title: "Trạng thái",
      align: "center",
      width: 100,
      render: (_, record) =>
        record.booking.is_checked_in ? "Đang ở" : "Chờ nhận phòng",
    },
  ];

  return (
    <Collapse defaultActiveKey={["1"]}>
      {rooms?.map((item, index) => {
        return (
          <Collapse.Panel header={item.name} key={index} className="root-1">
            <Row gutter={34}>
              {item?.rooms?.map((r, index) => {
                return (
                  <Col span={12} key={index}>
                    <div className="col-room">
                      <div className="info-room">
                        <h1>{r.name}</h1>
                      </div>
                      <div className="info-booking">
                        {r?.booked_rooms?.length ? (
                          <TableGlobal
                            columns={columns}
                            dataSource={r.booked_rooms}
                            pagination={false}
                            scrollX={420}
                            scroll={{ y: 171 }}
                          ></TableGlobal>
                        ) : (
                          <Empty></Empty>
                        )}
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );

  return (
    <>
      {!isLoading && (
        <Row className="root-1">
          {rooms?.map((item, index) => {
            return (
              <Col span={24} className="col-data" key={index}>
                <h1 className="title">{item.name}</h1>
                <Row gutter={34}>
                  {item?.rooms?.map((r, index) => {
                    return (
                      <Col span={12} key={index}>
                        <div className="col-room">
                          <div className="info-room">
                            <h1>{r.name}</h1>
                          </div>
                          <div className="info-booking">
                            {r?.booked_rooms?.length ? (
                              <TableGlobal
                                columns={columns}
                                dataSource={r.booked_rooms}
                                pagination={false}
                                scrollX={420}
                                scroll={{ y: 171 }}
                              ></TableGlobal>
                            ) : (
                              <Empty></Empty>
                            )}
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            );
          })}
        </Row>
      )}
    </>
  );
};

export default StatusRoomManagement;
