import { getAuth } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    UserName: auth.currentUser.displayName,
    email: auth.currentUser.email
  });
  const {UserName, email} = formData

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>マイページ</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            
            {/* UserName Input */}
            <input type='text' id="name" value={UserName} disabled className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded-3xl transition ease-in-out'></input>

            {/* Email Input */}
            <input type='email' id="email" value={email} disabled className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded-3xl transition ease-in-out'></input>   

            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
              <p className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-4 font-semibold cursor-pointer'>
                登録情報を変更する
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
