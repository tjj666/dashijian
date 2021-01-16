// -------------------------获取用户信息,渲染到头像区域-----------------------
// 封装函数 多次调用(修改昵称 和修改函数 调用)
function getUserInfo() {
    $.ajax({
        url: '/my/user/userinfo',
        success: function (res) {
            // console.log(res);
            if ( res.status === 0) {
                // 1.设置欢迎您 优先使用昵称
                // 使用昵称或者用户名 有昵称用昵称 没昵称 用账号
                var name = res.data.nickname || res.data.username;
                // 把昵称或者用户名渲染到页面上
                $(".username").text(name);//设置文本信息 
                // 2.设置头像 (优先使用图片)
                if (res.data.user_pic) {//如果有图片
                    // 设置这个图片的src 为获取数据里面的这个图片 并且显示在页面
                    $(".layui-nav-img").attr('src', res.data.user_pic).show();
                    // 让默认的图片隐藏
                    $(".text-avatar").hide();
                } else {//没有图片
                    // (截取名字(昵称或者用户名)的第一个字 转大写)
                    var first = name.substr(0, 1).toUpperCase();
                    // 把截取转换成大写的首字母设置给默认图片的文本框里并且显示
                    // show方法补充:show是恢复元素默认的样式,(span默认是行内样式,
                    // show会把span设置为display; inline, div是默认块级元素 ,会把div设置为display:block)
                    $(".text-avatar").text(first).css('dispay','inline-block');
                }
            
            }
        }
    })



}
getUserInfo();


// -------------------------退出功能----------------------
$("#logout").on('click', function (e) {
    //    阻止默认行为
    e.preventDefault();
    // 点击退出提示
    layer.confirm('确定退出吗?', function (index) {
        //do something
        // 删除token
        localStorage.removeItem('token');
        //   跳转到登录页面
        location.href = '/login.html';
        layer.close(index);//关闭弹出层
    });

});


