export default ({ children }) => (
    <div className="container">
        {children}
        <style jsx>
            {`
                .container {
                    cursor: pointer;
                    text-decoration: underline;
                }
            `}
        </style>
    </div>
)
