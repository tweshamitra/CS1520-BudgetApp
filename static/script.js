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
    console.log(responseText);
    var br = document.createElement('br');
    // console.log("repopulating");
    var data = JSON.parse(responseText);
    // console.log(data);
    var table = document.getElementById("budgetTable");
    var newRow, newCell, c, category, newButton;

    while(table.rows.length >0){
        table.deleteRow(0);
    }

    for (c in data){
        newRow = table.insertRow();    
        addCell(newRow, data[c].name);
        addCell(newRow, "$" + data[c].remaining + "/" + "$"+ data[c].budget);
        // if(data[c].budget < data[c].remaining)
        newCell = newRow.insertCell();
        newButton = document.createElement("input");
        newButton.type = "button";
        newButton.value = "Delete " + data[c].name;
        (function(_c){ 
            repop =1;
            newButton.addEventListener("click", function() { deleteCategory(_c); 
            }); 
        })(c);
        newCell.appendChild(newButton);
    }
    timeoutId = window.setTimeout(poller, timeout);
}
function addCell(row, text){
    var newCell = row.insertCell();
    var newText;
    newText = document.createTextNode(text);
    newCell.appendChild(newText);
    
}
function poller(){
    makeRequest("GET", '/cats', 200, repopulate);
    makeRequest("GET", '/purchases/',200, log);
}
function log(responseText){
    var data = JSON.parse(responseText);
}
function addCategory(){
    var newCat = document.getElementById("newCategory").value;
    var newCatBudget = document.getElementById("newCategoryBudget").value;
    var data = "name=" + newCat + "&budget=" + newCatBudget  + "&remaining=" + newCatBudget;
    window.clearTimeout(timeoutId);
    makeRequest("POST", "/cats", 201, poller, data);
    document.getElementById("newCategory").value = " ";
    document.getElementById("newCategoryBudget").value = " ";
    
}
function addPurchase(){ 
    var newPurchaseName = document.getElementById("newPurchaseName").value;
    var newPurchaseAmount = document.getElementById("newPurchaseAmount").value;
    var category = document.getElementById("purchaseCat").value;
    if(category == ""){
        category = "uncategorized"
    }
    var datePurchased = document.getElementById("datePurchased").value;
    
    var data = "category=" + category + "&name=" + newPurchaseName + "&spent=" + newPurchaseAmount + "&date=" + datePurchased;

    makeRequest("POST", "/purchases/", 201, poller, data); 
    document.getElementById("purchaseCat").value = " ";
    document.getElementById("newPurchaseName").value = " ";
    document.getElementById("newPurchaseAmount").value = " ";
}

function deleteCategory(category_id){
  
    makeRequest("DELETE", '/cats/' + category_id, 204, poller);
    
}
window.addEventListener("load", setup, true);