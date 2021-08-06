import firebase from 'firebase';



const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export default db;
export {auth,storage};
