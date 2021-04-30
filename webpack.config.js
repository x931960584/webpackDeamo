const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const workboxWebpackPlugin = require('workbox-webpack-plugin')
const terserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  // 入口起点 单入口
  entry: './src/index.js',
  // 多入口
  // entry: {
  //   main: './src/index.js',
  //   home: './src/home.js'
  // },
  // 输出
  output: {
    // 输出的文件名 [name]：取文件名(指定名称 + 目录)
    filename: '[name].[hash:10].js',
    // 输出的路径 __dirname nodejs的变量 代表当前文件目录的绝对路径
    path: path.resolve(__dirname, 'build'),
    // 所有资源引入公共路径前缀
    // publicPath: '/',
    // 非入口chunk的名称
    // chunkFilename: 'is/[name]_ckunk.js'
  },
  // loader配置
  module: {
    rules: [
      {
        // 匹配的文件
        test: /\.css$/,
        // 使用相对应的loader进行处理
        use: [
          // miniCssExtractPlugin 把打包后的js中的css提取成单独的文件
          // miniCssExtractPlugin.loader,
          // use数组中loader执行顺序 从右到左 从下往上 以此进行
          // 创建styleb标签， 将js中的样式资源添加插入到head中
          'style-loader',
          // 将css文件解析成commonjs模块 加载js中 里面是样式字符串
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          // 将less文件编译成css文件
          'less-loader',
        ],
      },
      {
        // 排除资源
        exclude: /\.(js|css|html|less|png|gif|jpg)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          // 输出的路径在output输出路径下
          outputPath: 'media',
        },
      },
      // 处理图片资源
      {
        test: /\.(png|gif|jpg)$/,
        // 下载url-loader file-loader
        loader: 'url-loader',
        options: {
          // 图片文件大小小于8kb, 会被base64处理
          // 优点：减少请求数量 （减少服务器压力）
          // 缺点：图片体积变大（文件请求速度变慢）
          limit: 8 * 1024,
          // 问题：url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs 解析时会出现[Object Module]
          // 解决：关闭url-loader的es6de模块化，使用commonjs
          esModule: false,
          // [hash: 10] 取图片的hash的前10位
          // [ext]取文件原始扩展名
          name: '[hash:10].[ext]',
          // 输出的路径在output输出路径下
          outputPath: 'images',
        },
      },
      {
        test: /\.html$/,
        // 处理html文件中img标签的图片引入，从而能被url-loader进行处理
        // 需要下载html-loader
        loader: 'html-loader',
        options: {
          // 问题：url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs 解析时会出现[Object Module]
          // 解决：关闭url-loader的es6de模块化，使用commonjs
          esModule: false,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env', 
                // corejs
                {
                  // 按需加载
                  useBuiltIns: 'usage',
                  // 指定corejs 版本
                  corejs: {
                    version: 3
                  },
                  // 指定兼容性做到哪个版本浏览器
                  targets: {
                    browsers: ['> 5%', 'IE 10', 'iOS 7', 'Firefox > 20']
                  },
                }
              ]
            ],
            // 缓存
            cacheDirectory: true
          }
        }
      },
      /**
       * 语法检查: eslint-loader eslint
       * 注意：只检查自己写的源代码，第三方库不检查
       * 设置规则：
       * package.json中 eslintConfig中设置
      *       "eslintConfig": {
                "extends": "airbnb-base"
              }
              airbnb ---> eslint-config-airbnb-base   eslint-plugin-import eslint
       *
       */
        // {
        //   test: /\.js$/,
        //   // 排除
        //   exclude: /node_modules/,
        //   // 值检查src目录下的js文件
        //   include: path.resolve(__dirname, 'src'),
        //   // 优先执行
        //   enforce: 'pre',
        //   loader: 'eslint-loader',
        //   options: {
        //     fix: true,
        //   },
        // },
    ],
  },
  // plugins的配置
  plugins: [
    // html-webpack-plugin 会默认创建一个空的HTML, 自动引入打包输出所有资源（js/img/css）
    new htmlWebpackPlugin({
      // 会复制./index.html文件 并自动引入打包输出的所以资源（js/img/css）
      template: './index.html',
      // 压缩html
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
    new miniCssExtractPlugin({
      // 文件重命名
      filename: 'css/index.css',
    }),
    // 压缩css
    new optimizeCssAssetsWebpackPlugin(),
    // 启动work-server
    new workboxWebpackPlugin.GenerateSW({
      /**
       * 1. 帮助serverwork快速启动
       * 2. 删除旧的 serverwork
       * 生产一个serverwork配置文件
       * 
       * // 注册serviceWorker 处理兼容性问题
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', ()=> {
            navigator.serviceWorker.register('./service-work.js').then(()=> {

            }).catch(()=> {

            })
          })
        }
       * 
       */
      
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  // mode的配置development开发环境 production 生产环境 production 会自动压缩js
  mode: 'development',
  // 开发服务器devServer: 用来自动化（自动编译， 自动打开浏览器 以及自动刷新）
  // 只会内存中编译打包，不会有任何输出
  // 启动devServer指令：npx webpack-dev-server
  devServer: {
    // 构建后的项目路径
    contentBase: path.resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 8082,
    // 域名
    host: 'localhost',
    // 自动打开浏览器
    open: true,
    // 开启HRM功能
    hot: true,
    // 监所contentBase目录下所有文件，一旦变化就会reload
    watchContentBase: true,
    // 忽略文件
    ignored: /node_modules/,
    // 不需要显示启动服务器日志
    clientLogLevel: 'none',
    // 除了一些基本信息外其他都不显示
    quiet: true,
    // 报错，不要全屏提示
    overlay: false,
    // 服务器代理 ---> 解决开发环境跨域的问题
    /*proxy: {
      // 一旦devServer服务器接受到/api/xxx的请求，就会转发到另外一个服务器上
      '/api': {
        target: 'http://localhost:3000',
        // 发送请求时，请求路径重写 将/api/xxx--->/xxx(去掉/api)
        pathRewrite: {
          '^api/': ''
        }
      }
    }*/
  },
  // 可以将node_modules中组件单独打包一个chunk最终输出  自动分析多入口chunk中，有木有公用引入的组件，会打包成单独的一个chunk
  optimization: {
    splitChunks: {
      chunks: 'all',
      /**
       * 默认值不用写
       */
      // 分割的chunk最小为30kb
     /* minSize: 30 * 1024,
      // 0表示最大限制没有
      maxSize: 0,
      // 要提取的chunk最少被引用1次
      minChunks: 1,
      // 按需加载时并行加载的文件数量最大值
      maxAsyncRequests: 5,
      // 入口js文件最大并行的数量
      maxInitialRequests: 3,
      // 名称连接符
      automaticNameDelimiter: '~',
      // 使用命名规则
      name: true,
      cacheGroups: {
        // 分割chunk的组
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          // 优先级
          priority: -10,
        }
      } */
    },
    // 解决当前模块记录其他模块的hash单独打包为一个文件 runtime
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`
    },
    minimizer: [
      // 配置生产环境压缩方案 js和css
      new terserWebpackPlugin({
        // 开启缓存
        cache: true,
        // 开启多进程打包
        parallel: true,
        // 启动source-map
        sourceMap: true
      })
    ]
  },
  // 解析模块规则
  resolve: {
    alias: {
      // 配置解析模块路径别名： 简写路径，但没有提示
      $css: path.resolve(__dirname, 'asset')
    },
    // 配置省略文件路径的后缀名（引用的时候）
    extensions: ['.js','.json','.jsx'],
    // 告诉webpack 解析模块去找哪个目录
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
  },
  // source-map 构建后代码映射技术
  devtool: 'source-map',
}