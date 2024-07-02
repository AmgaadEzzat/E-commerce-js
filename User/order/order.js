import { 
    getAuth, db, collection, getDoc, getDocs, doc, onAuthStateChanged,
    query, where, signOut
} from '../../Database/firebase-config.js';

LogeOutIcon.style.display = "none";
const auth = getAuth();
////// Get data from cart
onAuthStateChanged(auth, async(user) => {
    if (user) {
        var total = 0;
        var price ;
        const uid = user.uid;
        const q = query(collection(db, "orders"), where("userId", "==", uid));
        const ordersSnapshot = await getDocs(q);
        ordersSnapshot.forEach(async (order) => {          
            const data = order.data();
            const status = order.data().status;
            
            //Create tr inside table
            const tbodyRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
            const emptyRow = tbodyRef.insertRow(0);
            emptyRow.classList.add("emptyRow");

            var tableRow = tbodyRef.insertRow(1);
            tableRow.classList.add("tableRow");
            //Create td inside tr
            const tableDataOfProductDetails = tableRow.insertCell();
            const tableDataOfProductPrice = tableRow.insertCell();
            const tableDataOfProductStatus = tableRow.insertCell();
            const quantityCell = tableRow.insertCell(); 
            //Get products of orders        
            data['products'].forEach(async (id) => {                
                const docProduct = doc(db, "products", id); 
                const product = await getDoc(docProduct);
                const img = product.data().imageUrl;
                price = product.data().price;
                const title = product.data().title;

                tableDataOfProductStatus.style.paddingLeft = "50px";
                tableDataOfProductStatus.classList.add("wid");

                tableDataOfProductDetails.style.padding = "10px 30px"
                tableDataOfProductDetails.classList.add("widThirty");
    
                tableDataOfProductPrice.style.paddingLeft = "40px";
                tableDataOfProductPrice.classList.add("wid");
    
                quantityCell.classList.add("widThirty");

                const productImg = document.createElement("img");
                productImg.style.width = "50px";
                productImg.style.height = "50px";

                const productName = document.createElement("span");
                productName.style.paddingLeft = "10px";

                const productDetails = document.createElement("div");
                productDetails.style.marginTop = "10px"
                const productPrice = document.createElement("div");
                productPrice.style.marginTop = "20px"
                const productStatus = document.createElement("div");
                productStatus.style.marginTop = "20px"
                
                productImg.src = img
                productName.append(title);
                productDetails.appendChild(productImg);
                productDetails.appendChild(productName);
                productPrice.append(price);
                productStatus.append(status);                
                
                tableRow.setAttribute("data-rowid", order.id);
                tableDataOfProductDetails.appendChild(productDetails);
                tableDataOfProductPrice.appendChild(productPrice);
                tableDataOfProductStatus.appendChild(productStatus);

                if(status == "accepted") {
                    var p = (price * 1)
                    total += p;
                    document.getElementById("btnBuy").disabled = false;
                }
                 // Assum total value in cart            
                document.getElementById("subtotal").textContent = `$${total}`;
                document.getElementById("total").textContent = `$${total}`;
            });
            //// Get quantities of orders
            data['quantity'].forEach( async(q) => {
                const productQuantity  = document.createElement("div");
                productQuantity.style.marginTop = "20px";
                productQuantity.append(q);                              
                quantityCell.appendChild(productQuantity);                
            });
        });
        //// Pass the Ids of orders to billing
        var userID = localStorage.getItem("id");
        var orderIds = [];
        async function getorderIds(userID) {
            const q = query(collection(db, "orders"), where("userId", "==", userID));
                const ordersSnapshot = await getDocs(q);
                ordersSnapshot.forEach(async (order) => {
                    const status = order.data().status;
                    if(status == "accepted") {
                        orderIds.push(order.id);
                    }
                });
                const arrString = orderIds.join(',');
                btnBuy.href = '../../User/billing/billing.html?orderIds=' + encodeURIComponent(arrString)
                + "&total=" + total;
        }
        getorderIds(userID);
        ///Signout
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