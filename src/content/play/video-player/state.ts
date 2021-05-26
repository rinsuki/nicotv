import { makeAutoObservable } from "mobx"

export class VideoPlayerState {
    currentTime = 0
    paused = false

    constructor() {
        makeAutoObservable(this)
    }

    setCurrentTime(time: number) {
        this.currentTime = time
    }
}