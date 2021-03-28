const Loader = props => {
    return (
        <div className="loader">
            <style jsx>
                {`
                    .loader {
                        overflow: hidden;
                        position: sticky;
                        z-index: 3;
                        width: 100%;
                        height: 4px;
                    }
                    .loader:before {
                        display: block;
                        position: absolute;
                        content: '';
                        left: -200px;
                        width: 200px;
                        height: 4px;
                        background-color: #ffc818;
                        animation: loading 1s linear infinite;
                    }

                    @keyframes loading {
                        from {
                            left: -200px;
                            width: 30%;
                        }
                        50% {
                            width: 30%;
                        }
                        70% {
                            width: 70%;
                        }
                        80% {
                            left: 50%;
                        }
                        95% {
                            left: 120%;
                        }
                        to {
                            left: 100%;
                        }
                    }
                `}
            </style>
        </div>
    )
}

export default Loader
