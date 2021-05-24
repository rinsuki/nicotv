import { app, BrowserWindow, session } from "electron"

app.whenReady().then(() => {
    session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ["<all_urls>"] }, (details, callback) => {
        const url = new URL(details.url)
        if (url.protocol.startsWith("http")) {
            const isNico = url.hostname.endsWith(".nicovideo.jp") || url.hostname.endsWith(".nimg.jp") || url.hostname.endsWith(".nico")
            const shouldBlock = !(isNico) || url.hostname.endsWith("ads.nicovideo.jp")
            if (shouldBlock) {
                callback({cancel: true})
                return
            }
        }
        for (const k of Object.keys(details.requestHeaders)) {
            if (k.toLowerCase().startsWith("sec-fetch")) delete details.requestHeaders[k]
        }
        callback({requestHeaders: details.requestHeaders})
    })
    session.defaultSession.setUserAgent(session.defaultSession.getUserAgent().replace(/ Electron.+? /, " "), "ja, en")
    const window = new BrowserWindow({
        simpleFullscreen: true,
        webPreferences: {
            defaultFontFamily: {
                standard: 'M+ 1c',
                serif: 'M+ 1c',
                sansSerif: 'M+ 1c',
                monospace: 'Noto Sans Mono CJK JP',
            }
        }
    })
    window.loadFile(`${__dirname}/../public/index.html`)
})

app.on("window-all-closed", () => {
    app.quit()
})