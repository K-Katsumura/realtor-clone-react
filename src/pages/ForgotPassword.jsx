import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import logo_r4 from "../components/assets/svg/logo_r4.png";

export default function ForgotPassword() {
  const [email, setemail] = useState("");

  function onChange(e) {
    setemail(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("パスワード再設定用メールを送信しました。");
    } catch (error) {
      toast.error("予期せぬエラーが発生しました。")
    }
  }

  return (
    <section>
      <h1 className='text-xl text-center mt-20 font-bold'>パスワード再設定</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[76%] lg:w-[50%] mb-12 md:mb-6 items-center px-6 py-12 max-w-6xl mx-auto'>
          <img src={logo_r4} alt='logo' className='w-full' />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <div className='ml-4'>
              <p>メールアドレス</p>
            </div>
            <input
              //className="w-full"
              type='email'
              id='email'
              value={email}
              onChange={onChange}
              placeholder='XXXX@example.com'
              className="mb-3 w-full px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded-3xl transition ease-in-out">
            </input>

            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>
                <Link to="/sign-up" className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-4 font-semibold'>アカウントをお持ちでない方はこちら</Link>
              </p>
              <p>
                <Link to="/sign-in" className='text-gray-400 hover:text-gray-700 transition duration-200 ease-in-out mr-5 font-semibold'>戻る</Link>
              </p>
            </div>
            <button className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded-2xl shadow-md hover:bg-blue-400 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800" type='submit' >送信</button>
            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}
