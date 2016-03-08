/************ APP ***********/
var App = {
    prepare: function(){
        if(Auth.check){
            $('.login').hide();
        }else{
            $('.login').show();
        }
    },
    start: function(){}
};

var Profile = {
    id: my('user').id,
    name: my('user').name,
    phone: my('user').phone,
    email: my('user').email,
    team: my('user').team,
    leader: Boolean(my('user').leader),
    status: my('user').status,
    avatar: websiteUrl+'/avatars/avatar-'+my('user').id+'.jpg',
    types: function(){
        $.ajax({
            url: websiteUrl+'/api/tickets/types/my',
            type: "post",
            data: $('#addCommentForm').serialize(),
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer " + Auth.token);
            },
            success: function(response){
                var result = [];
                $(response.types).each(function(){
                    result.push(this.id);
                });
                localStorage.setItem("myTypes", JSON.stringify(result));
            }
        });
    },
    drawLeft: function(){
        $('.profile-text strong').empty().html(this.name);
        $('.profile-thumbnail').attr('src', this.avatar);
        if(this.leader){
            $('.profile-text span').empty().html('Team leader');
            $('.createLink, .allLink').show();
        }
    }
};


var Ticket = {
    draw: function(response){
        $('#main').empty();
        $(response.tickets).each(function(){
            var ticketId = this.id;
            $('#main').append(
                '<div class="nd2-card ticket-'+ticketId+'">'+
                '<div class="card-title has-supporting-text">'+
                '<h3 class="card-primary-title">'+this.name+'</h3>'+
                '<h5 class="card-subtitle">'+this.created_at+'</h5></div>'+
                '<div class="card-supporting-text">'+this.content+'</div>'+
                '<div class="card-supporting-text comments"  style="display: none"></div>' +
                '<div class="card-action"><div class="row between-xs"><div class="col-xs-12"><div class="box">'+
                '<a href="#" class="ui-btn ui-btn-inline"><i class="zmdi zmdi-accounts-add"></i></a>'+
                '<a style="float: right" onclick="Ticket.showComments('+ticketId+')" class="ui-btn ui-btn-inline"><i class="zmdi zmdi-comment-outline"></i></a>'+

                '</div></div></div></div>'
            );
            $('.ticket-'+this.id+' .comments').append(
                '<ul data-role="listview" data-icon="false" class="ui-listview">' +
                '</ul>' +
                '<form role="form" method="post"  id="addCommentForm"><div class="form-group">' +
                '<input  type="hidden" name="ticket_id" value="'+ticketId+'">' +
                '<input  type="hidden" name="user_id" value="'+Profile.id+'">' +
                '<textarea  name="content" id="textarea2b" placeholder="Write a comment" class="ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all ui-textinput-autogrow" style="height: 23px;"></textarea>' +
                '<button class="form-control input-lg btn" type="button" onclick="Ticket.addComment('+ticketId+')">Comment</button>' +
                '</div></form>'
            );
            if(this.comments.length > 0){
                $(this.comments).each(function(){
                    $('.ticket-'+ticketId+' .comments ul').append(
                        '<li class="ui-li-has-thumb">' +
                        '<a class="ui-btn waves-effect waves-button waves-effect waves-button">' +
                        '<img src="'+websiteUrl+'/avatars/avatar-'+this.user.id+'.jpg" class="ui-thumbnail ui-thumbnail-circular">' +
                        '<h3>'+this.user.name+'</h3>' +
                        '<p>'+this.created_at+'</p>' +
                        '</a>' +
                        '<div class="comment_text">'+this.content+'</div>' +
                        '</li>'
                    );
                })
            }
        })
    },

    addComment: function(ticketId){
        $.ajax({
            url: websiteUrl+'/api/tickets/addComment',
            type: "post",
            data: $('#addCommentForm').serialize(),
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer " + Auth.token);
            },
            success: function(response){
                if(response){
                    $('.ticket-'+ticketId+' .comments ul').append(
                        '<li class="ui-li-has-thumb">' +
                        '<a class="ui-btn waves-effect waves-button waves-effect waves-button">' +
                        '<img src="'+websiteUrl+'/avatars/avatar-'+Profile.id+'.jpg" class="ui-thumbnail ui-thumbnail-circular">' +
                        '<h3>'+Profile.name+'</h3>' +
                        '<p>1 minute ago</p>' +
                        '</a>' +
                        '<div class="comment_text">'+$('#addCommentForm textarea').val()+'</div>' +
                        '</li>'
                    );
                }else{
                    $('#main').append('<h2>Nothing was found</h2>');
                }
            }
        });
    },

    showComments: function(id){
        $('.ticket-'+id+' .comments').toggle('slow');
    },

    all: function(){
        $.ajax({
            url: websiteUrl+'/api/tickets',
            type: "post",
            data: "",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer " + Auth.token);
            },
            success: function(response){
                if(response){
                    Ticket.draw(response);
                }else{
                    $('#main').append('<h2>Nothing was found</h2>');
                }
            }
        });
    },

    my: function(){
        $.ajax({
            url: websiteUrl+'/api/tickets/my',
            type: "post",
            data: "",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer " + Auth.token);
            },
            success: function(response){
                if(response){
                    Ticket.draw(response);
                }else{
                    $('#main').append('<h2>Nothing was found</h2>');
                }
            }
        });
    },

    inProgress: function(){
        $.ajax({
            url: websiteUrl+'/api/tickets/progress',
            type: "post",
            data: "",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer " + Auth.token);
            },
            success: function(response){
                if(response){
                    $('#main').empty();
                    Ticket.draw(response);
                }else{
                    $('#main').append('<h2>Nothing was found</h2>');
                }
            }
        });
    },

    doneByMe: function(){
        $.ajax({
            url: websiteUrl+'/api/tickets/doneByMe',
            type: "post",
            data: "",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer " + Auth.token);
            },
            success: function(response){
                if(response){
                    $('#main').empty();
                    Ticket.draw(response);
                }else{
                    $('#main').append('<h2>Nothing was found</h2>');
                }
            }
        });
    },

    done: function(){
        $.ajax({
            url: websiteUrl+'/api/tickets/done',
            type: "post",
            data: "",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer " + Auth.token);
            },
            success: function(response){
                if(response){
                    $('#main').empty();
                    Ticket.draw(response);
                }else{
                    $('#main').append('<h2>Nothing was found</h2>');
                }
            }
        });
    },

    closedMy: function(){
        $.ajax({
            url: websiteUrl+'/api/tickets/closedMy',
            type: "post",
            data: "",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer " + Auth.token);
            },
            success: function(response){
                if(response){
                    $('#main').empty();
                    Ticket.draw(response);
                }else{
                    $('#main').append('<h2>Nothing was found</h2>');
                }
            }
        });
    }

};

var Settings = {
    show:function(){
        $('#main').empty().append(
            '<form id="SettingsSelect">' +
            '<fieldset data-role="controlgroup" class="ui-controlgroup ui-controlgroup-vertical ui-corner-all">' +
            '<div class="ui-controlgroup-controls"></div>' +
            '</fieldset>' +
            '</form>'
        );
        var types = my('types');
        var myTypes = my('myTypes');
        console.log(myTypes);
        var checked = '';
        $(types).each(function() {
            if(jQuery.inArray(this.id, myTypes) > -1){
                checked = 'ui-checkbox-on';
            }else{
                checked = 'ui-checkbox-off';
            }

            $('#main fieldset .ui-controlgroup-controls').append(
                '<div class="ui-checkbox">' +
                '<label for="c'+this.id+'" class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left '+checked+'">' +
                    this.name +
                '</label>' +
                '<input type="checkbox" id="c'+this.id+'" name="types[]" value="'+this.id+'"></div>'
            );
        })
    }
};




Profile.drawLeft();
Profile.types();
Ticket.my();
