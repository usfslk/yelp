import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyBAnjdnySDvGLXdsyKLQqZkw8LJ5spW1lU",
    authDomain: "review-nlp.firebaseapp.com",
    databaseURL: "https://review-nlp.firebaseio.com",
    projectId: "review-nlp",
    storageBucket: "review-nlp.appspot.com",
    messagingSenderId: "716815148318"
    };

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();