const postcssModules = require('postcss-modules');
const path = require('path');
const AngularCompilerPlugin = require('@ngtools/webpack');


module.exports = (config, options) => {

    /*  SCSS EXTEND */
    const scssRule = config.module.rules.find(x => x.test.toString().includes('scss'));
    const postcssLoader = scssRule.use.find(x => x.loader === 'postcss-loader');
    const pluginFunc = postcssLoader.options.plugins;
    const newPluginFunc = function () {
        var plugs = pluginFunc.apply(this, arguments);
        plugs.splice(plugs.length - 1, 0, postcssModules({ generateScopedName: "[hash:base64:5]" }));
        return plugs;
    }
    postcssLoader.options.plugins = newPluginFunc;

    /*  HTML EXTEND */

    config.module.rules.unshift(
        {
            test: /\.html$/,
            use: [
                { loader: 'raw-loader' },
                {
                    loader: 'posthtml-loader',
                    options: {
                        config: {
                            path: './',
                            ctx: {
                                include: { ...options },
                                content: { ...options }
                            }
                        },
                    }
                },
            ]
        },
    );

    const index = config.plugins.findIndex(p => p instanceof AngularCompilerPlugin.AngularCompilerPlugin);
    const oldOptions = config.plugins[index]._options;
    oldOptions.directTemplateLoading = false;
    config.plugins.splice(index);
    config.plugins.push(new AngularCompilerPlugin.AngularCompilerPlugin(oldOptions));
    return config;
};