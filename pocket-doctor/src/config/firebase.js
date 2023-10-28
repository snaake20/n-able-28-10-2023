import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAJIzu81vxkNqtbLhHBHDSnjKIySV8WZY8',
  authDomain: 'pocket-doctor-3bd2d.firebaseapp.com',
  projectId: 'pocket-doctor-3bd2d',
  storageBucket: 'pocket-doctor-3bd2d.appspot.com',
  messagingSenderId: '692417736583',
  appId: '1:692417736583:web:e6005086594197f99d6d22',
};

const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);
export const auth = getAuth(app);
