 const fs = require("fs");
const path = require('path');

const DefinePlugin = require("webpack").DefinePlugin;
const CopyPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const nodeExternals = require('webpack-node-externals');

const package_json = JSON.parse(fs.readFileSync("./package.json"));





module.exports = (env)=>{
    const VERSION = package_json.version;
    const PROGRAM_NAME = "NeoAtlantis Slate";
    const APPNAME = "neoatlantis-slate";   

    if(!PROGRAM_NAME) throw Error("Unknown namespace specified.");

    const program_prefix = PROGRAM_NAME.replace(/[^a-z0-9]/gi, "-").toLowerCase();

    
    const is_dev = (env.production === undefined);
    const output_path = __dirname;

    const common_srcpath = path.join(__dirname, "common");

    const generic_rules = [
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.(vue|js)$/,
            loader: 'ifdef-loader',
            exclude: /node_modules/,
            options: {
                DEV: is_dev,
            }
        },
        {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        // enable CSS Modules
                        modules: true,
                    }
                }
            ],
        },

    ];

    const generic_plugins = [
        new DefinePlugin({
            VERSION: JSON.stringify(VERSION),
            APPNAME: JSON.stringify(APPNAME),
            PROGRAM_NAME: JSON.stringify(PROGRAM_NAME),
            PROGRAM_PREFIX: JSON.stringify(program_prefix),
            DEV: JSON.stringify(is_dev),
        }),
        new HtmlReplaceWebpackPlugin([
            {
                pattern: '[[[PROGRAM NAME]]]',
                replacement: PROGRAM_NAME,
            },
        ]),
    ];


    let ret = [];

    let webext_srcpath = path.join(__dirname, "src");
    let webext_dstpath = path.join(
        __dirname,
        (is_dev?"dev":"dist"));


    function __template(srcpath, dstpath, scriptname, pagename){ return {
        entry: path.join(srcpath, scriptname),
        mode: (
            false
            ?'development'
            :'production'
        ),
        watch: true,
        output: {
            filename: scriptname,
            path: dstpath,
        },
        resolve: {
            alias: {
                app: srcpath,
                common: common_srcpath,
                sfc: path.join(srcpath, "vue"),
            },
            fallback: {
                "fs": false,
                "crypto": false,
            }
        },
        module: {
            rules: generic_rules, 
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: path.join(srcpath, pagename),
                filename: path.join(dstpath, pagename),
                scriptLoading: "module",
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.join(srcpath, "static"),
                        to:   path.join(dstpath, "static"),
                    },
                    "src/manifest.json",
                ]
            }),
        ].concat(generic_plugins),
    } }

    function web_template(scriptname, pagename){
        return __template(webext_srcpath, webext_dstpath, scriptname, pagename);
    }



    [
        web_template("background.js", "background.html"),
        web_template("options.js", "options.html"),
        web_template("popup.js", "popup.html"),
    ].forEach(e=>ret.push(e));

    console.log(ret);

    return ret;
};