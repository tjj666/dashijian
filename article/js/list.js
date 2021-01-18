

// 获取文章的请求参数
var data = {
    pagenum: 1,//表示页码值 获取第n页数据
    pagesize:2,//表示每页显示几条数据
}

// -------------------定义模板引擎过滤时间------------
template.defaults.imports.dateFormat=function (time) {
    var date = new Date(time);
    var n = date.getFullYear();
    var y = addZero(date.getMonth() + 1);
    var r = addZero(date.getDate());
    var s = addZero(date.getHours());
    var f = addZero(date.getMinutes());
    var m = addZero(date.getSeconds());
    return n + '-' + y + '-' + r + ' ' + s + ':' + f + ':' + m;
}
// 补零函数
function addZero(n) {
    return n < 10 ? +'0' + n : n;
}
// -------------------获取文章内容--------------------
function renderArticle() {
    $.ajax({
        url: '/my/article/list',
        data: data,
        success: function (res) {
            // 调用模板引擎 把获取的数据渲染到页面
            var str = template('tpl-article', res);
            $('tbody').html(str);
            // 当ajax请求成功后 在实现分页
            showPage(res.total);//res.total表示数据总数
        }

    })
}
renderArticle();

// -------------------使用Layui分页模块--------------------
var laypage = layui.laypage;  
function  showPage(t) {//res.total=t参数
      //执行一个laypage实例
  laypage.render({
    elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
      count:t , //数据总数，从服务端得到
      limit: data.pagesize,//表示每页显示几条数据 要和获取文章里面的分页一致
      curr: data.pagenum,//表示选中当前页
      limits:[2,3,5,10],//下拉框条数

      // prev上一页 next下一页 page中间页  count总条数 skip选择跳转页
      layout: ['prev', 'page', 'next', 'count','skip'],//自定义排版
      //分页的回调(showPage调用时触发一次,后续点击页码还会触发)
      jump: function(obj, first){
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        
        //首次不执行 //从换页执行
        if(!first){
          //do something
            // 修改当前页码
            data.pagenum = obj.curr;//例如 点了第三页,obj.curr就等于三,把三赋值给ajax请求参数
            // 调用函数 重新渲染
            // 修改每页显示的条数
            data.pagesize = obj.limit;//当修改了每页显示五条,及时更新ajax请求参数
            renderArticle();
        }
      }
  });
};

// -------------------筛选--------------------
var form = layui.form;
// 1.获取真实的分类,渲染到页面
$.ajax({
    url: '/my/category/list',
    success: function (res) {
        // 使用模板引擎渲染 
        var str = template('tpl-category', res);
        $("#category").append(str);//把模板引擎数据追加到category里面
    //有些表单元素可能是动态插入的。这时 form 模块 的自动化渲染是会对其失效的
        form.render('select');   // 使用更新渲染

    }
});


// 2.完成筛选
// 给表单注册submit提交事件
$("#search").on('submit', function (e) {

    e.preventDefult();
    // 获取两个下拉框的value值
    var cate_id = $("#category").val();
    var state = $("#sate").val();
    // 设置ajax请求
    if (cate_id) {//判断 cate_id里面有值(选择分类)的话
        data.cate_id = cate_id;//把值添加到对象里面去
    } else {
        //没有值(没有分类)删除
        delete data.cate.id;//delete用于删除对象的属性
    };
    if (state) {
        data.state = state;
    } else {
        delete state;
    }
    // 筛选之后重置页码为第一页
    data.pagenum = 1;
    renderArticle();//调用函数 渲染页面数据

});

// -------------------筛选--------------------
$('tbody').on('click', "button:contains('删除')", function () {
    var id = $(this).data('id');
    // 删除提示
    layer.confirm('确定删除吗', function (index) {
        $.ajax({
            url: '/my/article/delete/'+id,
            success: function (res) {
                // 提示
                layer.msg(res.message);
                if (res.status === 0) {
                    renderArticle();//删除成功重新渲染页面
                }
            }
        });
        layer.close(index);//关闭弹层
    });

});






