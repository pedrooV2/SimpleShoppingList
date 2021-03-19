var currentList = {};

function createShoppingList() {
    currentList.name = $("#shoppingListName").val();
    currentList.items = [];

    // Web Service Call
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'api/ShoppingListsEF',
        data: currentList,
        success: (result) => {
            currentList = result;
            showShoppingList();
            history.pushState({ id: result.id }, result.name, "?id=" + result.id)
        }
    });
}

function showShoppingList() {
    $("#shoppingListTitle").html(currentList.name);
    $("#shoppingListItems").empty();

    $("#createListDiv").hide();
    $("#shoppingListDiv").show();

    // Usability
    $("#newItemName").val("");
    $("#newItemName").focus();
    $("#newItemName").unbind("keyup");
    $("#newItemName").keyup((e) => {
        if (e.keyCode == 13) {
            addItem();
        }
    });
}

function addItem() {
    var newItem = {};
    newItem.name = $("#newItemName").val();
    newItem.shoppingListId = currentList.id;

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'api/ItemsEF/',
        data: newItem,
        success: (result) => {
            currentList = result;
            drawItems();
            $("#newItemName").val("");
        }
    });
}

function drawItems() {
    var $list = $("#shoppingListItems").empty();

    for (var i = 0; i < currentList.items.length; i++) {
        var currentItem = currentList.items[i];
        var $li = $("<li>").html(currentItem.name)
            .attr("id", "item_" + i);
        var deleteBtn = $("<button onclick='deleteItem(" + currentItem.id + ")'>D</button>").appendTo($li);
        var checkBtn = $("<button onclick='checkItem(" + currentItem.id + ")'>C</button>").appendTo($li);

        if (currentItem.checked) {
            $li.addClass("checked");
        }

        $li.appendTo($list);
    }
}

function deleteItem(itemId) {
    $.ajax({
        type: 'DELETE',
        dataType: 'json',
        url: 'api/itemsEF/' + itemId,
        success: (result) => {
            currentList = result;
            drawItems();
        } 
    });
}

function checkItem(itemId) {
    var changedItem = {};

    for (let i = 0; i < currentList.items.length; i++) {
        if (currentList.items[i].id == itemId) {
            changedItem = currentList.items[i];
        }
    }

    changedItem.checked = !changedItem.checked;

    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: 'api/ItemsEF/' + itemId,
        data: changedItem,
        success: (result) => {
            changedItem = result;
            drawItems();
        }
    });
}

function getShoppingListById(id) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'api/ShoppingListsEF/' + id,
        success: (result) => {
            currentList = result;
            showShoppingList();
            drawItems();
        }

    });
}

function hideShoppingList() {
    // Focus and Enter button (Usability)
    $("#createListDiv").show();
    $("#shoppingListDiv").hide();

    $("#shoppingListName").val("");
    $("#shoppingListName").focus();
    $("#shoppingListName").unbind("keyup");
    $("#shoppingListName").keyup((e) => {
        if (e.keyCode == 13) {
            createShoppingList();
        }
    });
}

$(document).ready(() => {

    hideShoppingList();

    var pageUrl = window.location.href;
    var idIndex = pageUrl.indexOf("?id=");
    if (idIndex != -1) {
        getShoppingListById(pageUrl.substring(idIndex + 4));
    }

    window.onpopstate = (event) => {
        if (event.state == null) {
            // hide shopping list
            hideShoppingList();
        } else {
            getShoppingListById(event.state.id);
        }
    };
});
