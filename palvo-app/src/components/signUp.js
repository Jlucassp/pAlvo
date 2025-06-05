import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase-config';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuário cadastrado:", userCredential.user);
      // Ações adicionais após o cadastro bem-sucedido:
      // TODO

      // Limpar campos do cadastro
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error("Erro no cadastro:", err.message);
      let msg = 'Erro ao cadastrar.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está em uso.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'E-mail inválido.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'A senha é muito fraca.';
      }
      setError(msg);
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Cadastrar</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="signup-email">Email:</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>
        <div>
          <label htmlFor="signup-password">Senha:</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha (mínimo 6 caracteres)"
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>{isLoading ? 'Cadastrando...' : 'Cadastrar'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
    </div>
  );
}

export default SignUp;