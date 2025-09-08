/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js")

firebase.initializeApp({
  apiKey: "AIzaSyBvBHE_v7srb5TAiaoELUdiByHUvmAg7MA",
  authDomain: "cryptoicoeu.firebaseapp.com",
  projectId: "cryptoicoeu",
  storageBucket: "cryptoicoeu.firebasestorage.app",
  messagingSenderId: "1025789584580",
  appId: "1:1025789584580:web:097be2521f8f895f0d5591",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log("Background message ", payload)
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/icon-192.png",
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
