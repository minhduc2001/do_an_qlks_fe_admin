import "./index.scss";
import React from "react";

interface IContentProps {
  children: React.ReactNode;
}

export default function Content({ children }: IContentProps) {
  return <div className="content">{children}</div>;
}
