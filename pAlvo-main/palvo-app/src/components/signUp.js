import React, { useState } from 'react';
// Importa as funções necessárias do Firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../firebase-config';

// Importa o nosso CSS para deixar o formulário bonito
import './SignUp.css';

// Importa a imagem do logo
import rocketLogo from '../assets/Logo_Inicial_pAlvo_contextoAmigavel.png'; 

function SignUp() {
  // --- LÓGICA DO BACKEND (MANTIDA E AMPLIADA) ---
  
  // Adicionamos os novos estados para os campos do protótipo
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError(null);

    // Nova verificação: garantir que as senhas coincidem
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return; // Interrompe o cadastro se as senhas forem diferentes
    }

    setIsLoading(true);
    try {
      // 1. Cria o usuário com e-mail e senha (lógica que você já tinha)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Adiciona o nome ao perfil do usuário recém-criado
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      console.log("Usuário cadastrado com nome:", userCredential.user);
      
      // Limpa os campos após o sucesso
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      // Toda a sua lógica de tratamento de erros foi mantida
      console.error("Erro no cadastro:", err.message);
      let msg = 'Erro ao cadastrar.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está em uso.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'E-mail inválido.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'A senha deve ter no mínimo 6 caracteres.';
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- INTERFACE (JSX) ATUALIZADA PARA FICAR IGUAL AO PROTÓTIPO ---
  return (
    <div className="signup-form-container">
      <img src={rocketLogo} alt="Logo pAlvo" className="signup-logo" />
      <h2>Criar sua conta</h2>
      
      <form onSubmit={handleSignUp} className="signup-form">
        <input 
          type="text" 
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
        />
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
        <input 
          type="password" 
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required 
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar-se'}
        </button>
      </form>
      {/* Exibe a mensagem de erro, se houver */}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

export default SignUp;