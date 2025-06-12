import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase-config';
import './App.css';

// Importe os componentes que representam suas páginas
import AuthScreen from './components/AuthScreen'; // Sua tela de login/cadastro
import Home from './components/home'; // A tela principal para o usuário logado

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Esta lógica do Firebase é essencial e será mantida
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Mostra "Carregando..." enquanto o Firebase verifica o status do usuário
  if (loading) {
    return <div className="loading-container">Carregando...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rota Principal ("/") */}
        <Route 
          path="/" 
          element={
            // Se EXISTE um usuário logado, mostre a página Home.
            // Se NÃO, redirecione para a página de login.
            currentUser ? <Home /> : <Navigate to="/signin" />
          } 
        />

        {/* Rota de Login ("/signin") */}
        <Route 
          path="/signin" 
          element={
            // Se NÃO existe um usuário logado, mostre a sua tela AuthScreen.
            // Se o usuário JÁ ESTÁ logado, redirecione para a página principal.
            !currentUser ? <AuthScreen /> : <Navigate to="/" />
          } 
        />
        
        {/* Você pode adicionar outras rotas aqui no futuro, como /signup ou /profile */}
      </Routes>
    </Router>
  );
}

export default App;