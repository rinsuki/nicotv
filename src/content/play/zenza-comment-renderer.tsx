import React, { useEffect, useRef, useState } from "react";
import { NicoCommentPlayer } from "../../../zenzawatch/src/CommentPlayer";
import { observer } from "mobx-react-lite"
import { VideoPlayerState } from "./video-player/state";

export const ZenzaCommentRendererCore: React.FC<{comments: string, playerState: VideoPlayerState}> = observer(props => {
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
    const { currentTime, paused } = props.playerState
    useEffect(() => {
        try {
            // console.log(props.playerState.currentTime)
            player.currentTime = currentTime
        } catch(e) {
            // may fail
            console.error(e)
        }
    }, [currentTime])
    useEffect(() => {
        if (paused) {
            player._view.pause()
        } else {
            player._view.play()
        }
    }, [player, paused])
    return <div ref={w => setWrapper(w ?? undefined)} className="zenzaCommentRendererCore" />
})

export const ZenzaCommentRenderer: React.FC<{thread: number | string, duration: number, playerState: VideoPlayerState, forks: number[]}> = props => {
    const [comments, setComments] = useState<string>()
    useEffect(() => {
        fetch("https://nmsg.nicovideo.jp/api.json", {
            method: "POST",
            body: JSON.stringify(props.forks.map(fork => {
                if (fork === 1) return {
                    thread: {
                        thread: props.thread.toString(),
                        user_id: "",
                        fork,
                        res_from: -1000,
                        version: "20061206",
                    }
                }
                return {
                    thread_leaves: {
                        thread: props.thread.toString(),
                        content: `0-${Math.ceil(props.duration / 60)}:100,1000,nicoru:100`,
                        fork,
                        language: 0,
                        nicoru: 3,
                        scores: 1,
                        user_id: "",
                    }
                }
            }))
        }).then(r => r.text()).then(r => {
            console.log("comments", JSON.parse(r))
            setComments(r)
        })
    }, [props.thread, ...props.forks])
    if (comments == null) return null
    return <ZenzaCommentRendererCore comments={comments} playerState={props.playerState} />
}