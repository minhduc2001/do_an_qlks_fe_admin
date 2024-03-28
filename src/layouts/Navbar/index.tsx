import { IRoute, PUBLIC_ROUTES } from "@/lazyLoading";
import "./index.scss";
import { Breadcrumb, Dropdown, Image, MenuProps, Space } from "antd";
import { toggleMenu, useGetMenuState } from "@/redux/slices/MenuSlice";
import { useCallback, useEffect, useMemo } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser, reloadUser } from "@/redux/slices/UserSlice";
import store from "@/redux/store";
import { useIsFetching, useIsMutating, useQuery } from "@tanstack/react-query";
import ApiUser from "@/api/ApiUser";

const findPath = (routes: IRoute[], path: string): IRoute[] | null => {
  for (const route of routes) {
    if (route.path === path) {
      return [route];
    }
  }
  return null;
};

interface IRenderBreadcrumbProps {
  path: string;
}

const RenderBreadcrumb = ({ path }: IRenderBreadcrumbProps) => {
  const pathArray = findPath(PUBLIC_ROUTES, path);
  if (!pathArray) {
    return null;
  }

  return (
    <Breadcrumb>
      {pathArray.map((route) => (
        <Breadcrumb.Item key={route.path}>{route.name}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

function Navbar() {
  const isOpen = useGetMenuState();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const user = store.getState().user;
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const handleToggleMenu = useCallback(() => {
    dispatch(toggleMenu());
  }, []);

  const { data: me } = useQuery(["get_me"], () => ApiUser.getMe());

  useEffect(() => {
    dispatch(reloadUser(me));
  }, [me]);

  const handleLogOut = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const dropdownItems: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: "1",
        label: "Logout",
        onClick: handleLogOut,
      },
    ];
  }, []);

  return (
    <div className="navbar">
      <div className="flex items-center">
        <span className="cursor-pointer mr-3" onClick={handleToggleMenu}>
          {isOpen ? (
            <MenuFoldOutlined style={{ fontSize: "20px" }} />
          ) : (
            <MenuUnfoldOutlined style={{ fontSize: "20px" }} />
          )}
        </span>
        <RenderBreadcrumb path={location.pathname} />
      </div>
      <Space>
        {isFetching + isMutating > 0 && (
          <div className="h-[60px]">
            <img src="/public/loading.svg" alt="" className="h-full" />
          </div>
        )}
        <Dropdown menu={{ items: dropdownItems }}>
          <div className="cursor-pointer flex items-center gap-1">
            <Image
              className="rounded-full object-contain"
              width={40}
              height={40}
              src={
                user.avatar ??
                "https://ninhbinhlegendhotel.com/wp-content/uploads/2022/07/cropped-logo02.png"
              }
              alt="user avatar"
              preview={false}
            />
            <span className="mr-20 ml-5">
              Xin chào <strong>{user.username}!</strong>
            </span>
          </div>
        </Dropdown>
      </Space>
    </div>
  );
}

export default Navbar;
