import Link from 'next/link';

export default ({title = 'Movie Match'}) => (
    <nav>
        <div className="container">
            <div className="page-title">
                {title}
            </div>
            <div className="top-icons-container">
                <div className="top-icon">
                    <Link href="/">
                        <i className="fas fa-clone"></i>
                    </Link>
                </div>
                <div className="top-icon">
                    <Link href="/matches">
                    <i className="fas fa-heart"></i>
                    </Link>
                </div>
            </div>
        </div>

    <style jsx>{`
        nav {
            margin-bottom: 60px;
        }
        .container {
            background: #fff;
            display: flex;
            justify-content: space-between;
            height: 40px;
            padding: 10px 20px;
            align-items: center;
            color: #a1a3ab;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 2;

            max-width: 800px;
            margin: 0 auto;
        }

        .page-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .top-icons-container {
            display: flex;
        }

        .top-icon {
            margin-left: 10px;
            padding: 10px;
        }
    `}
    </style>
    </nav>
);