import PageWidth from './page-width'
import Link from 'next/link'
import { withNamespaces } from '../i18n'

export default withNamespaces('common')(
    ({
        newGroupPage = false,
        groupPage = false,
        groupId,
        title = '',
        showMenu = true,
        t,
    }) => (
        <nav>
            <PageWidth>
                <div className="container">
                    <Link href={`/start`}>
                        <div className="page-title">
                            {title || 'Movie Match'}
                        </div>
                    </Link>
                    <div className="space-between" />
                    {showMenu && (
                        <div className="top-icons-container">
                            <Link href={`/start`}>
                                <div className="sublink">
                                    <div
                                        className={
                                            `sublink-btn ` +
                                            (newGroupPage &&
                                                'sublink-btn-active')
                                        }
                                    >
                                        {t('topbar-new-group')}
                                    </div>
                                </div>
                            </Link>
                            {groupId && (
                                <Link href={`/group?id=${groupId}`}>
                                    <div className="sublink">
                                        <div
                                            className={
                                                `sublink-btn ` +
                                                (groupPage &&
                                                    'sublink-btn-active')
                                            }
                                        >
                                            Group{' '}
                                            <span className="group-id-top">
                                                {groupId}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </PageWidth>

            <style jsx>
                {`
                    nav {
                        background: #fff;
                        position: sticky;
                        top: 0;
                        z-index: 1;
                        color: #333;
                    }

                    .navigation-icon {
                        height: 100%;
                        display: flex;
                        align-items: center;
                        width: 20px;
                        justify-content: center;
                        box-sizing: border-box;
                        padding: 0 20px;
                    }

                    .logo {
                        width: 20px;
                        margin-right: 10px;
                        cursor: pointer;
                    }

                    .space-between {
                        flex-grow: 1;
                    }

                    .container {
                        display: flex;
                        height: 45px;
                        padding: 0px 20px;
                        align-items: center;
                        position: relative;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 2;
                        box-sizing: border-box;
                        max-width: 800px;
                        margin: 0 auto;
                    }

                    .container-with-navigation {
                        padding-left: 0;
                    }

                    .page-title {
                        font-size: 13px;
                        text-transform: uppercase;
                        cursor: pointer;
                    }

                    .top-icons-container {
                        display: flex;
                        height: 100%;
                        align-items: center;
                    }

                    .top-icon {
                        margin-left: 10px;
                        padding: 10px;
                    }

                    .active-tab {
                        border-bottom: 2px solid;
                    }

                    .matched {
                        color: #ccffbc;
                    }

                    .sublink {
                        font-size: 11px;
                        margin-left: 10px;
                        display: flex;
                        height: 100%;
                        align-items: center;
                        cursor: pointer;
                    }

                    .sublink-btn {
                        padding: 2px;
                        border: 1px solid transparent;
                    }

                    .sublink-btn-active {
                        border-bottom: 1px solid #ffc818;
                    }

                    .group-id-top {
                        letter-spacing: 1px;
                        text-transform: uppercase;
                    }
                `}
            </style>
        </nav>
    )
)
