$(function(){
    console.log("I loaded in browser");

    $(".textarea-box").one("click" , function(){
        $(".textarea-box").val("");
        $(".textarea-box").css({
            "color" : "#2e2e2e"
        });
    });

    $("form").on("submit" , function(){
        $(this).serialize();
    });
});