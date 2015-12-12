
var formError = "Please edit the marked fields below to fix errors!<br>";
var hints = {
    "state" : "Use a two letter abbreviation",
    "zip" : "Use a 5 digit Zip Code",
    "phone" : "Numbers Only – No Spaces or Dashes",
    "email" : "Example – john@doe.com",
    "card_number" : "Numbers Only – No Spaces or Dashes"
};

var nameRegex = /^\S[A-Z ]{2,20}$/i;
var addressRegex = /^[0-9A-Z. ]{2,20}$/i;
var stateRegex = /^[A-Z]{2}$/i; // This could be improved by limiting it to a list of all 50 state abbreviations. [SC|MN|FL|...]
var zipRegex = /^[0-9]{5}$/;
var phoneRegex = /^[0-9]{10}$/;
var emailRegex = /^[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z0-9.-]+$/i;
var cardNumberRegex = /^[0-9]{13,16}$/;

var validators = [
    {
        "appliesTo" : ["first_name", "last_name", "city"],
        "error" : "Required: Must contain only letters and spaces between 2 and 20 characters!",
        "validate" : nameRegex,
        "required" : true
    },
    {
        "appliesTo" : ["address1"],
        "error" : "Required: Must contain only letters and spaces between 2 and 20 characters!",
        "validate" : addressRegex,
        "required" : true
    },
    {
        "appliesTo" : ["address2"],
        "error" : "Must contain only letters, numbers and spaces between 2 and 20 characters!",
        "validate" : addressRegex,
        "required" : false,
        "dependsOn" : "address1"
    },
    {
        "appliesTo" : ["state"],
        "error" : "Required: Must contain a two-letter State abbreviation!",
        "validate" : stateRegex,
        "required" : true
    },
    {
        "appliesTo" : ["zip"],
        "error" : "Required: Must contain a 5 number Zip Code!",
        "validate" : zipRegex,
        "required" : true
    },
    {
        "appliesTo" : ["phone"],
        "error" : "Must contain a 10 digit number with no spaces or dashes!",
        "validate" : phoneRegex,
        "required" : false
    },
    {
        "appliesTo" : ["email"],
        "error" : "Required: Must be a valid e-mail address!",
        "validate" : emailRegex,
        "required" : true
    },
    {
        "appliesTo" : ["credit_card"],
        "error" : "Please select a payment method!<br>",
        "validate" : stringIsNotNullOrEmpty,
        "required" : true
    },
    {
        "appliesTo" : ["card_number"],
        "error" : "Must contain a 13- 16 digit number with no spaces or dashes!",
        "validate" : cardNumberRegex,
        "required" : true, // Required only if dependency is not null or empty
        "dependsOn" : "credit_card"
    },
    {
        "appliesTo" : ["expiration_month", "expiration_year"],
        "error" : "Must select a Month and Year!",
        "validate" : stringIsNotNullOrEmpty,
        "required" : true,
        "dependsOn" : "credit_card"
    }
];

function stringIsNullOrEmpty(str)
{
    return (str == null || str.trim() == "");
}

function stringIsNotNullOrEmpty(str)
{
    return !stringIsNullOrEmpty(str);
}

var validCache = new Array();
var formData = {};

function clearCache()
{
    validCache = new Array();
}

function cacheValid(formName)
{
    validCache.push(formName);
}

function uncacheValid(formName)
{
    var index = validCache.indexOf(formName);
    if (index > -1) {
        validCache.splice(index, 1);
    }
}

function getValidator(formName)
{
    for (var validator of validators) {
        if (validator.hasOwnProperty("appliesTo") && $.inArray(formName, validator.appliesTo) > -1)
        {
            return validator;
        }
    }

    return null;
}

function isValid(formName, validator)
{
    if ($.inArray(formName, validCache) > -1) return true;

    var formValue = formData[formName];
        validator = validator || getValidator(formName);

    if (typeof formValue === "undefined") return true;

    if (!validator) {
        console.log("Didn't find validator for field: " + formName + "!");
        return true;
    }
    var dependencyMet = (validator.hasOwnProperty("dependsOn") ? !stringIsNullOrEmpty(formData[validator.dependsOn]) : true);

    if (validator.hasOwnProperty("required") && validator.required == false) {
        return true;
    } else if (stringIsNullOrEmpty(formValue) && !dependencyMet) {
        return true;
    } else if (!stringIsNullOrEmpty(formValue) && !dependencyMet) {
        var dependencyValidator = getValidator(validator.dependsOn);
        setError(validator.dependsOn, dependencyValidator.hasOwnProperty("error") ? dependencyValidator.error : "Please enter a valid value.<br>");
    }

    if (validator.hasOwnProperty("validate")) {
        var result = dependencyMet;

        if (validator.validate instanceof RegExp) {
            result = result && validator.validate.test(formValue);
        } else if (validator.validate instanceof Function) {
            result = result && validator.validate(formValue);
        } else {
            console.log("Property 'validate' in validator for required field ('" + formName + "') must be of type 'RegExp' or 'Function'!");
            return false;
        }

        return result;
    } else {
        console.log("Must supply 'validate' property in validator for required field ('" + formName + "').");
        return false;
    }
}

function getFormData(query) {
    var out = {};
    var formData = $(query).serializeArray();

    for (var i = 0; i < formData.length; i++) {
        var record = formData[i];
        out[record.name] = record.value;
    }

    return out;
}

function clearHints()
{
    $(".hint").html("").hide().removeClass("error");
}

function setError(formName, error)
{
    var elem = $("." + formName + "_hint");
    elem.addClass("error");
    if (error != "") {
        elem.html(error).show();
    } else {
        elem.html(error).hide();
    }
}

function setHint(formName, hint)
{
    var elem = $("." + formName + "_hint");
    elem.removeClass("error");
    if (hint != "") {
        elem.html(hint).show();
    } else {
        elem.html(hint).hide();
    }
}

function clearHint(formName)
{
    setHint(formName, "");
}

$(document).ready(function() {
    clearHints();

    $("input").focusin(function() {
        var name = $(this).attr("name");
        setHint(name, hints.hasOwnProperty(name) ? hints[name] : "");
    });

    $("input").focusout(function() {
        var name = $(this).attr("name");
        var validator = getValidator(name);
        if (isValid(name, validator)) {
            clearHint(name)
            cacheValid(name);
        } else {
            setError(name, validator && validator.hasOwnProperty("error") ? validator.error : "Error: Please see the developer log.<br>");
        }
    });

    $("input").change(function() {
        var name = $(this).attr("name");
        var value = $(this).val();
        formData[name] = value;
        uncacheValid(name);
    });

    $("form").submit(function() {
        var submit = true;

        clearCache();
        clearHints();
        formData = getFormData("#custForm");
        console.dir(formData);
        for (var record in formData) {
            if (formData.hasOwnProperty(record)) {
                var validator = getValidator(record);
                if (isValid(record, validator)) {
                    cacheValid(record);
                } else {
                    setError(record, validator && validator.hasOwnProperty("error") ? validator.error : "Error: Please see the developer log.<br>");
                    submit = false;
                }
            }
        }

        $(".form_hint").html(formError);
        return submit;
    });
});
