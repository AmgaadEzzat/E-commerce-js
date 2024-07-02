import { db, collection, addDoc, getDoc, updateDoc, doc } from '../../Database/firebase-config.js';

var paypalRadio = document.getElementById("paypal");
var closePaypal = document.getElementById("closePaypal");
var closeVisa = document.getElementById("closeVisa");
var submitPaypal = document.getElementById("submitPaypal");
var submitVisa = document.getElementById("submitVisa");
var visaRadio = document.getElementById("visa");
var name = document.getElementById('full-name');
var address = document.getElementById('address');
var phone = document.getElementById('phone-number');
var paypalEmail = document.getElementById('paypal-email');
var cardNumber = document.getElementById('card-number');
var date = document.getElementById('expiry-date');
var cvv = document.getElementById('cvv');
const savedID = localStorage.getItem('id');
const queryString = window.location.search;
const UrlParams = new URLSearchParams(queryString);
const ReqorderIds = UrlParams.get("orderIds");
const Reqtotal = UrlParams.get("total");
const total = document.getElementById("total");

window.onload = () => {
    total.innerText = Reqtotal;
}
paypalRadio.onclick = function () {
    document.getElementById("paypalForm").style.display = "block";
}
closePaypal.onclick = function () {
    document.getElementById("paypalForm").style.display = "none";
}
visaRadio.onclick = function () {
    document.getElementById("visaForm").style.display = "block";
}
closeVisa.onclick = function () {
    document.getElementById("visaForm").style.display = "none";
}

function checkValidation(type) {
    name = document.getElementById('full-name');
    address = document.getElementById('address');
    phone = document.getElementById('phone-number');
    paypalEmail = document.getElementById('paypal-email');
    let isValid = true;
    let fullNamePattern = /^[A-Z][a-z]+\s[A-Z][a-z]+$/;
    let addressPattern = /^[a-zA-Z0-9\s,.'-]{3,}$/;
    let egyptPhonePattern = /^01[0125][0-9]{8}$/;
    let emailPaypalPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let visaCardPattern = /^4[0-9]{12}(?:[0-9]{3})?(?:[0-9]{3})?$/;
    let cvvPattern = /^[0-9]{3}$/;
    let expiryDatePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!fullNamePattern.test(name.value)) {
        isValid = false;
        alert("Invalid full name. Please enter a valid full name with at least two parts, consisting of alphabetic characters only, separated by spaces.");
    }
    if (!egyptPhonePattern.test(phone.value)) {
        isValid = false;
        alert("Invalid phone number. Please enter a valid Egyptian phone number. Examples: (02) 12345678, 01012345678.");
    }
    if (!addressPattern.test(address.value)) {
        isValid = false;
        alert("Invalid address. Please enter a valid address with at least 3 characters, including numbers and letters (123 Main St.).");
    }
    if (type === 'paypal' && !emailPaypalPattern.test(paypalEmail.value)) {
        isValid = false;
        alert("Invalid email address. Please enter a valid PayPal email address.");
    }
    if (type === 'visa' && !visaCardPattern.test(cardNumber.value)) {
        isValid = false;
        alert("Invalid Visa card number. Please enter a valid 13 to 19-digit Visa card number starting with 4.");
    }
    if (type === 'visa' && !expiryDatePattern.test(date.value)) {
        isValid = false;
        console.log(date.value);
        alert("Invalid expiration date. Please enter a valid expiration date in MM/YY format.");
    }
    if (type === 'visa' && !cvvPattern.test(cvv.value)) {
        isValid = false;
        alert("Invalid CVV. Please enter a valid 3-digit CVV.");
    }
    if (isValid) {
        SetBillingData();
        UpdateStatus();
    }
}

submitPaypal.addEventListener('click', function () {
    checkValidation('paypal');
});
submitVisa.addEventListener('click', function () {
    checkValidation('visa');
});

let OrderIds = [];
if (ReqorderIds) {
    if (ReqorderIds.includes(","))
        for (let i = 0; i < ReqorderIds.split(",").length; i++) {
            OrderIds.push(ReqorderIds.split(",")[i])
        } else {
        OrderIds.push(ReqorderIds)
    }
}


async function SetBillingData() {
    if (paypalRadio.checked) {
        const docRef = collection(db, "billing");
        addDoc(
            docRef, {
            UserID: savedID,
            OrderIds: OrderIds,
            PaypalEmail: paypalEmail.value,
            CardNumber: "",
            ExpiryDate: "",
            Cvv: ""
        }).then(() => {
            paypalEmail.value = "";
            cardNumber.value = "";
            date.value = "";
            cvv.value = "";
        }).catch((error) => { alert(`Error${error}`) });
    } else if (visaRadio.checked) {
        await addDoc(
            collection(db, "billing"), {
            UserID: savedID,
            OrderIds: OrderIds,
            PaypalEmail: "",
            CardNumber: cardNumber.value,
            ExpiryDate: date.value,
            Cvv: cvv.value
        }).then(() => {
            paypalEmail.value = "";
            cardNumber.value = "";
            date.value = "";
            cvv.value = "";
        }
        ).catch((error) => { alert(`Error${error}`) });
    }
}

async function UpdateStatus() {
    for (let i = 0; i < OrderIds.length; i++) {
        const orderRef = doc(db, "orders", OrderIds[i])
        await updateDoc(orderRef, {
            status: "completed"
        });
        const document = await getDoc(orderRef);
        var allProductsID = document.data()['products'];
        var allQuantity = document.data()['quantity'];
        for (let x = 0; x < allProductsID.length; x++) {
            const product = doc(db, "products", allProductsID[x])
            const productData = await getDoc(product);
            let num1 = Number(productData.data()['quantity']);
            let num2 = Number(allQuantity[x]);
            let num3 = Number(productData.data()['remainingQuantity']);
            var updatedQuantity = num1 - num2;
            var updateRemaining = Number(num3) + Number(allQuantity[x]);
            await updateDoc(product, {
                quantity: updatedQuantity.toString(),
                remainingQuantity: Number(updateRemaining)
            });
        }
        if (i == OrderIds.length - 1) {
            window.location.href = "../../User/billing/billing.html?orderIds=" + ReqorderIds;
        }
    }
}