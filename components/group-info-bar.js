import PageWidth from './page-width'

export default ({ groupId, users }) => {
    return (
        <PageWidth className="mm-content-padding">
            <div className="group-info">
                <div className="eli">
                    <span className="group-id">{groupId}</span>
                    <i className="fas fa-user group-info-icon" />
                    <span className="group-info-text">{users.length}</span>
                    <i className="fas fa-info-circle group-info-icon" />
                    {users.map(u => u.name).join(', ')}
                </div>
            </div>
            <style jsx>
                {`
                    .group-info {
                        background: #fff;
                        color: #333;
                        font-size: 12px;
                        padding: 10px 0;
                        display: flex;
                    }

                    .eli {
                        white-space: nowrap;
                        overflow: hidden;
                        flex-grow: 1;
                        margin-right: 10px;
                        text-overflow: ellipsis;
                    }

                    .group-id {
                        margin-right: 6px;
                    }
                    .right {
                        flex-shrink: 0;
                    }

                    .tabs {
                        flex-shrink: 0;
                    }

                    .group-info-icon {
                        margin-right: 4px;
                    }

                    .group-info-text {
                        margin-right: 10px;
                    }
                `}
            </style>
        </PageWidth>
    )
}
