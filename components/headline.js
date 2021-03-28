import PageWidth from './page-width'
const Headline = props => {
    return (
        <section className={`headline ${props.className}`}>
            <PageWidth className="mm-all-padding">{props.children}</PageWidth>
            <style jsx>
                {`
                    .headline {
                        font-family: 'Quicksand', sans-serif;
                        color: #333;
                        background: #ffdb6e;
                    }
                `}
            </style>
        </section>
    )
}

export default Headline
