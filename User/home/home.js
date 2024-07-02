import { db, collection, getDocs, addDoc, signOut, auth } from '../../Database/firebase-config.js';

const savedID = localStorage.getItem('id');
const WishlistIcon = document.getElementById("WishlistIcon");
const CartIcon = document.getElementById("CartIcon");
const OrderIcon = document.getElementById("OrderIcon");
const LogeOutIcon = document.getElementById("LogeOutIcon");
const SignInBtn = document.getElementById("SignInBtn");
const allProducts = document.getElementById("ViewAllProducts");
//<a href="../../User/order/order.html">
if (!savedID) {
        WishlistIcon.style.display = "none";
        CartIcon.style.display = "none";
        OrderIcon.style.display = "none";
        LogeOutIcon.style.display = "none";
        SignInBtn.style.display = "inline-block";
} else if (savedID) {
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

//view all products
(function showProducts() {
        const allProductsBTN = document.createElement("a");
        allProductsBTN.innerText = "View All Products";
        allProductsBTN.href = "../category/category.html?categoy=" + "all" + "&UserID=" + savedID;
        allProducts.append(allProductsBTN);
})();

//Section1 Change The Banners

let TopBannerImg = document.getElementById("TopBannerImg");
let BottomBannerImg = document.getElementById("BottomBannerImg");

var topBanners = [];
var bottomBanners = [];
(async function getBannersCollection() {
        const BannersSnapshot = await getDocs(collection(db, "banners"));
        BannersSnapshot.forEach(c => {
                if (c.data()['position'] == 'Top') {
                        topBanners.push(c.data()['imageUrl']);
                } else {
                        bottomBanners.push(c.data()['imageUrl']);
                }
        });
})();

var i = 0;
var x = 0;
(function getTopBanners() {
        setInterval(() => {
                TopBannerImg.src = topBanners[i];
                BottomBannerImg.src = bottomBanners[i];
                i++;
                x++;
                if (i == topBanners.length) {
                        i = 0;
                }
                if (x == bottomBanners.length) {
                        x = 0;
                }
        }, 1500);
})();

//Section2 Categories
(async function GetCategoriesCollection() {
        const CategoriesSnapshot = await getDocs(collection(db, "categories"));
        CategoriesSnapshot.forEach((doc) => {
                //create Image 
                const img = document.createElement("img");
                img.src = doc.data()["imageUrl"];
                img.style.height = "30px";
                img.style.position = "relative";
                img.style.top = "30px"
                //create p
                const p = document.createElement("p");
                p.innerText = doc.data()["title"];
                //create CategoryDiv 
                const div = document.createElement("div");
                div.appendChild(img);
                div.appendChild(p);
                div.classList.add("Categories");
                div.style.position = "relative";
                div.style.bottom = "10px";
                div.style.display = "none";
                //create Link 
                const AForCategory = document.createElement("a");
                AForCategory.append(div);
                AForCategory.href = "../category/category.html?categoy=" + doc.data()["title"] + "&UserID=" + savedID;
                //Add div to categories
                document.getElementById("Categories").append(AForCategory);
        });
        for (let i = 0; i < 5; i++) {
                Categories[i].style.display = "inline-block";
        }
})();

let Categories = document.getElementsByClassName("Categories");
let rightCounterForCategories = 5;
let leftCounterForCategories = 0;

document.getElementById("CircleArrowRight").addEventListener("click", () => {
        if (rightCounterForCategories >= Categories.length) return false;
        Categories[leftCounterForCategories].style.display = "none";
        Categories[rightCounterForCategories].style.display = "inline-block";
        rightCounterForCategories++;
        leftCounterForCategories++;
})

document.getElementById("CircleArrowLeft").addEventListener("click", () => {
        if (leftCounterForCategories <= 0) return false;
        rightCounterForCategories--;
        leftCounterForCategories--;
        Categories[rightCounterForCategories].style.display = "none";
        Categories[leftCounterForCategories].style.display = "inline-block";
})


//Section3 Products
let counterOfAddedProducts = 0;
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

                //create Add To  Wishlist Icon
                const addToWishlistIcon = document.createElement("img");
                addToWishlistIcon.src = "https://img.icons8.com/ios/50/like--v1.png"
                addToWishlistIcon.addEventListener('click', async function () {
                        var productExist = false;
                        const favouites = collection(db, 'favourites');
                        const snapshot = await getDocs(favouites);
                        snapshot.forEach(doc => {
                                if (doc.data()['userID'] === savedID && doc.data()['productID'] === ProdutcID) {
                                        productExist = true;
                                }
                        });
                        if (productExist == false && savedID) {
                                await addDoc(collection(db, "favourites"), {
                                        userID: savedID,
                                        productID: ProdutcID,
                                }).then(() => {
                                        const notification = document.getElementById('notification');
                                        notification.innerHTML = '';
                                        notification.style.backgroundColor = 'green';
                                        notification.appendChild(document.createTextNode(`Product added to favouites successfully`));
                                        notification.classList.add('show');
                                        setTimeout(() => {
                                                notification.classList.add('hide');
                                                setTimeout(() => {
                                                        notification.classList.remove('show', 'hide');
                                                }, 500);
                                        }, 2000);
                                }).catch((e) => {
                                        const notification = document.getElementById('notification');
                                        notification.innerHTML = '';
                                        notification.style.backgroundColor = 'red';
                                        notification.appendChild(document.createTextNode(`Not able to add to favouites, ${e}`));
                                        notification.classList.add('show');
                                        setTimeout(() => {
                                                notification.classList.add('hide');
                                                setTimeout(() => {
                                                        notification.classList.remove('show', 'hide');
                                                }, 500);
                                        }, 2000);
                                });
                        } else {
                                const notification = document.getElementById('notification');
                                notification.innerHTML = '';
                                notification.style.backgroundColor = 'red';
                                if (!savedID)
                                        notification.appendChild(document.createTextNode(`You must Sign in !!`));
                                else
                                        notification.appendChild(document.createTextNode(`Product Already Exist in favouites`));
                                notification.classList.add('show');
                                setTimeout(() => {
                                        notification.classList.add('hide');
                                        setTimeout(() => {
                                                notification.classList.remove('show', 'hide');
                                        }, 500);
                                }, 2000);
                                productExist = false;
                        }
                });

                // create Div For Icons Of Product
                const IconsDiv = document.createElement("div");
                IconsDiv.append(addToWishlistIcon);
                IconsDiv.classList.add("ProductIcons");

                //create Link For Add To Create
                const AForAddToCart = document.createElement("a");
                AForAddToCart.innerText = "Add To Cart";
                AForAddToCart.addEventListener("click", async () => {
                        var CartExist = false;
                        const Carts = collection(db, 'cart');
                        const CartsSnapshot = await getDocs(Carts);
                        CartsSnapshot.forEach(doc => {
                                if (doc.data()['userId'] === savedID && doc.data()['productId'] === ProdutcID) {
                                        CartExist = true;
                                }
                        });
                        if (!CartExist && savedID) {
                                await addDoc(collection(db, "cart"), {
                                        userId: savedID,
                                        quantity: "1",
                                        productId: ProdutcID,
                                }).then(() => {
                                        const notification = document.getElementById('notification');
                                        notification.innerHTML = '';
                                        notification.style.backgroundColor = 'green';
                                        notification.appendChild(document.createTextNode(`Product added to Cart successfully`));
                                        notification.classList.add('show');
                                        setTimeout(() => {
                                                notification.classList.add('hide');
                                                setTimeout(() => {
                                                        notification.classList.remove('show', 'hide');
                                                }, 500);
                                        }, 2000);
                                }).catch((e) => {
                                        const notification = document.getElementById('notification');
                                        notification.innerHTML = '';
                                        notification.style.backgroundColor = 'red';
                                        notification.appendChild(document.createTextNode(`Not able to add to Cart, ${e}`));
                                        notification.classList.add('show');
                                        setTimeout(() => {
                                                notification.classList.add('hide');
                                                setTimeout(() => {
                                                        notification.classList.remove('show', 'hide');
                                                }, 500);
                                        }, 2000);
                                });
                        } else {
                                const notification = document.getElementById('notification');
                                notification.innerHTML = '';
                                notification.style.backgroundColor = 'red';
                                if (!savedID)
                                        notification.appendChild(document.createTextNode(`You must Sign in !!`));
                                else
                                        notification.appendChild(document.createTextNode(`Product Already Exist in Cart`));
                                notification.classList.add('show');
                                setTimeout(() => {
                                        notification.classList.add('hide');
                                        setTimeout(() => {
                                                notification.classList.remove('show', 'hide');
                                        }, 500);
                                }, 2000);
                                CartExist = false;
                        }
                })

                //create Add To Cart
                const AddToCartBtn = document.createElement("div");
                AddToCartBtn.append(AForAddToCart);
                AddToCartBtn.classList.add("AddToCart");

                //create Img Of Product
                const imgOfProduct = document.createElement("img");
                imgOfProduct.src = imageUrl;
                imgOfProduct.style.objectFit = 'contain';
                imgOfProduct.addEventListener("click", () => {
                        window.location.href = "../../User/product/Product.html?ProdutcID=" + ProdutcID + "&UserID=" + savedID;
                })

                //create P For Title 
                const titleOfProduct = document.createElement("p");
                titleOfProduct.innerText = title;
                titleOfProduct.style.fontWeight = "bold";
                titleOfProduct.classList.add("titleOfProduct");

                //create p For price 
                const priceOfProduct = document.createElement("p");
                priceOfProduct.innerText = `${price} EGP`;
                priceOfProduct.classList.add("PriceOfProduct");

                //create Div For Prodect 
                const ProductDiv = document.createElement("div");
                ProductDiv.id = ProdutcID;
                ProductDiv.setAttribute("category", category);
                ProductDiv.setAttribute("oldQuantity", oldQuantity);
                ProductDiv.setAttribute("quantity", quantity);
                ProductDiv.setAttribute("description", description);
                ProductDiv.append(IconsDiv);
                ProductDiv.append(imgOfProduct);
                ProductDiv.append(titleOfProduct);
                ProductDiv.append(priceOfProduct);
                ProductDiv.append(AddToCartBtn);
                ProductDiv.classList.add("divproducts");
                ProductDiv.style.display = "none";
                //console.log(ProductDiv);

                if (counterOfAddedProducts % 2 == 0) document.getElementById("ProductsRow1").appendChild(ProductDiv);
                else document.getElementById("ProductsRow2").appendChild(ProductDiv);
                counterOfAddedProducts++;

        });

        for (let i = 0; i < 5; i++) {
                Products[i].style.display = "inline-block";
                Products[i + Products.length / 2].style.display = "inline-block";
        }
})();

let Products = document.getElementsByClassName("DivProducts");
let CounterOfProducts = 0;

document.getElementById("CircleArrowRightForProdects").addEventListener("click", () => {
        if (CounterOfProducts + 5 >= Products.length / 2) return false;
        Products[CounterOfProducts].style.display = "none";
        Products[CounterOfProducts + 5].style.display = "inline-block";
        Products[CounterOfProducts + Products.length / 2].style.display = "none";
        Products[CounterOfProducts + 5 + Products.length / 2].style.display = "inline-block";
        CounterOfProducts++;
})

document.getElementById("CircleArrowLeftForProdects").addEventListener("click", () => {
        if (CounterOfProducts <= 0) return false;
        CounterOfProducts--;
        Products[CounterOfProducts].style.display = "inline-block";
        Products[CounterOfProducts + 5].style.display = "none";
        Products[CounterOfProducts + Products.length / 2].style.display = "inline-block";
        Products[CounterOfProducts + 5 + Products.length / 2].style.display = "none";
})