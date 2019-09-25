import firebase from 'firebase/app'
import 'firebase/database';
import config from './config/firebase.config'

firebase.initializeApp(config)
const firebaseRef = firebase.database().ref()

export default firebaseRef