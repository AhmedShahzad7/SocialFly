import {  FIREBASE_AUTH,FIRESTORE_DB } from "../FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, updateDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

class AuthService {
    constructor(instance) {
        this.instance = instance;
    }
    authenticate = async (formData) => {
        return await this.instance.authenticate(formData);
    };
}

class LoginClass extends AuthService {
    constructor() {
        super();
    }
    authenticate = async (formData) => {
        const auth = FIREBASE_AUTH;
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
    };
}

class SignUpClass extends AuthService {
    constructor() {
        super();
    }

    authenticate = async (formData) => {
        const auth = FIREBASE_AUTH;
        const userinfo = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userinfo.user;

        // Create user entry in Firestore
        await setDoc(doc(FIRESTORE_DB, "Users", user.uid), {
            fullName: formData.fullname,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            createdAt: new Date(),
        });
    }
}

class updateUserinfo extends AuthService {
    constructor() {
        super();
    }
    authenticate = async (formData) => {
        const user = getAuth().currentUser;
        const userDoc = await getDoc(doc(FIRESTORE_DB, "Users", user.uid));

        await updateDoc(userDoc.ref, {
            fullName: formData.fullName,
        });
    };
}

class FriendRequestsend extends AuthService {
    constructor() {
        super();
    }
    authenticate = async (formData) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const userDoc = doc(FIRESTORE_DB, 'Users', currentUser.uid);
        const userSnap = await getDoc(userDoc);
        const fromUsername = userSnap.data().username;
        const request = {
          from: fromUsername,
          toUsername: formData.sendusername,
          status: 'pending',
          timestamp: new Date(),
        };
    
        await addDoc(collection(FIRESTORE_DB, 'FriendRequests'), request);
    };
}

export { LoginClass, AuthService,SignUpClass,updateUserinfo,FriendRequestsend}