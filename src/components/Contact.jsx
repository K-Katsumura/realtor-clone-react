import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function Contact({ userRef, listing }) {
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState("")
    useEffect(() => {
        async function getLandlord() {
            const docRef = doc(db, "users", userRef)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setLandlord(docSnap.data())
            } else {
                toast.error("データを表示できませんでした。")
            }
        }
        getLandlord();
    }, [userRef]);
    function onChange(e) {
        setMessage(e.target.value);
    }
    return <div>{landlord !== null && (
        <div className='flex flex-col w-full'>
            <p>Contact {landlord.UserName} for the {listing.bookname.toLowerCase()}</p>
            <div className='mt-3 mb-6'>
                <textarea
                    name="message"
                    id="message"
                    rows="2"
                    value={message}
                    onChange={onChange}
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'>
                </textarea>
            </div>
            <a href={`mailto:${landlord.email}?Subject=タイトル「${listing.bookname}」の本について&body=${message}`}>
                <button className='px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg active:bg-blue-700 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6'
                    type='button'>メールを作成</button>
            </a>
        </div>
    )}</div>
}
