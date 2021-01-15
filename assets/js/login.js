// 切换登录和注册盒子
// 点击login里面的a 触发事件
$('.login a').on('click', function () {
    // 点击login里面的去注册 让login隐藏让他的下一个兄弟显示 
    $(".login").hide().next().show();
});
// 点击注册 
$(".register a").on('click', function () {
    // 让login显示 他的兄弟隐藏
    $(".login").show().next().hide();
});
// ------------------注册功能--------------------
// 表单提交->阻止默认行为->收集表单数据-ajax提交
$(".register form").on("submit", function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    //console.log(data);
    $.ajax({
        type: "POST",
        url: '/api/reguser',
        // 把数据发送到服务器
        data: data,
        success: function (res) {
            // 失败 提示一下
            layer.msg(res.message);
            if (res.status === 0) {
                // 注册成功 清空输入框
                // 表单输入jquery对象 需要用索引转换成dom对象
                $(".register form")[0].reset();
                // 切换到登录页面
                $(".login").show().next().hide();
            }
        }
    })
});

// ----------------------自定义表单模块-------------------
// 必须使用layui的内置模块 -form模块
// 只能使用layui的模块 必须加载模块
// 语法: layui.form 注意:内置模块都需要加载 除了弹出层
var form = layui.form;//加载form
// var tree = latyer.tree;//加载树形组件模块
// 调用form模块内置方法 verify,自定义验证规则,
form.verify({
    // 是对象形式的
    // 键(验证规则):值(验证方法)
    // 验证用户名2~10位
    user: [/^a-zA-Z0-9{2,10}$/, '用户名只能是数字字母,且6~12位'],
    // 验证密码 长度6~2位 \S表示非空格 除了空格以外所有的包括数字 字母 下划线等 
    len:[/^\S{6,12}&/,'密码长度6~12位且不能有空格'],
    // 判断确认密码
    // val表示输入框的值 val形参 表示谁用这个验证规则 val就代表谁的值 在这里表示确认密码
    same: function (val) {
        // jquery语法获取输入框的值
        if (val !== $('.pwd').val()) {
            // 不相等 返回错误提示
            return '两次密码不一致';

        }
    }
});  
  

// ----------------------登录页面--------------------
$(".login form").on('submit', function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: '/api/login',
        data: data,
        success: function (res) {
            // 提示
            layer.msg(res.message);
            // 登录成功
            if (res.status === 0) {
                // 保存token 
                localStorage.setItem('token', res.token);
                // 跳转到首页面
                location.href='/index.html'
            }
        }
    })
})


