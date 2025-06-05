import { signOut } from "firebase/auth";
import { auth } from '../firebase-config';

function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Usuário deslogado com sucesso.");
    } catch (error) {
      console.error("Erro ao sair:", error.message);
      alert(`Erro ao sair: ${error.message}`);
    }
  };

  return (
    <button onClick={handleSignOut} style={{ marginLeft: '20px' }}>
      Sair
    </button>
  );
}

export default SignOutButton;