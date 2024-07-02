import {
    getAuth, db, collection, setDoc, getDocs, doc, onAuthStateChanged,
    query, where, deleteDoc, signOut
} from '../../Database/firebase-config.js';

const auth = getAuth();
var uid;
var subTotal;
var total = 0;
LogeOutIcon.style.display = "none";
////// Get data from cart
onAuthStateChanged(auth, async (user) => {
    if (user) {
        uid = user.uid;
        const q = query(collection(db, "cart"), where("userId", "==", uid));
        const cartSnapshot = await getDocs(q);
        cartSnapshot.forEach(async (doc) => {
            const productId = doc.data().productId;
            const quantity = doc.data().quantity;
            var img;
            var price;
            var title;
            const collProducts = collection(db, "products");
            const products = await getDocs(collProducts);
            products.forEach((doc) => {
                if (doc.id == productId) {
                    img = doc.data().imageUrl;
                    price = doc.data().price;
                    title = doc.data().title;
                }
            });

            //Create td inside table
            var tbodyRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
            const emptyRow = tbodyRef.insertRow(0);
            emptyRow.classList.add("emptyRow");

            const tableRow = tbodyRef.insertRow(1);
            tableRow.classList.add("tableRow");
            tableRow.setAttribute("data-rowid", doc.id);

            const tableDataOfProductDetails = tableRow.insertCell(0);
            const tableDataOfProductPrice = tableRow.insertCell(1);
            const tableDataOfProductQuantity = tableRow.insertCell(2);
            const tableDataOfProductSubtotal = tableRow.insertCell(3);
            const checkBox = tableRow.insertCell(4);

            tableDataOfProductDetails.style.padding = "10px 30px"
            tableDataOfProductDetails.classList.add("widThirty");

            tableDataOfProductPrice.style.paddingLeft = "40px";
            tableDataOfProductPrice.classList.add("wid");

            tableDataOfProductQuantity.style.paddingLeft = "50px";
            tableDataOfProductQuantity.classList.add("wid");

            tableDataOfProductSubtotal.style.textAlign = "end";
            tableDataOfProductSubtotal.style.paddingRight = "60px";
            tableDataOfProductSubtotal.classList.add("widThirty");

            const productImg = document.createElement("img");
            productImg.style.width = "50px";
            productImg.style.height = "50px";
            productImg.src = img

            const productName = document.createElement("span");
            productName.style.paddingLeft = "10px"
            productName.append(title);

            tableDataOfProductDetails.appendChild(productImg);
            tableDataOfProductDetails.appendChild(productName);
            tableDataOfProductPrice.append(price);
            tableDataOfProductQuantity.append(quantity);
            tableDataOfProductSubtotal.append(price * quantity)
            subTotal = (price * quantity);
            total += subTotal;

            // Assum total value in cart
            document.getElementById("subtotal").textContent = `$${total}`
            document.getElementById("total").textContent = `$${total}`

            let inputCheck = document.createElement("INPUT");
            inputCheck.setAttribute("type", "checkbox");
            checkBox.appendChild(inputCheck);
            inputCheck.classList.add("row-checkbox");
        });
        // SingOut
        const LogeOutIcon = document.getElementById("LogeOutIcon");   
        LogeOutIcon.style.display = "inline-block";
        LogeOutIcon.addEventListener('click', function () {
            signOut(auth).then(() => {
                localStorage.clear();
                window.location.href = '../../Common/Authentication/login.html';
            }).catch((error) => {
                alert('Error signing out: ', error);
            });
        });
    }
});

const btnDelete = document.getElementById("btnDelete");
btnDelete.addEventListener("click", deleteProductFromCart);

function deleteProductFromCart() {
    const checkboxes = document.getElementsByClassName('row-checkbox');
    const selectedRows = [];
    // Iterate over the checkboxes and find the selected rows
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            const row = checkboxes[i].parentNode.parentNode;
            const rowId = row.dataset.rowid;
            selectedRows.push(rowId);
        }
    }
    // Delete the selected rows from Firestore
    for (let i = 0; i < selectedRows.length; i++) {
        const rowId = selectedRows[i];
        try {
            deleteDoc(doc(db, "cart", rowId)).then(() => {
                window.location.reload();
            });

        } catch (error) {
            alert(`Error deleting document with ID ${rowId}:`, error);
        }
    }

}

const btnCheckout = document.getElementById("btnCheckout");
btnCheckout.addEventListener("click", processCheckout);

async function processCheckout() {
    alert("Your order is in pending status");
    const q = query(collection(db, "cart"), where("userId", "==", uid));
    try {
        var allProducts = [];
        var allQuantities = [];
        var allCarts = [];
        const cartsSnapshot = await getDocs(q);
        const orderCollection = doc(collection(db, "orders"));
        cartsSnapshot.forEach(async (snap) => {
            allProducts.push(snap.data().productId);
            allQuantities.push(snap.data().quantity);
            allCarts.push(snap.id);
        });
        await setDoc(orderCollection, {
            products: allProducts,
            quantity: allQuantities,
            userId: uid,
            status: "pendding",
            returnOrder: false
        });
        allCarts.forEach(async (id) => {
            await deleteDoc(doc(db, "cart", id));
        });
    } catch (e) {
        alert(e);
    }
}

