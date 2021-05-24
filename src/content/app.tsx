import React, { useEffect, useState } from "react";
import { FRONTEND_ID } from "./const";
import { DMCVideoPlayer } from "./dmc-video-player";
import { generateActionTrackID } from "./utils/niconico/generate-ati";
import { ZenzaCommentRenderer } from "./zenza-comment-renderer";

const VideoPlayer: React.FC<{id: string}> = props => {
    const [info, setInfo] = useState<any>()
    const [currentTime, setCurrentTime] = useState(0)
    useEffect(() => {
        fetch(`https://www.nicovideo.jp/api/watch/v3_guest/${props.id}?_frontendId=${FRONTEND_ID}&_frontendVersion=0&actionTrackId=${generateActionTrackID()}&isContinueWatching=true`)
            .then(r => r.json())
            .then(r => {
                console.log("nicovideo watch res", r)
                setInfo(r.data)
            })
    }, [])
    if (info == null) return null

    return <div className="player">
        <title>{info.video.title} ({info.video.id}) - nicotv </title>
        <DMCVideoPlayer delivery={info.media.delivery} setCurrentTime={setCurrentTime} />
        <ZenzaCommentRenderer thread={1543669986} fork={1} duration={300} currentTime={currentTime}/>
    </div>
}

export const App: React.FC = props => {
    return <VideoPlayer id="sm34256261" />
}