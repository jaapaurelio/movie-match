import en from './public/static/locales/en/common.json'

function i18(WrappedComponent) {
    function Theme(props) {
        return <WrappedComponent t={t} {...props} />
    }

    if (WrappedComponent.getInitialProps) {
        Theme.getInitialProps = WrappedComponent.getInitialProps
    }

    function t(key) {
        if (en[key]) {
            return en[key]
        } else {
            console.log('no value for translation', key)
            return key
        }
    }

    return Theme
}

// This function takes a component...
export function withNamespaces() {
    return i18
}

export function appWithTranslation(WrappedComponent) {
    return i18(WrappedComponent)
}
