const config = (opt) => {
    /**
     * @type {import('webpack').Configuration}
     */
    const configuration = {
        ...opt,
    };
    return configuration;
};
module.exports = config;
