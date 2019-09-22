import { withNamespaces } from '../i18n'

export default withNamespaces('common')(({ groupId, t }) => (
    <section className="container">
        <span className="group-number-desc"><span className="group-url">Your group name is {groupId}</span></span>
        <style jsx>
            {`
            .container {
                margin-top: 10px;
            }
                .group-number-desc {
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
