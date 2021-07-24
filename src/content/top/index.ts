const form = document.querySelector("form")!
form.addEventListener("submit", e => {
    e.preventDefault()
    const a = (Array.from(new FormData(form).entries()) as [string, string][]).filter(a => a[1].length)
    open("play.html?" + new URLSearchParams(a), "player")
})

document.getElementById("addpinbutton")?.addEventListener("click", () => {
    const a = (Array.from(new FormData(form).entries()) as [string, string][]).filter(a => a[1].length)
    localStorage.setItem("pinned_list", JSON.stringify([
        ...fallbackableJSONParse("pinned_list", []),
        a,
    ]))
    reloadPinnedList()
})

function fallbackableJSONParse<T>(input: string | undefined | null, fallback: T) {
    try {
        if (input == null) return fallback
        return JSON.parse(input)
    } catch(e) {
        return fallback
    }
}

function reloadPinnedList() {
    const ul = document.getElementById("pinned_list")
    if (ul == null) return
    while (ul.children.length) ul.children.item(0)?.remove()
    const list = fallbackableJSONParse(localStorage.getItem("pinned_list"), [])
    for (const pin of list) {
        const li = document.createElement("li")
        const a = document.createElement("a")
        a.href = `play.html?${new URLSearchParams(pin)}`
        a.target = "player"
        a.innerText = new URLSearchParams(pin).toString()
        li.appendChild(a)
        ul.appendChild(li)
    }
}

reloadPinnedList()