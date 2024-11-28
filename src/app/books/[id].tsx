import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchBookById } from '@/app/utils/api';

const BookDetail = () => {
    const router = useRouter();
    const { id } = router.query;

    const [book, setBook] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const getBook = async () => {
            try {
                const data = await fetchBookById(Number(id));
                setBook(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        getBook();
    }, [id]);

    if (error) return <div>Error: {error}</div>;
    if (!book) return <div>Loading...</div>;

    return (
        <div>
            <h1>{book.title}</h1>
            <p>{book.description}</p>
            <p>Published on: {book.publishDate}</p>
        </div>
    );
};

export default BookDetail;
