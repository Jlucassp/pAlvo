import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Irei deixar essas chaves aqui, pois o repositório está PRIVADO. Se for torna-lo público,
// é importante criar um .env

const firebaseConfig = {
  apiKey: "AIzaSyDRdsUCmLb43-0ThZJ8MWpm89J87Y0uFlg",
  authDomain: "palvo-44fe7.firebaseapp.com",
  projectId: "palvo-44fe7",
  storageBucket: "palvo-44fe7.firebasestorage.app",
  messagingSenderId: "135078743373",
  appId: "1:135078743373:web:b2187d1bd55e8935a3fb04",
  measurementId: "G-T0N7CLCVLV"
};

const app = initializeApp(firebaseConfig);

// Exporte a instância de autenticação para ser usada em seus componentes React
export const auth = getAuth(app);

// Exporte o app se precisar de outros serviços Firebase
//export default app;