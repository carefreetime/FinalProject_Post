var App = (function () {

    function _bindEvent() {
        console.log('bind event');
        $('#login').on('click', _login);
        $('#newpost').on('click', _postNew);
        $('#User').on('click',  '#submit', _authorUpdate);
        $('#postlist').on('click', '#button_edit', _postLoad);
        $('#EditModal').on('click', '#updatepost', _postEdit);
        $('#postlist').on('click', '#button_delete', _postDelete);
    }

    function _login() {
       $.ajax({
          url: 'https://richegg.top/login',
          type: 'post',
          dataType: 'json',
          contentType: 'application/json',
          xhrFields: {
             withCredentials: true
         },
         data: JSON.stringify({
             username: $('#userName').val(),
             password: $('#userPassword').val()
         }),
         success: function (autohr) {
             var username = autohr.username;
             var name = autohr.name;
             var gender = autohr.gender;
             var address = autohr.address;

             $('#User').append(`
                <div class="row">
                <div class="col-md-8 col-md-offset-2">
                <div class="form-area">  
                <form role="form">
                <br style="clear:both">
                <h3 style="margin-bottom: 25px; text-align: center;">使用者資料</h3>
                <div class="col-md-2" style="text-align: right;">
                <span>Username</span>
                </div>
                <div class="col-md-10">
                <div class="form-group">
                <input type="text" class="form-control" id="username" name="username" value="${username}" required>
                </div>
                </div>
                <div class="col-md-2" style="text-align: right;">
                <span>Name</span>
                </div>
                <div class="col-md-10">
                <div class="form-group">
                <input type="text" class="form-control" id="name" name="name" value="${name}" required>
                </div>
                </div>
                <div class="col-md-2" style="text-align: right;">
                <span>Gender</span>
                </div>
                <div class="col-md-10">
                <div class="form-group">
                <input type="text" class="form-control" id="gender" name="gender" value="${gender}" required>
                </div>
                </div>
                <div class="col-md-2" style="text-align: right;">
                <span>Address</span>
                </div>
                <div class="col-md-10">
                <div class="form-group">
                <input type="text" class="form-control" id="address" name="address" value="${address}" required>        
                </div>
                </div>      
                <button type="button" id="submit" name="submit" class="btn btn-primary pull-right">修改</button>
                </form>
                </div>
                </div>
                </div>
                `);
             $('a[href="#user"]').tab('show');
             $('#LoginModal').modal('hide');  
         },
         error: function (jqXHR) {
             console.log(jqXHR);
         }
     });

   }

   function  _authorUpdate() {
       var username = $('#userName').val();
       $.ajax({
          url: 'https://richegg.top/authors/' + username,
          type: 'patch',
          dataType: 'json',
          contentType: 'application/json',
          xhrFields: {
             withCredentials: true
         },
         data: JSON.stringify({
             username: $('#username').val(),
             name: $('#name').val(),
             gender: $('#gender').val(),
             address: $('#address').val()
         }),
         success: function (data) {
             $('a[href="#home"]').tab('show');
         },
         error: function (jqXHR) {
             console.log(jqXHR);
         }
     });
   }

   function _postNew() {
       var x = $("#tags").val('items');
       console.log(x);
       $.ajax({
          url: 'https://richegg.top/posts',
          type: 'post',
          dataType: 'json',
          contentType: 'application/json',
          xhrFields: {
             withCredentials: true
         },
         data: JSON.stringify({
             title: $('#title').val(),
             content: $('#content').val(),
             tags: $.parseJSON('["1"]')
         }),
         success: function (data) {
             console.log('postnew_ok');
             _posts();
             $('a[href="#home"]').tab('show');
             $('#NewPostModal').modal('hide');   
         },
         error: function (jqXHR) {
             console.log(jqXHR);
             console.log('postnew_error');
         }
     });
   }

    function _postLoad() {
        var pid = $(this).parents('.panel-heading').attr('data-id');
        $.ajax({
            url: `https://richegg.top/posts/` + pid,
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var title = data.title;
                var content = data.content;
                var tags = "";
                for (var i = 0; i < data.tags.length; i++) {
                    tags += data.tags[i] + ",";
                } 
                $("#edittitle").val(title);  
                $("#editcontent").val(content);
            },
            error: function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _postEdit() {
        $.ajax({
            url: `https://richegg.top/posts/` + pid,
            type: 'patch',
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({
                title: $('#edittitle').val(),
                content: $('#editcontent').val(),
                tags: $.parseJSON('["1","2","3"]')
            }),
            success: function (data) {
                console.log("更新成功");
                location.reload();
            },
            error: function (jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _postDelete() {
        var pid = $(this).parents('.panel-heading').attr('data-id');
        $.ajax({
            url: `https://richegg.top/posts/` + pid,
            type: 'delete',
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {
               withCredentials: true
           },
           success: function (data) {
            console.log("刪除成功");
            location.reload();
            },
            error: function (jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _posts() {
        $.ajax({
            url:'https://richegg.top/posts',
            type:'get',
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                for (let posts of data) {
                    var id = posts.id;
                    var title = posts.title;
                    var content = posts.content;
                    var created_at = moment(posts.created_at).format('LLLL');
                    var name = posts.author.name;
                    var tags = "";
                    for (var i = 0; i < posts.tags.length; i++) {
                        tags += "<span class='label label-default'>" + posts.tags[i] + "</span> ";
                    }

                    $('#Posts').append(`
                        <div class="panel-heading" data-id="${id}">
                        <div class="text-center">
                        <div class="row">
                        <div class="col-md-8">
                        <h3 class="pull-left">${title}</h3>
                        </div>
                        <div class="col-md-3">
                        <h4 class="pull-right">
                        <small>${created_at}</em></small>
                        </h4>
                        </div>
                        <div class="col-md-1" style="margin-top:10px;">
                        <button id="button_edit" type="button" class="btn btn-default" data-toggle="modal" data-target="#EditModal"
                        style="background-image: none; border: 0px; border-color: white; box-shadow: none;">
                        <i class="fa fa-pencil fa-lg" aria-hidden="true"></i>
                        </button>
                        <button id="button_delete" type="button" class="btn btn-default" 
                        style="background-image: none; border: 0px; border-color: white; box-shadow: none;">
                        <i class="fa fa-trash-o fa-lg" aria-hidden="true"></i>
                        </button>                       
                        </div>
                        <div class="col-md-9">
                        <h5 class="pull-left">${name}</h5>
                        </div>
                        </div>
                        </div>
                        </div>

                        <div class="panel-body">
                        ${content}
                        </div>

                        <div class="panel-footer">
                        ${tags}
                        </div>
                        `);     
                }
            },
            error: function (jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function init() {
        console.log('Hello');
        _bindEvent();
        _posts();
        $('a[href="#home"]').tab('show');
    }
    return {
        init
    }

})();