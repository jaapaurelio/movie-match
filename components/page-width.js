export default props => {
  return (
    <section className={`page-width ${props.className}`}>
      {props.children}
      <style jsx>
        {`
          .page-width {
            max-width: 600px;
            margin: 0 auto;
            box-sizing: border-box;
          }
        `}
      </style>
    </section>
  );
};
