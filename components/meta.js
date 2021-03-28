import Head from 'next/head'

const Meta = () => (
    <div>
        <Head>
            <link rel="manifest" href="/static/manifest.json" />
            <link rel="icon" type="image/x-icon" href="/static/favicon.png" />
            <link
                rel="stylesheet"
                href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
                integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
                crossOrigin="anonymous"
            />
            <link
                href="https://fonts.googleapis.com/css?family=Quicksand|Raleway:400,700|Pacifico"
                rel="stylesheet"
            />
            <meta name="theme-color" content="#333" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, minimum-scale=1.0, user-scalable=no"
            />
            <meta charSet="utf-8" />
            <title>Movie Match - Find the perfect movie</title>
            <meta
                name="Description"
                content="Movie Match helps you find the perfect movie to watch with friends."
            />
            <meta
                name="google-site-verification"
                content="FRcG65B1vuHfxMOYHCH3PuLjbZ8UKxLc8kO1m2cGshs"
            />
        </Head>
    </div>
)

export default Meta
