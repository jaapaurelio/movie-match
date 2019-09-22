import { withNamespaces } from '../i18n'

export default withNamespaces('common')(({ roomId, t }) => (
    <section className="container">
        <span className="room-number-desc"><span className="group-url">moviematch.io/{roomId}</span></span>
        <style jsx>
            {`
            .container {
                margin-top: 10px;
            }
                .room-number-desc {
                    text-align: center;
                    margin-bottom: 10px;
                    font-size: 14px;
                }

                .group-url {
                    font-weight: bold;
                }
            `}
        </style>
    </section>
))
