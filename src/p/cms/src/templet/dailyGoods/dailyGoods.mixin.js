module.exports = {
    created: function(){
        if(window.appVersion < 63 && navigator.userAgent.match(/Android/i)){
            this.getPriceStatus()
        }
    }
}
