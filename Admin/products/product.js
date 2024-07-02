import { storage, db, uploadBytes, ref, getDownloadURL, addDoc, collection, getDocs, deleteDoc, deleteObject, doc, updateDoc } from '../../Database/firebase-config.js';

const add = document.getElementById('add');
const addDialog = document.getElementById('addDialog');
const dialogEdit = document.getElementById('editDialog');
const closeDialogButton = document.getElementById('closeAddDialog');
const closeDialogEdit = document.getElementById('closeEditDialog');
const submitButton = document.getElementById('submit');
const submitEditButton = document.getElementById('submitEdit');
const addForm = document.getElementById('addForm');
const editForm = document.getElementById('editForm');
var selectedImageName;
var selectedID;
var selectedTitle;
var imageURL;
var category;
var detailsSelected;
var quantitySelected;
var priceSelected;
const categories = [];

add.addEventListener('click', () => {
    addDialog.style.display = 'flex';
});
closeDialogButton.addEventListener('click', () => {
    addDialog.style.display = 'none';
});
closeDialogEdit.addEventListener('click', () => {
    dialogEdit.style.display = 'none';
});

const getCategories = async () => {
    const selection = document.getElementById('categories');
    const selectionEdit = document.getElementById('categoriesEdit');
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    snapshot.forEach(doc => {
        categories.push(doc.data()['title']);
        const option = document.createElement('option');
        const title = document.createTextNode(`${doc.data()['title']}`);
        option.appendChild(title);
        selection.appendChild(option);
    });
    snapshot.forEach(doc => {
        categories.push(doc.data()['title']);
        const option = document.createElement('option');
        const title = document.createTextNode(`${doc.data()['title']}`);
        option.appendChild(title);
        selectionEdit.appendChild(option);
    });
}
getCategories();

addForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    var loader = document.querySelector('.loading-indicator');
    loader.style.display = 'block';
    submitButton.style.display = 'none';
    closeDialogButton.style.display = 'none';
    const formData = new FormData(addForm);
    const title = formData.get('name');
    const image = formData.get('image');
    const category = formData.get('category');
    const price = formData.get('price');
    const description = formData.get('description');
    const quantity = formData.get('quantity');
    const now = new Date();
    const storageRef = ref(storage, `Products/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);
    await addDoc(collection(db, "products"), {
        imageUrl: imageUrl,
        title: title,
        name: image.name,
        date: now,
        category: category,
        description: description,
        price: price,
        quantity: quantity,
        remainingQuantity: 0,
    }).then(() => {
        loader.style.display = 'none';
        submitButton.style.display = 'inline-block';
        closeDialogButton.style.display = 'inline-block';
        addDialog.style.display = 'none';
        window.location.reload();
    }).catch((e) => {
        alert(e.message);
        loader.style.display = 'none';
        submitButton.style.display = 'inline-block';
        closeDialogButton.style.display = 'inline-block';
    });
});


window.onload = () => {
    const displayProducts = async () => {
        const allProducts = document.getElementById('allProducts');
        const selectedProduct = document.getElementById('selectedProduct');
        const productCollection = collection(db, "products");
        try {
            const querySnapshot = await getDocs(productCollection);
            var index = 0;
            querySnapshot.forEach((doc) => {
                index++;
                const data = doc.data();
                const imageUrl = data.imageUrl;
                // Create image
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = "Banner Image";
                img.style.width = "20%";
                img.style.margin = "5px";
                img.style.objectFit = "cover";
                img.style.borderRadius = "8px";
                // create label
                const label = document.createElement('label');
                label.classList.add('labelBanner');
                const textNode = document.createTextNode(`(${index})`);
                label.appendChild(textNode);
                // title
                const lName = document.createElement('label');
                lName.classList.add('labelBanner');
                const name = document.createTextNode(`${data.title}`);
                lName.appendChild(name);
                const lDetails = document.createElement('label');
                lDetails.classList.add('detailsProduct');
                const details = document.createTextNode(`${data.description}`);
                lDetails.appendChild(details);
                const lQuantity = document.createElement('label');
                lQuantity.classList.add('labelBanner');
                const quantity = document.createTextNode(`Quantity: ${data.quantity}`);
                lQuantity.appendChild(quantity);
                const lPrice = document.createElement('label');
                lPrice.classList.add('labelBanner');
                const price = document.createTextNode(`Price: ${data.price} EGP`);
                lPrice.appendChild(price);
                const lCategory = document.createElement('label');
                lCategory.classList.add('labelBanner');
                const cat = document.createTextNode(`Category: ${data.category}`);
                lCategory.appendChild(cat);
                const lid = document.createElement('label');
                lid.classList.add('labelBanner');
                const id = document.createTextNode(`ID: ${doc.id}`);
                lid.appendChild(id);
                const categoryData = document.createElement('div');
                categoryData.style.display = 'flex';
                categoryData.style.flexDirection = 'column';
                categoryData.style.alignItems = 'flex-start';
                categoryData.style.justifyContent = 'start';
                categoryData.appendChild(lName);
                categoryData.appendChild(lDetails);
                categoryData.appendChild(lQuantity);
                categoryData.appendChild(lPrice);
                categoryData.appendChild(lCategory);
                categoryData.appendChild(lid);
                // Create div
                const categoryDiv = document.createElement('div');
                categoryDiv.style.justifyContent = 'start';
                categoryDiv.classList.add('banner');
                categoryDiv.appendChild(label);
                categoryDiv.appendChild(img);
                categoryDiv.appendChild(categoryData);
                categoryDiv.addEventListener('click', () => {
                    selectedProduct.innerHTML = '';
                    selectedID = doc.id;
                    selectedImageName = data.name;
                    selectedTitle = data.title;
                    imageURL = data.imageUrl
                    detailsSelected = data.description;
                    category = data.category;
                    quantitySelected = data.quantity;
                    priceSelected = data.price;
                    selectedProduct.appendChild(document.createTextNode(`Selected Product ID: ${doc.id}`));
                });
                // Parent
                allProducts.appendChild(categoryDiv);
            });
        } catch (error) {
            console.error("Error: ", error);
        }
    }
    displayProducts();
};


function deleteProduct() {
    if (typeof selectedID === 'undefined') {
        const notification = document.getElementById('notificationError');
        notification.innerHTML = '';
        notification.appendChild(document.createTextNode(`You must Select Product`));
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.classList.remove('show', 'hide');
            }, 500);
        }, 2000);
    }
    else {
        const notification = document.getElementById('notification');
        notification.innerHTML = '';
        notification.appendChild(document.createTextNode(`Wait`));
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.classList.remove('show', 'hide');
            }, 500);
        }, 2000);
        const storageRef = ref(storage, `Products/${selectedImageName}`);
        deleteObject(storageRef)
        const categoryDocRef = doc(db, "products", selectedID);
        deleteDoc(categoryDocRef).finally(() => {
            window.location.reload();
        });
    }
}

document.getElementById('delete').addEventListener('click', function () {
    deleteProduct();
});

function editProduct() {
    if (typeof selectedID === 'undefined') {
        const notification = document.getElementById('notificationError');
        notification.innerHTML = '';
        notification.appendChild(document.createTextNode(`You must Select Product`));
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.classList.remove('show', 'hide');
            }, 500);
        }, 2000);
    }
    else {
        document.getElementById('nameEdit').value = selectedTitle;
        document.getElementById('categoriesEdit').value = category;
        document.getElementById('priceEdit').value = priceSelected;
        document.getElementById('descriptionEdit').value = detailsSelected;
        document.getElementById('quantityEdit').value = quantitySelected;
        const formData = new FormData(editForm);
        dialogEdit.style.display = 'flex';
        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const data = new FormData(editForm);
            const image = data.get('imageEdit');
            const title = data.get('nameEdit');
            const price = data.get('priceEdit');
            const details = data.get('descriptionEdit');
            const quantity = data.get('quantityEdit');
            const cat = document.getElementById('categoriesEdit').value;
            var loader = document.querySelector('.loading-indicator');
            loader.style.borderTopColor = 'rgb(255, 187, 0)';
            loader.style.display = 'block';
            submitEditButton.style.display = 'none';
            closeDialogEdit.style.display = 'none';
            if (image.name === '' || typeof image === undefined) {
                const docRef = doc(db, 'products', selectedID);
                await updateDoc(docRef, {
                    title: title,
                    price: price,
                    description: details,
                    quantity: quantity,
                    category: cat,
                }).then(() => {
                    dialogEdit.style.display = 'none';
                    loader.style.display = 'none';
                    submitEditButton.style.display = 'inline-block';
                    closeDialogEdit.style.display = 'inline-block';
                    window.location.reload();
                }).catch((e) => {
                    dialogEdit.style.display = 'none';
                    loader.style.display = 'none';
                    submitEditButton.style.display = 'flex';
                    closeDialogEdit.style.display = 'flex';
                    alert(e.message);
                });
            } else {
                const deleteIMG = ref(storage, `Products/${selectedImageName}`);
                deleteObject(deleteIMG)
                const storageRef = ref(storage, `Products/${image.name}`);
                await uploadBytes(storageRef, image);
                const imageUrl = await getDownloadURL(storageRef);
                const docRef = doc(db, 'products', selectedID);
                await updateDoc(docRef, {
                    imageUrl: imageUrl,
                    name: image.name,
                    title: title,
                    price: price,
                    description: details,
                    quantity: quantity,
                    category: cat
                }).then(() => {
                    dialogEdit.style.display = 'none';
                    loader.style.display = 'none';
                    submitEditButton.style.display = 'inline-block';
                    closeDialogEdit.style.display = 'inline-block';
                    window.location.reload();
                }).catch((e) => {
                    dialogEdit.style.display = 'none';
                    loader.style.display = 'none';
                    submitEditButton.style.display = 'flex';
                    closeDialogEdit.style.display = 'flex';
                    alert(e.message);
                });
            }
        });

    }
}

document.getElementById('edit').addEventListener('click', function () {
    editProduct();
});