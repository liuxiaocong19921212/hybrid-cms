//devFakePlugin.js
var Transformer = require('./dataTransformer.js')
function fake(){
    /**
     * pro
     * uat
     * pre
     */
    var ENV = 'uat'
    var jsonpCntr = 0
    //dev start
    if(!navigator.gome){
        navigator.gome = {
            app: {
                nativeLogin:{
                    jumpToNativeLogin: function(ok,fail,opt){
                        if(confirm('是否登录')){
                            window.localStorage['logintest'] = 'Y'
                            ok('{"jumpToNativeLogin":"Y"}')
                        }else{
                            window.localStorage['logintest'] = 'N'
                            ok('{"jumpToNativeLogin":"N"}')
                        }
                    }
                }
            },
            util: {
                nativeRequest: {
                    sendNativeLayoutRequest: function(ok,fail,opt){
                        opt.url = Transformer.transEnv(opt.url)
                        var key = 'saleojaZDTV6o1X'//'saleTw2Ab0oNLtv'//'salelv07ot9Z7F0'
                        if(!opt.param){
                            opt.param = {
                                'keyProms': key,
                            }
                        }else{
                            opt.param['keyProms'] = key
                        }
                        if(opt.type =="GET"){
                            if(opt.url == "http://m.gome.com.cn/index.php" || opt.url == "http://m.atguat.com.cn/index.php" || opt.url == "http://m.gomeprelive.com.cn/index.php"){
                                var param = ''
                                for(var key in opt.param){
                                    param += '&'+key+'='+opt.param[key]
                                }
                                window['jsoncallback'] = function(data){
                                    ok(data);
                                }
                                var script = document.createElement('script')
                                script.src = opt.url+'?bust=' + (new Date()).getTime()+param+'&callback=jsoncallback'
                                document.body.appendChild(script)
                            }else{
                                var ajax = new XMLHttpRequest()
                                ajax.open('GET',opt.url.replace('prom.m.gome.com.cn','geekie.online').replace('prom.atguat.com.cn','prom.atguat.com.cn'),true)
                                ajax.send(null)
                                ajax.onreadystatechange = function(){
                                    if(ajax.status == 200)
                                        ok(ajax.responseText)
                                    else
                                        fail('fail')
                                }
                            }
                        }else{
                            var param = encodeURI(JSON.stringify(opt.param));
                            window['jsonp'+jsonpCntr] = function(data){
                                ok(data);
                            }
                            var script = document.createElement('script')
                            script.src = opt.url+'?bust=' + (new Date()).getTime()+'&body='+param+'&callback=jsonp'+jsonpCntr
                            jsonpCntr++;
                            document.body.appendChild(script)
                        }
                    },
                    sendNativeRequest: function(ok,fail,opt){
                        opt.url = Transformer.transEnv(opt.url)
                        if(opt.type =="GET"){
                            if(opt.url == "http://m.gome.com.cn/index.php"
                                || opt.url == "http://m.atguat.com.cn/index.php"
                                || opt.url == "http://m.gomeprelive.com.cn/index.php"
                                || opt.url.match(/\/promotion\/takeUpAllCoupon\.jsp/)){
                                var param = ''
                                for(var key in opt.param){
                                    param += '&'+key+'='+opt.param[key]
                                }
                                window['jsoncallback'] = function(data){
                                    ok(data);
                                }
                                var script = document.createElement('script')
                                script.src = opt.url+'?bust=' + (new Date()).getTime()+param+'&callback=jsoncallback'
                                document.body.appendChild(script)
                            }else{
                                var ajax = new XMLHttpRequest()

                                ajax.open('GET',opt.url.replace('prom.m.gome.com.cn','geekie.online').replace('prom.atguat.com.cn','10.144.35.22:1111').replace('prom.gomeprelive.com.cn','10.144.35.22:2222'),true)
                                ajax.send(null)
                                ajax.onreadystatechange = function(){
                                    if(ajax.status == 200)
                                        ok(ajax.responseText)
                                    else
                                        fail('fail')
                                }
                            }
                        }else{
                            var param = encodeURI(JSON.stringify(opt.param));
                            window['jsonp'+jsonpCntr] = function(data){
                                ok(data);
                            }
                            var script = document.createElement('script')
                            if(opt.url.match(/api\.search\.gome\.com\.cn/)){
                                var param = ''
                                for(var key in opt.param){
                                    param += '&'+key+'='+ ((typeof opt.param[key] == 'object') ? JSON.stringify(opt.param[key]) : opt.param[key])
                                }
                                script.src = opt.url+'?bust=' + (new Date()).getTime()+param+'&callback=jsonp'+jsonpCntr
                            }else
                                script.src = opt.url+'?bust=' + (new Date()).getTime()+'&body='+param+'&callback=jsonp'+jsonpCntr
                            jsonpCntr++;
                            document.body.appendChild(script)
                        }

                    }
                },
                nativeUtils: {
                    isLogin: function(ok,fail,data){
                        if(window.localStorage['logintest']){
                            if(window.localStorage['logintest'] === 'Y')
                                ok('{"isLogin":"Y"}')
                            else
                                ok('{"isLogin":"N"}')
                        }else{
                            ok('{"isLogin":"N"}')
                        }
                    },
                    showToast: function(data){
                        console.log(data)
                    },
                    showTitle: function(title){
                        console.log('title:'+ title)
                    },
                    shareLink: function(jsonStr){
                        console.log('分享:'+jsonStr)
                    },
                    jumpExternalLink: function(url){
                        console.log('跳转到'+url)
                    },
                    getMeasure: function(param) {
                        console.log('调用埋码'+param)
                    },
                    getAppEnvironment: function(ok,fail){
                        //console.log('getAppEnvironment')
                        //ok('{"environment":"'+ENV+'"}')
                        ok('{"environment":"uat"}')
                        //ok('{"environment":"pro"}')
                        //ok('{"environment":"pre"}')
                        //ok('{"environment":"sit"}')
                    },
                    getAppVersion: function(ok,fail){
                        ok('{"dev_version": "66.0.1","user_version":"4.1.2"}')
                    },
                    getAddressFourArea: function(ok,fail){
                        ok({
                            province: {
                                name:'北京',
                                code: '13000000'
                            },
                            city: {
                                name:'北京市',
                                code: '13020000'
                            },
                            district: {
                                name:'朝阳区(五环里)',
                                code: '11010200'
                            },
                            town: {
                                name:'全部区域',
                                code: '110102001'
                            }
                        })
                    }
                }
            }
        }
    }
    //dev end
    navigator.gome ? window.bridge = navigator.gome : ''
}
if(!window.cordova){
    window.addEventListener('load',function(){
        var event = document.createEvent('Event')
        event.initEvent('deviceready',true,true)
        document.dispatchEvent(event)
    })
}

module.exports = fake
