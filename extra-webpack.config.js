const postcssModules = require('postcss-modules');
const path = require('path');
const AngularWebpackPlugin = require('@ngtools/webpack/src/ivy/plugin');


module.exports = (config, options) => {

    /*  SCSS EXTEND */
    const scssRule = config.module.rules.find(x => x.test.toString().includes('scss'));
    const postcssLoader = scssRule.use.find(x => x.loader.toString().includes('postcss-loader'));
    const pluginFunc = postcssLoader.options.postcssOptions.plugins;
    const newPluginFunc = function () {
        var plugs = pluginFunc.apply(this, arguments);
        plugs.splice(plugs.length - 1, 0, postcssModules({ generateScopedName: "[hash:base64:5]" }));
        return plugs;
    }
    postcssLoader.options.postcssOptions.plugins = newPluginFunc;

    /*  HTML EXTEND */

    config.module.rules.unshift(
        {
            test: /\.html$/,
            use:(info) => {
                return [
                    { loader: 'raw-loader' },
                    {
                        loader: path.resolve('./scripts/loaders/html-css-modules.loader.js'),
                        options: {
                            file: info.resource
                        }
                    },
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
            }
        },
    );

    const index = config.plugins.findIndex(p => p instanceof AngularWebpackPlugin.AngularWebpackPlugin);
    const oldOptions = config.plugins[index].pluginOptions;
    oldOptions.directTemplateLoading = false;
    config.plugins.splice(index);
    config.plugins.push(new AngularWebpackPlugin.AngularWebpackPlugin(oldOptions));
    return config;
};
