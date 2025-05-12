var jpdbBaseURL = "http://api.login2explore.com:5577";
var connToken = "90934678|-31949205401365309|90956092";

var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var projDBName = "COLLEGE-DB";
var projRelationName = "PROJECT-TABLE";

$("#projid").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getProjIdAsJsonObj() {
    var projid = $("#projid").val();
    var jsonStr = {
        id: projid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#projname").val(record.name);
    $("#assignedto").val(record.assignedTo);
    $("#assignmentdate").val(record.assignmentDate);
    $("#deadline").val(record.deadline);
}

function resetForm() {
    $("#projid").val("");
    $("#projname").val("");
    $("#assignedto").val("");
    $("#assignmentdate").val("");
    $("#deadline").val("");
    $("#projid").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#projid").focus();
}

function validateData() {
    var projid, projname, assignedto, assignmentdate, deadline;
    projid = $("#projid").val();
    projname = $("#projname").val();
    assignedto = $("#assignedto").val();
    assignmentdate = $("#assignmentdate").val();
    deadline = $("#deadline").val();

    if (projid === "") {
        alert("Project ID missing");
        $("#projid").focus();
        return "";
    }
    if (projname === "") {
        alert(" Project Name missing");
        $("#projname").focus();
        return "";
    }
    if (assignedto === "") {
        alert("Assigned To missing");
        $("#assignedto").focus();
        return "";
    }
    if (assignmentdate === "") {
        alert("Assignment Date missing");
        $("#assignmentdate").focus();
        return "";
    }
    if (deadline === "") {
        alert("Deadline missing");
        $("#deadline").focus();
        return "";
    }

    var jsonStrObj = {
        id: projid,
        name: projname,
        assignedTo: assignedto,
        assignmentDate: assignmentdate,
        deadline: deadline
    };
    return JSON.stringify(jsonStrObj);
}

function getProj() {
    var projIdJsonObj = getProjIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, projDBName, projRelationName, projIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#change").prop("disabled", true);
        $("#projname").focus();

    } else if (resJsonObj.status === 200) {
        $("#projid").prop("disabled", true);
        fillData(resJsonObj);

        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#save").prop("disabled", true);
        $("#projname").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, projDBName, projRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#projid").focus();
}

function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, projDBName, projRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#projid").focus();
}