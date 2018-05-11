function update(id, questionString , allAnswers , level , time , q) {
    $.ajax({
        method: "PATCH",
        url: '/api/question/' + id,
        contentType: 'application/json',
        data: JSON.stringify({
            id,
            questionString,
            answers : allAnswers,
            level,
            time
        }),
        success: function (response) {
            $("#questionsBlock").empty();                        
            if (q) {
                return getQueryLink(q);
            } else {
                return initialize();
            }
            // Empty the content to avoid duplicate content
        }
    });
}

function deleteData(id, questionString , q) {
    $.ajax({
        method: "DELETE",
        url: '/api/question/' + id,
        contentType: 'application/json',
        data: JSON.stringify({
            id
        }),
        success: function (response) {
            $("#questionsBlock").empty();            
            if(q){
                return getQueryLink(q);
            }else{
                return initialize();                
            }
            // Empty the content to avoid duplicate content
        }
    });
}


function getQueryLink(q){
    return $.ajax({
            method: "GET",
            url: '/api/question/?q=' + encodeURIComponent(q),
            contentType: 'application/json',
            success: function (response) {
                var getListBlock = $("#questionsBlock");
                $("#questionsBlock").empty();    
                response.question.docs.forEach(function (questions) {
                    var id = questions._id;
                    getListBlock.append("<form id='" + id + "' class='questionBox'><input type='number' name='time' id='timeLittleBox' value='" + questions.time + "' onfocus='this.value=\"\"'><p style='font-size: 17px;color: #535353; display: inline-block; float:right; padding:3px;'>seconds</p><textarea class='list'>" + questions.questionString + "</textarea><input type='number' class='answer-box-edit' style='background-color: #eaad3a' id='trueAnswerBox' value='" + questions.answers[0] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox1' value='" + questions.answers[1] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox2' value='" + questions.answers[2] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox3' value='" + questions.answers[3] + "'><div class='form-group'><label for='level' id='timeBoxLabelEdit'>Level of Question = <output class='rangeValue' id='rangevalue'>" + questions.level + "</output></div></label><input type='range' id='level' min='1' max='10' value='" + questions.level + "' oninput='rangevalue.value=value' onchange='rangevalue.value=value' /><br><button form='" + id + "' class='delete'>Delete</button><button form='" + id + "' class='update'>Update</button></form><hr>");
                });
                if (response.question.total >= 6) {
                    getListBlock.last().append("<div id='pagination' class='pagination'><a class='left-arrow' href='/'>❮ Previous</a><a class='right-arrow' href='/'>Next ❯</a></div>");
                }
                if (response.question.page == 1) {
                    $(".left-arrow").addClass("disabled");
                } else if (response.question.page == response.question.pages) {
                    $(".right-arrow").addClass("disabled");
                }
                $("a.left-arrow").on("click", function (e) {
                    e.preventDefault();
                    paginationLeft(response.question.pages, response.question.page);
                });
                $("a.right-arrow").on("click", function (e) {
                    e.preventDefault();
                    paginationRight(response.question.pages, response.question.page);
                });
                $('.questionBox').on('click', '.update', function (e) {
                    e.preventDefault();
                    var id = $(this).attr('form');
                    var questionString = $("form#" + id).find("textarea").val();
                    var answer1 = $("form#" + id).find("#trueAnswerBox").val();
                    var answer2 = $("form#" + id).find("#falseAnswerBox1").val();
                    var answer3 = $("form#" + id).find("#falseAnswerBox2").val();
                    var answer4 = $("form#" + id).find("#falseAnswerBox3").val();
                    var level = $("form#" + id).find("#level").val();
                    var time = $("form#" + id).find("#timeLittleBox").val();                    
                    var allAnswers = [answer1, answer2, answer3, answer4];
                    update(id, questionString, allAnswers, level ,time , q);
                });
                $('.questionBox').on('click', '.delete', function (e) {
                    e.preventDefault();
                    var id = $(this).attr('form');
                    var questionString = $("form#" + id).find("textarea").val();
                    deleteData(id, questionString , q);
                });
            }
        });
}

function paginationLeft(total , currentPage){
    if(currentPage == 1){
        return getQueryLink(JSON.parse(currentPage));
    }else if(currentPage >= 1){
        return getQueryLink(JSON.parse(currentPage - 1));
    }
}

function paginationRight(total , currentPage){
    if(currentPage == total){
        return getQueryLink(JSON.parse(currentPage));
    }else if(currentPage <= total){
        return getQueryLink(JSON.parse(currentPage + 1));
    }
}


function initialize() {
    return $.ajax({
            method: "GET",
            url: '/api/question',
            contentType: 'application/json',
            success: function (response) {
                var getListBlock = $("#questionsBlock");
                response.question.docs.forEach(function (questions) {
                    var id = questions._id;
                    getListBlock.append("<form id='" + id + "' class='questionBox'><input type='number' name='time' id='timeLittleBox' value='" + questions.time + "' onfocus='this.value=\"\"'><p style='font-size: 17px;color: #535353; display: inline-block; float:right; padding:3px;'>seconds</p><textarea class='list'>" + questions.questionString + "</textarea><input type='number' style='background-color: #eaad3a' class='answer-box-edit' id='trueAnswerBox' value='" + questions.answers[0] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox1' value='" + questions.answers[1] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox2' value='" + questions.answers[2] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox3' value='" + questions.answers[3] + "'><div class='form-group'><label for='level' id='timeBoxLabelEdit'>Level of Question = <output class='rangeValue' id='rangevalue'>" + questions.level + "</output></div></label><input type='range' id='level' min='1' max='10' value='" + questions.level + "' oninput='rangevalue.value=value' onchange='rangevalue.value=value' /><br><button form='" + id + "' class='delete'>Delete</button><button form='" + id + "' class='update'>Update</button></form><hr>");
                });
                if(response.question.total >= 6){
                    getListBlock.last().append("<div id='pagination' class='pagination'><a class='left-arrow' href='/'>❮ Previous</a><a class='right-arrow' href='/'>Next ❯</a></div>");
                }
                if(response.question.page == 1){
                    $(".left-arrow").addClass("disabled");
                }else if(response.question.page == response.question.pages){
                    $(".right-arrow").addClass("disabled");                    
                }
                $("a.left-arrow").on("click" , function(e){
                    e.preventDefault();                    
                    paginationLeft(response.question.pages , response.question.page);
                });
                $("a.right-arrow").on("click" , function(e){
                    e.preventDefault();                    
                    paginationRight(response.question.pages , response.question.page);
                });
                $('.questionBox').on('click', '.update', function (e) {
                    e.preventDefault();
                    var id = $(this).attr('form');
                    var questionString = $("form#" + id).find("textarea").val();
                    var answer1 = $("form#" + id).find("#trueAnswerBox").val();
                    var answer2 = $("form#" + id).find("#falseAnswerBox1").val();
                    var answer3 = $("form#" + id).find("#falseAnswerBox2").val();
                    var answer4 = $("form#" + id).find("#falseAnswerBox3").val();
                    var level = $("form#" + id).find("#level").val();
                    var time = $("form#" + id).find("#timeLittleBox").val();
                    var allAnswers = [answer1 , answer2 , answer3 , answer4];
                    update(id, questionString , allAnswers , level , time);
                });
                $('.questionBox').on('click', '.delete', function (e) {
                    e.preventDefault();
                    var id = $(this).attr('form');
                    var questionString = $("form#"+id).find("textarea").val();
                    deleteData(id, questionString);
                });
            }
        });
}

function closeBox(){
    $("#questionsBlock").empty();
    $(".all-question").css('display' , 'none');
    $(".sidebar").css({
        width : "0%",
        transitionDuration: "0.4s"
    });
    $(".overlay").css({
        display : "none",
        transitionDuration : "0.2s"
    });
}

function openBox(){
    $(".sidebar").css({
        display: "block",
        width: "55%",
        transitionDuration: "0.4s"
    });
    $(".all-question").css('display', 'block');
    $(".overlay").css({
        display: "block",
        transitionDuration: "0.2s"
    });
    initialize();
}

function rankClick(){
    console.log("Clicked");
    $("#rankbox").css({
        width: "100%",
        transition: "2s ease-in",
        position: "absolute",
        float: "right",
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "block",
        bottom: "0",
        top: "0",
        zIndex: "3",
        left: "0",
    });

    $.ajax({
        url: '/api/app/user',
        contentType : "application/json",
        method : "GET",
        success : function (rank) {
            var i = 1;
            var myCounter = 0;
            var percentage;
            rank.users.forEach(function(element) {
                var answerCount = element.answers.forEach(v => v ? myCounter++ : v);
                percentage = 100 * myCounter / element.answers.length;
                console.log("Percentage :",percentage);
                $("tbody#appendTable").append(`<tr style='${(decodeURI(getCookie("from")) === element.from) ? "background-color :rgba(2, 60, 255, 0.41);" : "background-color :none;"}'><td> ${i++} </td><td> ${element.from}</td><td>${(isNaN(percentage) || percentage == Infinity) ? percentage=0 : percentage}/100</td></tr>`);
            });

        }
    });
    $(".rank-chat").on("click", function (e) {
        $("#rankbox").css({
            width: "0%",
            transition: "1s ease-in",
            display: "none"
        });
        $("tbody#appendTable").empty();
    });
}


// Cookies

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("from");
    if (user != "") {
        $("div#formInput").append("<a class='fetchUser' href='/play'> Use \"" + decodeURI(user) + "\"</a>");
        $("#welcome").append(decodeURI(user));
    } 
}
function gameStarted(level){    
    $.ajax({
        url : '/api/game/' + encodeURI(level),
        method : "GET",
        contentType : "application/json",
        success : function(response){
            var arrayQuestion = 0;
            var question = response.question;
            gameCounter(question, arrayQuestion);                
        }
    })
}

function gameCounter(question , arrayQuestion){
    $("body").css("background-color", "#EAAD3A");
    window.clearInterval(window.timeTrue);    
    // console.log("Level available" , question[arrayQuestion].level);
    Array.prototype.move = function (from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
    };
    var oriArray = question[arrayQuestion].answers;
    var randomArray = [];
    for(var i = 0; i < oriArray.length;i++){
        randomArray.push(oriArray[i]);        
    }
    var rand = Math.floor((Math.random() * 3) + 1);
    var rand2 = Math.floor((Math.random() * 4) - 1);
    var rand3 = Math.floor((Math.random() * 3) + 1);
    randomArray.move(0, rand);
    randomArray.move(1, rand2);
    randomArray.move(2, rand3);
    // Begin Append Question
    $(".append").html("<div id='level-text' class='level-text'><p style='text-align:center;'>Level " + question[arrayQuestion].level + "</p></div><div id='countdown'><div id='countdown-number'></div><svg id='circleSvg'><circle class='circle' cx='75' cy='80' r='68' /></svg></div><div id='" + question[arrayQuestion]._id + "' class='question-display'>" + question[arrayQuestion].questionString + "</div><div class='input-area'><input type='submit' id='answer1' value='" + randomArray[0] + "'><input type='submit' id='answer2' value='" + randomArray[1] + "'><br><input type='submit' id='answer3' value='" + randomArray[2] + "'><input type='submit' id='answer4' value='" + randomArray[3] + "'></div><div id='new-user' class='new-user'></div>");
    // Countdown Begins
    var countdownNumberEl = document.getElementById('countdown-number');
    var countdown = question[arrayQuestion].time;
    countdownNumberEl.textContent = countdown;
    window.timeTrue = window.setInterval(function () {
        console.log("Countdown :", countdown);            
        if (countdown === 0) {
            pushAnswer(getCookie("from"), question[arrayQuestion].answers[0], "false", question[arrayQuestion].level, timeTrue, question, arrayQuestion + 1);
            window.clearInterval(window.timeTrue);              
            countdown = 0;
        }else{
            countdown = --countdown;            
        }
        countdownNumberEl.textContent = countdown;
    }, 1000);
    $(".circle").css({
        animation: "countdown " + countdown + "s linear forwards",
        animationPlayState : "running"
    });
    $("button#chat").on("click", function (e) {
        window.clearInterval(window.timeTrue);
        // Bug , reset countdown
        $(".circle").css({
            animationPlayState: "paused"
        });
        $("div#close-chat").on("click", function (e) {
            e.stopPropagation();            
            window.clearInterval(window.timeTrue);
            gameCounter(question, arrayQuestion);
        });
    });
    // Countdown Ends
    for (var i = 1; i <= 4; i++)(function (i) {
        $("#answer" + i).on("click", function () {
            var value = this.value;
            // console.log("You click",value);
            // console.log("True Answer",question[arrayQuestion].answers[0]);
            pushAnswer(getCookie("from"), question[arrayQuestion].answers[0], value, question[arrayQuestion].level, timeTrue, question,arrayQuestion + 1);
            clearInterval(timeTrue);
        });
    }(i));
}
// Make it global to be able to push array for clicking not more than 5 total questions
var allAnswer = [];
function pushAnswer(user,correctAns , ans , level , timeTrue , question , nextQuestion){
    console.log("All Answer" , allAnswer);
    if(ans == correctAns){
        allAnswer.push(true);
        $("body").css("background-color", "#20bf6b");
        $(".append").html("<div id='lottie' style='blackground-color : #023cff; z-index:3 width:100%;transform : none; height:536px; position:relative;' class='lottie'></div>");
        var animation = lottie.loadAnimation({
            container: document.getElementById("lottie"),
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: '/js/jsonanimation/dataTrue.json'
        });
        // Hide button to avoid bug :D
        $("button#ranking, button#chat").css("display", "none");
        animation.addEventListener("complete" , function(){
            $("body").css("background-color", "#EAAD3A");            
            $("button#ranking, button#chat").css("display", "inline-block");
            gameCounter(question, nextQuestion);
        });
    }else if(ans !== correctAns){
        allAnswer.push(false);
        $("body").css("background-color", "#ff3838");
        $(".append").html("<div id='lottie' style='blackground-color : #023cff; z-index:3 width:100%;transform : none; height:536px; position:relative;' class='lottie'></div>");
        var falseAnimation = lottie.loadAnimation({
            container: document.getElementById("lottie"),
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: '/js/jsonanimation/dataFalse.json'
        });
        $("button#ranking, button#chat").css("display", "none");        
        falseAnimation.addEventListener("complete", function () {
            $("body").css("background-color", "#EAAD3A");
            $("button#ranking, button#chat").css("display", "inline-block");
            gameCounter(question, nextQuestion);
        });
    }else if(ans == "false"){
        allAnswer.push(false);
        $("body").css("background-color", "#ff3838");
        $(".append").html("<div id='lottie' style='blackground-color : #ff3838; z-index:3 width:100%;transform : none; height:536px; position:relative;' class='lottie'></div>");
        var falseAnimation = lottie.loadAnimation({
            container: document.getElementById("lottie"),
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: '/js/jsonanimation/dataFalse.json'
        });
        $("button#ranking, button#chat").css("display", "none");        
        falseAnimation.addEventListener("complete", function () {
            $("body").css("background-color", "#EAAD3A");
            $("button#ranking, button#chat").css("display", "inline-block");
            gameCounter(question, nextQuestion);
        });
    }
    // Wait 1 second to execute (BUG)
    setTimeout(() => {
        if (allAnswer.length === 5) {
            // (BUG)
            $("body").css("background-color", "#EAAD3A");
            $("button#ranking, button#chat").css("display", "inline-block");
            lottie.destroy();
            sendAnswer(allAnswer, user, level, timeTrue);
            allAnswer = [];
        }
    }, 1000);
}
// Array Global to store temporary
var finalAnswer = [];
var allLevel = [];
function sendAnswer(allAnswer , user , level , timeTrue){
    console.log("Final Answer", finalAnswer);    
    // To make push on each array to a new one
    for(var i = 0 ; i<allAnswer.length; i++){
        finalAnswer.push(allAnswer[i]); 
        allLevel.push(level);       
    }
    $(".append").html("<div id='lottie' style='blackground-color : #EAAD3A; z-index:3 width:100%;transform : none; height:536px; position:relative;' class='lottie'></div>");
    var levelUp = lottie.loadAnimation({
        container: document.getElementById("lottie"),
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: '/js/jsonanimation/dataLevel.json'
    });
    $("button#ranking, button#chat").css("display", "none");
    levelUp.addEventListener("complete", function () {
        $("body").css("background-color", "#EAAD3A");
        $("button#ranking, button#chat").css("display", "inline-block");
        $.ajax({
            url: "api/app/user/" + user,
            method: "PATCH",
            contentType: "application/json",
            data: JSON.stringify({
                answers: finalAnswer,
                level: allLevel
            }),
            success: function () {
                console.log("Success TRUE PATCH");
                $(".append").empty();
                var newLevel = level + 1;
                // clear all interval on timeTrue (BUG)
                window.clearInterval(window.timeTrue);
                gameStarted(newLevel);
            }
        });
    });
}

// Time Function
function getTime(){
    var Time = {};
    var d = new Date();
    Time.hours = d.getHours() > 12 ? d.getHours() - 12 : d.getHours() === 0 ? d.getHours() + 1 : d.getHours();
    Time.minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    Time.ampm = d.getHours() >= 12 ? "pm" : "am";

    return Time;
}


// DOMContentLoaded
$(function(){

    var level = $("#level").val(1);
    console.log("I loaded in browser");
    $(".textarea-box").one("click" , function(){
        $(".textarea-box").val("");
        $(".textarea-box").css({
            "color" : "#2e2e2e"
        });
    });
    
    // Chat Clicked
    $(document).on("click" , "button#chat", function (e) {
        console.log("Clicked");
        $("#chatbox").css({
            width: "100%",
            transition: "2s ease-in",
            position : "absolute",
            float: "right",
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "block",
            bottom : "0",
            top: "0",
            zIndex: "3",
            left:"0",
            paddingBottom: "120px"
        });
        $(".close-chat").on("click" , function (e) {
            e.stopPropagation();            
            $("#chatbox").css({
                width: "0%",
                transition: "1s ease-in",
                display : "none"
            });
        });
    });

    // Input Name Validation
    $("#inputSend").submit(function (e) {  
        e.preventDefault();
        var valueInput = $("input#from").val();
        $("p").remove();
        $.ajax({
            url : '/api/app/user/input',
            method : "POST",
            data : JSON.stringify({
                from : valueInput
            }),
            contentType : "application/json",
            success : function () {  
                $(this).unbind("submit").submit();
                window.location.href = "/play";
            },
            error : function (error) {  
                console.log(error);
                $("#input").append("<p style='top : 0;font-size : 14px;color: white;background: #ff2457;text-align:  center;'>\"" + valueInput + "\" has been taken. Please choose other names.</p>");
            }
        });
    })

    if (window.location.pathname == '/play') {
        gameStarted(1);
        // Initialize socket
        var socket = io();        
        socket.on('connect', function () {
            console.log("Connected to Server");
        });

        // Welcoming New User
        socket.on("newUser", function (welcome) {
            var $div = $(".new-user");
            $div.slideDown(500, function () {
                $div.css("display", "table");
                $(".user-welcome").css("display", "block");
            });
            $div.html("<p class='user-welcome'>User Connected : " + welcome.from + "</p>");
            setTimeout(() => {
                $div.slideUp(500, function () {
                    $(".user-welcome").css("display", "none");
                });
            }, 5000);
        });

        // Broadcast Disconnected Users
        socket.on('userDisconnect' , function(user){
            var $div = $(".new-user");
            $div.slideDown(500, function () {
                $div.css({
                    display : "table",
                    backgroundColor : "red"
                });
                $(".user-welcome").css("display", "block");
            });
            $div.html("<p class='user-welcome'>User Disconnected : " + user + "</p>");
            setTimeout(() => {
                $div.slideUp(500, function () {
                    $(".user-welcome").css("display", "none");
                });
            }, 5000);
        });

        // Messages send and receives (Client Side)
        var chatArea = $("#chatmessages");
        socket.on("newMessages", function (message) {
            var listYou = $("<li class='bubble-you'></li>");
            var listBot = $("<li class='bubble-bot' style='color : #EAAD3A;'></li>");
            var timeYou = $("<p class='time' style='clear:both; float:right;'></p>");
            var timeBot = $("<p class='time'></p>");
            var nameYou = $("<p style='clear: both; float: right; margin-bottom: 0; font-size: 12px;'></p>");
            var nameBot = $("<p style='clear: both; margin-bottom: 0; font-size: 12px;'></p>");
            if(getCookie("from") === message.user){
                nameYou.text('YOU');
                listYou.text(`${message.chat}`);
                timeYou.text(`${getTime().hours} : ${getTime().minutes} ${getTime().ampm}`);
                chatArea.append(listYou);
                timeYou.insertAfter(listYou);
                nameYou.insertBefore(listYou);
                console.log("From YOU :",message);                
            }else {
                nameBot.text(`${message.user}`);
                listBot.text(`${message.chat}`);
                timeBot.text(`${getTime().hours} : ${getTime().minutes} ${getTime().ampm}`);
                chatArea.append(listBot);
                timeBot.insertAfter(listBot);
                nameBot.insertBefore(listBot);
                console.log("From Other Users :", message);                
            }
            $("#chatmessages").scrollTop($("#chatmessages")[0].scrollHeight);
        });

        $("form#sendMessage").on("submit", function (e) {
            var chat = $("#chatarea").val();
            socket.emit('createMessages', chat);
            $("#chatarea").val("");
            e.preventDefault();
        });

    }

});