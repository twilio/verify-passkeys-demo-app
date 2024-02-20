const storage = new Map()

module.exports = {
    save: (key, value) => storage.set(key, value),
    get: (key) => storage.get(key),
}