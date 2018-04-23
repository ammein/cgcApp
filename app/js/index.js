$(function(){
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
        alert('Question : ' + question + "\n True Asnwer :" + trueAnswer + "\n False Answers : " + falseAnswer);
    });

    function getId(response , num){
        return console.log(response.question[num]._id);
    }

    $("#get").on("click",function(){
        // GET Questions
        $.ajax({
            method: "GET",
            url: '/api/question',
            contentType: 'application/json',
            success: function (response) {
                var getListBlock = $("#questionsBlock");
                // console.log("All responses",{response});
                response.question.forEach((questions) => {
                    var id = questions._id;
                    getListBlock.append("<form id='" + id + "' class='questionBox'><textarea class='list'>" + questions.questionString + "</textarea><input type='number' class='answer-box-edit' id='trueAnswerBox' value='" + questions.answers[0] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox' value='" + questions.answers[1] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox' value='" + questions.answers[2] + "'><input type='number' class='answer-box-edit' id='falseAnswerBox' value='" + questions.answers[3] + "'><br><button form='"+id+"' class='delete'>Delete</button><button form='"+id+"' class='update' onclick='update()'>Update</button></form><hr>");
                    // console.log("Id :", id);
                });
            }
        });
    });


    function update(){
        // DELETE Questions
        $('form').on('click', '.update', function (e) {
            e.preventDefault();
            var id = $("form.questionBox").attr('id');
            var questionString = $(".list").val();
            console.log(id);
            console.log("Update clicked");
            // $.ajax({
            //     method: "PUT",
            //     url: '/api/question',
            //     contentType: 'application/json',
            //     data: JSON.stringify({
            //         id,
            //         questionString
            //     }),
            //     success: function (response) {
            //         $("#get").click();
            //     }
            // });
        });
    }
});