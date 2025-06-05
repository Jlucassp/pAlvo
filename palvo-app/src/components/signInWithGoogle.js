import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase-config';

const provider = new GoogleAuthProvider();

function SignInWithGoogle() {

  const [errorMessage, setErrorMessage] = useState('');  

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuário logado com Google:", user);
      // O token de acesso do Google:

      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        const token = credential.accessToken;
        console.log("Google Access Token:", token);
      }

      //TODO: Qual redirecionamento agora que o login foi bem sucedido?
    } catch (error) {
      console.error("Código do Erro:", error.code);
      console.error("Mensagem do Erro:", error.message);

      if (error.customData && error.customData.email) {
        console.error("Email relacionado ao erro:", error.customData.email);
      }
      if (GoogleAuthProvider.credentialFromError(error)) {
        console.error("Credencial relacionada ao erro:", GoogleAuthProvider.credentialFromError(error));
      }

      let friendlyMessage = "Ocorreu um erro ao tentar fazer login com o Google.";
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          friendlyMessage = "Você fechou a janela de login antes de completar o processo. Por favor, tente novamente.";
          break;
        case 'auth/popup-blocked':
          friendlyMessage = "O login com Google foi bloqueado pelo seu navegador. Verifique se os pop-ups estão permitidos para este site e tente novamente.";
          break;
        case 'auth/cancelled-popup-request':
          friendlyMessage = "A solicitação de login foi cancelada. Por favor, tente novamente.";
          break;
        case 'auth/account-exists-with-different-credential':
          friendlyMessage = "Já existe uma conta com este endereço de e-mail, mas utilizando um método de login diferente. Tente fazer login com o outro método.";
          break;
        case 'auth/operation-not-allowed':
            friendlyMessage = "Login com Google não está habilitado para esta aplicação. Contate o suporte.";
            break;
        case 'auth/network-request-failed':
            friendlyMessage = "Houve um problema de rede. Verifique sua conexão e tente novamente.";
            break;
        default:
          friendlyMessage = `Erro: ${error.message}`;
      }
      setErrorMessage(friendlyMessage);
    }
  };

   return (
    <div>
      <button onClick={handleGoogleSignIn} style={{ marginTop: '10px' }}>
        Entrar com Google
      </button>
      {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
    </div>
  );
}

export default SignInWithGoogle;