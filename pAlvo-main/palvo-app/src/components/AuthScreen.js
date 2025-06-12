// Dentro de src/components/AuthScreen.js

import React, { useState } from 'react';

// Importe os componentes que a equipe de backend já criou
import SignIn from './SignIn';
import SignUp from './SignUp';
import SignInWithGoogle from './SignInWithGoogle';

// Importe o arquivo CSS que vamos criar no próximo passo
import './AuthScreen.css'; 

// Importe a imagem que você vai usar
import rocketImage from '../assets/Logo_Inicial_pAlvo_contextoAmigavel.png'; 

function AuthScreen() {
  // 'view' controla o que é exibido: 'options', 'signin', ou 'signup'
  const [view, setView] = useState('options'); 

  // Função para renderizar o conteúdo principal
  const renderContent = () => {
    switch (view) {
      case 'signin':
        // Mostra o formulário de login e um link para voltar
        return (
          <>
            <SignIn />
            <button onClick={() => setView('options')} className="back-link">
              &larr; Voltar
            </button>
          </>
        );
      case 'signup':
        // Mostra o formulário de cadastro e um link para voltar
        return (
          <>
            <SignUp />
            <button onClick={() => setView('options')} className="back-link">
              &larr; Voltar
            </button>
          </>
        );
      default:
        // 'options' é a visão padrão
        return (
          <>
            
            <SignInWithGoogle className="google-btn" />
            
            <div className="separator">
                <span>OU</span>
            </div>
            
            <button onClick={() => setView('signup')} className="create-account-btn">
              Criar conta
            </button>
            
            <p className="terms-text">
                Ao se inscrever, você concorda com os <a href="#">Termos de Serviço</a> e a <a href="#">Política de Privacidade</a>.
            </p>
            
            <div className="login-prompt">
              <span>Já tem conta?</span>
              <button onClick={() => setView('signin')} className="login-btn">
                Entrar
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-illustration">
        <img src={rocketImage} alt="Foguete no alvo" />
      </div>
      
      <div className="auth-form">
        <h1>Comece a focar em suas metas!!</h1>
        {renderContent()}
      </div>
    </div>
  );
}

export default AuthScreen;