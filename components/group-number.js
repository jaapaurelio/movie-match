export default function GroupNumber({ groupId, t }) {
    return (
        <section className="container">
            <span className="group-number-desc">
                <span className="group-url">
                    {t('group-name-is')} {groupId}
                </span>
            </span>
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
    )
}
