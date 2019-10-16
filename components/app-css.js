export default () => (
    <div>
        <style jsx global>{`
            body {
                font-family: 'Raleway', sans-serif;
                color: #333;
                line-height: 1.4;
            }

            .mm-title-container {
                margin: 40px 20px;
            }

            .mm-title {
                font-size: 22px;
                font-weight: 800;
            }

            .mm-subtitle {
                font-size: 16px;
                font-weight: normal;
                margin-top: 6px;
                display: block;
            }

            .mm-big-message {
                text-align: center;
                padding: 20px;
                font-size: 16px;
                color: #0f3846;
            }

            select {
                background: #fff;
                border: 1px solid #b7b7b7;
                border-radius: 4px;
                padding: 3px 22px 3px 3px;
                background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M7.406 7.828l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z'%3E%3C/path%3E%3C/svg%3E");
                background-position: calc(100% - 3px) 50%;
                background-repeat: no-repeat;
                background-size: 16px;
                -webkit-appearance: none;
                -moz-appearance: none;
            }

            select::-ms-expand {
                display: none;
            }

            .mm-content-padding {
                padding: 0px 20px;
            }

            .mm-all-padding {
                padding: 20px;
            }

            .join-title {
                text-align: center;
                margin: 0px 0 10px;
                font-size: 16px;
            }

            .group-input {
                padding: 10px;
                font-size: 16px;
                text-align: center;
                border: 1px solid #b7b7b7;
                width: 170px;
                box-sizing: border-box;
                text-transform: uppercase;
                border-radius: 4px;
            }
            .mm-btn {
                display: inline-block;
                padding: 14px;
                border: 1px solid #a79600;
                border-radius: 6px;
                text-decoration: none;
                color: #443300;
                font-size: 16px;
                cursor: pointer;
                background: #ffdb6e;
                width: 170px;
                box-sizing: border-box;
                line-height: 1;
                outline: none;
                font-family: Raleway, sans-serif;
                font-weight: bold;
            }

            .mm-btn-line {
                background: transparent;
                border: 1px solid #333;
                color: #333;
            }

            .mm-btn-accept {
                background: #00c185;
                color: #fff;
                border: 1px solid #0bb17d;
            }

            .mm-btn:disabled {
                border-color: #333;
                background: #fde291;
                color: #333;
            }

            .mm-small-btn {
                width: auto;
                padding: 6px 15px;
                border: 0;
                border: 1px solid #333;
                background: transparent;
                color: #333;
                margin-top: 10px;
                border-radius: 4px;
                position: relative;
                outline: none;
                cursor: pointer;
            }

            .mm-text-btn {
                cursor: pointer;
                text-decoration: underline;
            }

            .mm-tooltip {
                position: absolute;
                background: #000000cf;
                color: #fff;
                display: block;
                padding: 10px;
                border-radius: 2px;
                left: 50%;
                -webkit-transform: translateX(-50%);
                transform: translateX(-50%);
                white-space: nowrap;
                border-radius: 4px;
            }

            .join-btn {
                margin-top: 10px;
            }

            strong {
                font-weight: bold;
            }
        `}</style>
    </div>
)
