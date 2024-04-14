var accessToken = "";

//window.getUserProfile = getUserProfile;

document.getElementById('login-form').addEventListener('submit', userLogin);
document.getElementById('new_user-form').addEventListener('submit', userCreate);
document.getElementById('deleteAccount').addEventListener('click', deleteUserAccount);
document.getElementById('logout').addEventListener('click', logout);

async function userLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    var data = {
        email: username,
        password: password
    }

    try {
        const response = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok){
            const responseData = await response.json();
            accessToken = responseData.accessToken;
            alert('login successful');
            displayUponLogin();
            getUserProfile(username,accessToken);
        } else {
            alert('login failed');
        }
    } catch (error) {
        console.error('Error logging in: ', error);
        alert('An error occurred while logging in. Please try again.');
    }

    //return data;
}

//module.exports = { userLogin, data };

async function userCreate(event) {
    event.preventDefault();
    const username = document.getElementById('new_username').value.trim();
    const email = document.getElementById('new_email').value.trim();
    const password = document.getElementById('new_password').value.trim();
    var data = {
        username: username,
        email: email,
        password: password
    }
    console.log (data);
        
    try {
        const response = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok){
            alert('new user created')
            switchToLogin();
        } else {
            alert('user creation failed')
        }
        
    } catch (error) {
        console.error('Error logging in: ', error);
        alert('An error occurred while logging in. Please try again.');
    }
}


async function getUserProfile(email,accessToken){

    //const email = user.email; 
    console.log('email',email);
    console.log('accessToken',accessToken);

    var data = {
        email: email
    }
        
    try {
        const response = await fetch('http://localhost:3001/users/getUserByEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify(data)
        }).then(function(response) {
            return response.json();
          }).then(function(data) {
            if(data.error){
                alert("Couldn't retrieve profile");
            } else {
                console.log(data); 
                alert('user profile retrieved!')
                document.getElementById('userName').value = data?.userDetails?.email;
                document.getElementById('createAt').value = data?.userDetails?.createdAt;
            }
          });
    } catch (error) {
        console.error('Error fetching profile: ', error);
        // alert('An error occurred while loading profile. Please try again.');
    }
   //return data;

}


async function deleteUserAccount(event){
    console.log('handleDeleteUser',event);
    const email = document.getElementById('userName');
    const data = {
        email: email
    }
    try {
        const response = await fetch('http://localhost:3001/users/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify(data)
        }).then(function(response) {
            return response.json();
          }).then(function(data) {
            console.log(data);
            alert(data.message);
          });
    } catch (error) {
        console.error('Error fetching profile: ', error);
        // alert('An error occurred while loading profile. Please try again.');
    }
}

async function logout() {
    switchToLogin();
}