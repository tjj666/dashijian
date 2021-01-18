// 统一配置功能 请求头
// 项目根路径 方便使用
var baseUrl = 'http://www.itcbc.com:8080';
// 使用$.ajaxPrefilter 配置url headers complete
// $.ajaxPrefilter函数用于制定预先处理ajax参数选项的回调函数
$.ajaxPrefilter(function (option) {
    // option 表示ajax获取请求的选项 比如 option.url
    // 修改请求的url(加上根路径)
    option.url = baseUrl + option.url;

    // 配置请求头 因为请求头以/my开头的接口的时候,必须带请求头
    // headers里面放着Authorization作用是验证用户信息  登录之后要保存token 
    option.headers = {
        // 
        Authorization: localStorage.getItem('token'),

    }

    // 配置complete 因为token会过期 服务器就返回401状态码,过期触发complete函数
    // 在complete里面判断身份认证 如果失败 重新登录
    // complete无论成功与失败 都会提示
    option.complete = function (xhr) {
        // 获取到响应的数据
        var res = xhr.responseJSON;
        // 如果res数据存在 并且里面为1 信息提示 认证失败
        if (res&&res.status===1&&res.message==='身份认证失败') {
            // 清除过期token
            localStorage.removeItem('token');
            // index页面跳转登录页面(两者属于平级关系)location对象包含url路径
            if (location.pathname==='/index.html') {//pathname地址栏路径
                location.href = './login.html';
            } else {
                // 小页面跳转父页面
            window.parent.location.href = '../login.html';
            }
            
        }
        // 其他错误 比如用户名错误
        if (res && res.status === 1) {
            // 提示
            layer.msg(res.message);
        }
    }

})
    




