"use client"

import { useState, useEffect } from 'react';
import { createBook, fetchBooks } from '@/app/utils/api';

const CreateBook = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [excerpt, setExcerpt] = useState(''); // Campo excerpt
    const [publishDate, setPublishDate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [existingBooks, setExistingBooks] = useState<any[]>([]);

    // Cargar libros existentes para obtener el ID máximo
    useEffect(() => {
        const fetchBooksData = async () => {
            try {
                const books = await fetchBooks();
                setExistingBooks(books);
            } catch (err: any) {
                setError('Error fetching books: ' + err.message);
            }
        };
        fetchBooksData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Generar el ID basado en el máximo ID existente
        const newId = existingBooks.length
            ? Math.max(...existingBooks.map((book) => book.id)) + 1
            : 1;

        const newBook = { title, description, excerpt, publishDate, id: newId };

        try {
            // Llamamos a la función para crear el libro
            await createBook(newBook);
            alert('Book created successfully!');
            setTitle('');
            setDescription('');
            setExcerpt('');
            setPublishDate('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Create Book</h1>
            {error && <div>Error: {error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <textarea
                    placeholder="Excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)} // Cambiar el valor de excerpt
                />
                <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateBook;
