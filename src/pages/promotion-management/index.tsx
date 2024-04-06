import ApiPromotion, {
  IGetPromotionsParams,
  IPromotionRes,
} from "@/api/ApiPromotion";
import { InputSearchGlobal } from "@/components/AntdGlobal";
import ButtonGlobal from "@/components/ButtonGlobal";
import ModalCreateEditPromotion from "@/components/ModalGlobal/ModalCreateEditPromotion";
import Notification from "@/components/Notification";
import TableGlobal, {
  IChangeTable,
  TABLE_DEFAULT_VALUE,
} from "@/components/TableGlobal";
import {
  checkPermission,
  groupPermission1,
  groupPermission2,
  groupPermission4,
} from "@/lazyLoading";
import store from "@/redux/store";
import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Row, Space, Switch } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { useState } from "react";

export default function PromotionManagement() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [promotionParams, setPromotionParams] = useState<IGetPromotionsParams>({
    page: 1,
    limit: TABLE_DEFAULT_VALUE.defaultPageSize,
  });
  const [selectedPromotion, setSelectedPromotion] = useState<IPromotionRes>();

  const { data: promotions } = useQuery(
    ["get_promotions", promotionParams],
    () => ApiPromotion.getPromotions(promotionParams),
    {
      keepPreviousData: true,
    }
  );
  -1;
  const handleCloseModal = () => {
    setSelectedPromotion(undefined);
    setIsOpenModal(false);
  };

  const handleChangeTable = (value: IChangeTable) => {
    setPromotionParams({
      ...promotionParams,
      page: value.page,
      limit: value.pageSize,
    });
  };

  const avtiveMutation = useMutation(ApiPromotion.active);

  const columns: ColumnsType<IPromotionRes> = [
    {
      title: "STT",
      align: "center",
      width: 80,
      render: (_, __, i) => i + 1,
    },
    {
      title: "Tên khuyến mại",
      dataIndex: "name",
      align: "center",
      width: 250,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      align: "center",
      width: 400,
    },
    {
      title: "Điều kiện (theo mức giá)",
      dataIndex: "condition",
      align: "center",
      width: 200,
      render: (value) => value.toLocaleString() + " đ",
    },
    {
      title: "Khuyễn mãi (%)",
      dataIndex: "discount",
      align: "center",
      width: 150,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      align: "center",
      render: (value) => moment(value).format("DD-MM-YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      align: "center",
      render: (value) => moment(value).format("DD-MM-YYYY"),
    },
    {
      title: "Hành động",
      align: "center",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <>
          {checkPermission(groupPermission2, [store.getState().user.role]) && (
            <>
              <Switch
                checkedChildren="On"
                unCheckedChildren="Off"
                defaultChecked={record.active}
                loading={avtiveMutation.isLoading}
                onChange={(e) => {
                  console.log(e);

                  avtiveMutation.mutate(
                    { id: record.id, active: e },
                    {
                      onSuccess: (resp) => {
                        Notification.notificationSuccess(resp);
                      },
                    }
                  );
                }}
              ></Switch>
              <span
                className="p-2 cursor-pointer"
                role="presentation"
                onClick={() => {
                  setSelectedPromotion(record);
                  setIsOpenModal(true);
                }}
              >
                <EditOutlined />
              </span>
            </>
          )}
          {checkPermission(groupPermission4, [store.getState().user.role]) && (
            <>
              <Switch
                checkedChildren="On"
                unCheckedChildren="Off"
                defaultChecked={record.active}
                loading={avtiveMutation.isLoading}
                disabled
              ></Switch>
            </>
          )}
        </>
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
              setPromotionParams({ ...promotionParams, search: searchValue })
            }
            placeholder="Nhập tên khuyến mại"
          />
        </Space>
        {checkPermission(groupPermission2, [store.getState().user.role]) && (
          <Space>
            <ButtonGlobal
              title="Thêm khyến mại"
              onClick={() => setIsOpenModal(true)}
            />
          </Space>
        )}
      </Row>
      <TableGlobal
        total={promotions?.metadata.totalItems}
        dataSource={promotions?.results}
        columns={columns}
        onChangeTable={handleChangeTable}
        scrollX={1200}
      />
      <ModalCreateEditPromotion
        isOpenModal={isOpenModal}
        handleCloseModal={handleCloseModal}
        selectedPromotion={selectedPromotion}
      />
    </div>
  );
}
