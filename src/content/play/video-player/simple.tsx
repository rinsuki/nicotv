import React, { useEffect, useState } from "react";
import { VideoPlayerState } from "./state";

export const SimpleVideoPlayer: React.FC<{src: string, playerState: VideoPlayerState}> = ({src, playerState}) => {
    const [video, setVideo] = useState<HTMLVideoElement>()
    useEffect(() => {
        if (video == null) return
        const timer = setInterval(() => {
            playerState.setCurrentTime(video.currentTime)
        }, 25)
        return () => clearInterval(timer)
    }, [video, playerState])
    
    return <video src={src} ref={v => setVideo(v ?? undefined)} controls autoPlay style={{
        width: "100%",
        height: "100%",
        outline: "none",
        opacity: 0.5,
    }}/>

}