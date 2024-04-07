var accessToken = "";

document.getElementById('login-form').addEventListener('submit', userLogin);
document.getElementById('new_user-form').addEventListener('submit', userCreate);

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
        } else {
            alert('login failed');
        }
    } catch (error) {
        console.error('Error logging in: ', error);
        alert('An error occurred while logging in. Please try again.');
    }
}

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