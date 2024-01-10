import { getAuth, updateProfile } from 'firebase/auth';
import { collection, doc, getDocs, orderBy, query, updateDoc, where, deleteDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { BsBook } from "react-icons/bs"
import ListingItem from '../components/ListingItem';

export default function Profile() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    UserName: auth.currentUser.displayName,
    email: auth.currentUser.email
  });
  const {UserName, email} = formData

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e){
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(){
    try {
      if(auth.currentUser.displayName !== UserName){
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

  useEffect(()=>{
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
      setLoading(false);
    }
    fetchUserListing();
  },[auth.currentUser.uid]);
  async function onDelete(listingID){
    if(window.confirm("本当に削除しますか？")){
      await deleteDoc(doc(db, "listings", listingID)) 
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings)
      toast.success("削除されました。")
    }
  }
  function onEdit(listingID){
    navigate(`/edit-listing/${listingID}`);
  }

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>マイページ</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            
            {/* UserName Input */}
            <input 
              type='text' 
              id="UserName" 
              value={UserName} 
              disabled={!changeDetail} 
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded-3xl transition ease-in-out ${ changeDetail && "bg-red-200 focus:bg-red-200"}`}>
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
            <Link to="/create-listing" className='flex justify-center items-center'>
              <BsBook className='mr-2 text-xl'/>
              本を追加/削除する
            </Link>
          </button>
        </div>
      </section>
      <div className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && listings.length > 0 && (
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
                  onDelete={()=>onDelete(listing.id)}
                  onEdit={()=>onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
