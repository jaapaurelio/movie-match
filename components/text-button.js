const TextButton = ({ children }) => (
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
export default TextButton
