import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCSM4SezoKLcfM05qGZvYcapp_EsCcNJBk",
  //AIzaSyD-Q0SwLQmyPJZFbGV01h8qFT9qFLjazuQ
  //AIzaSyCSM4SezoKLcfM05qGZvYcapp_EsCcNJBk
  authDomain: "food-ordering-4dcf1.firebaseapp.com",
  projectId: "food-ordering-4dcf1",
  storageBucket: "food-ordering-4dcf1.appspot.com", // <-- fixed typo here
  messagingSenderId: "645829755864",
  appId: "1:645829755864:web:798c421248bd3cb301a8ad",
  measurementId: "G-VVKR89PBQY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Analytics is optional and only works in the browser
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { analytics };