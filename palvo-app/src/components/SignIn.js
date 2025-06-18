// Dentro de src/components/SignIn.js

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase-config';

// Passo 1: Importe o MESMO CSS do SignUp para reutilizar os estilos!
import './SignUp.css'; 

// Importe a imagem do logo que você já tem
import rocketLogo from '../assets/Logo_Inicial_pAlvo_contextoAmigavel.png';

function SignIn() {
  // --- TODA A SUA LÓGICA DE BACKEND ESTÁ MANTIDA ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuário logado:", userCredential.user);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error("Erro no login:", err.message);  
      let msg = "E-mail ou senha incorretos."; // Mensagem padrão mais amigável
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'E-mail ou senha incorretos. Por favor, tente novamente.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'O formato do e-mail é inválido.';
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- INTERFACE (JSX) ATUALIZADA PARA FICAR IGUAL AO PROTÓTIPO ---
  return (
    <div className="signup-form-container"> {/* Usando a mesma classe do container */}
      <img src={rocketLogo} alt="Logo pAlvo" className="signup-logo" />
      <h2>Fazer Login</h2>
      
      <form onSubmit={handleSignIn} className="signup-form"> {/* Usando a mesma classe do formulário */}
        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {/* Exibe a mensagem de erro, se houver */}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

export default SignIn;
