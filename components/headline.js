import PageWidth from "./page-width";
export default props => {
  return (
    <section className={`headline ${props.className}`}>
      <PageWidth className="mm-all-padding">{props.children}</PageWidth>
      <style jsx>
        {`
          .headline {
            font-family: "Quicksand", sans-serif;
            color: #333;
            background: #fafafa;
            border-bottom: 1px solid #eaeaea;
          }
        `}
      </style>
    </section>
  );
};
