import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyD-ms1KCj9ea7mNOATIGLCOgIKpxW8687g",
    authDomain: "help-me-aux-aspire-test.firebaseapp.com",
    databaseURL: "https://help-me-aux-aspire-test.firebaseio.com",
    projectId: "help-me-aux-aspire-test",
    storageBucket: "help-me-aux-aspire-test.appspot.com",
    messagingSenderId: "71268946504"
};

firebase.initializeApp(config);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;