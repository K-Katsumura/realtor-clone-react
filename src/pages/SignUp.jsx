import React, { useState } from 'react'
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    UserName: "",
    email: "",
    password: "",
  });
  const {UserName, email, password} = formData;
  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-20 font-bold'>新規登録</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[76%] lg:w-[50%] mb-12 md:mb-6 items-center px-6 py-12 max-w-6xl mx-auto'>
          <img src='https://placehold.jp/300x150.png' alt='logo' 
          //className='w-full rounded-2xl'
          className='w-full'
          />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form>
            <div className='ml-4'>
              <p>ユーザーネーム</p>
            </div>
            <input 
              className="w-full" 
              type='text' 
              id='UserName' 
              value={ UserName }
              onChange={onChange}
              placeholder='山田 太郎'
              className="mb-3 w-full px-4 py-2 text-lg  text-gray-700 bg-white border-gray-300 rounded-3xl transition ease-in-out">
            </input>
            
            <div className='ml-4'>
              <p>メールアドレス</p>
            </div>
            <input 
              className="w-full" 
              type='text' 
              id='email' 
              value={ email }
              onChange={onChange}
              placeholder='XXXX@example.com'
              className="mb-3 w-full px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded-3xl transition ease-in-out">
            </input>

            <div className='ml-4'>
              <p>パスワード</p>
            </div>
            <div className='relative mb-6'>
              <input 
                type={showPassword? "text" : "password"}
                id='password' 
                value={ password }
                onChange={onChange}
                placeholder=''
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded-3xl transition ease-in-out">
              </input>
              {showPassword ? 
                (
                  <AiFillEye className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword((prevState) => !prevState)} />
                ) : (
                  <AiFillEyeInvisible className='absolute right-3 top-3 text-xl cursor-pointer' onClick={() => setShowPassword((prevState) => !prevState)} />
                )}
            </div>
            <div className='flex justify-center whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>
                <Link to="/sign-in" className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out mr-5 font-semibold'>既にアカウントをお持ちの方はこちら</Link>
              </p>
            </div>
            <button className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded-2xl shadow-md hover:bg-blue-400 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800" type='submit' >新規登録</button>    
            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
            <OAuth>

            </OAuth>
          </form>
        </div>
      </div>
    </section>  
  )
}
