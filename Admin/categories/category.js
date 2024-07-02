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

add.addEventListener('click', () => {
    addDialog.style.display = 'flex';
});
closeDialogButton.addEventListener('click', () => {
    addDialog.style.display = 'none';
});
closeDialogEdit.addEventListener('click', () => {
    dialogEdit.style.display = 'none';
});

addForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    var loader = document.querySelector('.loading-indicator');
    loader.style.display = 'block';
    submitButton.style.display = 'none';
    closeDialogButton.style.display = 'none';
    const formData = new FormData(addForm);
    const title = formData.get('name');
    const image = formData.get('image');
    const now = new Date();
    const storageRef = ref(storage, `Categories/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);
    await addDoc(collection(db, "categories"), {
        imageUrl: imageUrl,
        title: title,
        name: image.name,
        date: now,
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
    const displayCategories = async () => {
        const categoriesDiv = document.getElementById('allCategories');
        const selectedCategory = document.getElementById('selectedCategory');
        const categoryCollection = collection(db, "categories");
        try {
            const querySnapshot = await getDocs(categoryCollection);
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
                img.style.borderRadius = "8px";
                // create label
                const label = document.createElement('label');
                label.classList.add('labelBanner');
                const textNode = document.createTextNode(`(${index})`);
                label.appendChild(textNode);
                // Position & ID
                const pos = document.createElement('label');
                pos.classList.add('labelBanner');
                const title = document.createTextNode(`${data.title}`);
                pos.appendChild(title);
                const categoryData = document.createElement('div');
                categoryData.style.display = 'flex';
                categoryData.style.flexDirection = 'column';
                categoryData.style.alignItems = 'flex-start';
                categoryData.style.justifyContent = 'center';
                categoryData.appendChild(pos);
                // Create div
                const categoryDiv = document.createElement('div');
                categoryDiv.style.justifyContent = 'start';
                categoryDiv.classList.add('banner');
                categoryDiv.appendChild(label);
                categoryDiv.appendChild(img);
                categoryDiv.appendChild(categoryData);
                categoryDiv.addEventListener('click', () => {
                    selectedCategory.innerHTML = '';
                    selectedID = doc.id;
                    selectedImageName = data.name;
                    selectedTitle = data.title;
                    imageURL = data.imageUrl
                    selectedCategory.appendChild(document.createTextNode(`Selected Category ID: ${doc.id}`));
                });
                // Parent
                categoriesDiv.appendChild(categoryDiv);
            });
        } catch (error) {
            console.error("Error: ", error);
        }
    }
    displayCategories();
};

function deleteCategory() {
    if (typeof selectedID === 'undefined') {
        const notification = document.getElementById('notificationError');
        notification.innerHTML = '';
        notification.appendChild(document.createTextNode(`You must Select Category`));
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
        const storageRef = ref(storage, `Categories/${selectedImageName}`);
        deleteObject(storageRef)
        const categoryDocRef = doc(db, "categories", selectedID);
        deleteDoc(categoryDocRef).finally(() => {
            window.location.reload();
        });
    }
}

function editCategory() {
    if (typeof selectedID === 'undefined') {
        const notification = document.getElementById('notificationError');
        notification.innerHTML = '';
        notification.appendChild(document.createTextNode(`You must Select Category`));
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
        dialogEdit.style.display = 'flex';
        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const data = new FormData(editForm);
            const image = data.get('imageEdit');
            const title = data.get('nameEdit');
            var loader = document.querySelector('.loading-indicator');
            loader.style.borderTopColor = 'rgb(255, 187, 0)';
            loader.style.display = 'block';
            submitEditButton.style.display = 'none';
            closeDialogEdit.style.display = 'none';
            if (image.name === '' || typeof image === undefined) {
                const docRef = doc(db, 'categories', selectedID);
                await updateDoc(docRef, {
                    title: title
                }).then(() => {
                    dialogEdit.style.display = 'none';
                    loader.style.display = 'none';
                    submitEditButton.style.display = 'inline-block';
                    closeDialogEdit.style.display = 'inline-block';
                    //window.location.reload();
                }).catch((e) => {
                    dialogEdit.style.display = 'none';
                    loader.style.display = 'none';
                    submitEditButton.style.display = 'flex';
                    closeDialogEdit.style.display = 'flex';
                    alert(e.message);
                });
            } else {
                const deleteIMG = ref(storage, `Categories/${selectedImageName}`);
                deleteObject(deleteIMG)
                const storageRef = ref(storage, `Categories/${image.name}`);
                await uploadBytes(storageRef, image);
                const imageUrl = await getDownloadURL(storageRef);
                const docRef = doc(db, 'categories', selectedID);
                await updateDoc(docRef, {
                    imageUrl: imageUrl,
                    name: image.name,
                    title: title
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

document.getElementById('delete').addEventListener('click', function () {
    deleteCategory();
});
document.getElementById('edit').addEventListener('click', function () {
    editCategory();
});


