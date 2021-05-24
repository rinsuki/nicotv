import React, { useEffect, useRef, useState } from "react";

export const DMCVideoPlayer: React.FC<{delivery: any, setCurrentTime: (sec: number) => void}> = ({delivery, setCurrentTime}) => {
    const [session, setSession] = useState<any>()
    useEffect(() => {
        fetch("https://api.dmc.nico/api/sessions?_format=json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                session: {
                    client_info: {
                        player_id: delivery.movie.session.playerId,
                    },
                    content_id: delivery.movie.contentId,
                    content_type: "movie",
                    content_src_id_sets: [{
                        content_src_ids: [{
                            src_id_to_mux: {
                                video_src_ids: [delivery.movie.videos.find((s: any) => s.isAvailable).id],
                                audio_src_ids: [delivery.movie.audios.find((s: any) => s.isAvailable).id],
                            }
                        }]
                    }],
                    timing_constraint: "unlimited",
                    keep_method: {
                        heartbeat: {
                            lifetime: delivery.movie.session.heartbeatLifetime,
                        }
                    },
                    protocol: {
                        name: "http",
                        parameters: {
                            http_parameters: {
                                parameters: {
                                    http_output_download_parameters: {
                                        transfer_preset: "",
                                        use_ssl: "yes",
                                        use_well_known_port: "yes",
                                    }
                                }
                            }
                        }
                    },
                    content_uri: "",
                    session_operation_auth: {
                        session_operation_auth_by_signature: {
                            token: delivery.movie.session.token,
                            signature: delivery.movie.session.signature,
                        }
                    },
                    content_auth: {
                        auth_type: "ht2",
                        content_key_timeout: delivery.movie.session.contentKeyTimeout,
                        service_id: "nicovideo",
                        service_user_id: delivery.movie.session.serviceUserId,
                    },
                    recipe_id: delivery.recipeId,
                    priority: delivery.movie.session.priority,
                },
            })
        }).then(r => r.json()).then(r => {
            setSession(r.data.session)
        })
    }, [])
    useEffect(() => {
        if (session == null) return
        const timer = setInterval(() => {
            fetch(`https://api.dmc.nico/api/sessions/${session.id}?_format=json&_method=PUT`, {
                method: "POST",
                body: JSON.stringify({session})
            }).then(r => r.json()).then(r => {
                console.log("heartbeat", r)
                setSession(r.data.session)
            })
        }, delivery.movie.session.heartbeatLifetime/2)
        return () => clearInterval(timer)
    }, [session])
    const [video, setVideo] = useState<HTMLVideoElement>()
    useEffect(() => {
        if (video == null) return
        const timer = setInterval(() => {
            setCurrentTime(video.currentTime)
        }, 100)
        return () => clearInterval(timer)
    }, [video, setCurrentTime])

    if (session == null) return null
    
    return <video src={session.content_uri} ref={v => setVideo(v ?? undefined)} controls autoPlay style={{
        width: "100%",
        height: "100%",
        outline: "none",
    }}/>
}