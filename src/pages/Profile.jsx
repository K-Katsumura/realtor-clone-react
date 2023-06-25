import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';

export default function Profile() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false)
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
        </div>
      </section>
    </>
  )
}
