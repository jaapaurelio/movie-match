import React, { createRef, useState, useEffect } from 'react'
import axios from 'axios'

function UserPopup({ t }) {
    const textInput = createRef()

    const [state, setState] = useState({
        showPopup: false,
    })

    async function handleClick() {
        if (textInput.current.value !== '') {
            const name = textInput.current.value

            await axios.post(`/api/methods?api=user`, { name })

            localStorage.setItem('username', name)
            setState({ showPopup: false })

            location.reload()
        }
    }

    useEffect(() => {
        var user = localStorage.getItem('username')
        if (!user) {
            setState({ showPopup: true })
        }
    }, [])

    return (
        <div>
            {state.showPopup && (
                <section className="container">
                    <div className="content">
                        {t('whats-you-name')}

                        <div>
                            <input
                                className="name-input"
                                ref={textInput}
                                type="text"
                            />
                        </div>
                        <div>
                            <button className="mm-btn" onClick={handleClick}>
                                {t('save-btn')}
                            </button>
                        </div>
                    </div>
                    <style jsx>
                        {`
                            .container {
                                position: fixed;
                                background: #393939fa;
                                left: 0;
                                top: 0;
                                bottom: 0;
                                right: 0;
                                display: flex;
                                z-index: 4;
                                align-items: center;
                                justify-content: center;
                            }

                            .content {
                                padding: 40px;
                                background: #fff;
                                border-radius: 4px;
                            }

                            .name-input {
                                margin-top: 10px;
                                margin-bottom: 10px;
                                width: 100%;
                                box-sizing: border-box;
                                font-size: 14px;
                                padding: 10px;
                                border: 1px solid #b7b7b7;
                                border-radius: 4px;
                            }
                        `}
                    </style>
                </section>
            )}
        </div>
    )
}

export default UserPopup
