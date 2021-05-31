import React, { useState, useEffect } from 'react'
import jsCookie from 'js-cookie'
import Title from '../components/title'
import PageWidth from '../components/page-width'
import { withNamespaces } from '../i18n'
import Link from 'next/link'

import Topbar from '../components/topbar'

const HowToUse = (props) => {
    const [lastGroupId, setLastGroupId] = useState()
    console.log(props)
    useEffect(() => {
        const lastGroupId = jsCookie.get('groupId')

        setLastGroupId(lastGroupId)
    }, [])

    return (
        <div className="container">
            <Topbar
                showGroup={true}
                groupId={lastGroupId}
                title="Movie Match"
            />
            <PageWidth className="mm-content-padding">
                <Title title={props.t('how-to-title')}></Title>
                <div className="image-container">
                    <img className="image" src="/blabla.png"></img>
                </div>
                <div className="description">{props.t('intro-1')}</div>

                <div className="image-container">
                    <img className="image" src="/yesyes.png"></img>
                </div>
                <div className="description">{props.t('intro-2')}</div>

                <div className="image-container">
                    <img className="image" src="/match.png"></img>
                </div>
                <div className="description">{props.t('intro-3')}</div>
                <Link href="/">
                    <button className="close-button mm-btn mm-btn-accept">
                        {props.t('close-btn')}
                    </button>
                </Link>
            </PageWidth>
            <style jsx>{`
                .image-container {
                    padding: 20px;
                    text-align: center;
                }

                .image {
                    max-width: 100%;
                    width: 300px;
                }

                .description {
                    font-size: 20px;
                    text-align: center;
                    margin-bottom: 40px;
                }

                .close-button {
                    margin-bottom: 40px;
                    width: 100%;
                }
            `}</style>
        </div>
    )
}

HowToUse.getInitialProps = () => {
    const pageProps = { namespacesRequired: ['common'] }

    return pageProps
}

export default withNamespaces('common')(HowToUse)
