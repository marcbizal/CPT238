var ALPHABET_OFFSET = 65;
var ALPHABET_SIZE = 26;

function area(width, height) {
    return width * height;
}

var alphabet = new Array();
for (var i = 0; i < ALPHABET_SIZE; i++)
{
    alphabet.push(
        String.fromCharCode(ALPHABET_OFFSET + i)
    );
}

$(document).ready(function() {
    $("#letters").addClass("christmas");
    $("#calculation").addClass("easter");
});
