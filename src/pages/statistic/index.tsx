import ApiStatistic, {
  IGetRoomStatisticParams,
  IGetServiceStatisticParams,
} from "@/api/ApiStatistic";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Column } from "@ant-design/plots";
import { Divider, Space, DatePicker } from "antd";
import { SelectGlobal } from "@/components/AntdGlobal";
import { Pie } from "@ant-design/plots";
import { Line } from "@ant-design/plots";
import ApiRoom from "@/api/ApiRoom";
import ButtonGlobal from "@/components/ButtonGlobal";
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

function ServiceStatistic() {
  const [serviceStatisticParams, setServiceStatisticParams] =
    useState<IGetServiceStatisticParams>({
      startDate: dayjs().subtract(30, "day").format(dateFormat).toString(),
      endDate: dayjs().format(dateFormat),
    });

  const { data: serviceStatistic } = useQuery(
    ["get_service_statistic", [serviceStatisticParams]],
    () => ApiStatistic.getServiceStatistic(serviceStatisticParams)
  );

  const exportExcelServiceMutation = useMutation(
    ApiStatistic.exportExcelService
  );
  const handleExportExcel = () => {
    exportExcelServiceMutation.mutate(serviceStatisticParams);
  };

  const handleRangeChange = (dates: any, dateStrings: any) => {
    setServiceStatisticParams({
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    });
  };

  const config = {
    data: serviceStatistic ?? [],
    xField: "name",
    yField: "value",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return (
    <div className="service-statistic">
      <h1 className="text-center">THỐNG KÊ DOANH THU DỊCH VỤ THEO THỜI GIAN</h1>
      <div className="flex justify-end">
        <Space>
          <ButtonGlobal
            className="!h-[30px]"
            title="Xuất excel"
            onClick={handleExportExcel}
          />

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
        </Space>
      </div>
      <Column {...config} />
    </div>
  );
}

function RoomStatistic() {
  const [roomStatisticParams, setRoomStatisticParams] =
    useState<IGetServiceStatisticParams>({
      startDate: dayjs().subtract(30, "day").format(dateFormat).toString(),
      endDate: dayjs().format(dateFormat),
    });

  const { data: roomStatistic } = useQuery(
    ["get_room_statistic", [roomStatisticParams]],
    () => ApiStatistic.getRoomStatistic(roomStatisticParams)
  );

  const exportExcelRoomMutation = useMutation(ApiStatistic.exportExcelRoom);
  const handleExportExcel = () => {
    exportExcelRoomMutation.mutate(roomStatisticParams);
  };

  const handleRangeChange = (dates: any, dateStrings: any) => {
    setRoomStatisticParams({
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    });
  };

  const config = {
    data: roomStatistic ?? [],
    xField: "name",
    yField: "value",
    seriesField: "type",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return (
    <div className="service-statistic">
      <h1 className="text-center">
        THỐNG KÊ DOANH THU - LƯỢT THUÊ PHÒNG THEO THỜI GIAN
      </h1>
      <div className="flex justify-end">
        <Space>
          <ButtonGlobal
            className="!h-[30px]"
            title="Xuất excel"
            onClick={handleExportExcel}
          />
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
        </Space>
      </div>
      <Column {...config} />
    </div>
  );
}

function RoomStatisticInCurrentWeek() {
  const [roomId, setRoomId] = useState<string>();

  const { data: rooms } = useQuery(["get_rooms"], () => ApiRoom.getRooms());
  const convertRoomsValue = useMemo(() => {
    return rooms?.results.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [rooms]);

  useEffect(() => {
    if (rooms?.results && rooms.results.length > 0) {
      setRoomId(rooms.results[0].id);
    }
  }, [rooms]);

  const { data: roomStatisticInCurrentWeek } = useQuery(
    ["get_room_statistic_in_current_week", roomId],
    () => ApiStatistic.getRoomStatisticInCurrentWeek(roomId),
    {
      enabled: !!roomId,
    }
  );

  const config = {
    data: roomStatisticInCurrentWeek ?? [],
    xField: "name",
    yField: "value",
    seriesField: "type",
  };

  return (
    <div className="service-statistic">
      <h1 className="text-center">
        THỐNG KÊ DOANH THU - LƯỢT THUÊ PHÒNG THEO TUẦN HIỆN TẠI
      </h1>
      <div className="flex justify-end">
        <SelectGlobal
          className="w-[150px]"
          placeholder="Phòng"
          allowClear={false}
          options={convertRoomsValue}
          onChange={(value) => setRoomId(value)}
        />
      </div>
      <Line {...config} />
    </div>
  );
}

function RevenueStatistic() {
  const [revenueStatisticParams, setRevenueStatisticParams] =
    useState<IGetRoomStatisticParams>({
      year: moment().year(),
      month: moment().month() + 1,
      day: moment().date(),
    });

  const { data: revenueStatistic } = useQuery(
    ["get_revenue_statistic", [revenueStatisticParams]],
    () => ApiStatistic.getRevenueStatistic(revenueStatisticParams)
  );

  const exportExcelRevenueMutation = useMutation(
    ApiStatistic.exportExcelRevenue
  );
  const handleExportExcel = () => {
    exportExcelRevenueMutation.mutate(revenueStatisticParams);
  };

  const config = {
    appendPadding: 10,
    data: revenueStatistic ?? [],
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  return (
    <div className="service-statistic">
      <h1 className="text-center">THỐNG KÊ DOANH THU KHÁCH SẠN THEO NĂM</h1>
      <div className="flex justify-end">
        <Space>
          <ButtonGlobal
            className="!h-[30px]"
            title="Xuất excel"
            onClick={handleExportExcel}
          />
          <SelectGlobal
            placeholder="Năm"
            allowClear={false}
            options={Array.from({ length: 11 }, (_, index) => ({
              label: moment().year() - index + "",
              value: moment().year() - index,
            }))}
            value={revenueStatisticParams.year}
            onChange={(value) => {
              setRevenueStatisticParams({
                ...revenueStatisticParams,
                year: value,
                month: undefined,
                day: undefined,
              });
            }}
          />
        </Space>
      </div>
      <Pie {...config} />
    </div>
  );
}

export default function Statistic() {
  return (
    <div>
      <ServiceStatistic />
      <Divider />
      <RoomStatistic />
      {/* <Divider /> */}
      {/* <RoomStatisticInCurrentWeek /> */}
      <Divider />
      <RevenueStatistic />
    </div>
  );
}
