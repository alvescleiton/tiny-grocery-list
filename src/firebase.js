import * as firebase from 'firebase';
import config from './config/firebase.config'

firebase.initializeApp(config);
const firebaseRef = firebase.database().ref();

export default firebaseRef