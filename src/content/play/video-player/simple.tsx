import React, { useEffect, useState } from "react";

export const SimpleVideoPlayer: React.FC<{src: string, setCurrentTime: (sec: number) => void}> = ({src, setCurrentTime}) => {
    const [video, setVideo] = useState<HTMLVideoElement>()
    useEffect(() => {
        if (video == null) return
        const timer = setInterval(() => {
            setCurrentTime(video.currentTime)
        }, 25)
        return () => clearInterval(timer)
    }, [video, setCurrentTime])
    
    return <video src={src} ref={v => setVideo(v ?? undefined)} controls autoPlay style={{
        width: "100%",
        height: "100%",
        outline: "none",
        opacity: 0.5,
    }}/>

}