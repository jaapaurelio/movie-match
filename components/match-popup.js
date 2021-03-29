import { withNamespaces } from '../i18n'

export default withNamespaces('common')(
    ({ show, poster, onClickMatches, onClickDismiss, t }) => (
        <div className={`popup-container ${show ? 'show' : ''}`}>
            <div className="popup-content">
                <h1>{t('its-a-match')}</h1>
                {}
                <img
                    className="poster"
                    src={`https://image.tmdb.org/t/p/w116_and_h174_bestv2/${poster}`}
                />
                <div className="desc">{t('pop-up-we-found-perfect-match')}</div>
                <div className="btn-container">
                    <div onClick={onClickMatches} className="match-btn">
                        {t('check-matches')}
                    </div>
                </div>
                <div className="btn-container">
                    <div onClick={onClickDismiss} className="keep-searching">
                        {t('continue-searching')}
                    </div>
                </div>
            </div>

            <style jsx>
                {`
                    .poster {
                        border-radius: 4px;
                        margin-bottom: 20px;
                    }

                    .popup-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 3;
                        display: flex;
                        flex-flow: column nowrap;
                        justify-content: center;
                        align-items: center;
                        background: #393939fa;
                        transition: opacity 0.2s linear;
                        visibility: hidden;
                        opacity: 0;
                    }

                    .popup-container.show {
                        visibility: visible;
                        opacity: 1;
                    }

                    .popup-content {
                        padding: 40px;
                        color: #fff;
                        text-align: center;
                    }

                    h1 {
                        font-size: 30px;
                        font-family: 'Pacifico', cursive;
                        margin-bottom: 20px;
                    }

                    .desc {
                        margin-bottom: 20px;
                        font-size: 14px;
                    }

                    .btn-container {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }

                    .match-btn {
                        border: 1px solid #fff;
                        padding: 6px;
                        cursor: pointer;
                        margin-bottom: 20px;
                        width: 200px;
                        text-align: center;
                        border-radius: 4px;
                        box-sizing: border-box;
                    }

                    .keep-searching {
                        text-decoration: underline;
                    }
                `}
            </style>
        </div>
    )
)
