export const GA_TRACKING_ID =
    process.env.NODE_ENV === 'production' ? 'UA-58151786-5' : ''

export const pageview = url => {
    window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
    })
}

export const event = ({ action, category, label, value }) => {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    })
}
