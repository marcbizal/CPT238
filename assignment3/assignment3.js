$(document).ready(function() {
    "use strict";

    $("#format-table-btn").on("click", function() {
        $("tbody > tr:first-child").addClass("header");
        $("tbody > tr:not(:first-child)").filter(":odd").addClass("altrow");
    });

    $("#add-image-btn").on("click", function() {
        var img_width;
        $("<img>", {src: "jquery_cover.jpg"})
            .appendTo($("#myImage"))
            .load(function() { img_width = this.width; })
            .hover( function() { $(this).animate({width: img_width*2 + "px"}, 500); },
                    function() { $(this).animate({width: img_width + "px"}, 500); });
    });

    $("#add-borders-btn").on("click", function() {
        $("div").addClass("enclose");
    });
});
