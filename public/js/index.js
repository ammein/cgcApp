$(function(){
    console.log("I loaded in browser");

    $(".textarea-box").one("click" , function(){
        $(".textarea-box").val("");
        $(".textarea-box").css({
            "color" : "#2e2e2e"
        });
    });

    $("form").on("submit" , function () {
        var question = $("questionForm" + [1]).val();
        console.log(question);
        var trueAnswer = $("trueAnswerBox").val();
        var falseAnswer = $("falseAnswerBox").val();
        alert('Question : ' + question + "\n True Asnwer :" + trueAnswer + "\n False Answers : " + falseAnswer);
    });

    $.ajax({
        method: "GET",
        url: '/api/question',
        contentType: 'application/json',
        data: $('#questionForm').serialize(),
        success: function (response) {
            var lastAddedResponse = response.question.length - 1;
            // alert('All data added : ' + JSON.stringify(response.question[lastAddedResponse], undefined, 2));
        }
    });
});