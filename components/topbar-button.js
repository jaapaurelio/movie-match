export default ({ children }) => (
  <div className="root">
    {children}

    <style jsx>
      {`
        .root {
          padding: 0 10px;
        }
      `}
    </style>
  </div>
);
