import ApiCustomer, {
  ICustomerRes,
  IGetCustomersParams,
} from "@/api/ApiCustomer";
import ApiUser, { EGender } from "@/api/ApiUser";
import { InputSearchGlobal } from "@/components/AntdGlobal";
import ButtonGlobal from "@/components/ButtonGlobal";
import ModalCreateEditUser from "@/components/ModalGlobal/ModalCreateEditUser";
import Notification from "@/components/Notification";
import TableGlobal, {
  IChangeTable,
  TABLE_DEFAULT_VALUE,
} from "@/components/TableGlobal";
import { checkPermission, groupPermission2 } from "@/lazyLoading";
import store from "@/redux/store";
import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, Divider, Row, Space, Switch } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";

export default function RoomManagement() {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>();
  const [customerParams, setCustomerParams] = useState<IGetCustomersParams>({
    page: 0,
    limit: TABLE_DEFAULT_VALUE.defaultPageSize,
  });

  const [userParams, setUserParams] = useState<IGetCustomersParams>({
    page: 0,
    limit: TABLE_DEFAULT_VALUE.defaultPageSize,
  });

  const { data: customers } = useQuery(
    ["get_customers", customerParams],
    () => ApiCustomer.getCustomers(customerParams),
    {
      keepPreviousData: true,
    }
  );
  const { user } = store.getState();

  const getDataUser = useMutation(ApiUser.getUser);

  useEffect(() => {
    getDataUser.mutate(userParams);
  }, [checkPermission(groupPermission2, [user.role])]);

  const handleChangeTable = (value: IChangeTable) => {
    setCustomerParams({
      ...customerParams,
      page: value.page - 1,
      limit: value.pageSize,
    });
  };

  const avtiveMutation = useMutation(ApiUser.activeUser);

  const columns: ColumnsType<ICustomerRes> = [
    {
      title: "STT",
      align: "center",
      render: (_, __, i) => i + 1,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "email",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "CCCD/Passport/GPLX",
      dataIndex: "cccd",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      align: "center",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      align: "center",
      render: (value) => (value === EGender.Male ? "Nam" : "Nữ"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      align: "center",
    },
  ];

  const columns1: ColumnsType<ICustomerRes> = [
    {
      title: "STT",
      align: "center",
      render: (_, __, i) => i + 1,
      width: 70,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "email",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      align: "center",
      render: (value) => {
        if (value === "ROLE_ACCOUNTANT") return "Kế toán";
        else return "Lễ tân";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      align: "center",
      render: (value, record) => {
        return (
          <Switch
            checkedChildren="Đang hoạt động"
            unCheckedChildren="Đã khóa"
            defaultChecked={value}
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
        );
      },
    },
    {
      title: "Hành Động",
      align: "center",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <>
          <span
            className="p-2 cursor-pointer"
            role="presentation"
            onClick={() => {
              setSelectedUser(record);
              setOpenModal(true);
            }}
          >
            <EditOutlined />
          </span>
        </>
      ),
    },
  ];

  return (
    <div className="room-management-page">
      <Row>
        <Col span={24} className="h-[40vh]">
          <Row className="mb-5 " justify="space-between">
            <Space>
              <InputSearchGlobal
                onChange={(e) => setSearchValue(e.target.value.trim())}
                onSearch={() =>
                  setCustomerParams({ ...customerParams, search: searchValue })
                }
                placeholder="Nhập tên, số điện thoại, email, ..."
              />
            </Space>
          </Row>
          <TableGlobal
            total={customers?.metadata.totalItems}
            dataSource={customers?.results}
            columns={columns}
            onChangeTable={handleChangeTable}
          />
        </Col>

        <Divider />

        {checkPermission(groupPermission2, [user.role]) && (
          <Col span={24}>
            <div className="text-center text-bold text-[20px]">
              Quản lý nhân viên
            </div>
            <Row className="mb-5" justify="space-between">
              <Space>
                <InputSearchGlobal
                  onChange={(e) => setSearchValue(e.target.value.trim())}
                  onSearch={() =>
                    setUserParams({
                      ...userParams,
                      search: searchValue,
                    })
                  }
                  placeholder="Nhập tên, email, ..."
                />
              </Space>
              <Space>
                <ButtonGlobal
                  title="Thêm nhân viên"
                  onClick={() => setOpenModal(true)}
                />
              </Space>
            </Row>
            <TableGlobal
              total={getDataUser?.data?.metadata.totalItems}
              dataSource={getDataUser?.data?.results}
              columns={columns1}
              onChangeTable={handleChangeTable}
            />
            <ModalCreateEditUser
              handleCloseModal={() => {
                setOpenModal(false);
                setSelectedUser(null);
              }}
              isOpenModal={openModal}
              selectedUser={selectedUser}
            ></ModalCreateEditUser>
          </Col>
        )}
      </Row>
    </div>
  );
}
