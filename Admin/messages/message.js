import { db, collection, getDocs } from '../../Database/firebase-config.js';

window.onload = () => {
    const displayMessages = async () => {
        const MessagesDiv = document.getElementById('allMessages');
        const contactCollection = collection(db, "contact");
        try {
            const querySnapshot = await getDocs(contactCollection);
            var index = 0;
            querySnapshot.forEach((doc) => {
                index++;
                const data = doc.data();
                // create label
                const label = document.createElement('label');
                label.classList.add('labelBanner');
                const textNode = document.createTextNode(`(${index})  `);
                label.appendChild(textNode);
                // Position & ID
                const pos = document.createElement('label');
                pos.classList.add('labelBanner');
                const title = document.createTextNode(`${data['Msg']}`);
                pos.appendChild(title);
                const otherData = document.createElement('div');
                otherData.style.display = 'flex';
                otherData.style.flexDirection = 'column';
                otherData.style.alignItems = 'flex-start';
                otherData.style.justifyContent = 'center';
                otherData.appendChild(pos);
                // Create div
                const categoryDiv = document.createElement('div');
                categoryDiv.style.justifyContent = 'start';
                categoryDiv.classList.add('banner');
                categoryDiv.appendChild(label);
                categoryDiv.appendChild(otherData);
                // Parent
                MessagesDiv.appendChild(categoryDiv);
            });
        } catch (error) {

        }
    }
    displayMessages();
};