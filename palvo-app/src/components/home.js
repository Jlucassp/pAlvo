// Em src/components/home.js
import React from 'react';
import SignOutButton from './SignOutButton'; // Importe o botão de sair
import MarketingGoalCard from './MarketingGoalCard/MarketingGoalCard';

function Home() {
  return (
    <div>
      <h1>Bem-vindo ao pAlvo!</h1>
      <p>Esta é a sua página principal.</p>
      <MarketingGoalCard />

      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <SignOutButton />
      </div>
    </div>
  );
}

export default Home;