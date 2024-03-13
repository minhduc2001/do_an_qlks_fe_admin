import { Helmet as HelmetWrapper } from "react-helmet";

function Helmet(props: HelmetProps) {
  return (
    <HelmetWrapper>
      <title>Khách sạn | {props.title}</title>
      <meta name="description" content={props.description} />
    </HelmetWrapper>
  );
}

Helmet.defaultProps = {
  title: "Khách sạn",
  description: "",
};

export default Helmet;
