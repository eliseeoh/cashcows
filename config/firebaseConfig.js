import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCxgpWsVXck0X_jXZjCjIaLV_uO0qVZaJU",
    authDomain: "cashcows-4102f.firebaseapp.com",
    projectId: "cashcows-4102f",
    storageBucket: "cashcows-4102f.appspot.com",
    messagingSenderId: "3300826133",
    appId: "1:3300826133:android:7cbd57d9d1e2f3349b821c",
    measurementId: "G-4SHD1K0CC5",
};
   

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };