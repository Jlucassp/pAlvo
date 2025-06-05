// src/components/SignIn.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase-config';

function SignIn() {
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
      // Ações adicionais após o login bem-sucedido:
      // TODO

      setEmail('');
      setPassword('');
    } catch (err) {
      console.error("Erro no login:", err.message);  
      let msg = "Erro ao fazer login.";
      if (err.code === 'auth/user-not-found') {
        msg = 'Usuário não encontrado.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Senha incorreta.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'E-mail inválido.';
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSignIn}>
        <div>
          <label htmlFor="signin-email">Email:</label>
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>
        <div>
          <label htmlFor="signin-password">Senha:</label>
          <input
            id="signin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>{isLoading ? 'Entrando' : 'Entrar'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
    </div>
  );
}

export default SignIn;