import React from 'react'
import ReactPlayer from 'react-player/youtube'

const MovieVideo = ({ youtubeKey }) => {
    return (
        <div className="player-wrapper">
            <div className="react-player">
                <div>
                    <ReactPlayer
                        width="100%"
                        height="100%"
                        controls={true}
                        url={`https://www.youtube.com/watch?v=${youtubeKey}`}
                    />
                </div>
            </div>
            <style jsx>
                {`
                    .player-wrapper {
                        width: auto; // Reset width
                        height: auto; // Reset height
                    }
                    .react-player {
                        padding-top: 56.25%; // Percentage ratio for 16:9
                        position: relative; // Set to relative
                    }

                    .react-player > div {
                        top: 0;
                        width: 100%;
                        height: 100%;
                        position: absolute; // Scaling will occur since parent is relative now
                    }
                `}
            </style>
        </div>
    )
}

export default MovieVideo
