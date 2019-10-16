export default ({ children }) => {
    return (
        <div className="fixed-bottom-container">
            <div className="fixed-bottom">{children}</div>
            <style jsx>
                {`
                    .fixed-bottom-container {
                        padding-top: 150px;
                    }

                    .fixed-bottom {
                        text-align: center;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                    }
                `}
            </style>
        </div>
    )
}
