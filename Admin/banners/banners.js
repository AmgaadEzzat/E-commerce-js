import { storage, db, uploadBytes, ref, getDownloadURL, addDoc, collection, getDocs, deleteDoc, deleteObject, doc, updateDoc } from '../../Database/firebase-config.js';

const openDialogButton = document.getElementById('openDialogButton');
const dialogOverlay = document.getElementById('dialogOverlay');
const closeDialogButton = document.getElementById('closeDialogButton');
const closeDialogEdit = document.getElementById('closeDialogEdit');
const submitButton = document.getElementById('submit');
const submitEditButton = document.getElementById('submitEdit');
const bannerForm = document.getElementById('bannerForm');
const editForm = document.getElementById('editForm');
const selection = document.getElementById('nameEdit');
var selectedImageName;
var selectedID;
var selectedPosition;
var imageURL;
const dialogEdit = document.getElementById('dialogEdit');

openDialogButton.addEventListener('click', () => {
    dialogOverlay.style.display = 'flex';
});
closeDialogButton.addEventListener('click', () => {
    dialogOverlay.style.display = 'none';
});
closeDialogEdit.addEventListener('click', () => {
    dialogEdit.style.display = 'none';
});

bannerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    var loader = document.querySelector('.loading-indicator');
    loader.style.display = 'block';
    submitButton.style.display = 'none';
    closeDialogButton.style.display = 'none';
    const formData = new FormData(bannerForm);
    const position = formData.get('name');
    const image = formData.get('image');
    const now = new Date();
    const storageRef = ref(storage, `Banners/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);
    await addDoc(collection(db, "banners"), {
        imageUrl: imageUrl,
        position: position,
        name: image.name,
        date: now,
    }).then(() => {
        document.getElementById('image').value = '';
        loader.style.display = 'none';
        submitButton.style.display = 'inline-block';
        closeDialogButton.style.display = 'inline-block';
        dialogOverlay.style.display = 'none';
        window.location.reload();
    }).catch((e) => {
        alert(e.message);
        document.getElementById('image').value = '';
        loader.style.display = 'none';
        submitButton.style.display = 'inline-block';
        closeDialogButton.style.display = 'inline-block';
    });
});

window.onload = () => {
    const displayBanners = async () => {
        const bannersDiv = document.getElementById('allBanners');
        const selectBanner = document.getElementById('selectedBanner');
        const bannersCollection = collection(db, "banners");
        try {
            const querySnapshot = await getDocs(bannersCollection);
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
                const position = document.createTextNode(`${data.position}`);
                pos.appendChild(position);
                const id = document.createElement('label');
                id.classList.add('labelBanner');
                const bannerID = document.createTextNode(`${doc.id}`);
                id.appendChild(bannerID);
                const bannerData = document.createElement('div');
                bannerData.style.display = 'flex';
                bannerData.style.flexDirection = 'column';
                bannerData.style.alignItems = 'flex-start';
                bannerData.style.justifyContent = 'center';
                bannerData.appendChild(pos);
                bannerData.appendChild(id);
                // Create div
                const bannerDiv = document.createElement('div');
                bannerDiv.style.width = '100%';
                bannerDiv.style.justifyContent = 'start';
                bannerDiv.classList.add('banner');
                bannerDiv.appendChild(label);
                bannerDiv.appendChild(img);
                bannerDiv.appendChild(bannerData);
                bannerDiv.addEventListener('click', () => {
                    selectBanner.innerHTML = '';
                    selectedID = doc.id;
                    selectedImageName = data.name;
                    selectedPosition = data.position;
                    imageURL = data.imageUrl
                    selectBanner.appendChild(document.createTextNode(`Selected Banner ID: ${doc.id}`));
                });
                // Parent
                bannersDiv.appendChild(bannerDiv);
            });
        } catch (error) {
            console.error("Error: ", error);
        }
    }
    displayBanners();
};

function deleteBanner() {
    if (typeof selectedID === 'undefined') {
        const notification = document.getElementById('notificationError');
        notification.innerHTML = '';
        notification.appendChild(document.createTextNode(`You must Select Banner`));
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
        const storageRef = ref(storage, `Banners/${selectedImageName}`);
        deleteObject(storageRef)
        const bannerDocRef = doc(db, "banners", selectedID);
        deleteDoc(bannerDocRef).finally(() => {
            window.location.reload();
        });
    }
}

function editBanner() {
    if (typeof selectedID === 'undefined') {
        const notification = document.getElementById('notificationError');
        notification.innerHTML = '';
        notification.appendChild(document.createTextNode(`You must Select Banner`));
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.classList.remove('show', 'hide');
            }, 500);
        }, 2000);
    }
    else {
        dialogEdit.style.display = 'flex';
        const formData = new FormData(editForm);
        formData.set('name', selectedPosition);
        const position = formData.get('name');
        selection.value = position;
        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const data = new FormData(editForm);
            const image = data.get('image');
            var loader = document.querySelector('.loading-indicator');
            loader.style.borderTopColor = 'rgb(255, 187, 0)';
            loader.style.display = 'block';
            submitEditButton.style.display = 'none';
            closeDialogEdit.style.display = 'none';
            if (typeof image === undefined) {
                const docRef = doc(db, 'banners', selectedID);
                await updateDoc(docRef, {
                    position: selection.value
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
                const deleteIMG = ref(storage, `Banners/${selectedImageName}`);
                deleteObject(deleteIMG)
                const storageRef = ref(storage, `Banners/${image.name}`);
                await uploadBytes(storageRef, image);
                const imageUrl = await getDownloadURL(storageRef);
                const docRef = doc(db, 'banners', selectedID);
                await updateDoc(docRef, {
                    imageUrl: imageUrl,
                    name: image.name,
                    position: selection.value
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
    deleteBanner();
});
document.getElementById('editDialog').addEventListener('click', function () {
    editBanner();
});


