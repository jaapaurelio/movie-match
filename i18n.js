import en from './static/locales/en/common.json'

// This function takes a component...
export function withNamespaces() {
    return function(WrappedComponent) {
        // ...and returns another component...
        return class extends React.Component {
            constructor(props) {
                super(props)
            }

            t(key) {
                if (en[key]) {
                    return en[key]
                } else {
                    console.log('no value for translation', key)
                    return key
                }
            }

            render() {
                // ... and renders the wrapped component with the fresh data!
                // Notice that we pass through any additional props
                return <WrappedComponent t={this.t} {...this.props} />
            }
        }
    }
}

export function appWithTranslation(WrappedComponent) {
    // ...and returns another component...
    return class extends React.Component {
        constructor(props) {
            super(props)
        }

        t(a) {
            console.log('iside t', a)
            return a
        }

        render() {
            // ... and renders the wrapped component with the fresh data!
            // Notice that we pass through any additional props
            return <WrappedComponent t={this.t} {...this.props} />
        }
    }
}
