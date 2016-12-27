if (Vue) {

     function isFunction(arg) {
        return Object.prototype.toString.call(arg) === '[object Function]';
    };
    Vue.directive('url-content', {
        bind: function () {
            // 准备工作
            // 例如，添加事件处理器或只需要运行一次的高耗任务
            var me=this;
            me.init_html= me.el.innerHTML
        },
        update: function (newValue, oldValue) {
            var me = this;
            function showContent(text) {
                me.el.innerHTML = text;
            }
            if (newValue != oldValue) {

                // console.log(me.init_html)
                showContent(me.init_html);
                // this.el.innerHTML =newValue;
                this.vm.$http.get(newValue, {   // use before callback
                    before: function (request) {
                        // abort previous request, if exists
                        if (this.previousRequest&&isFunction(this.previousRequest.abort)) {
                            this.previousRequest.abort();
                        }
                        // set previous request on Vue instance
                        this.previousRequest = request;
                    }
                }).then(function (response) {
                    // success callback
                    var data = response.text();
                    showContent(data);
                }, function (response) {
                    // error callback
                    showContent(data);
                });
            }
            // 值更新时的工作
            // 也会以初始值为参数调用一次
        },
        unbind: function () {
            // 清理工作
            // 例如，删除 bind() 添加的事件监听器
        }
    })
} else {
    console.error('you need Vue')
}