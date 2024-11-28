const API_URL = 'https://localhost:7193/api';

export const fetchBooks = async () => {
    const response = await fetch(`${API_URL}/Books`);
    if (!response.ok) throw new Error('Error fetching books');
    return response.json();
};

export const fetchBookById = async (id: number) => {
    const response = await fetch(`${API_URL}/Books/${id}`);
    if (!response.ok) throw new Error('Error fetching book');
    return response.json();
};

export const createBook = async (book: any) => {
    const response = await fetch(`${API_URL}/Books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error('Error creating book');
    return response;
};


export const updateBook = async (id: number, book: any) => {
    const response = await fetch(`${API_URL}/Books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error('Error al actualizar el libro');
    return response;
};

export const deleteBook = async (id: number) => {
    const response = await fetch(`${API_URL}/Books/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error borrando el libro');
    return response;
};
