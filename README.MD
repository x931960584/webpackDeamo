#  Webpack是一种前端资源构建工具  一个静态模块打包器

Webpack五个核心概念
  1 Entry: 入口 以哪个文件以入口起点开始打包，分析构建内部依赖图
      ---> string：---- './src/index.js' 单入口打包 形成一个chunk,只有一个bundle文件输出，此时chunk默认名称是main
      ---> array: ---- ['./src/index.js', './src/add.js'] 多入口 所有的入口只会生产一个chunk, 输出出去的只有一个bundle文件  使用场景：在HRM功能中让html热更新生效
      ---> object: ---- {
                          index: './src/index.js',
                          home: './src/home.js
                        }  有几个入口文件就会生成几个chunk,输出几个bundle，此时的chunk名称是key
  2 Output: 输出 将打包后的资源bundles输出到哪里，以及命名
  3 Loader：处理那些非js文件（webpack自身自能处理js）
  4 Plugings: 用于执行范围更广的任务
  5 Mode: 使用相对应的模式配置（develoment production）

运行指令：
  开发环境： webpack ./src/index.js -o ./build --mode=development
    webpack会以./src/index.js为入口文件开始打包，打包输出到./build 整体打包环境为开发环境
  生产环境： webpack ./src/index.js -o ./build --mode=production
    webpack会以./src/index.js为入口文件开始打包，打包输出到./build 整体打包环境为生产环境
  结论：
    webpack能处理js/json资源，不能处理scc/img等资源
    能将ES6模块化编译成浏览器识别的模块化

webpack.config.js  webpack的配置文件
  作用： 指示webpack干什么些活（当你运行webpack时会加载里面的配置）
    构建工具都是基于nodejs平台运行 模块化默认采用commonjs
  webpack.config.js文件代码修改需要重新打包运行

webpack性能优化
  * 开发环境性能优化
    1, 优化打包构建速度
    2, 优化代码调试
  * 生产环境性能优化
    1, 优化打包构建速度 
    2, 优化代码运行的性能
js兼容性处理：babel-loader @babel/core  @babel/prest-env @babel/polyfill  corejs
  1. @babel/prest-env ---> 只能转换基本的语法， 如promise不能转换
  2. @babel/polyfill ----> 全部js兼容 只需要js中引入
  3. corejs ---> 按需加载

HMR: hot module replacement 热模块替换
  1. 作用： 一个模块发生变化，之后重新打包这个模块， 而不是打包所以模块， 极大提升了速度
  2. 样式文件：可以使用HRM功能 原因是style-loader内部实现
  3. js文件： 默认不能使用HRM
  4. html：默认不能使用HRM,同时会导致HTML文件不能热更新

source-map: 一种提供源代码到构建后代码映射技术（应用构建后代码出错，通过映射可以追踪代码错误）
  1. source-map: 外部
    错误代码准确信息以及源代码错误位置
  2. line-source-map: 内联
    只生成一个内联的source-map  错误代码准确信息以及源代码错误位置
  3. hidden-source-map: 外部
    错误代码原因 但追踪不到源代码错误位置以及代码错误
  4. eval-source-map: 内联
    每一个文件都生成对应的source-map，都在eval  错误代码准确信息以及源代码错误位置
  5. nosources-source-map: 外部
    错误代码准确信息但没有源码信息
  6. cheap-source-map: 外部
    错误代码准确信息以及源代码错误位置 但只能精确到行
  7. cheap-module-source-map: 外部
    错误代码准确信息以及源代码错误位置 module会将loader的source map加入
  开发环境：需要速度快，调试更友好
    速度快： eval-cheap-source ---> eval-source-map
    调试更友好:  source-map ---> cheap-module-source-map ---> cheap-source-map
  生成环境：源代码需不需要隐藏？调试要不要更友好
    nosources-source-map --->  hidden-source-map 只隐藏
    source-map ---> cheap-module-source-map

缓存：
  bable缓存 ---> cacheDirectory: true   ----> 让第二次打包构建速度更快
  文件资源缓存 ----> 让代码上线运行缓存更好使用
    hash: 每次webpack构建都会生成一个唯一的hash值。故js和css等文件都会使用一个hash值，如果只修改一个文件重新打包，会导致所有的缓存失效
    chunkhash: 根据chunk生成的hash值。如果打包来源于同一个chunk,那么hash值就一样。由于css是在js中被引用，所以同属于一个chunk,故js和css的hash值还是一样
    contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样

code split代码分割

PWA: 渐进式网络开发应用程序（离线状态下可访问） 
  workbox ---> workbox-webpack-plugin



 