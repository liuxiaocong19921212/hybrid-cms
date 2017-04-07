/**
 * gulp配置文件
 * Author: 赵晔
 * Created-Time: 2015-12
 * Last-Modified-Time: 2016-09-26
 * Last-Modified-By: zhaoye
 */
/****************************utils func*****************************/
function webpackLog (moduleName,err,stats,cb){
    if(err) throw new gutil.PluginError(moduleName, err);
    var jsonStats = stats.toJson();
    if(jsonStats.errors.length > 0){
        gutil.log(gutil.colors.yellow(moduleName), stats.toString({
            // output options
            'colors': true,
        }));
        cb();
    }else{
        gutil.log(gutil.colors.yellow(moduleName), gutil.colors.green('build complete'));
        cb();
    }
}
/****************************gulp init*****************************/
/**
 * args参数说明
 * 参数           可否为空    说明                     值
 * gulpCommand    N           gulp的命令               dev开发 build发布
 * platform       Y           平台：                   app(默认) wap
 * env            N           发布环境build时有效      uat live
 * project        N           构建的项目               all,cms,duobao,随项目增加
 * sdk            Y           构建的对应sdk            all(默认)
 * update         Y           更新不升级               true(默认)
 * upgrade        Y           升级                     false(默认)
 * proxy          Y           是否启动域名代理         不出现(默认)，任意
 */
var args = require('./lib/argParser.js')
var gulp = require('gulp')
var less = require('gulp-less')
var webpack = require('webpack')
var gutil = require('gulp-util')
var cssmin = require('gulp-cssmin')
var replace = require('./lib/replace.js')
var path = require('path')
var uglify = require('gulp-uglify')
var gulpif = require('gulp-if')
var runSequence = require('run-sequence')
var clean = require('gulp-clean')
var fs = require('fs')
var through2 = require('through2')
var htmlmin = require('gulp-htmlmin')
var uglifyJs = require('uglify-js')
var zipcss = function(css){
    //替换注释
    var commentReg = /\/\*(\s|.)*?\*\//g;
    //替换换行
    var crReg = /\r\n|\r|\n|\t/g;
    return css.replace(crReg,'').replace(commentReg,'').replace(/\s*\{\s*/g,'{').replace(/;\s*/g,';').replace(/:\s*/g,':').replace(/;\s*\}/g,'}');
}
//配置文件适配环境
var configString = String(fs.readFileSync('./src/b/components/src/utils/config.js'))
var CONFIG = {
    //defaults
    PLATFORM: 'APP',
    SDK: 'ALL',
    UPDATE: 'TRUE',
    UPGRADE: 'FALSE',
}

for(var key in args){
    CONFIG[key.toUpperCase()] = args[key].toUpperCase()
}

fs.writeFileSync('./src/b/components/src/utils/__config__.js', new Buffer('module.exports='+JSON.stringify(CONFIG)))                        
var injectString = String(fs.readFileSync('./lib/injector.js'))

//判断项目的代理函数
function projectProxy(cb){
    if(args.project.match(/all/)){
        config.knownProjects.forEach(function(pname){
            cb(pname)
        })
    }else if(args.project.match(/,/)){
        args.project.split(',').forEach(function(pname){
            cb(pname)
        })
    }else{
        cb(args.project)
    }
}
/**
 * knownProjects  目前所有的项目
 * knownSDKs      目前所有的sdk
 * webpackConfig  webpack的配置
 */
var config = {
    knownProjects:['cms','duobao','coupon-newcomer'],
    envPath: (function(){
        if(args.gulpCommand == 'dev' || args.gulpCommand == 'watch'){
            return 'dev'
        }else if (args.gulpCommand == 'build'){
            return 'dist'
        }
    })(),
    webpackConfig: {
        'components': require('./configs/webpack.config.components.js'),
        'cms': require('./configs/webpack.config.cms.js'),
        'duobao': require('./configs/webpack.config.duobao.comps.js'),
    }
}

gulp.task('clean',function(){
    var cleanGlobs = ['dist/components/src'];
    config.knownProjects.forEach(function(project){
        cleanGlobs.push('dist/'+project+'/src')
    })
    return gulp.src(cleanGlobs, {read: false})
        .pipe(clean({force: true}))
})

//copy globs
var globs = {
    core: ['./src/b/components/src/core/**/*'
            ,'!./src/b/components/src/core/less/**/*'
            ,'!./src/b/components/src/core/less'],
    vendor: ['./src/b/components/src/vendor/**/*'
            ,'!./src/b/components/src/vendor/vue.js'],
    utils: ['./src/b/components/src/utils/*.js'
            ,'!./src/b/components/src/utils/__config__.js'
            ,'!./src/b/components/src/utils/bridge.js'
            ,'!./src/b/components/src/utils/config.js']
}
var projectGlobs = {}
projectProxy(function(pname){
    projectGlobs[pname] = [ "./src/p/" + pname + "/src/*.html"
                    ,"./src/p/" + pname + "/src/js/**/*"
                    ,"./src/p/" + pname + "/src/css/**/*"
                    ,"./src/p/" + pname + "/src/images/**/*"]
})

//copy task
gulp.task('copyFiles',function(cb){
    //projects
    projectProxy(function(pname){
        gulp.src(projectGlobs[pname])
            .pipe(gulpif('*.html',through2.obj(function(file,enc,cb){
                                                    var content = String(file.contents)
                                                    var REG = /\<\!--PackConfig--\>/
                                                    if(REG.test(content)){
                                                        content = content.replace(REG,'<script type="text/javascript">!(function(){window.PackConfig='+JSON.stringify(CONFIG)+';\n'+injectString+'})();</script>')
                                                    }
                                                    if(args.gulpCommand == 'build'){
                                                        content = content.replace(/\<input\s+type\s*?\=\"hidden\"\s*?id\=\"keyProms\"\s*?value\=\"([\d\w]+)\"\>/,'<input type="hidden" id="keyProms" value="$!{keyProms}">')
                                                    }
                                                    file.contents = new Buffer(content,'utf-8')
                                                    cb(null,file)
                                                })
                ))
            .pipe(gulpif('*.html' && args.project == 'cms', replace()))
            //以下压缩，debug时可用注释掉
            .pipe(gulpif('index.html' && args.project == 'cms', htmlmin({collapseWhitespace: true}) ))
            .pipe(gulpif('index.html' && args.project == 'cms', through2.obj(function(file,enc,cb){
                var content = String(file.contents)
                var scripts = content.match(/<script.*?>[\s\S]*?<\/script>/g)
                scripts.forEach(function(item,idx){
                    var code = item.match(/<script.*?>([\s\S]*?)<\/script>/)[1]
                    code = '<script type="text/javascript">' + uglifyJs.minify(code,{fromString: true}).code + '\<\/script\>'
                    content = content.replace(item, code)
                })
                var styles = content.match(/<style.*?>[\s\S]*?<\/style>/g)
                styles.forEach(function(item,idx){
                    var code = item.match(/<style.*?>([\s\S]*?)<\/style>/)[1]
                    content = content.replace(item, '<style>'+zipcss(code)+'<\/style>')
                })
                file.contents = new Buffer(content)
                cb(null, file)
            }) ))
            //压缩代码完毕
            //改变下base
            .pipe(gulpif(['*.css','*.js','*.png','*.jpg','*.bmp','*.gif'],through2.obj(function(file, enc, cb){
                file.base = path.resolve(file.base, '..')
                cb(null, file)
            })))
            .pipe(gulp.dest('./' + config.envPath + ((args.gulpCommand == 'dev' || args.gulpCommand == 'watch') ? '/p/' : '/') + pname + '/src'))
    })
    //base
    for(var key in globs){
        gulp.src(globs[key])
            .pipe(gulp.dest('./'+config.envPath+ ((args.gulpCommand == 'dev' || args.gulpCommand == 'watch') ? '/b/' : '/') + 'components/src/'+key))
    }
    cb();
})
//webpack task
//base
gulp.task("webpack:comps", function(callback) {
    webpack(config.webpackConfig.components, function(err, stats) {
        webpackLog("[webpack:comps]",err,stats,callback)
    })
});
//projects
config.knownProjects.forEach(function(pname){
    if(!!config.webpackConfig[pname]){
        gulp.task("webpack:" + pname, function(callback) {
            return webpack(config.webpackConfig[pname], function(err, stats) {
                webpackLog("[webpack:"+ pname +"]",err,stats,callback)
            })
        });    
    }
})
//final task
var tasks = ['copyFiles','webpack:comps']
projectProxy(function(pname){
    if(!!config.webpackConfig[pname]){
        tasks.push('webpack:' + pname)
    }
})

//watch
gulp.task("watch", tasks, function(){
    gulp.watch(["src/b/components/**/*"], ["webpack:comps"]);
    projectProxy(function(pname){
        gulp.watch(['src/p/' + pname + '/**/*'],['webpack:' + pname])
    })
    gulp.watch('./src/**/*',['copyFiles'])
})
//build
gulp.task("build", function(cb){
    runSequence('clean', tasks, cb);
})
//build for uat
gulp.task("dev", tasks, function(){})
