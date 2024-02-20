import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore"
import { db } from "../firebase"
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem'
import Listing from './Listing';
import { useParams } from 'react-router';
import BookItem from '../components/BookItem';
import BookDetail from './BookDetail';

export default function OnLoanBook() {
    const [books, setBooks] = useState(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const [lastFetchedBook, setLastFetchedBook] = useState(null);
    useEffect(() => {
        async function fetchBooks() {
            try {
                const bookRef = collection(db, "books");
                const q = query(
                    bookRef,
                    where("status", "==", true),
                    orderBy("timestamp", "desc"),
                    limit(4)
                );
                const querySnap = await getDocs(q);
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedBook(lastVisible);
                const books = [];
                querySnap.forEach((doc) => {
                    return books.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });
                setBooks(books);
                setLoading(false);
            } catch (error) {
                toast.error("リストを取得できませんでした。")
            }
        }
        fetchBooks()
    }, []);

    async function onFetchMoreBooks() {
        try {
            const bookRef = collection(db, "books");
            const q = query(
                bookRef,
                where("status", "==", true),
                orderBy("timestamp", "desc"),
                startAfter(lastFetchedBook),
                limit(4)
            );
            const querySnap = await getDocs(q);
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedBook(lastVisible);
            const books = [];
            querySnap.forEach((doc) => {
                return books.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setBooks((prevState) => [...prevState, ...books]);
            setLoading(false);
        } catch (error) {
            toast.error("リストを取得できませんでした。")
        }
    }


    return <div className='max-w-6xl mx-auto px-3'>
        <h1 className='text-3xl text-center mt-6 font-bold mb-6'>貸出中の本</h1>
        {loading ? (
            <Spinner />
        ) : books && books.length > 0 ? (
            <>
                <main>
                    <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                        {books.map((book) => (
                            <BookItem
                                key={book.id}
                                id={book.id}
                                book={book.data}
                            />
                        ))}
                    </ul>
                </main>
                {lastFetchedBook && (
                    <div className='flex justify-center items-center'>
                        <button onClick={onFetchMoreBooks} className='bg-white px-3 py-1.5 text-gray-700 border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out'>
                            Load more
                        </button>
                    </div>
                )}
            </>
        ) : (
            <p>現在、借りられる本がありません</p>
        )
        }
    </div >
}
