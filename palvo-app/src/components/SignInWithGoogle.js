// Dentro de src/components/SignInWithGoogle.js (já renomeado)

import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase-config';

// O componente agora aceita 'className' como uma propriedade (prop)
function SignInWithGoogle({ className }) {
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário logado com Google:", result.user);
    } catch (error) {
      console.error("Erro no login com Google:", error.message);
      // Aqui você poderia usar o seu código de tratamento de erros,
      // ou passar uma função de callback para exibir o erro na tela principal.
    }
  };

  return (
    // O botão agora usa a classe que passarmos para ele e tem o texto do protótipo
    <button onClick={handleGoogleSignIn} className={className}>
      Inscreva-se com o Google
    </button>
  );
}

export default SignInWithGoogle;
