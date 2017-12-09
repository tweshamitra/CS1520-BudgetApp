var timeoutID;
var timeout = 10000;
var showBudget;
function setup() {
    document.getElementById("catButton").addEventListener("click", addCategory, true);
    document.getElementById("purchaseButton").addEventListener("click", addPurchase,true);
    showBudget = 1;
    
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
    var budgetMsgArea = document.getElementById("budget-info");
    var br = document.createElement('br');
    var data = JSON.parse(responseText);
    var table = document.getElementById("budgetTable");
    var totalBudget= 0;
    var newRow, newCell, c, category, newButton, errorArea, errorText, red;
    while(table.rows.length >0){
        table.deleteRow(0);
    }
    for (c in data){
        totalBudget += data[c].budget;
        newRow = table.insertRow();    
        addCell(newRow, data[c].name);
        addCell(newRow, "$" + data[c].remaining + "/" + "$"+ data[c].budget);
        
        newCell = newRow.insertCell();
        newButton = document.createElement("input");
        newButton.type = "button";
        newButton.value = "Delete " + data[c].name;
        if(data[c].remaining < 0){
            red = 0-data[c].remaining;
            addCell(newRow,red + " over the budget for " + data[c].name);
        }
        
        (function(_c){ 
            repop =1;
            newButton.addEventListener("click", function() { deleteCategory(_c); 
            }); 
        })(c);
        
      
        newCell.appendChild(newButton);
    }
    if(showBudget == 1){
        var monthly_budget = document.getElementById("monthly-budget");
        var budget_header = document.createElement('h2');
        var budget_text = document.createTextNode("Your budget for this month is: $" + totalBudget);
        budget_header.appendChild(budget_text);
        monthly_budget.appendChild(budget_header);
        showBudget = 0;
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
    var datePurchased = document.getElementById("datePurchased").value;
    if(category == ""){
        category = "Uncategorized";
    }
    var data = "category=" + category + "&name=" + newPurchaseName + "&spent=" + newPurchaseAmount + "&date=" + datePurchased;
    window.clearTimeout(timeoutId);
    makeRequest("POST", "/purchases/", 201, poller, data); 
    document.getElementById("purchaseCat").value = "";
    document.getElementById("newPurchaseName").value = "";
    document.getElementById("newPurchaseAmount").value = "";
}

function deleteCategory(category_id){
  
    makeRequest("DELETE", '/cats/' + category_id, 204, poller);
    
}
window.addEventListener("load", setup, true);