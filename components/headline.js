import PageWidth from "./page-width";
export default props => {
  return (
    <section className={`headline ${props.className}`}>
      <PageWidth className="mm-all-padding">{props.children}</PageWidth>
      <style jsx>
        {`
          .headline {
            font-family: "Quicksand", sans-serif;
            background: #ffc818;
            color: #333;
          }
        `}
      </style>
    </section>
  );
};
