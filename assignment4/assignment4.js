$(document).ready(function() {
    "use strict";

    $("#area1").offset({ top: "200", left: "200" });
    $("#area2").offset({ top: "220", left: "350" });
    $("#area3").offset({ top: "300", left: "300" });
    $("#area4").offset({ top: "300", left: "720" });
    $("#area5").offset({ top: "325", left: "720" });
    $("#area6").offset({ top: "450", left: "720" });

    $("button").css({ "color": "white", "font-size": "16px", "background-color": "blue "});

    var target = $("#area3");

    $("#moveUp").on("click", function() {
        target.scrollTop(target.scrollTop() - 50);
    });

    $("#moveDown").on("click", function() {
        target.scrollTop(target.scrollTop() + 50);
    });

    $("#changeText").on("click", function() {
        if ($(this).text() == "Larger Text")
        {
            $(this).text("Smaller Text");
        }
        else {
            $(this).text("Larger Text");
        }

        target.toggleClass("newFont");
    });
});
