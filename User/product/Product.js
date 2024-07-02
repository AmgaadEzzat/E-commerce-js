import {
    getAuth, db, addDoc, collection, getDoc, getDocs, doc, onAuthStateChanged,
    query, where, getCountFromServer, signOut
} from '../../Database/firebase-config.js';

//////////////////////Get ProductID and UserId from url params
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('ProdutcID');
const userId = urlParams.get('UserID');
const auth = getAuth();
////////////////////get product details from firbase////////////////////
const productName = document.getElementById("productName");
const productImage = document.getElementById("productImage");
const productPrice = document.getElementById("productPrice");
const description = document.getElementById("description");
const stockValue = document.getElementById("stockValue");
const numberOfReviews = document.getElementById("numberOfReviews");
const btnIncreaseQuantity = document.getElementById("increaseQuantity");
const btnDecreaseQuantity = document.getElementById("decreaseQuantity");
const inputOfQuantity = document.getElementById("quantityInput");
const btnAddToWishlist = document.getElementById("addToWishlist");
const paragraphAfterNav = document.getElementById("paragraphAfterNav");
const btnAddToCart = document.getElementById("addToCart");
const LogeOutIcon = document.getElementById("LogeOutIcon");
LogeOutIcon.style.display = "none";
var quantity;

onAuthStateChanged(auth, (user) => {
    if (user) {
        // SingOut  
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
})

let productDetails = doc(db, "products", productId);
const productSnapshot = await getDoc(productDetails);

if (productSnapshot.exists()) {
    productImage.src = productSnapshot.data().imageUrl;
    productImage.classList.add('image');
    productName.textContent = productSnapshot.data().title;
    paragraphAfterNav.textContent = `Shop / ${productSnapshot.data().title}`
    productPrice.textContent = `$ ${productSnapshot.data().price}`;
    description.textContent = productSnapshot.data().description;
    quantity = productSnapshot.data().quantity;
} else {
    alert = "Something went wrong"
}

if (quantity > 0) {
    stockValue.textContent = "In stock"
} else {
    stockValue.textContent = "Out stock";
    btnAddToCart.disabled = true;
}
//////////////////get count of rating for this product data //////
const coll = collection(db, "rating");
const q = query(coll, where("productId", "==", productId));
const snapshot = await getCountFromServer(q);

numberOfReviews.textContent = `( ${snapshot.data().count} Reviews )`
////////////////////////Increase Quantity////////////////
btnIncreaseQuantity.addEventListener("click", function () {
    let quantityValue = inputOfQuantity.value;
    if (Number(quantityValue) >= Number(productSnapshot.data().quantity)) {
        btnIncreaseQuantity.disabled = true;
    } else {
        quantityValue++;
        inputOfQuantity.value = quantityValue;
        btnDecreaseQuantity.disabled = false;
    }
})

/////////////////Decrease Quantity////////////////////
btnDecreaseQuantity.addEventListener("click", function () {
    let quantityValue = inputOfQuantity.value;

    if (quantityValue <= 1) {
        btnDecreaseQuantity.disabled = true;
    } else {
        quantityValue--;
        inputOfQuantity.value = quantityValue;
        btnDecreaseQuantity.disabled = false;
        btnIncreaseQuantity.disabled = false;
    }
})
////////////////////////Add to cart /////////////////////////
const user = auth.currentUser;
var checkProduct = 0;
let refCart = collection(db, "cart");
const productsOfCart = await getDocs(refCart);

function addToCart() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            productsOfCart.forEach((doc) => {
                if ((doc.data().productId == productId) && (doc.data().userId == uid)) {
                    return checkProduct = 1;
                }
            });
            if (!checkProduct) {
                addDoc(
                    refCart, {
                    productId: productId,
                    userId: uid,
                    quantity: inputOfQuantity.value
                }
                )
                alert("Product added successfully to cart!");
            } else {
                alert("This product has already been added to the shopping cart")
            }
        } else {
            alert("Please, Sign in")
        }
    });
}

btnAddToCart.addEventListener("click", addToCart);
////////////////////Add to wishlist//////////////////////
async function addToWishlist() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            let refWishList = collection(db, "favourites");
            var productExist = false;
            const snapshot = await getDocs(refWishList);
            snapshot.forEach(doc => {
                if (doc.data()['userID'] === uid && doc.data()['productID'] === productId) {
                    productExist = true;
                }
            });
            if (productExist == false) {
                addDoc(refWishList, {
                    productID: productId,
                    userID: uid
                });
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
            } else {
                const notification = document.getElementById('notification');
                notification.innerHTML = '';
                notification.style.backgroundColor = 'red';
                notification.appendChild(document.createTextNode(`Product Already Exist in favouites`));
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.add('hide');
                    setTimeout(() => {
                        notification.classList.remove('show', 'hide');
                    }, 500);
                }, 2000);
            }
        } else {
            const notification = document.getElementById('notification');
            notification.innerHTML = '';
            notification.style.backgroundColor = 'red';
            notification.appendChild(document.createTextNode(`Please, Sign in`));
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.add('hide');
                setTimeout(() => {
                    notification.classList.remove('show', 'hide');
                }, 500);
            }, 2000);
        }
    });
}

btnAddToWishlist.addEventListener("click", addToWishlist);
/////////////////////////////////stars///////////////////////////
const stars = document.querySelectorAll(".star");
const rating = document.getElementById("rating");
const reviewText = document.getElementById("review");
const submitBtn = document.getElementById("submit");
const reviewsContainer = document.getElementById("reviews");

stars.forEach((star) => {
    star.addEventListener("click", () => {
        var value = parseInt(star.getAttribute("data-value"));
        rating.innerText = value;

        // Remove all existing classes from stars
        stars.forEach((s) => s.classList.remove("one",
            "two",
            "three",
            "four",
            "five"));

        // Add the appropriate class to 
        // each star based on the selected star's value
        stars.forEach((s, index) => {
            if (index < value) {
                s.classList.add(getStarColorClass(value));
            }
        });

        // Remove "selected" class from all stars
        stars.forEach((s) => s.classList.remove("selected"));
        // Add "selected" class to the clicked star
        star.classList.add("selected");
    });
});

var userRating;
var review;
submitBtn.addEventListener("click", () => {
    review = reviewText.value;
    userRating = parseInt(rating.innerText);

    if (!userRating || !review) {
        alert(
            "Please select a rating and provide a review before submitting."
        );
        return;
    }

    if (userRating > 0) {
        const reviewElement = document.createElement("div");
        // reviewElement.classList.add("review");
        reviewElement.innerHTML = `<p><strong>Rating: ${userRating}/5</strong></p><p>${review}</p>`;
        reviewsContainer.appendChild(reviewElement);

        // Reset styles after submitting
        reviewText.value = "";
        rating.innerText = "0";
        stars.forEach((s) => s.classList.remove("one",
            "two",
            "three",
            "four",
            "five",
            "selected"));
    }

    ////////set rating value to firebase/////////////////
    let refRating = collection(db, "rating");
    var now = Date();
    addDoc(
        refRating, {
        comment: review,
        productId: productId,
        userId: userId,
        rating: userRating,
        date: now
    }
    )
    alert("Review added successfully");
});

function getStarColorClass(value) {
    switch (value) {
        case 1:
            return "one";
        case 2:
            return "two";
        case 3:
            return "three";
        case 4:
            return "four";
        case 5:
            return "five";
        default:
            return "";
    }
}
/////////////////Get all reviews/////////
const reviewsDiv = document.getElementById("reviewsContainer");

const queryReviews = query(collection(db, "rating"), where("productId", "==", productId));
const reviewSnapshot = await getDocs(queryReviews);
reviewSnapshot.forEach(async (doc) => {
    const comment = doc.data().comment;
    const rating = doc.data().rating;
    const now = doc.data().date;
    const user = doc.data().userId;
    ///// Get the name of customer
    let refUser = collection(db, "users");
    const userSnapshot = await getDocs(refUser);
    var name;
    userSnapshot.forEach((doc) => {
        if (doc.data().id == user) {
            name = doc.data().name;
        }
    })
    /////Create customet image
    const customerDiv = document.createElement("div");
    const customerImg = document.createElement("img");
    customerImg.classList.add("customerImg");
    customerImg.src = "../../images/profile.jpeg";
    customerDiv.appendChild(customerImg);
    /////Create span for customer name
    const userDetails = document.createElement("div");
    const customerName = document.createElement("span");
    customerName.append(name);
    userDetails.appendChild(customerName)
    //Create paragraph for date of rating
    let date = new Date(now);
    // Extract components
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-indexed
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Convert hours to 12-hour format and determine AM/PM
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set it to 12

    // Format minutes to always have two digits
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const ratingDate = document.createElement("p");
    ratingDate.append(`${day}/${month}/${year} ${hours}:${minutes} ${period}`);
    ratingDate.classList.add("dateOfRating");
    userDetails.appendChild(ratingDate)
    customerDiv.appendChild(userDetails);
    customerDiv.style.display = "flex";

    reviewsDiv.appendChild(customerDiv);
    // create rate star
    const rateDiv = document.createElement("div");
    rateDiv.innerText = "";
    for (var i = 1; i <= rating; i++) {
        rateDiv.innerText += "★";
        if (rating == 1) {
            rateDiv.classList.add('one');
        }
        if (rating == 2) {
            rateDiv.classList.add('two');
        }
        if (rating == 3) {
            rateDiv.classList.add('three');
        }
        if (rating == 4) {
            rateDiv.classList.add('four');
        }
        if (rating == 5) {
            rateDiv.classList.add('five');
        }
    }
    reviewsDiv.append(rateDiv);
    //////////Create parag for customer comment
    const customerComment = document.createElement("p");
    customerComment.append(comment);
    reviewsDiv.appendChild(customerComment)
})