import React from "react"
import { render } from "react-dom"
import { Config } from "../../../zenzawatch/src/Config"

// ZenzaWatch の Config restore が済んでからじゃないと摩訶不思議なところでConfigが読めなくてコケるので
// 読んでから async import する

Promise.all([
    Config.promise("restore")
]).then(() => {
    return import("./app")
}).then(({App}) => {
    render(<App />, document.querySelector("#app"))
})
