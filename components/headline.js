import PageWidth from "./page-width";
export default props => {
  return (
    <section className={`headline ${props.className}`}>
      <PageWidth className="mm-all-padding">{props.children}</PageWidth>
      <style jsx>
        {`
          .headline {
            font-family: "Thasadith", sans-serif;
            background: #840c49;
            color: #fff;
            border-bottom: 2px solid #610933;
          }
        `}
      </style>
    </section>
  );
};
