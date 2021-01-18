var listRoot = document.getElementById("master");
var instructions = document.getElementById("msg-empty-list");
var items = [];

var addBackground = document.getElementById("add-dialog-bg");
var addDialog = document.getElementById("add-dialog");

var settingsBackground = document.getElementById("settings-dialog-bg");
var settingsDialog = document.getElementById("settings-dialog");

class Item
{
    constructor(name, checked, index)
    {
        this.name = name;
        this.checked = checked;
        this.index = index;
    }
}

if(document.cookie.length > 0)
{
    if(JSON.parse(readCookie("items")) != null)
    {
        items = JSON.parse(readCookie("items"));
    
        if(items != null && items.length > 0)
        {
            for(let i = 0; i < items.length; i++)
            {
                insertElement(items[i].name, items[i].checked, items[i].index);
            }
        }
    }
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
}

function checkItemCount()
{
    if(items != null && items.length > 0)
    {
        instructions.style.display = "none";
    }

    else
    {
        instructions.style.display = "block";
    }
}

function toggleAddItem()
{
    if(addBackground.style.display === "block")
    {
        addBackground.style.display = "none";
        addDialog.style.display = "none";        
    }

    else 
    {
        addBackground.style.display = "block";
        addDialog.style.display = "block";        
    }
}

function toggleSettings()
{
    applyTheme(false);

    if(settingsBackground.style.display === "block")
    {
        settingsBackground.style.display = "none";
        settingsDialog.style.display = "none";        
    }

    else 
    {
        settingsBackground.style.display = "block";
        settingsDialog.style.display = "block";        
    }
}

function saveData()
{
    //Fix any inconsistencies with indexes
    for(let i = 0; i < items.length; i++)
    {
        items[i].index = i;
    }

    //Store the list of items in a cookie, in JSON format
    var now = new Date();
    var time = now.getTime();
    var expiration = time + 172800 * 1000; //Set cookie expiration time to 2 days from now
    now.setTime(expiration);

    document.cookie = "items=" + JSON.stringify(items) + "; expires=" + now.toUTCString() + "; path=/";
}

function updateChecked(childElement)
{
    var itemName = childElement.parentElement.parentElement.children[0].innerHTML;
    var itemIndex = childElement.parentElement.parentElement.children[0].getAttribute("data-index");    

    for(let i = 0; i < items.length; i++)
    {
        if(items[i].index == itemIndex && items[i].name === itemName)
        {
            items[i].checked = childElement.checked;
            saveData();
            break;
        }
    }
}

function applyTheme(applyStylesheet = true)
{
    var darkmodeToggle = document.getElementById("darkmode-toggle");

    if(readCookie("darkmode") === "true") 
    {  
        if(applyStylesheet)
        {
            document.getElementById("theme").setAttribute("href", "dark-theme.css");
        }

        darkmodeToggle.checked = true;
    }

    else 
    {
        if(applyStylesheet)
        {
            document.getElementById("theme").setAttribute("href", "light-theme.css");
        }
        darkmodeToggle.checked = false;
    }
}

function setDarkmode()
{    
    var value = document.getElementById("darkmode-toggle").checked;

    //Set expiration time
    var now = new Date();
    var time = now.getTime();
    var expiration = time + 28 * 24 * 3600 * 1000; //Set the expiration time to four weeks from now
    now.setTime(expiration);

    //Save darkmode preference
    document.cookie = "darkmode=" + value + "; expires=" + now.toUTCString() + "; path=/";

    applyTheme();
    toggleSettings();
}

function insertElement(name, checked, index)
{
    var checkedAttribute = "checked";
    if(!checked) { checkedAttribute = ""; }

    var newElement = document.createElement("div");
    newElement.className = "list-element";
    newElement.innerHTML = '<p class="list-text" data-index="' + index + '" >' + name + '</p> <p class="remove-btn" onclick="removeElement(this);">&minus;</p> <label class="switch"><input type="checkbox" onclick="updateChecked(this)" ' + checkedAttribute + '><span class="slider round"></span></label>';
    listRoot.appendChild(newElement);
}

function addElement()
{
    var inputField = document.getElementById("input-name");
    var elementName = inputField.value;

    if(elementName.length > 0)
    {
        //Shorten the display name if it's longer than 20 characters
        if(elementName.length > 20)
        {
            var newElementName = "";
            for(let i = 0; i < 17; i++) 
            {
                newElementName += elementName[i];
            }

            //Manually add ellipsis
            newElementName += "...";
            elementName = newElementName;
        }

        insertElement(elementName, false, items.length);

        items.push(new Item(elementName, false, items.length));
        checkItemCount();
        saveData();

        //Reset the input field
        inputField.value = "";
        toggleAddItem();

    }
}

function removeElement(childElement)
{    
    //Find the name of the element that we want to remove
    var itemName = childElement.parentElement.children[0].innerHTML;

    var itemIndex = childElement.parentElement.children[0].getAttribute("data-index");    

    //Iterate items and remove with the correct index
    for(let i = 0; i < items.length; i++)
    {        
        if(items[i].index == itemIndex && items[i].name === itemName)
        {
            items.splice(i, 1); //Remove the item from the list
            break;
        }
    }

    saveData();
    checkItemCount();

    listRoot.removeChild(childElement.parentElement);
}

//Call checkItemCount on startup in case there are any items stored in a cookie
checkItemCount();
applyTheme();