"use client";
import GameApp from '../../components/game/GameApp.jsx';
import ClientOnly from '../../components/ClientOnly.js';

export default function CombatSangliersPage() {
  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-green-800">
          🐗 Chargement du donjon...
        </div>
      </div>
    }>
      <GameApp />
    </ClientOnly>
  );
}