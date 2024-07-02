import { db, collection, getDocs, doc, getDoc, updateDoc } from '../../Database/firebase-config.js';


window.onload = () => {
    const displayOrders = async () => {
        const ordersDiv = document.getElementById('allOrders');
        const orderCollection = collection(db, "orders");
        try {
            const querySnapshot = await getDocs(orderCollection);
            querySnapshot.forEach((order) => {
                const orderData = order.data();
                const orderImages = document.createElement('div');
                orderImages.classList.add('parent-div');
                var state;
                if (orderData['status'] == 'pendding') {
                    state = 'Pending';
                }
                if (orderData['status'] == 'accepted') {
                    state = 'Accepted';
                    orderImages.style.borderColor = 'green';
                }
                if (orderData['status'] == 'rejected') {
                    state = 'Rejected';
                    orderImages.style.borderColor = 'red';
                }
                if (orderData['status'] == 'completed') {
                    state = 'Completed';
                    orderImages.style.borderColor = 'orange';
                }
                var p = [];
                p = orderData['products'];
                 for (let i = 0; i < p.length; i++){
                    const orderImage = document.createElement('div');
                    const titles = document.createElement('div');
                    orderImage.classList.add('div-image');
                    const productsCollection = doc(db, "products", p[i]);
                     getDoc(productsCollection).then((docSnap) => {
                         const data = docSnap.data();
                         
                         
                         console.log(docSnap.data());
                         // create label name
                         var pos = document.createElement('label');
                         pos.classList.add('labelProduct');
                         const title = document.createTextNode(`${data['title']}`);
                         pos.appendChild(title);
                         // create label quantity
                         var quantitiyDiv = document.createElement('label');
                         quantitiyDiv.classList.add('labelProduct');
                         const q = document.createTextNode(`Quantity: ${orderData['quantity'][i]}`);
                         quantitiyDiv.appendChild(q);
                         // create image
                         const img = document.createElement('img');
                         img.src = data['imageUrl'];
                         img.alt = "Product Image";
                         img.classList.add('image');
                         titles.appendChild(pos);
                         titles.appendChild(document.createElement('br'));
                         titles.appendChild(quantitiyDiv);
                         orderImage.appendChild(img);
                         orderImage.appendChild(titles);
                         orderImages.appendChild(orderImage);
                     });
                }

                // accept & reject button
                const btns = document.createElement('div');
                btns.style.display = 'flex';
                var acceptLabel = document.createElement('p');
                acceptLabel.classList.add('buttonAccept');
                const acc = document.createTextNode(`Accept Order`);
                acceptLabel.appendChild(acc);
                var rejectLabel = document.createElement('p');
                rejectLabel.classList.add('buttonReject');
                const rej = document.createTextNode(`Reject Order`);
                rejectLabel.appendChild(rej);
                acceptLabel.addEventListener('click', async function () {
                    const docRef = doc(db, 'orders', order.id);
                    await updateDoc(docRef, {
                        status: 'accepted'
                    }).then(() => {
                        window.location.reload();
                    });
                });
                rejectLabel.addEventListener('click', async function () {
                    const docRef = doc(db, 'orders', order.id);
                    console.log(id);
                    await updateDoc(docRef, {
                        status: 'rejected'
                    }).then(() => {
                        window.location.reload();
                    });
                });
                btns.appendChild(rejectLabel);
                btns.appendChild(acceptLabel);
                orderImages.appendChild(btns);
                
                // create label status
                var statuslabel = document.createElement('label');
                var statusDiv = document.createElement('div');
                statusDiv.classList.add('status');
                statuslabel.classList.add('labelProduct');
                if (orderData['status'] == 'accepted') {
                    statuslabel.style.backgroundColor = 'green';
                }
                if (orderData['status'] == 'rejected') {
                    statuslabel.style.backgroundColor = 'red';
                }
                if (orderData['status'] == 'completed') {
                    statuslabel.style.backgroundColor = 'blue';
                }
                const s = document.createTextNode(`${state}`);
                statuslabel.appendChild(s);
                statusDiv.appendChild(statuslabel);
                orderImages.appendChild(statusDiv);
                // parent
                ordersDiv.appendChild(orderImages);
            });
        } catch (error) {
            
        }
    }
    displayOrders();
};