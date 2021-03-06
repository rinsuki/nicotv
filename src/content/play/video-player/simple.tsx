import React, { useEffect, useState } from "react";
import { addEventListenerWithRemoveFunction } from "../../utils/ael-with-remove-function";
import { VideoPlayerState } from "./state";

export const SimpleVideoPlayer: React.FC<{src: string, playerState: VideoPlayerState}> = ({src, playerState}) => {
    const [video, setVideo] = useState<HTMLVideoElement>()
    useEffect(() => {
        if (video == null) return
        const timer = setInterval(() => {
            playerState.setCurrentTime(video.currentTime)
        }, 25)
        const removePlay = addEventListenerWithRemoveFunction(video, "play", playerState.play.bind(playerState))
        const removePause = addEventListenerWithRemoveFunction(video, "pause", playerState.pause.bind(playerState))
        return () => {
            clearInterval(timer)
            removePlay()
            removePause()
        }
    }, [video, playerState])
    useEffect(() => {
        if (video == null) return
        try {
            video.volume = JSON.parse(localStorage.getItem("video.volume") ?? "0.5")
        } catch(e) {
        }
    }, [video])
    
    return <video src={src} ref={v => setVideo(v ?? undefined)} controls autoPlay style={{
        width: "100%",
        height: "100%",
        outline: "none",
        opacity: 0.5,
    }} onVolumeChange={e => {
        localStorage.setItem("video.volume", JSON.stringify(e.currentTarget.volume))
    }}/>

}