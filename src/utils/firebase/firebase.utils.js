import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCt3eKpTis4viNPZVuUD7J8b6pd-rc-mOQ',
  authDomain: 'crwn-clothing-db-1d005.firebaseapp.com',
  projectId: 'crwn-clothing-db-1d005',
  storageBucket: 'crwn-clothing-db-1d005.appspot.com',
  messagingSenderId: '1085144240580',
  appId: '1:1085144240580:web:fe79e452e8cc625a5d1491',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Setting up the Google provider
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();

// Sign-In methods with Google
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, provider);

export const db = getFirestore();

// Creating the collection and documents (once, to load data)
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());

    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done');
};

// Getting mapped categories from Firebase
export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
};

// Create a document in the Firebase collection:
export const createUserDocumentFromAuth = async (
  userAuth,
  additionalDetails = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.log('Error creating the user', error.message);
    }
  }

  return userSnapshot;
};

// Create user auth data with email & password
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

// Log out
export const signOutUser = async () => await signOut(auth);

// Check the current auth session
export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubcsribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubcsribe();
        resolve(userAuth);
      },
      reject
    );
  });
};
