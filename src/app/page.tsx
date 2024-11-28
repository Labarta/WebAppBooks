import BookList from '@/app/components/BookList'; // Asegúrate de que la ruta sea correcta

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <BookList />
    </main>
  );
}
