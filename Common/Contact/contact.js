import { db, collection, addDoc } from '../../Database/firebase-config.js';

document.getElementById("SubmitBtn").addEventListener("click", SendAMessage)

async function SendAMessage() {
        const Firstname = document.getElementById("Firstname");
        const Lastname = document.getElementById("Lastname");
        const EmailAddress = document.getElementById("EmailAddress");
        const Phonenumber = document.getElementById("Phonenumber");
        const Message = document.getElementById("Message");
        await addDoc(
                collection(db, "contact"), {
                Fullname: Firstname.value + Lastname.value,
                Email: EmailAddress.value,
                Phone: Phonenumber.value,
                Msg: Message.value
        }).then(() => {
                alert("sent Message Successefully :)")
                Firstname.value = "";
                Lastname.value = "";
                EmailAddress.value = "";
                Phonenumber.value = "";
                Message.value = "";
        }
        ).catch((error) => { alert(`Error${error}`) });
}