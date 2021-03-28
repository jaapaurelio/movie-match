import PageWidth from './page-width'

const Footer = ({ children, className = '' }) => {
    return (
        <section className="footer-container">
            <div className="footer">
                <PageWidth>Movie Match</PageWidth>
            </div>
            <style jsx>
                {`
                    .footer-container {
                        margin-top: 40px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 10px;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        padding: 4px;
                        background: #111111;
                        color: #fff;
                    }
                `}
            </style>
        </section>
    )
}
export default Footer;
