export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-cyan-600">Bienvenue sur Create.xyz !</h1>
      <p className="mt-4 text-lg text-cyan-800">Votre projet Next.js fonctionne.</p>
      <a href="/combat-sangliers" className="mt-8 px-4 py-2 bg-yellow-400 text-black rounded-lg font-bold">Jouer au combat des sangliers</a>
    </main>
  );
}
