const form = document.querySelector("form")!
form.addEventListener("submit", e => {
    e.preventDefault()
    const a = (Array.from(new FormData(form).entries()) as [string, string][]).filter(a => a[1].length)
    open("play.html?" + new URLSearchParams(a), "_blank")
})