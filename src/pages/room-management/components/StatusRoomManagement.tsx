import { Col, Row, Tag } from "antd";
import "./index.scss";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ApiRoom, { IGetRoomsParams } from "@/api/ApiRoom";
import AsyncWrapper from "@/layouts/AsyncWrapper";

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
                    {[1, 2, 3, 4].map((r) => {
                      return (
                        <Col span={8}>
                          <div className="col-room">
                            <div className="info-room">
                              <h1>401</h1>
                              {/* <Tag color="magenta" className="tag">
                                Dang Dung
                              </Tag> */}
                            </div>
                            <div className="info-booking">
                              <span>23/12/2024 - 24-12-2024</span>
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
