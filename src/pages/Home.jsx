import { useEffect, useState } from 'react'
import Slider from '../components/Slider'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import BookItem from '../components/BookItem'

export default function Home() {
  //今すぐ借りられる本
  const [notOnLoanBooks, setNotOnLoanBooks] = useState(null)
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchBooks() {
      try {
        // get reference
        const booksRef = collection(db, "books");
        // create the query
        const q = query(booksRef, where("status", "==", false), orderBy("timestamp", "desc"), limit(4));
        // execute the query
        const querySnap = await getDocs(q);
        const books = [];
        querySnap.forEach((doc) => {
          return books.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setNotOnLoanBooks(books);
        //console.log(books);
      } catch (error) {
        //console.log(error);
      }
    }
    fetchBooks();
  }, [])

  //貸出中の本
  const [onLoanBooks, setOnLoanBooks] = useState(null)
  useEffect(() => {
    async function fetchBooks() {
      try {
        // get reference
        const booksRef = collection(db, "books");
        // create the query
        const q = query(booksRef, where("status", "==", true), orderBy("timestamp", "desc"), limit(4));
        // execute the query
        const querySnap = await getDocs(q);
        const books = [];
        querySnap.forEach((doc) => {
          return books.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOnLoanBooks(books);
        console.log(books);
      } catch (error) {
        console.log(error);
      }
    }
    fetchBooks();
  }, [])

  //ビジネス書
  const [businessBooks, setBusinessBooks] = useState(null)
  useEffect(() => {
    async function fetchBooks() {
      try {
        // get reference
        const booksRef = collection(db, "books");
        // create the query
        const q = query(booksRef, where("bookType", "==", "business"), orderBy("timestamp", "desc"), limit(4));
        // execute the query
        const querySnap = await getDocs(q);
        const books = [];
        querySnap.forEach((doc) => {
          return books.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setBusinessBooks(books);
        console.log(books);
      } catch (error) {
        console.log(error);
      }
    }
    fetchBooks();
  }, [])

  //技術書
  const [techBooks, setTechBooks] = useState(null)
  useEffect(() => {
    async function fetchBooks() {
      try {
        // get reference
        const booksRef = collection(db, "books");
        // create the query
        const q = query(booksRef, where("bookType", "==", "tech"), orderBy("timestamp", "desc"), limit(4));
        // execute the query
        const querySnap = await getDocs(q);
        const books = [];
        querySnap.forEach((doc) => {
          return books.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setTechBooks(books);
        console.log(books);
      } catch (error) {
        console.log(error);
      }
    }
    fetchBooks();
  }, [])

  //Offers
  const [offerListings, setOfferListings] = useState(null)
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(listingsRef, where("Offer", "==", true), orderBy("timestamp", "desc"), limit(4));
        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, [])

  // Places for rent 
  const [rentListings, setRentListings] = useState(null)
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(listingsRef, where("type", "==", "追加"), orderBy("timestamp", "desc"), limit(4));
        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, [])

  // Places for sale
  const [saleListings, setSaleListings] = useState(null)
  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(listingsRef, where("type", "==", "削除"), orderBy("timestamp", "desc"), limit(4));
        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings);
        console.log(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, [])

  return (
    <div>
      <Slider></Slider>
      <div className='max-w-6xl mx-auto pt-4 space-y-6 '>

        {/*今すぐ借りられる本*/}
        {notOnLoanBooks && notOnLoanBooks.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>今すぐ借りられる本</h2>
            <Link to="/notonloanbook">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>Show more</p>
            </Link>
            <ul className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {notOnLoanBooks.map((book) => (
                <BookItem
                  key={book.id}
                  book={book.data}
                  id={book.id} />
              ))}
            </ul>
          </div>
        )}

        {/*貸出中の本*/}
        {onLoanBooks && onLoanBooks.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>貸出中の本</h2>
            <Link to="onloanbook">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>Show more</p>
            </Link>
            <ul className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {onLoanBooks.map((book) => (
                <BookItem
                  key={book.id}
                  book={book.data}
                  id={book.id} />
              ))}
            </ul>
          </div>
        )}

        {/*ビジネス書*/}
        {businessBooks && businessBooks.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>ビジネス書</h2>
            <Link to="BookCategory/business">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>Show more</p>
            </Link>
            <ul className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {businessBooks.map((book) => (
                <BookItem
                  key={book.id}
                  book={book.data}
                  id={book.id} />
              ))}
            </ul>
          </div>
        )}

        {/*技術書*/}
        {techBooks && techBooks.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>技術書</h2>
            <Link to="/BookCategory/tech">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>Show more</p>
            </Link>
            <ul className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {techBooks.map((book) => (
                <BookItem
                  key={book.id}
                  book={book.data}
                  id={book.id} />
              ))}
            </ul>
          </div>
        )}

        {/*
        {rentListings && rentListings.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Places for rent</h2>
            <Link to="/category/追加">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>Show more places for rent</p>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {rentListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id} />
              ))}
            </ul>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Places for sale</h2>
            <Link to="/category/削除">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>Show more places for rent</p>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {saleListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id} />
              ))}
            </ul>
          </div>
        )}

              */}

      </div>
    </div>
  )
}
