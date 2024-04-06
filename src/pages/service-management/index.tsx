import ApiService, { IGetServicesParams, IServiceRes } from "@/api/ApiService";
import { InputSearchGlobal } from "@/components/AntdGlobal";
import ButtonGlobal from "@/components/ButtonGlobal";
import ModalCreateEditService from "@/components/ModalGlobal/ModalCreateEditService";
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
import { useState } from "react";

export default function RoomManagement() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [serviceParams, setServiceParams] = useState<IGetServicesParams>({
    page: 1,
    limit: TABLE_DEFAULT_VALUE.defaultPageSize,
  });
  const [selectedService, setSelectedService] = useState<IServiceRes>();

  const { data: services } = useQuery(
    ["get_services", serviceParams],
    () => ApiService.getServices(serviceParams),
    {
      keepPreviousData: true,
    }
  );

  const handleCloseModal = () => {
    setSelectedService(undefined);
    setIsOpenModal(false);
  };

  const handleChangeTable = (value: IChangeTable) => {
    setServiceParams({
      ...serviceParams,
      page: value.page,
      limit: value.pageSize,
    });
  };

  const avtiveMutation = useMutation(ApiService.active);

  const columns: ColumnsType<IServiceRes> = [
    {
      title: "STT",
      align: "center",
      render: (_, __, i) => i + 1,
      width: 50,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      align: "center",
      width: 400,
    },
    {
      title: "Đơn vị",
      dataIndex: "unity",
      align: "center",
      width: 150,
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      align: "center",
      render: (value) => value.toLocaleString() + " đ",
      width: 200,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      align: "center",
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
                  setSelectedService(record);
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
              setServiceParams({ ...serviceParams, search: searchValue })
            }
            placeholder="Nhập tên dịch vụ"
          />
        </Space>
        {checkPermission(groupPermission2, [store.getState().user.role]) && (
          <Space>
            <ButtonGlobal
              title="Thêm dịch vụ"
              onClick={() => setIsOpenModal(true)}
            />
          </Space>
        )}
      </Row>
      <TableGlobal
        total={services?.metadata.totalItems}
        dataSource={services?.results}
        columns={columns}
        onChangeTable={handleChangeTable}
      />
      <ModalCreateEditService
        isOpenModal={isOpenModal}
        handleCloseModal={handleCloseModal}
        selectedService={selectedService}
      />
    </div>
  );
}
