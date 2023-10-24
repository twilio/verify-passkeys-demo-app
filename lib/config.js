let baseUrl;
let hostName;

module.exports = {
    /**
     * @param url : string
     */
    setUrl: (url) => {
        baseUrl = url;
        hostName = new URL(url).hostname;
    },
    /**
     * @returns {string}
     */
    getUrl: () => baseUrl,
    /**
     * @returns {string}
     */
    getHostName: () => hostName
}