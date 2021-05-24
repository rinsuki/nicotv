import React, { useEffect, useRef, useState } from "react";
import { NicoCommentPlayer } from "../../../zenzawatch/src/CommentPlayer";

export const ZenzaCommentRendererCore: React.FC<{comments: string, currentTime: number}> = props => {
    const [player] = useState(() => new NicoCommentPlayer({
        filter: {
            enableFilter: false,
            fork0: true,
            fork1: true,
            fork2: true,
        },
        showComment: true,
        debug: true,
        playbackRate: 1,
    }))
    const [wrapper, setWrapper] = useState<HTMLDivElement>()
    useEffect(() => {
        console.log
        if (wrapper == null) return
        player.appendTo(wrapper)
    }, [wrapper])
    useEffect(() => {
        console.log("NicoCommentPlayer", player)
    }, [player])
    useEffect(() => {
        player.setComment(props.comments, {format: "json"})
    }, [props.comments])
    useEffect(() => {
        try {
            console.log(props.currentTime)
            player.currentTime = props.currentTime
        } catch(e) {
            // may fail
            console.error(e)
        }
    }, [props.currentTime])
    return <div ref={w => setWrapper(w ?? undefined)} className="zenzaCommentRendererCore" />
}

export const ZenzaCommentRenderer: React.FC<{thread: number | string, fork: number, duration: number, currentTime: number}> = props => {
    const [comments, setComments] = useState<string>()
    useEffect(() => {
        fetch("https://nmsg.nicovideo.jp/api.json", {
            method: "POST",
            body: JSON.stringify([{
                thread: {
                    thread: props.thread.toString(),
                    user_id: "",
                    fork: props.fork,
                    res_from: -1000,
                    version: "20061206",
                }
            }])
        }).then(r => r.text()).then(r => {
            console.log("comments", JSON.parse(r))
            setComments(r)
        })
    }, [props.thread, props.fork])
    if (comments == null) return null
    return <ZenzaCommentRendererCore comments={comments} currentTime={props.currentTime} />
}