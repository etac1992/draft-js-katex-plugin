// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/docs/react-storybook/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
const resolve = require('path').resolve
const globalCSS = resolve(__dirname, '../', 'src/styles.css');

module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    rules: [
      /*
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
        include: path.resolve(__dirname, '../')
      },
      */
      {
        test: /\.css$/,
        include: [globalCSS],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: 'draftJsKatexPlugin__[local]__[hash:base64:5]',
            },
          },
        ],
      }, {
        test: /\.css$/,
        exclude: [globalCSS],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
    /*
    loaders: [

    {
      test: /\.css$/,
      use: [
        {
          loader: "style-loader"
        },
        {
          loader: "css-loader",
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: 'draftJsKatexPlugin__[local]__[hash:base64:5]',
          },
        },
        'postcss-loader'
      ]
    }]
    */
  },
};
