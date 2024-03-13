import React from "react";
import { PUBLIC_ROUTES } from "./lazyLoading";
import { Route, Routes } from "react-router-dom";
import { Spin } from "antd";

const Login = React.lazy(() => import("@/pages/login"));
const PageNotFound = React.lazy(() => import("@/pages/404"));
const SuspenseWrapper = (props: SuspenseWrapperProps) => {
  return <React.Suspense fallback={<Spin />}>{props.children}</React.Suspense>;
};

function MainRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        key="/login"
        element={
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        }
      />
      {PUBLIC_ROUTES.map((route) => (
        <Route
          path={route.path}
          key={route.path}
          element={
            <SuspenseWrapper>
              <route.component />
            </SuspenseWrapper>
          }
        />
      ))}

      <Route
        path="*"
        key="*"
        element={
          <SuspenseWrapper>
            <PageNotFound />
          </SuspenseWrapper>
        }
      />
    </Routes>
  );
}

export default MainRoutes;
