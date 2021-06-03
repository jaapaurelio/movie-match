import React, { useState, useEffect } from 'react'
import jsCookie from 'js-cookie'
import Title from '../components/title'
import PageWidth from '../components/page-width'
import Link from 'next/link'

import Topbar from '../components/topbar'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const HowToUse = (props) => {
    const { t } = useTranslation('common')
    const [lastGroupId, setLastGroupId] = useState()

    useEffect(() => {
        const lastGroupId = jsCookie.get('groupId')

        setLastGroupId(lastGroupId)
    }, [])

    return (
        <div className="container">
            <Topbar
                t={t}
                showGroup={true}
                groupId={lastGroupId}
                title="Movie Match"
            />
            <PageWidth className="mm-content-padding">
                <Title title={t('how-to-title')}></Title>
                <div className="image-container">
                    <img className="image" src="/blabla.png"></img>
                </div>
                <div className="description">{t('intro-1')}</div>

                <div className="image-container">
                    <img className="image" src="/yesyes.png"></img>
                </div>
                <div className="description">{t('intro-2')}</div>

                <div className="image-container">
                    <img className="image" src="/match.png"></img>
                </div>
                <div className="description">{t('intro-3')}</div>
                <Link href="/">
                    <button className="close-button mm-btn mm-btn-accept">
                        {t('close-btn')}
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

export const getServerSideProps = async ({ locale, query }) => {
    const translations = await serverSideTranslations(locale)

    return {
        props: {
            ...translations,
        },
    }
}

export default HowToUse
