import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Updated Firebase Documentation
// db setup -> https://firebase.google.com/docs/web/setup
// authentication -> https://blog.logrocket.com/user-authentication-firebase-react-apps/
// storage -> https://firebase.google.com/docs/storage/web/upload-files


const firebaseConfig = {
    apiKey: "AIzaSyAyKQHI04bseEDsBuVLyDHyAqhZfPXH5NM",
    authDomain: "social-media-app-6a63c.firebaseapp.com",
    projectId: "social-media-app-6a63c",
    storageBucket: "social-media-app-6a63c.appspot.com",
    messagingSenderId: "352917666928",
    appId: "1:352917666928:web:155ee54baa0481842ec8b5",
    measurementId: "G-ZKDQHNGRXZ"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage();

const getData = async () => {
    const postCol = collection(db, 'posts');
    const snapshot = await getDocs(postCol);
    return snapshot;
}

const getComments = async (postId) => {
    const commentCol = collection(db, `posts/${postId}/comments`);
    const snapshot = await getDocs(commentCol);
    return snapshot;
}

const addComment = async (postId, comment, username) => {
    const docRef = await addDoc(collection(db, `posts/${postId}/comments`), {
        timestamp: serverTimestamp(),
        comment: comment,
        username: username,
    });
    console.log("Document written with ID: ", docRef.id);
}

const uploadPost = (image, caption, username, setProgress) => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            //progress function
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
        },
        (error) => {
            // Handle unsuccessful uploads
            console.log(error);
            alert(error.message);
            window.location.reload();
        },
        () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log('File available at', downloadURL);
                const docRef = await addDoc(collection(db, "posts"), {
                    timestamp: serverTimestamp(),
                    caption: caption,
                    imageUrl: downloadURL,
                    username: username,
                });
                console.log("Document written with ID: ", docRef.id);
                setProgress(0);
                window.location.reload();
            });
        },
    );
}

const registerWithEmailAndPassword = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        return res;
    } catch (err) {
        console.log(err.message);
        alert(err.message);
        return err;
    }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res;
    } catch (err) {
        console.error(err.message);
        alert(err.message);
        return err;
    }
};


export {
    getData,
    getComments,
    addComment,
    uploadPost,
    registerWithEmailAndPassword,
    logInWithEmailAndPassword,
    auth,
    updateProfile,
    signOut,
    storage,
};