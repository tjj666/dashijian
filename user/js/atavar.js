// ------------------------------1.初始化剪裁插件-----------------------
//第一步:先找到图片


// ---------------  创建剪裁区 ------------------
// - 找到剪裁区的图片 （img#image）
var $image = $('#image');
// - 设置配置项
var option = {

    aspectRatio: 1,  // 设置剪裁框的宽高比 //  纵横比 正方形
    // 指定预览区域
    preview: '.img-preview' // 指定预览区的类名（选择器）
};
// - 调用cropper方法，创建剪裁区
$image.cropper(option);

// ------------------------2.点击选择头像,实现选择图片------------------------
// 点击选择头像按钮触发文件域的点击事件
$("#chooseFile").on('click', function () {
    // 触发文件域的点击事件
    $('#file').trigger("click");

});

// -------------------------3.文件域内容改变,更换内容区域的图片------------------
// 文件域内容改变触发事件 点击取消也会触发change(改变)事件
$('#file').on('change', function () {
    // 判断 找一张图片在选择这张图片
    if (this.files.length > 0) {
         // 1.找到文件对象
    //files 是选择的文件列表,它里面会存放选择的图片)
    var fileObj =this.files[0];//事件源里面的files(所有图片列表)找到索引0第一张
    // 2.为文件对象创建临时url
        var url = URL.createObjectURL(fileObj);//js内置方法 作用:为文件对象创建临时url 通过url可以访问到选择的图片
        //  console.log(url);
    // 3.更换剪裁区的框(销毁剪裁框==>更换剪裁框==>重新生成剪裁框)
    // destory 表示销毁 销毁原图片 把原图片的路径改换为新图片的临时url路径 ,并重新生成剪裁框
        $image.cropper("destroy").attr('src', url).cropper(option);
    
    }
   
});

// ------------------------------4.点击确认修改,实现图片更换--------------------------
$("#sure").on('click', function () {
    // 1.剪裁图片 得到canvas
    // getCroppedCanvas 参数 剪裁选中图片为宽高50*50的
    var canvas = $image.cropper('getCroppedCanvas', { width: 50, height: 50 });
    // 2.把canvas转换成base64格式字符串
    var base64 = canvas.toDataURL();//canvas里面的方法 可以把canvas转换成base64
    // 3.ajax提交
    $.ajax({
        type: 'POST',
        url: '/my/user/avatar',
        data: { avatar: base64 },
        success: function (res) {
            // 提示
            layer.msg(res.message);
            // 更换头像成功
            if (res.status === 0) {
                // 更新index.html的头像
                // 找父页面的函数
                window.parent.getUserInfo();
            }
        }
    })

})