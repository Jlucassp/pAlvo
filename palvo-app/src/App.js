import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase-config';

import SignUp from './components/signUp';
import SignIn from './components/signIn';
import SignInWithGoogle from './components/signInWithGoogle';
import SignOutButton from './components/signOutButton';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        console.log("Usuário logado detectado:", user);
      } else {
        console.log("Nenhum usuário logado detectado.");
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>pAlvo</h1>
        {currentUser ? (
          <div>
            <p>Bem-vindo, {currentUser.displayName || currentUser.email}!</p>
            {/* TODO: renderizaria o conteúdo principal*/}
            <p>Seu UID: {currentUser.uid}</p>
            <SignOutButton />
          </div>
        ) : (
          <div>
            <p>Por favor, faça login ou cadastre-se.</p>
            <SignIn />
            <hr />
            <SignUp />
            <hr />
            <SignInWithGoogle />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;