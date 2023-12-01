import React, { useState } from 'react'

export default function CreateListing() {
    const [formData, setFormData] = useState({
        type: "削除",
        bookname: "",
        year: 2010,
        bathrooms: "1",
        parking: false,
        Offer: false,
        address: "",
        regularPrice:10000,
        DiscountedPrice:"",
    });
    const { type, bookname, year, bathrooms, parking, Offer, address, regularPrice, DiscountedPrice } = formData;
  function onChange()  {}
  return (
    <main className='max-w-md px-2 mx-auto'>

        <h1 className='text-3xl text-center mt-6 font-bold'>
            本を追加/削除
        </h1>
        <form>
            <p className='text-lg mt-6 font-semibold'>
                追加/削除
            </p>
            <div className='flex'>
                <button 
                    type="button" 
                    id="type" 
                    value="追加" 
                    onClick={onChange} 
                    className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    type === "削除" ? "bg-white text-black" :  "bg-slate-600 text-white"  
                }`}>
                    追加
                </button>
                <button type="button" id="type" value="削除" onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    type === "追加" ? "bg-white text-black" :  "bg-slate-600 text-white"  
                }`}>
                    削除
                </button>
            </div>

            <p className='text-lg mt-6 font-semibold'>
                本の名前
            </p>
            <input type="text" 
             id="bookname" 
             value={bookname} 
             onChange={onChange} 
             placeholder='Name' 
             maxLength="32" 
             minLength="1" 
             required 
             className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'>
            </input>

            <div className='flex space-x-6 mb-6'>
                <div>
                    <p className='text-lg font-semibold'>
                        出版年
                    </p>
                    <input type='number' 
                           id="year" 
                           value={year}
                           onChange={onChange}
                           min="1"
                           max="2999"
                           className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 '>
                    </input>
                </div>
                
                <div>
                    <p className='text-lg font-semibold'>Baths</p>
                    <input type='number' 
                           id="bathrooms" 
                           value={bathrooms}
                           onChange={onChange}
                           min="1"
                           max="2999"
                           className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 '>
                    </input>
                </div>
            </div>

            <p className='text-lg mt-6 font-semibold'>
                Parking spot
            </p>
            <div className='flex'>
                <button 
                    type="button" 
                    id="parking" 
                    value="true" 
                    onClick={onChange} 
                    className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    !parking ? "bg-white text-black" :  "bg-slate-600 text-white"  
                }`}>
                    Yes
                </button>
                <button 
                    type="button" 
                    id="parking" 
                    value="false" 
                    onClick={onChange} 
                    className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    parking ? "bg-white text-black" :  "bg-slate-600 text-white"  
                }`}>
                    No
                </button>
            </div>

            <p className='text-lg mt-6 font-semibold'>
                Offer
            </p>
            <div className='flex'>
                <button 
                    type="button" 
                    id="Offer" 
                    value="Yes" 
                    onClick={onChange} 
                    className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    !Offer ? "bg-white text-black" :  "bg-slate-600 text-white"  
                }`}>
                    YES
                </button>
                <button 
                    type="button" 
                    id="Offer" 
                    value="No" 
                    onClick={onChange} 
                    className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    Offer ? "bg-white text-black" :  "bg-slate-600 text-white"  
                }`}>
                    No
                </button>
            </div>

            <p className='text-lg mt-6 font-semibold'>
                address
            </p>
            <textarea
                type="text" 
                id="bookname" 
                value={bookname} 
                onChange={onChange} 
                placeholder='Address' 
                maxLength="32" 
                minLength="1" 
                required 
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'>
            </textarea>

            <div className='flex items-center mb-6'>
                <div className=''>
                    <p className='text-lg font-semibold'>Regular price</p>
                    <div className='flex w-full justify-center items-center space-x-4'>
                        <input type="number" name="" id="regularPrice" value={regularPrice} onChange={onChange} min="10000" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'/>
                    {type === "追加" &&(
                        <div className=''>
                            <p className='text-md w-full whitespace-nowrap'>円</p>
                        </div>
                    )}
                    </div>
                </div>
            </div>
            {Offer && (
            <div className='flex items-center mb-6'>
                <div className=''>
                    <p className='text-lg font-semibold'>Discounted price</p>
                    <div className='flex w-full justify-center items-center space-x-4'>
                        <input type="number" name="" id="regularPrice" value={regularPrice} onChange={onChange} min="10000" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'/>
                    </div>
                </div>
            </div>
            )}
            <div className='mb-6'>
                <p className='text-lg font-semibold'>Image</p>
                <p className='text-gray-600'>The first image will be the cover</p>
                <input type='file' 
                    id='images' 
                    onChange={onChange} 
                    accept='.jpg, .png, .jpeg'
                    multiple
                    required
                    className='w-full px-3 py-1.5'>
                </input>
            </div>
            <button type='submit' className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
                決定
            </button>
        </form>
    </main>
  )
}
