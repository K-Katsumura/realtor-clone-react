import { getAuth, updateProfile } from 'firebase/auth';
import { collection, doc, getDocs, orderBy, query, updateDoc, where, deleteDoc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { BsBook } from "react-icons/bs"
import ListingItem from '../components/ListingItem';
import BookItem from '../components/BookItem';
import SecondTestBookItem from '../components/SecondTestBookItem';
import mypage_r1 from "../components/assets/svg/mypage_r1.png";
import book_r1 from "../components/assets/svg/book_r1.png";

export default function Profile() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [landlord, setLandlord] = useState(null)
  const [formData, setFormData] = useState({
    UserName: auth.currentUser.displayName,
    email: auth.currentUser.email
  });
  const { UserName, email } = formData

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== UserName) {
        //update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: UserName,
        });

        //update name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {
          UserName,
        })
        toast.success("ユーザーネームを変更しました。")
      }
    } catch (error) {
      toast.error("正しく変更できませんでした。")
    }
  }

  useEffect(() => {
    async function fetchUserBook() {
      setLoading(true);
      const bookRef = collection(db, "books");
      const q = query(
        bookRef,
        where("userRef", "==", auth.currentUser.uid),
        where("status", "==", true),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);
      let books = [];
      querySnap.forEach((doc) => {
        return books.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setBooks(books);
    }

    async function getLandlord(userRef) {
      const docRef = doc(db, "users", userRef)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setLandlord(docSnap.data())
      } else {
        toast.error("データを表示できませんでした。")
      }
    }

    async function fetchUserListing() {
      setLoading(true);
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      //getLandlord(books.borrower);
      setLoading(false);
    }
    fetchUserListing();
    fetchUserBook();
  }, [auth.currentUser.uid]);

  async function onDelete(listingID) {
    if (window.confirm("本当に削除しますか？")) {
      await deleteDoc(doc(db, "listings", listingID))
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings)
      toast.success("削除されました。")
    }
  }
  function onEdit(listingID) {
    navigate(`/edit-listing/${listingID}`);
  }
  function onEditBook(bookID) {
    navigate(`/edit-book/${bookID}`);
  }

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <div className='flex justify-center items-center m-10 '>
          <img src={mypage_r1} alt='my page' className='h-[45px] md:h-[35px] lg:h-[50px]' />
        </div>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>

            {/* UserName Input */}
            <input
              type='text'
              id="UserName"
              value={UserName}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded-3xl transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`}>
            </input>

            {/* Email Input */}
            <input type='email' id="email" value={email} disabled className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded-3xl transition ease-in-out'></input>

            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
              <p className='flex items-center'>
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-4 font-semibold cursor-pointer'>
                  {changeDetail ? "変更する" : "登録情報を変更する"}
                </span>
              </p>

              <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out mr-5 font-semibold cursor-pointer'>
                ログアウト
              </p>
            </div>
          </form>
          <button type="submit" className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>
            {/*<Link to="/create-listing" className='flex justify-center items-center'>*/}
            <Link to="/register-book" className='flex justify-center items-center'>
              <BsBook className='mr-2 text-xl' />
              新しい本を登録する
            </Link>
          </button>
        </div>
      </section>

      <div className='max-w-6xl px-3 mb-10 mt-10 mx-auto'>
        {!loading && books?.length > 0 && (
          <>
            <div className='bg-slate-300 rounded-3xl py-1'>
              <div className='flex justify-center items-center mb-10'>
                <img src={book_r1} alt='my page' className='mt-10 h-[25px] md:h-[25px] lg:h-[30px]' />
              </div>
              <ul className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6 mb-10'>
                {books.map((book) => (
                  <BookItem
                    key={book.id}
                    id={book.id}
                    book={book.data}
                  //onDelete={() => onDelete(book.id)}
                  //onEditBook={() => onEditBook(book.id)}
                  />
                ))}
              </ul>
            </div>
          </>
        )}

        {!loading && books?.length == 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold mt-20'>
              貸出状況一覧
            </h2>
            <p className='text-center mt-8'>
              現在、貸出中の本はありません
            </p>
          </>
        )}

      </div>

      {/*
      <div className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && listings?.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold mt-20'>
              -- My Listings --
            </h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-10'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
      */}
    </>
  )
}
