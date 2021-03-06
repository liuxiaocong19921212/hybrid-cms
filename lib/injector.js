window.reqRes = function(requires, opt, baseUrl){
    var time = new Date().getTime();
    //baseurl替代opt的情况
    if(typeof baseUrl == 'undefined' && typeof opt == 'string'){
        baseUrl = opt;
        opt = {
            absolute: false
        }
    }
    opt = opt || {
        absolute: false,
        //combo只有在线上才有用
        combo: false,
        async: false,
        onload: null,
        cache: '' 
    }
    //没mixin暂时这么写着
    opt.cache = opt.cache || ''
    if(opt.cache){
        opt.cache = '?v='+opt.cache
    }
    if(!opt.absolute){
        //容错
        baseUrl = baseUrl || RESOURCE || ''
    }
    if(PackConfig.ENV == 'LIVE' && PackConfig.PLATFORM == 'WAP' && !!opt.combo && !PackConfig.DEBUG){
        var src = baseUrl + '??' + requires.join(',') + opt.cache
        if(requires[0].match(/\.css/)){
            var link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = src
            document.querySelector('head').appendChild(link)
            if(opt.onload){
                link.onload = opt.onload
            }
        } else {
            //防uglify和scriptparser误截取
            var start = decodeURI('%3Cscript')
            var end = decodeURI('%3C/script%3E')
            if(opt.async){
                var script = document.createElement('script')
                script.src = src
                script.setAttribute('defer','defer')
                script.setAttribute('async','async')
                document.querySelector('head').appendChild(script)
            }else{
                document.write(start+' src="'+src+'">'+end)
            }
            if(opt.onload && script){
                script.onload = opt.onload
            }
        }
    }else{
        var loadStatus = [];
        function check(){
            var result = true
            loadStatus.forEach(function(status){
                if(!status){
                    result = false
                }
            })
            if(result && opt.onload){
                setTimeout(function(){
                    opt.onload()
                })
            }
        }
        requires.forEach(function(item,idx){
            loadStatus.push(false)
            if(item.match(/\.css/)){
                var src = !!opt.absolute ? item : (baseUrl+item) + opt.cache
                var link = document.createElement('link')
                link.rel = 'stylesheet'
                link.href = src
                document.querySelector('head').appendChild(link)
                link.onload = function(){
                    loadStatus[idx] = true
                    check()
                }
            }else{
                var src = !!opt.absolute ? item : (baseUrl+item) + opt.cache
                if(opt.async){
                    var script = document.createElement('script')
                    script.src = src
                    script.setAttribute('defer','defer')
                    script.setAttribute('async','async')
                    document.querySelector('head').appendChild(script)
                    script.onload = function(){
                        loadStatus[idx] = true
                        check()
                    }
                }else{
                    var cbid = time + idx
                    window['cb'+cbid] = function(){
                        loadStatus[idx] = true
                        check()
                    }
                    //防uglify和scriptparser误截取
                    var start = decodeURI('%3Cscript')
                    var end = decodeURI('%3C/script%3E')
                    document.write(start+' onload="window.cb' + cbid + '();" src="'+src+'">'+end)
                }
            }
        })    
        
    }
}
/**
 * deviceready的封装
 */
window.requestAnimationFrame=(function(){
    return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {setTimeout(callback, 1000 / 60);}
}());