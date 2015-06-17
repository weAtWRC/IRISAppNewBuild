var BASE_URL = "http://localhost/iris/";
//var BASE_URL = "http://dev.wrctechnologies.com/irisdesign/dev/";
$(window).load(function () {
    $("#formSubmitReg1").click(function () {
        if (validateForm()) {
            callApiForRegistration();
        }
    });
});

// REGISTRATION CODE
function validateForm() {
    var bool = true;
    if ($.trim($("#fname").val()) === "" || $.trim($("#fname").val().length) === 0) {
//        alert("fname");
        $("#fname").addClass("error");
        $("#fname").focus();
//        navigator.notification.alert("Firstname should not be left blank.", null, "Notification", "OK");
        bool = false;
    } else if ($.trim($("#lname").val()) === "" || $.trim($("#lname").val().length) === 0) {
//        alert("lname");
        $("#lname").addClass("error");
        $("#lname").focus();
//        navigator.notification.alert("Lastname should not be left blank.", null, "Notification", "OK");
        bool = false;
    } else if ($.trim($("#email").val()) === "" || $.trim($("#email").val().length) === 0) {
//        alert("email");
        $("#email").addClass("error");
        $("#email").focus();
//        navigator.notification.alert("Email should not be left blank.", null, "Notification", "OK");
        bool = false;
    } else if ($.trim($("#username").val()) === "" || $.trim($("#username").val().length) === 0) {
//        alert("uname");
        $("#username").addClass("error");
        $("#username").focus();
//        navigator.notification.alert("Username should not be left blank.", null, "Notification", "OK");
        bool = false;
    } else if ($.trim($("#password").val()) === "" || $.trim($("#password").val().length) === 0) {
//        alert("pwd");
        $("#password").addClass("error");
        $("#password").focus();
//        navigator.notification.alert("Password should not be left blank.", null, "Notification", "OK");
        bool = false;
    } else {
        bool = true;
    }
    return bool;
}
function callApiForRegistration() {
    var fname = $('#fname').val();
    var lname = $('#lname').val();
    var email = $('#email').val();
    var username = $('#username').val();
    var password = $('#password').val();
    $.ajax({
        url: BASE_URL + 'api/registration',
        type: "POST",
        data: {
            fname: fname,
            lname: lname,
            email: email,
            username: username,
            password: password
        },
        success: function (resp) {
            var data = $.parseJSON(resp);
            if (data.code == '200') {
                location.href = 'selectinterest.html';
                sessionStorage.setItem("uid", data.uid);
            } else {
                navigator.notification.alert(data.error, null, "Notification", "OK");
            }
        }
    });
}
// REGISTRATION CODE

// SELECT INTEREST CODE
function callSelectInterest() {
    if (sessionStorage.getItem("login")) {
        location.href = "dashboard.html";
    } else {
        fetchInterests();
    }
}
function fetchInterests() {
    $.ajax({
        url: BASE_URL + 'api/fetchInterestMaster',
        type: "POST",
        data: {
            todo: "fetch"
        },
        success: function (resp) {
            var data = $.parseJSON(resp);
            var output = "";
            for (var i = 0; i < data.length; i++) {
                output += '<li id="' + data[i].topic_id + '"><a href="#" onclick="addClassInterests(' + data[i].topic_id + ')">' + data[i].topic_name + '</a></li>';
            }
            $("#interests").html(output);
            var uid = '<input type="hidden" id="uid" name="uid" value="' + sessionStorage.getItem("uid") + '">';
            $("#selInt").append(uid);
        }
    });

    $("#done").click(function () {
        $.ajax({
            url: BASE_URL + 'api/insertRegisteredUsersChoice',
            type: "POST",
            data: $("#selectedForm").serialize(),
            success: function (resp) {
                var data = $.parseJSON(resp);
                if (data.code == "200") {
                    location.href = 'dashboard.html';
                } else {
                    navigator.notification.alert(data.error, null, "Notification", "OK");
                }
            }
        });
    });
}
function addClassInterests(id) {
    var hiddenField = "";
    if ($("#" + id).hasClass("act")) {
        $("#" + id).removeClass("act");
        $("#hf" + id).remove();
    } else {
        hiddenField = '<input type="hidden" id="hf' + id + '" name="selectedInterests[]" value="' + id + '">';
        $("#selInt").append(hiddenField);
        $("#" + id).addClass("act");
    }
}
// SELECT INTEREST CODE

// LOGIN CODE
function loginFunctions() {
    $('.logsin').click(function () {
        var username = $('#username').val();
        var password = $('#password').val();
        if (username == "") {
            $('#username').addClass('error');
            $('#username').focus();
        } else if (password == "") {
            $('#password').addClass('error');
            $('#password').focus();
        } else {
            $.ajax({
                url: BASE_URL + 'api',
                data: {'username': username, 'password': password},
                type: 'post',
                success: function (resp) {
                    var obj = $.parseJSON(resp);
                    if (obj.code == '100') {
                        sessionStorage.setItem("uid", obj.uid);
                        location.href = 'dashboard.html';
                    } else {
                        //alert(obj.msg);
                        $('#username').addClass('error');
                        $('#username').focus();
                    }
                }
            });
        }
    });
}
// LOGIN CODE

// DASHBOARD FUNCTIONS
function dashboardFunctions() {
    if (null != sessionStorage.getItem("uid")) {
        sessionStorage.setItem("login", "true");
    } else {
        location.href = "index.html";
    }
}
// DASHBOARD FUNCTIONS

function logout() {
    sessionStorage.clear();
    location.href = "index.html";
}