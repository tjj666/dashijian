
// ------------------完成重置密码-------------------
$("form").on("submit", function (e) {
    e.preventDefault();//阻止默认行为
    // 获取表单信息
    var data = $(this).serialize();
    // ajax提交
    $.ajax({
        type: 'POST',
        url: '/my/user/updatepwd',
        data:data,
        success: function (res) {
             // 修改成功提示
             layer.msg(res.message);
            if (res.status === 0) {
                // 清空token
                localStorage.removeItem('token');
                // 跳转登录页面
                window.parent.location.href = '/login.html';
               
           }
        }
    });
});

// -------------------------表单验证-------------------