const path = require('path');
const AngularWebpackPlugin = require('@ngtools/webpack/src/ivy/plugin');

module.exports = (config, options) => {

    /*  HTML EXTEND */
    config.module.rules.unshift(
        {
            test: /\.html$/,
            use:(info) => {
                return [
                    { loader: 'raw-loader' },
                    {
                        loader: path.resolve('./scripts/loaders/html-plain-class-name.loader.js'),
                        options: {
                            file: info.resource
                        }
                    }
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
