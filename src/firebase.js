import firebase from 'firebase';

const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyAJ8PVJjHki-MJ-ME6gF5-aHvZcSoWO42Y",
    authDomain: "piczta-ba2e0.firebaseapp.com",
    projectId: "piczta-ba2e0",
    storageBucket: "piczta-ba2e0.appspot.com",
    messagingSenderId: "137839826625",
    appId: "1:137839826625:web:4dec99cf4d4ab1fbb9e640",
    measurementId: "G-VM9PXRXW4R"
})

const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export default db;
export {auth,storage};