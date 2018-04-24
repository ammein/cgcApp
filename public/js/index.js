function update(id, questionString , allAnswers , level) {
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
            initialize();
            // Empty the content to avoid duplicate content
            $("#questionsBlock").empty();            
        }
    });
}

function deleteData(id, questionString) {
    $.ajax({
        method: "DELETE",
        url: '/api/question/' + id,
        contentType: 'application/json',
        data: JSON.stringify({
            id
        }),
        success: function (response) {
            initialize();
            // Empty the content to avoid duplicate content
            $("#questionsBlock").empty();
        }
    });
}

function initialize() {
    return $.ajax({
            method: "GET",
            url: '/api/question',
            contentType: 'application/json',
            success: function (response) {
                var getListBlock = $("#questionsBlock");
                // console.log("All responses",{response});
                response.question.docs.forEach((questions) => {
                    var id = questions._id;
                    getListBlock.append("<form id='" + id + "' class='questionBox'><textarea class='list'>" + questions.questionString + "</textarea><input type='number' class='answer-box-edit' id='trueAnswerBox' value='" + questions.answers[0] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox1' value='" + questions.answers[1] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox2' value='" + questions.answers[2] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox3' value='" + questions.answers[3] + "'><div class='form-group'><label for='level' id='timeBoxLabelEdit'>Level of Question = <output class='rangeValue' id='rangevalue'>"+questions.level+"</output></div></label><input type='range' id='level' min='1' max='10' value='" + questions.level +"' oninput='rangevalue.value=value' onchange='rangevalue.value=value' /><br><button form='" + id + "' class='delete'>Delete</button><button form='" + id + "' class='update'>Update</button></form><hr>");
                });
                $('.questionBox').on('click', '.update', function (e) {
                    e.preventDefault();
                    console.log("This Update",this);
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
    $(".all-question").css('display', 'block');
    $(".sidebar").css({
        display : "block",
        width: "55%",
        transitionDuration: "0.4s"
    });
    $(".overlay").css({
        display: "block",
        transitionDuration: "0.2s"
    });
    initialize();
}

// DOMContentLoaded
$(function(){

    console.log("I loaded in browser");
    var level = $("#level").val(1);
    console.log(level);
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