import { Col, Empty, Row, Tag } from "antd";
import "./index.scss";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ApiRoom, { IGetRoomsParams } from "@/api/ApiRoom";
import AsyncWrapper from "@/layouts/AsyncWrapper";
import moment from "moment";

const StatusRoomManagement = () => {
  const [roomParams, setRoomParams] = useState<IGetRoomsParams>({
    page: 1,
    limit: 9999,
  });

  const {
    data: rooms,
    isLoading,
    ...rest
  } = useQuery(
    ["get_rooms", roomParams],
    () => ApiRoom.getRoomsWithRelation(roomParams),
    {
      keepPreviousData: true,
    }
  );

  const handleDate = (date: any) => {
    const newDate = new Date(date);
    return (
      newDate.getDate() +
      " / " +
      (newDate.getMonth() + 1) +
      " / " +
      newDate.getFullYear()
    );
  };

  return (
    <AsyncWrapper loading={isLoading} fulfilled={true}>
      {rooms?.results && rooms?.results?.length > 0 && (
        <div className="root">
          <Row>
            {rooms?.results?.map((item) => {
              return (
                <Col span={24} className="col-data">
                  <div className="title">{item.name}</div>
                  <Row gutter={34}>
                    {item?.rooms?.map((r) => {
                      return (
                        <Col span={8}>
                          <div className="col-room">
                            <div className="info-room">
                              <h1>{r.name}</h1>
                            </div>
                            <div className="info-booking">
                              {r?.booked_rooms?.length ? (
                                r.booked_rooms?.map(
                                  (br: any, index: number) => {
                                    return !br.booking.is_checked_out ? (
                                      <div key={index}>
                                        <span>
                                          {handleDate(br.booking.checkin)}
                                        </span>
                                        {" --- "}
                                        <span>
                                          {handleDate(br.booking.checkout)}
                                        </span>
                                      </div>
                                    ) : (
                                      <></>
                                    );
                                  }
                                )
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
        </div>
      )}
    </AsyncWrapper>
  );
};

export default StatusRoomManagement;
