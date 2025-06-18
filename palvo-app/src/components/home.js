// Em src/components/home.js
import React from 'react';
import SignOutButton from './SignOutButton'; // Importe o botão de sair
import Dashboard from './Dashboard/Dashboard';
import { ObjetivoCard } from './ObjetivoCard/ObjetivoCard';

function Home() {
  // Para testar, pegue o ID de um objetivo que você criou e cole aqui.
  // No futuro, esta página mostraria uma lista de todos os objetivos.
  const idDoObjetivoParaExibir = "8JLscxtEk1gVt20uzDSm";

  return (
    <div>
      <ObjetivoCard objetivoId={idDoObjetivoParaExibir} /> 
      {/* <Dashboard />  */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <SignOutButton />
      </div>
    </div>
  );
}

export default Home;