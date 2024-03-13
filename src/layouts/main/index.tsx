import "./index.scss";
import classNames from "classnames";
import { useGetMenuState } from "@/redux/slices/MenuSlice";
import { ReactNode } from "react";

interface IMainProps {
  children: ReactNode;
}

export default function Main({ children }: IMainProps): JSX.Element {
  const isOpen = useGetMenuState();

  return (
    <div className={classNames("main", { ["sidebar-open"]: isOpen })}>
      {children}
    </div>
  );
}
