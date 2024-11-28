"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchBooks, deleteBook, createBook, updateBook } from '@/app/utils/api';
import { FaSearch } from 'react-icons/fa';

const BookList = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newBook, setNewBook] = useState({ title: '', description: '', excerpt: '' });
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
        setFilteredBooks(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    getBooks();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = books.filter((book) => book.id.toString().includes(value));
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  };

  const deleteBookHandler = async (id: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este libro?');
    if (confirmDelete) {
      try {
        await deleteBook(id);
        alert('Libro eliminado con éxito!');
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
        setFilteredBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const addBookHandler = () => {
    if (!newBook.title || !newBook.description) {
      alert('El título y la descripción son obligatorios.');
      return;
    }

    // Obtener el siguiente id disponible (basado en el id máximo existente)
    const nextId = books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1;

    const bookToAdd = { ...newBook, id: nextId };

    createBook(bookToAdd).then((createdBook) => {
      setBooks((prevBooks) => [...prevBooks, createdBook]);
      setFilteredBooks((prevBooks) => [...prevBooks, createdBook]);
      closeModal();
    }).catch((err: any) => {
      alert('Error al agregar el libro: ' + err.message);
    });
  };

  const saveEditedBookHandler = async () => {
    if (!selectedBook?.title || !selectedBook?.description) {
      alert('El título y la descripción son obligatorios.');
      return;
    }

    try {
      await updateBook(selectedBook.id, selectedBook);
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === selectedBook.id ? selectedBook : book
        )
      );
      setFilteredBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === selectedBook.id ? selectedBook : book
        )
      );
      setIsEditing(false);
      alert('Libro actualizado con éxito!');
      closeModal();
    } catch (err: any) {
      alert('Error al actualizar el libro: ' + err.message);
    }
  };

  const openModal = (book: any = null) => {
    if (book) {
      setSelectedBook(book);
      setNewBook({ title: book.title, description: book.description, excerpt: book.excerpt });
      setIsEditing(true);
    } else {
      setSelectedBook(null);
      setNewBook({ title: '', description: '', excerpt: '' });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const openDetailModal = (book: any) => {
    setSelectedBook(book);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDetailModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (isEditing) {
      setSelectedBook((prevBook: any) => ({
        ...prevBook,
        [name]: value,
      }));
    } else {
      setNewBook((prevBook: any) => ({
        ...prevBook,
        [name]: value,
      }));
    }
  };

  const handleBookClick = (book: any) => {
    setSelectedBook(book);
  };

  const truncateText = (text: string, lines: number): string => {
    if (!text) {
        return ''; 
      }
    
      const lineHeight = 1.2; 
      const maxLength = lines * lineHeight * 20; 
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Libros</h1>

      <div className="mb-6 text-center">
        <button onClick={() => openModal()} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Agregar Nuevo Libro
        </button>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Buscar por ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Modal para ver detalles */}
      {showDetailModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold">Detalles del Libro</h2>
            <div className="mt-4">
              <label className="block text-sm font-medium">Título</label>
              <input
                type="text"
                value={selectedBook.title}
                readOnly
                className="w-full p-2 mt-1 border rounded-md bg-gray-100"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Descripción</label>
              <textarea
                value={selectedBook.description}
                readOnly
                className="w-full p-2 mt-1 border rounded-md h-24 overflow-auto"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Extracto</label>
              <textarea
                value={selectedBook.excerpt}
                readOnly
                className="w-full p-2 mt-1 border rounded-md h-24 overflow-auto"
              />
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de agregar o editar libro */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold">{isEditing ? 'Editar Libro' : 'Nuevo Libro'}</h2>

            <div className="mt-4">
              <label className="block text-sm font-medium">Título</label>
              <input
                type="text"
                name="title"
                value={isEditing ? selectedBook?.title : newBook.title}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Descripción</label>
              <textarea
                name="description"
                value={isEditing ? selectedBook?.description : newBook.description}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md h-24"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Extracto</label>
              <textarea
                name="excerpt"
                value={isEditing ? selectedBook?.excerpt : newBook.excerpt}
                onChange={handleInputChange}
                className="w-full p-2 mt-1 border rounded-md h-24"
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={isEditing ? saveEditedBookHandler : addBookHandler}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                {isEditing ? 'Guardar Cambios' : 'Guardar'}
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de libros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded-lg shadow-md"
            onClick={() => handleBookClick(book)}
          >
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p>{truncateText(book.description, 3)}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => openDetailModal(book)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Ver Detalle
              </button>
              <div className="flex">
                <button
                  onClick={() => openModal(book)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mx-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteBookHandler(book.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
