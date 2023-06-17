import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { Timestamp, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import React from 'react'
import { AiOutlineGoogle } from "react-icons/ai"
import { toast } from 'react-toastify'
import { db } from '../firebase'
import { useNavigate } from 'react-router'

export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick(){
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      //check for user

      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)

      if(!docSnap.exists()){
        await setDoc(docRef, {
          UserName: user.displayName,
          email: user.email,
          timestamp: serverTimestamp()
        });
      }
      navigate("/")

    } catch (error) {
      toast.error("予期せぬエラーが発生しました。")
    }
  }
  return (
    <button
      type='button' 
      onClick={onGoogleClick} 
      className='flex items-center justify-between w-full bg-red-500 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-300 active:bg-red-900 shadow-lg transition duration-150 ease-in-out rounded-2xl'>
        <AiOutlineGoogle className='text-2xl'/>
        <p>Googleでログイン&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p></p>
    </button>
  )
}
