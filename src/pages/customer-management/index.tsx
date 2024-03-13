import ApiCustomer, {
  ICustomerRes,
  IGetCustomersParams,
} from "@/api/ApiCustomer";
import { InputSearchGlobal } from "@/components/AntdGlobal";
import TableGlobal, {
  IChangeTable,
  TABLE_DEFAULT_VALUE,
} from "@/components/TableGlobal";
import { useQuery } from "@tanstack/react-query";
import { Row, Space } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useState } from "react";

export default function RoomManagement() {
  const [searchValue, setSearchValue] = useState("");
  const [customerParams, setCustomerParams] = useState<IGetCustomersParams>({
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

  const handleChangeTable = (value: IChangeTable) => {
    setCustomerParams({
      ...customerParams,
      page: value.page - 1,
      limit: value.pageSize,
    });
  };

  const columns: ColumnsType<ICustomerRes> = [
    {
      title: "STT",
      align: "center",
      render: (_, __, i) => i + 1,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
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
      dataIndex: "tel",
      align: "center",
    },
    {
      title: "Giới tính",
      dataIndex: "sex",
      align: "center",
      render: (value) => (value === "male" ? "Nam" : "Nữ"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
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
    </div>
  );
}
