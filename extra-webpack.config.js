const postcssModules = require('postcss-modules');

module.exports = (config, options) => {

    const scssRule = config.module.rules.find(x => x.test.toString().includes('scss'));
    const postcssLoader = scssRule.use.find(x => x.loader === 'postcss-loader');
    const pluginFunc = postcssLoader.options.plugins;
    const newPluginFunc = function () {
        var plugs = pluginFunc.apply(this, arguments);
        plugs.splice(plugs.length - 1, 0, postcssModules({ generateScopedName: "[hash:base64:5]" }));
        return plugs;
    }
    postcssLoader.options.plugins = newPluginFunc;

    return config;
};