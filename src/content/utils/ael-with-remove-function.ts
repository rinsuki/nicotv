export function addEventListenerWithRemoveFunction<K, F>(d: {
    addEventListener: (k: K, f: F) => void,
    removeEventListener: (k: K, f: F) => void
}, key: K, f: F) {
    d.addEventListener(key, f)
    return () => d.removeEventListener(key, f)
}