const userLoginTab = document.getElementById('userLogin-tab');
const userLoginPane = document.getElementById('userLogin-Pane');

const newUserTab = document.getElementById('newUser-tab');
const newUserPane = document.getElementById('newUser-Pane');

const myTab = document.getElementById('my-tab');
const myTabPane = document.getElementById('my-Pane')

const listViewTab = document.getElementById('listView-tab');
const listViewPane = document.getElementById('listView');

const detailViewTab = document.getElementById('detailView-tab');
const detailViewPane = document.getElementById('detailView');

// Tab effects on click
userLoginTab.addEventListener('click', function() {
    // userLoginTab_Remove();
    newUserTab_Remove();
    myTab_Remove();
    listViewTab_Remove();
    detailViewTab_Remove();
    
    userLoginTab.classList.add('active');
    userLoginPane.classList.add("show", "active");           
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
});

newUserTab.addEventListener('click', function() {
    userLoginTab_Remove();
    // newUserTab_Remove();
    myTab_Remove();
    listViewTab_Remove();
    detailViewTab_Remove();
    
    newUserTab.classList.add('active');
    newUserPane.classList.add("show","active");
    document.getElementById('new_username').value = "";
    document.getElementById('new_email').value = "";
    document.getElementById('new_password').value = "";
});

myTab.addEventListener('click', function() {
    userLoginTab_Remove();
    newUserTab_Remove();
    // myTab_Remove();
    listViewTab_Remove();
    detailViewTab_Remove();
    
    myTab.classList.add('active');
    myTabPane.classList.add("show","active");
});


listViewTab.addEventListener('click', function() {
    userLoginTab_Remove();
    newUserTab_Remove();
    myTab_Remove();
    // listViewTab_Remove();
    detailViewTab_Remove();

    listViewTab.classList.add('active');
    listViewPane.classList.add("show","active");
});

detailViewTab.addEventListener('click', function() {
    userLoginTab_Remove();
    newUserTab_Remove();
    myTab_Remove();
    listViewTab_Remove();
    // detailViewTab_Remove();

    detailViewTab.classList.add('active');
    detailViewPane.classList.add("show","active");
});


// Supporting functions for tab effects
function userLoginTab_Remove(){
    if (userLoginTab.classList.contains('active')){
        userLoginTab.classList.remove('active');
    }
    if (userLoginPane.classList.contains('active')){
        userLoginPane.classList.remove('active','show');
    }
}

function newUserTab_Remove(){
    if (newUserTab.classList.contains('active')){
        newUserTab.classList.remove('active');
    }
    if (newUserPane.classList.contains('active')){
        newUserPane.classList.remove('active','show');
    }
}

function myTab_Remove(){
    if (myTab.classList.contains('active')){
        myTab.classList.remove('active');
    }
    if (myTabPane.classList.contains('active')){
        myTabPane.classList.remove('active','show')
    }
}

function listViewTab_Remove(){
    if (listViewTab.classList.contains('active')){
        listViewTab.classList.remove('active');
    }
    if (listViewPane.classList.contains('active')){
        listViewPane.classList.remove('active','show');
    }
}

function detailViewTab_Remove(){
    if (detailViewTab.classList.contains('active')){
        detailViewTab.classList.remove('active');
    }
    if (detailViewPane.classList.contains('active')){
        detailViewPane.classList.remove('active','show');
    }
}


// Event functions used in other .js files
function switchToLogin() {
    userLoginTab.dispatchEvent(new Event('click'));
}

function switchToMyProfile() {
    myTab.dispatchEvent(new Event('click'));
}

function switchToQuestionsList() {
    listViewTab.dispatchEvent(new Event('click'));
}

function switchToAddQuestions() {
    detailViewTab.dispatchEvent(new Event('click'));
}

function displayUponLogin(){   
    userLoginTab.classList.add('disabled');
    userLoginTab.classList.remove('active');  
    newUserTab.classList.add('disabled');
    myTab.classList.remove('disabled');
    myTab.classList.add('active');
    listViewTab.classList.remove('disabled');
    detailViewTab.classList.remove('disabled');

    userLoginPane.classList.remove("show", "active");
    myTabPane.classList.add("show","active")

}