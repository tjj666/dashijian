

// 加载layui的form模块
var form = layui.form;

// -----------------------完成数据回填-------------------
function renderUser() {
    $.ajax({
        url: '/my/user/userinfo',
        success: function (res) {
            if (res.status === 0) {
                // 使用layui提供的数据回填的方法
                // form.val('表单的lay-filter属性值(user)',对象形式的key(键值)要和表单各项的name属性值相同)
                form.val('user', res.data);
            }
        }

    })
};
renderUser();
// ------------------------完成用户信息的修改-----------------
//表单注册事件
$("form").on("submit", function (e) {
    e.preventDefault();//阻止默认行为
    // 获取表单信息
    var data = $(this).serializeArray();//serialize不能收集到禁用状态的值
    // ajax提交
    $.ajax({
        type: 'POST',
        url: '/my/user/userinfo',
        data: data,
        success: function (res) {
             // 修改成功提示
             layer.msg(res.message);
            if (res.status === 0) {
                // 更新成功 调用封装函数 更新数据
                // 找到主页面 window(指当前窗口)
               window.parent.getUserInfo();//找到当前窗口的父元素里面的函数
               
           }
        }
    });
});


// -------------------------重置------------------
// 给button 属性为type是reset的 注册事件
$("button[type=reset]").on('click', function (e) {
    e.preventDefault();
    // 调用数据回填封装函数
    renderUser();
})
