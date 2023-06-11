import React from 'react'
import { AiOutlineGoogle } from "react-icons/ai"

export default function OAuth() {
  return (
    <button className='flex items-center justify-between w-full bg-red-500 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-300 active:bg-red-900 shadow-lg transition duration-150 ease-in-out rounded-2xl'>
        <AiOutlineGoogle className='text-2xl'/>
        <p>Googleでログイン&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p></p>
    </button>
  )
}
