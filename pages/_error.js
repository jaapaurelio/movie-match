import React from 'react'
import Topbar from '../components/topbar'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

function ErrorPage() {
    const { t } = useTranslation('common')

    return (
        <div>
            <Topbar />
            <div className="error">{t('sorry-page-not-found')}</div>
            <div className="home-link">
                <div className="mm-btn">
                    <Link href={`/`}>
                        <a>{t('go-to-home-btn')}</a>
                    </Link>
                </div>
            </div>
            <style jsx>{`
                .error {
                    text-align: center;
                    margin-top: 40px;
                }

                .home-link {
                    margin-top: 20px;
                    text-align: center;
                }
            `}</style>
        </div>
    )
}

export const getServerSideProps = async ({ locale, res, err }) => {
    const translations = await serverSideTranslations(locale)
    const statusCode = res ? res.statusCode : err ? err.statusCode : null

    return {
        props: {
            ...translations,
            statusCode,
        },
    }
}

export default ErrorPage
