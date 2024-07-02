import { db, collection, getDocs, getDoc, doc, deleteDoc } from '../../Database/firebase-config.js';

const savedEmail = localStorage.getItem('email');
const savedID = localStorage.getItem('id');


document.addEventListener("DOMContentLoaded", async () => {
    const divParent = document.getElementById('wishlis');
    const favouritesCollection = collection(db, "favourites");
    const querySnapshot = await getDocs(favouritesCollection);
    var allProducts = [];
    var allFavs = [];
    querySnapshot.forEach(async (document) => {
        const data = document.data();
        if (data['userID'] == savedID) {
            allProducts.push(data['productID']);
            allFavs.push(document.id);
        }
    });

    if (allProducts.length == 0) {
        const noProduct = document.createElement('h2');
        noProduct.appendChild(document.createTextNode(`You don't have favourite yet!`));
        divParent.appendChild(noProduct);
    }

    allProducts.forEach(async (id, index) => {
        var divProduct = document.createElement('div');
        divProduct.classList.add('product_list');
        var divSmallProduct = document.createElement('div');
        divSmallProduct.classList.add('product');
        const docRef = doc(db, 'products', id);
        await getDoc(docRef).then((value) => {
            console.log('in then');
            var getProductData = value.data();
            //create image
            const img = document.createElement('img');
            img.src = getProductData['imageUrl'];
            img.alt = "Product Image";
            img.classList.add('image');
            //create icon
            const container = document.createElement('div');
            container.classList.add('container');
            const addCart = document.createElement('div');
            addCart.classList.add('add_cart');
            addCart.appendChild(document.createTextNode(`Add To Cart`));
            const remove = document.createElement('div');
            remove.classList.add('remove_cart');
            remove.appendChild(document.createTextNode(`Reomve`));
            remove.addEventListener('click', async function () { 
                const docRef = doc(db, 'favourites', allFavs[index]);
                await deleteDoc(docRef);
                window.location.reload();
            });
            container.appendChild(addCart);
            container.appendChild(remove);
            // append to product
            divSmallProduct.classList.add('product');
            divSmallProduct.appendChild(img);
            divSmallProduct.appendChild(container);
            //create title
            const title = document.createElement('h3');
            title.appendChild(document.createTextNode(`${getProductData['title']}`));
            //create price
            const price = document.createElement('h4');
            price.appendChild(document.createTextNode(`${getProductData['price']} EGP`));
            //append all
            divProduct.classList.add('product_list');
            divProduct.appendChild(divSmallProduct);
            divProduct.appendChild(title);
            divProduct.appendChild(price);
            //parent
            divParent.appendChild(divProduct);
        }).catch((e) => {
            console.log(`Error: ${e}`);
        });
    });
});
