// Em src/components/home.js
import React from 'react';
import SignOutButton from './SignOutButton'; // Importe o botão de sair

function Home() {
  return (
    <div>
      <h1>Bem-vindo ao pAlvo!</h1>
      <p>Esta é a sua página principal.</p>
      <SignOutButton />
    </div>
  );
}
export default Home;