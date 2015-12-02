var redirectPaused = false;

function countDownToRedirect(redirectTime)
{
    if (!redirectPaused) {
        if (redirectTime == 0) {
            $("#message").html("Redirecting...");
            //setTimeout(function() { window.location.replace("http://marcbizal.com/"); }, 1000);
        } else {
            $("#remaining").html(redirectTime);
            redirectTime--;
        }
    }

    setTimeout(countDownToRedirect, 1000, redirectTime);
}

function hideWindow() {
    $("#bubble").fadeIn();
    $("#window").slideUp("slow", function() {
        $(".pen").each(function() {
            $(this).css({opacity : "0", height : "0"});
        });
    });
    redirectPaused = false;
}

function showWindow() {
    $("#bubble").fadeOut();
    $("#window").slideDown("slow", function() {
        $(".pen").each(function(i) {
            var _this = this;
            setTimeout(function() { $(_this).animate({opacity : "1", height : "225"}, {duration: 1000, easing: "swing"}); }, i * 333);
        });
    });
    redirectPaused = true;
}

function rssCallback(data) {
    console.log(data);
}

function populateFromCodepen()
{
    $.getJSON("http://cpv2api.com/pens/popular/marcbizal", function(resp){
    	if(resp.success){
    		var pens = resp.data;
            for (var i = 0; i < pens.length; i++)
            {
                $(
                "<div class=\"pen\">" +
                "<div class=\"pen-info\">" +
                "<a href=\"" + pens[i].link + "\">" + pens[i].title + "</a><br>" +
                (pens[i].loves ? "<i class=\"fa fa-heart\"></i> " + pens[i].loves : "") + "&nbsp;<i class=\"fa fa-eye\"></i> " + pens[i].views +
                "</div>" +
                "</div>")
                .css("background-image", "url(" + pens[i].images.small + ")")
                .appendTo($("#codepen"));
            }
            $("#bubble").fadeIn(2000);
    	} else {
            console.error(resp.error);
    	}
    });
}

$(document).ready(function() {
    hideWindow();
    countDownToRedirect(30);
    populateFromCodepen();
});
