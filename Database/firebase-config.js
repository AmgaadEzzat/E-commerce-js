
import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, getDoc, doc, setDoc, deleteDoc, updateDoc,
    query, where, getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
    getStorage, ref, uploadBytes, getDownloadURL, deleteObject 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { 
    getDatabase, set, push, onValue, update 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



// const firebaseConfig = {
//     apiKey: "AIzaSyCx4SOlmhgw5VfFlBO7xWQZMGvxIZa_TWw",
//     authDomain: "my-ecommerce-743d4.firebaseapp.com",
//     projectId: "my-ecommerce-743d4",
//     storageBucket: "my-ecommerce-743d4.appspot.com",
//     messagingSenderId: "63574676290",
//     appId: "1:63574676290:web:8da17c5925247814c2eedb",
//     measurementId: "G-PS4S1WDJ9T"
// };


const firebaseConfig = {
    apiKey: "AIzaSyCdLjxezxSJ3hHNjoQ4L0QLY1dohdSD_oM",
    authDomain: "ecommerce-2fbcb.firebaseapp.com",
    projectId: "ecommerce-2fbcb",
    storageBucket: "ecommerce-2fbcb.appspot.com",
    messagingSenderId: "746486198725",
    appId: "1:746486198725:web:31cbbd6d6cdd1b8ddbdbac",
    measurementId: "G-7ZCZZ4RC6R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, db, auth, storage, update, getDoc, deleteDoc, deleteObject, 
    getDownloadURL, uploadBytes, signOut, database, set, push, onValue, 
    createUserWithEmailAndPassword, signInWithEmailAndPassword, collection, 
    addDoc, getDocs, setDoc, doc, ref, updateDoc, onAuthStateChanged, getAuth,
    query, where, getCountFromServer
};