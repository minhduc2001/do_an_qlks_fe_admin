import ApiPromotion, {
  IGetPromotionsParams,
  IPromotionRes,
} from "@/api/ApiPromotion";
import { InputSearchGlobal } from "@/components/AntdGlobal";
import ButtonGlobal from "@/components/ButtonGlobal";
import ModalCreateEditPromotion from "@/components/ModalGlobal/ModalCreateEditPromotion";
import TableGlobal, {
  IChangeTable,
  TABLE_DEFAULT_VALUE,
} from "@/components/TableGlobal";
import { checkPermission, groupPermission1 } from "@/lazyLoading";
import store from "@/redux/store";
import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Row, Space } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useState } from "react";

export default function PromotionManagement() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [promotionParams, setPromotionParams] = useState<IGetPromotionsParams>({
    page: 0,
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

  const handleCloseModal = () => {
    setSelectedPromotion(undefined);
    setIsOpenModal(false);
  };

  const handleChangeTable = (value: IChangeTable) => {
    setPromotionParams({
      ...promotionParams,
      page: value.page - 1,
      limit: value.pageSize,
    });
  };

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
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      align: "center",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      align: "center",
    },
    {
      title: "Hành động",
      align: "center",
      width: 100,
      fixed: "right",
      render: (_, record) =>
        checkPermission(groupPermission1, store.getState().user.roles) && (
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
        {checkPermission(groupPermission1, store.getState().user.roles) && (
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
