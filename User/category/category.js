import { db, collection, getDocs } from '../../Database/firebase-config.js';

const savedID = localStorage.getItem('id');
const WishlistIcon = document.getElementById("WishlistIcon");
const CartIcon = document.getElementById("CartIcon");
const OrderIcon = document.getElementById("OrderIcon");
const LogeOutIcon = document.getElementById("LogeOutIcon");
const SignInBtn = document.getElementById("SignInBtn");

let flage = true;
if (!savedID) {
        flage = false;
}
if (!flage) {
        WishlistIcon.style.display = "none";
        CartIcon.style.display = "none";
        OrderIcon.style.display = "none";
        LogeOutIcon.style.display = "none";
        SignInBtn.style.display = "inline-block";
} else if (flage) {
        document.getElementById("HeaderIcons").style.position = "relative";
        document.getElementById("HeaderIcons").style.right = "10px";

        WishlistIcon.style.display = "inline-block";
        WishlistIcon.addEventListener("click", () => {
                window.location.href = "../../User/wishlist/index.html"
        })
        CartIcon.style.display = "inline-block";
        CartIcon.addEventListener("click", () => {
                window.location.href = "../../User/cart/cart.html"
        })
        OrderIcon.style.display = "inline-block";
        OrderIcon.addEventListener("click", () => {
                window.location.href = "../../User/order/order.html";
        })
        LogeOutIcon.style.display = "inline-block";
        LogeOutIcon.addEventListener('click', function () {
                signOut(auth).then(() => {
                        localStorage.clear();
                        window.location.href = '../../Common/Authentication/login.html';
                }).catch((error) => {
                        alert('Error signing out: ', error);
                });
        });
        SignInBtn.style.display = "none";
}


const queryString = window.location.search;
const UrlParams = new URLSearchParams(queryString);
const ReqCategory = UrlParams.get("categoy");

(async function GetAllProducts() {
        const ProductsSnapshot = await getDocs(collection(db, "products"));
        ProductsSnapshot.forEach(doc => {
                // category description imageUrl oldQuantity price quantity title
                const ProdutcID = doc.id;
                const category = doc.data()["category"];
                const description = doc.data()["description"];
                const imageUrl = doc.data()["imageUrl"];
                const oldQuantity = doc.data()["oldQuantity"];
                const price = doc.data()["price"];
                const quantity = doc.data()["quantity"];
                const title = doc.data()["title"];

                //create Link For Add To Create
                const AForAddToCart = document.createElement("a");
                AForAddToCart.innerText = "Add To Cart";
                AForAddToCart.href = "";
                //create Add To Cart
                const AddToCartBtn = document.createElement("div");
                AddToCartBtn.append(AForAddToCart);
                AddToCartBtn.classList.add("AddToCart");

                //create Img Of Product
                const imgOfProduct = document.createElement("img");
                imgOfProduct.src = imageUrl;
                imgOfProduct.addEventListener("click", () => {
                        window.location.href = "../../User/product/Product.html?ProdutcID=" + ProdutcID + "&UserID=" + savedID;
                })

                //create P For Title 
                const titleOfProduct = document.createElement("p");
                titleOfProduct.innerText = title;
                titleOfProduct.style.fontWeight = "bold";
                titleOfProduct.classList.add("titleOfProduct");
                titleOfProduct.style.position = "relative"
                titleOfProduct.style.top = "20px";

                //create p For price 
                const priceOfProduct = document.createElement("p");
                priceOfProduct.innerText = price;
                priceOfProduct.classList.add("PriceOfProduct");
                priceOfProduct.style.position = "relative"
                priceOfProduct.style.top = "10px";

                //create Div For Prodect 
                const ProductDiv = document.createElement("div");
                ProductDiv.id = ProdutcID;
                ProductDiv.setAttribute("category", category);
                ProductDiv.setAttribute("oldQuantity", oldQuantity);
                ProductDiv.setAttribute("quantity", quantity);
                ProductDiv.setAttribute("description", description);
                ProductDiv.append(imgOfProduct);
                ProductDiv.append(titleOfProduct);
                ProductDiv.append(priceOfProduct);
                ProductDiv.classList.add("divproducts");
                ProductDiv.style.margin = "5px"
                ProductDiv.style.display = "inline-block"
                
                 if (doc.data()["category"] == ReqCategory.split("?")[0])
                        document.getElementById("row").appendChild(ProductDiv)
                if (ReqCategory.split("?")[0] == "all")
                        document.getElementById("row").appendChild(ProductDiv)
        })
})()