function update(id, questionString , allAnswers , level , q) {
    $.ajax({
        method: "PATCH",
        url: '/api/question/' + id,
        contentType: 'application/json',
        data: JSON.stringify({
            id,
            questionString,
            answers : allAnswers,
            level
        }),
        success: function (response) {
            if (q) {
                return getQueryLink(q);
            } else {
                return initialize();
            }
            // Empty the content to avoid duplicate content
            $("#questionsBlock").empty();            
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
            if(q){
                return getQueryLink(q);
            }else{
                return initialize();                
            }
            // Empty the content to avoid duplicate content
            $("#questionsBlock").empty();
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
                response.question.docs.forEach((questions) => {
                    var id = questions._id;
                    getListBlock.append("<form id='" + id + "' class='questionBox'><textarea class='list'>" + questions.questionString + "</textarea><input type='number' class='answer-box-edit' id='trueAnswerBox' value='" + questions.answers[0] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox1' value='" + questions.answers[1] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox2' value='" + questions.answers[2] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox3' value='" + questions.answers[3] + "'><div class='form-group'><label for='level' id='timeBoxLabelEdit'>Level of Question = <output class='rangeValue' id='rangevalue'>" + questions.level + "</output></div></label><input type='range' id='level' min='1' max='10' value='" + questions.level + "' oninput='rangevalue.value=value' onchange='rangevalue.value=value' /><br><button form='" + id + "' class='delete'>Delete</button><button form='" + id + "' class='update'>Update</button></form><hr>");
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
                    var allAnswers = [answer1, answer2, answer3, answer4];
                    update(id, questionString, allAnswers, level , q);
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
                response.question.docs.forEach((questions) => {
                    var id = questions._id;
                    getListBlock.append("<form id='" + id + "' class='questionBox'><textarea class='list'>" + questions.questionString + "</textarea><input type='number' class='answer-box-edit' id='trueAnswerBox' value='" + questions.answers[0] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox1' value='" + questions.answers[1] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox2' value='" + questions.answers[2] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox3' value='" + questions.answers[3] + "'><div class='form-group'><label for='level' id='timeBoxLabelEdit'>Level of Question = <output class='rangeValue' id='rangevalue'>"+questions.level+"</output></div></label><input type='range' id='level' min='1' max='10' value='" + questions.level +"' oninput='rangevalue.value=value' onchange='rangevalue.value=value' /><br><button form='" + id + "' class='delete'>Delete</button><button form='" + id + "' class='update'>Update</button></form><hr>");
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
                    var allAnswers = [answer1 , answer2 , answer3 , answer4];
                    update(id, questionString , allAnswers , level);
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

    $("form").on("submit" , function () {
        var question = $(".textarea-box").val();
        console.log(question);
        var trueAnswer = $("#trueAnswerBox").val();
        var falseAnswer = $("#falseAnswerBox").val();
        // alert('Question : ' + question + "\n True Asnwer :" + trueAnswer + "\n False Answers : " + falseAnswer);
    });

});