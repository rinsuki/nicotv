import React, { useEffect, useState } from "react";
import { FRONTEND_ID } from "./const";
import { DMCVideoPlayer } from "./video-player/dmc";
import { generateActionTrackID } from "../utils/niconico/generate-ati";
import { ZenzaCommentRenderer } from "./zenza-comment-renderer";
import { SimpleVideoPlayer } from "./video-player/simple";

const VideoPlayer: React.FC<{id: string, thread?: string, videoSrc?: string}> = props => {
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
    const thread = props.thread != null ? parseInt(props.thread) : 1558794783
    const vsrc = props.videoSrc

    return <div className="player">
        <title>{info.video.title} ({info.video.id}) - nicotv </title>
        {vsrc != null ? <SimpleVideoPlayer src={vsrc} setCurrentTime={setCurrentTime} /> : <DMCVideoPlayer delivery={info.media.delivery} setCurrentTime={setCurrentTime} />}
        <ZenzaCommentRenderer thread={thread} fork={1} duration={300} currentTime={currentTime}/>
    </div>
}

export const App: React.FC = props => {
    const params = new URL(location.href).searchParams
    return <VideoPlayer id={params.get("id")!} thread={params.get("thread") ?? undefined} videoSrc={params.get("vsrc") ?? undefined} />
}