var timeoutID;
var timeout = 10000;

function setup() {
    document.getElementById("catButton").addEventListener("click", addCategory, true);
    document.getElementById("purchaseButton").addEventListener("click", addPurchase,true);
    poller();
}

function makeRequest(method, target, retCode, action, data){
    var httpRequest = new XMLHttpRequest();

    if(!httpRequest){
        alert("Giving up");
        return false;
    }

    httpRequest.onreadystatechange = makeHandler(httpRequest, retCode, action);
    httpRequest.open(method, target);
    console.log("made request");
    if(data){
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(data);
    } else{
        httpRequest.send();
    }
}

function makeHandler(httpRequest, retCode, action){
    function handler(){
        if(httpRequest.readyState === XMLHttpRequest.DONE){
            if(httpRequest.status === retCode){
                console.log(httpRequest.responseText);
                action(httpRequest.responseText);
            } else {
                alert("there was a problem with the request");
            }
        }
    }
    
    return handler;

}

function repopulate(responseText){
    var categories = JSON.parse(responseText);
    
    console.log(responseText);
    var list = document.getElementById("categories");
    var newCat, newButton;

    timeoutId = window.setTimeout(poller, timeout);
}

function poller(){
    makeRequest("GET", '/cats', 200, repopulate);
    makeRequest("GET", '/purchases',200,repopulate);
}

function addCategory(){
    var newCat = document.getElementById("newCategory").value;
    console.log(newCat);
    var data;
    data = 'name=' + newCat;
    window.clearTimeout(timeoutId);
    makeRequest("POST", "/cats", 201, poller, data);
}

function addListItem(){

}
function addPurchase(){ 
    var newPurchaseName = document.getElementById("newPurchaseName").value;
    var newPurchaseAmount = document.getElementById("newPurchaseAmount").value;
    console.log(newPurchaseName);
    console.log(newPurchaseAmount);
    makeRequest("POST", "/purchases", 201, poller, data);
    
}

function deleteCategory(categoryName){
  makeRequest("DELETE", '/cats/' + categoryName, 204, poller);
    
}
window.addEventListener("load", setup, true);