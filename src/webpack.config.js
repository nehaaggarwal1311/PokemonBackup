var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

var OUTPUT_DIR = path.resolve(__dirname, 'dist')

console.log(`The webpack.config.js is being read from ${path.resolve(__dirname)}`)

module.exports = {
    entry : './app.js',
    output : {
        path : OUTPUT_DIR,
        filename: 'index_bundle.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.jsx']
      },
    devServer:{
        contentBase: OUTPUT_DIR,
    },
    module : {
        rules : [
            {
                test : /\.(js|jsx)?$/, use: {
                loader: 'babel-loader',
                    options: {
                        // exclude: "/(node_modules|bower_components)/",
                        customize: require.resolve(
                            'babel-preset-react-app/webpack-overrides'
                        )
                    }
                }
            },
            {
                test : /\.css$/, use:['style-loader', 'css-loader']
            }, // css loader will load only those css files which have been imported through js, not the ones in HTML link tags
            {
                test: /\.(jpe?g|gif|png|svg)$/i, use: {
                    loader: 'file-loader',
                        options: {
                            limit: 25000
                        }
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    mode:'development',
    plugins : [
        new HtmlWebpackPlugin ({
            template : path.resolve(__dirname, 'index.html')
        })
    ]
}
