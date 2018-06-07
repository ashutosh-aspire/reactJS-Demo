import {firebaseAuth, googleProvider, facebookProvider} from "./authConstants.js";

export function loginWithGoogle() {
    return firebaseAuth().signInWithRedirect(googleProvider);
    //return authenticate(loginWithFirebase(googleProvider));
}

export function loginWithFacebook() {
    return firebaseAuth().signInWithRedirect(facebookProvider);
    //return authenticate(loginWithFirebase(facebookProvider));
}


// function authenticate(promise) {
//     return promise
//         .then(function (result) {
//             var token = result.credential.accessToken;
//             var user = result.user;
//             console.log("login happened with firebase, ", JSON.stringify(user));
//             localStorage.setItem("firebaseUser", JSON.stringify(result));
//             return Promise.resolve(result);
//         }).catch(function(error){
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             var email = error.email;
//             var credential = error.credential;
//             alert("failed firebase login" + error);
//             return Promise.reject("err");
//         });
// }

function loginWithFirebase(provider) {
    return firebaseAuth().signInWithRedirect(provider);
}

export function logout() {
    return firebaseAuth().signOut();
}

