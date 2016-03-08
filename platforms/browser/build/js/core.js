/*********** Helpers Start ***********/
var websiteUrl = 'http://tick';
Array.prototype.first = function(){return this[0]};
Array.prototype.last = function(){return this[this.length - 1]};
/*********** Helpers End ***********/
/*********** Dates Start ***********/
now = new Date();
nowPlusTwoDays = now.setDate(now.getDate() + 2);
now = new Date(); //reinitialize
/*********** Dates End ***********/

var Auth = {
    token: localStorage.getItem("token"),
    check: function(){
        return this.token.length;
    },
    sendSms: function(){
        $.ajax({
            type:"POST",
            url: websiteUrl+"/api/sms/send",
            data: $('form').serialize(),
            processData: false,
            success: function(msg){
                if(msg.error){
                    console.log(msg.error);
                    $('#popupDialog .noPhoneAlert').show();
                }else{
                    $('.codeInput, .authBtn').show();
                    $('.phoneInput, .smsBtn').hide();
                }
            },
            error: function(e){
                alert(e);
                $('#popupDialog, .wrongCodeAlert').show();
            }
        });
    },
    signIn: function(obj){
        showLoader();
        var form = $(obj).parent().parent().parent();
        $.ajax({
            type:"POST",
            url: websiteUrl+"/api/login",
            data: form.serialize(),
            processData: false,
            success: function(msg){
                if(msg.token.length > 1){
                    localStorage.setItem("token", msg.token);
                    localStorage.setItem("user", JSON.stringify(msg.user));
                    if(localStorage.key('user'))
                        setTimeout(function(){window.location = '../main.html';}, 1000);
                }
            },
            error: function(){
                hideLoader();
                $('#popupDialog').show();
            }
        });
        return false;
    },
    register: function(obj){
        var form = $(obj).parent().parent().parent();
        $.ajax({
            type:"POST",
            url: websiteUrl+"/api/signUp",
            data: form.serialize(),
            processData: false,
            success: function(msg){
                if(msg.token){
                    localStorage.setItem("token", msg.token);
                    localStorage.setItem("user", JSON.stringify(msg.user));
                    if(localStorage.key('user'))
                        setTimeout(function(){window.location = '../main.html';}, 500);
                }
            },
            error: function(){
                    $('.result').append('Invalid Credentials');
                }
            });
        return false;
    },
    logout: function(){
        localStorage.clear();
        window.location = 'index.html';
    },
    me: localStorage.getItem("user")
};



/************ APP ***********/
var App = {
    prepare: function(){
        if(Auth.check){
            $('.login').hide();
        }else{
            $('.login').show();
        }
    },
    start: function(){
        $.ajax({
            url: websiteUrl+'/api/tickets/types',
            type: "post",
            data: $('#addCommentForm').serialize(),
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer " + Auth.token);
            },
            success: function(response){
                localStorage.setItem("types", JSON.stringify(response.types));
            }
        });
    }
};

App.prepare();
App.start();

function showLoader(){
    $('#loader').show();
}
function hideLoader(){
    $('#loader').hide();
}

function my(item){
    return JSON.parse(localStorage.getItem(item))
}


function onDeviceReady(){
    console.log("Device Ready");
    var push = PushNotification.init({ "android": {"senderID": "57553602346"},
        "ios": {"alert": "true", "badge": "true", "sound": "true"}, "windows": {} } );

    push.on('registration', function(data) {
        $.ajax({
            url: websiteUrl+'/api/users/updateGCM',
            type: "post",
            data: "gcm="+data.registrationId,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Bearer " + Auth.token);
            },
            success: function(response){
                alert(response);
                localStorage.setItem("gcm", response);
            }
        });
    });

    push.on('notification', function(data) {
        console.log(data.message);
        alert(data.title+" Message: " +data.message);
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
    });

    push.on('error', function(e) {
        console.log(e.message);
    });
}