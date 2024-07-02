import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, doc, setDoc } from '../../Database/firebase-config.js';

function signUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var name = document.getElementById('name').value;
    var createAccountButton = document.querySelector('.auth-button');
    var loader = document.querySelector('.loading-indicator');
    createAccountButton.style.display = 'none';
    loader.style.display = 'block';
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('email', email);
            localStorage.setItem('id', user.uid);
            setDoc(doc(db, "users", user.uid), {
                email: email,
                password: password,
                name: name,
                id: user.uid
            }).then(() => {
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
                createAccountButton.style.display = 'block';
                loader.style.display = 'none';
                window.location.href = '../../User/home/index.html';
            });
        })
        .catch((error) => {
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            alert(error.message);
            createAccountButton.style.display = 'block';
            loader.style.display = 'none';
        });
}

function logIn() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var createAccountButton = document.querySelector('.auth-button');
    var loader = document.querySelector('.loading-indicator');
    createAccountButton.style.display = 'none';
    loader.style.display = 'block';
    document.querySelector('.loading-indicator').style.top = '35%';
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('email', email);
            localStorage.setItem('id', user.uid);
            createAccountButton.style.display = 'block';
            loader.style.display = 'none';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            if (email === 'admin@yahoo.com') {
            //if (email === "admin@admin.com") {
                window.location.href = '../../Admin/home/home.html';
            } else {
                window.location.href = '../../User/home/index.html';
            }
        })
        .catch((error) => {
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            alert(error.message);
            createAccountButton.style.display = 'block';
            loader.style.display = 'none';
        });
}

function checkValidation(type) {
    let isValid = true;
    let name;
    let nameRegex = /^[a-zA-Z\s'-]+$/;
    let email = document.getElementById('email').value;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let password = document.getElementById('password').value;
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (type !== 'login') {
        name = document.getElementById('name').value;
    }
    if (!nameRegex.test(name) && type !== 'login') {
        isValid = false;
    }
    if (!emailRegex.test(email)) {
        isValid = false;
        alert('Invalid email format. Please enter a valid email address in the format: example@domain.com');
    }
    if (!passwordRegex.test(password)) {
        isValid = false;
        alert('Invalid password format. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
    }
    if (isValid) {
        type === 'login' ? logIn() : signUp();
    }
}


window.onload = () => {
    localStorage.clear();
    const savedEmail = localStorage.getItem('email');
    if (savedEmail && savedEmail == 'admin@yahoo.com') {
        window.location.href = '../../Admin/home/home.html';
    } else if (savedEmail && savedEmail != 'admin@yahoo.com') {
        window.location.href = '../../User/home/index.html';
    }
}

function onLoadPage() {
    var list = window.location.href.split('/');
    if (list[list.length - 1] === 'register.html') {
        document.getElementById('myForm').addEventListener('submit', function (event) {
            event.preventDefault();
            checkValidation('signup');
        });
    }
    if (list[list.length - 1] === 'login.html') {
        document.getElementById('myForm').addEventListener('submit', function (event) {
            event.preventDefault();
            logIn();
            //checkValidation('login');
        });
    }
}

onLoadPage();


// make cookies
// check validation for login is need or not
// action in form not play