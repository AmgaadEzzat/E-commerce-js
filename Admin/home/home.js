
import { auth, signOut } from '../../Database/firebase-config.js';

var items = document.querySelectorAll('.manage-item');

items.forEach(function (item, index) {
    item.addEventListener('click', function () {
        if (index === 0) {
            window.location.href = '../banners/banners.html';
        }
        if (index === 1) {
            window.location.href = '../categories/category.html';
        }
        if (index === 2) {
            window.location.href = '../products/products.html';
        }
        if (index === 3) {
            window.location.href = '../order/order.html';
        }
        if (index === 4) {
            window.location.href = '../messages/message.html';
        }
    });
});

document.getElementById('logout').addEventListener('click', function () {
    signOut(auth).then(() => {
        localStorage.clear();
        window.location.href = '../../Common/Authentication/login.html';
    }).catch((error) => {
        alert('Error signing out: ', error);
    });
});