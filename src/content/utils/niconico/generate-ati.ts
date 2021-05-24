export function generateActionTrackID() {
    let randomPart = ""
    const parts = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    for (let i=0; i<10; i++) {
        randomPart += parts[Math.floor(Math.random() * parts.length)]
    }
    return `${randomPart}_${Date.now()}`
}