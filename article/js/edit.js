
// ---------------------获取地址栏的id参数----------------
// URLSearchParams('参数必须是参数格式')专门获取url参数 new之后得到的是对象
var id = new URLSearchParams(location.search).get('id');//获取地址栏的id
// --------------------------------调用复文本编辑框插件封装函数
initEditor();
// ---------------------- 获取分类，渲染到下拉框的位置 ------------------
var form = layui.form;
// 1. 获取真实的分类，渲染到下拉框的位置
$.ajax({
    url: '/my/category/list',
    success: function (res) {
        // console.log(res)
        var str = template('tpl-category', res);
        // $('#category').append(str);
        $('select[name=cate_id]').html(str);
         // 更新渲染
         // form.render('select', 'lay-filter属性值');
         form.render('select');
         // 等所有分类渲染完,才能获取数据回填

      $.ajax({
        url: '/my/article/' + id,
        success: function (res) {
         // 使用layui 的 form.val 快速完成数据回填
         form.val("article", res.data);
          // 先把textarea 换成复文本编辑器 在设置复文本编辑器的内容
          tinyMCE.activeEditor.setContent(res.data.content);

            // 完成编辑里面的图片回填更换剪裁区域的图片 销毁=>更换=>重新生成
         $image.cropper('destroy').attr('src', baseUrl+'/'+res.data.cover_img).cropper(options);
      }
      })
    }
});



// --------------------初始化剪裁框---------------------
  // 1. 初始化剪裁框
// 1. 初始化图片裁剪器

var $image = $("#image");

// 2. 裁剪选项
var options = {
  aspectRatio: 400 / 280,
  preview: '.img-preview',
  autoCropArea: 1,//让剪裁框铺满整个剪裁区
};

// 3. 初始化裁剪区域
$image.cropper(options);

// 点击按钮触发文件域的单击事件 可以选择图片
$("button:contains('选择封面')").on('click', function () {
  $("$file").trigger('click');
}); 

// 当文件域的发生改变的时候,更换剪裁区的图片
$("#file").on('change', function () {
  // 找到文件对象
  var fileObj = this.files[0];
  // 生成临时url
  var url = URL.createObjectURL(fileObj);
  // 更换剪裁区域的图片 销毁=>更换=>重新生成
  $image.cropper('destroy').attr('src', url).cropper(options);
});


// -------------------------------完成修改文章------------------
$('form').on('submit', function (e) {
  e.preventDefault();
  // 收集表单数据
  var fd = new FormData(this);//传入表单的dom对象
  // content复文本编辑器使用的插件 所以需要通过插件tinymce 的特有方式来获取
  fd.set('content', tinyMCE.activeEditor.getContent());//获取内容 单独向fd中添加content内容
  // 对于图片来说,先剪裁,向fd中追加文件对象
  var canvas = $image.cropper('getCroppedCanvas', { width: 400, heigth: 280 });
    
  // 把canvas转成blob二进制格式
  canvas.toBlob(function (blob) {
    // 形参blob是转化后的图片
    fd.append('cover_img', blob);//把bolb追加到fd中,会自动变成文件对象
    // 根据接口要求,在fd中追加一个id
    fd.append('id', id);

    $.ajax({
      type:'POST',
      url: '/my/article/update',
      data: fd,

      // 提交FormData对象 必须填的两个选项
      contentType: false,
      processData: false,
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          // 修改成功跳转到列表页
          location.href='./list.html'
        }
      }
      })
  })
});
  
  
  
 









