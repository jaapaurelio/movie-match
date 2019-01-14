import PageWidth from "./page-width";
export default props => {
  return (
    <section className={`headline ${props.className}`}>
      <PageWidth className="mm-all-padding">{props.children}</PageWidth>
      <style jsx>
        {`
          .headline {
            font-family: "Thasadith", sans-serif;
            background: #06baa8;
            color: #fff;
          }
        `}
      </style>
    </section>
  );
};
