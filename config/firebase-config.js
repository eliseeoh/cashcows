import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBI5EFePdUtipAz-lFaFLPSF0cdqsFG788",
  authDomain: "cashcows-4102f.firebaseapp.com",
  projectId: "cashcows-4102f",
  storageBucket: "cashcows-4102f.appspot.com",
  messagingSenderId: "3300826133",
  appId: "1:3300826133:web:1b7dba3c310bd4e79b821c",
  measurementId: "G-2Y9BTCW0TX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);