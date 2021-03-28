const PageWidth = ({ children, className = '' }) => {
    return (
        <section className={`page-width ${className}`}>
            {children}
            <style jsx>
                {`
                    .page-width {
                        max-width: 600px;
                        margin: 0 auto;
                        box-sizing: border-box;
                        position: relative;
                    }
                `}
            </style>
        </section>
    )
}

export default PageWidth
