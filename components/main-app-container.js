
export default ({ children }) => (
    <section className="container">
        {children}


        <style jsx>{`
            .container {
                max-width: 600px;
                margin: 0 auto;
            }
        `}
        </style>
    </section>


);
