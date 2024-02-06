import React, { useState } from 'react'
import Spinner from '../components/Spinner';
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, reload } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Navigate, useNavigate } from 'react-router';


export default function CreateListing() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "削除",
        bookname: "",
        year: 2010,
        bathrooms: "1",
        parking: false,
        Offer: false,
        address: "",
        regularPrice: 10000,
        DiscountedPrice: 10000,
        latitude: 0,
        longitude: 0,
        images: {}
    });
    const {
        type,
        bookname,
        year,
        bathrooms,
        parking,
        Offer,
        address,
        regularPrice,
        DiscountedPrice,
        latitude,
        longitude,
        images,
    } = formData;

    function onChange(e) {
        let boolean = null;
        if (e.target.value === "true") {
            boolean = true
        }
        if (e.target.value === "false") {
            boolean = false
        }
        // Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }));
        }
        // Text/Booean/Number
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    }
    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if (+DiscountedPrice >= +regularPrice) {
            setLoading(false);
            toast.error("ディスカウントプライスは通常価格より低く設定してな！これがver2")
            return
        }
        if (images.length > 6) {
            setLoading(false);
            toast.error("画像は6枚までやで！")
            return
        }
        let geolocation = {}
        let location
        if (geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GROCODR_API_KEY}`
            );
            const data = await response.json()
            console.log(data)
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location = data.status === "ZERO_RESULTS" && undefined;

            if (location === undefined) {
                setLoading(false);
                toast.error("正しい住所を入力してください。");
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        function storeImage(image) {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error)
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );

            })
        }

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch((error) => {
            setLoading(false)
            toast.error("画像が正しくアップロードされませんでした。")
            return;
        }
        );
        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
        };
        delete formDataCopy.images;
        !formDataCopy.Offer && delete formDataCopy.DiscountedPrice;
        delete formDataCopy.latitude
        delete formDataCopy.longitude
        const docRef = await addDoc(collection(db, "listings"), formDataCopy);
        setLoading(false);
        toast.success("登録が完了しました");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }

    if (loading) {
        return <Spinner />;
    }
    return (
        <main className='max-w-md px-2 mx-auto'>

            <h1 className='text-3xl text-center mt-6 font-bold'>
                本を追加/削除
            </h1>
            <form onSubmit={onSubmit}>
                <p className='text-lg mt-6 font-semibold'>
                    追加/削除
                </p>
                <div className='flex'>
                    <button
                        type="button"
                        id="type"
                        value="追加"
                        onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "削除" ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>
                        追加
                    </button>
                    <button type="button"
                        id="type"
                        value="削除"
                        onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "追加" ? "bg-white text-black" : "bg-slate-600 text-white"
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
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>
                        Yes
                    </button>
                    <button
                        type="button"
                        id="parking"
                        value="false"
                        onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking ? "bg-white text-black" : "bg-slate-600 text-white"
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
                        value="true"
                        onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!Offer ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>
                        YES
                    </button>
                    <button
                        type="button"
                        id="Offer"
                        value="false"
                        onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${Offer ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>
                        No
                    </button>
                </div>

                <p className='text-lg mt-6 font-semibold'>
                    address
                </p>
                <textarea
                    type="text"
                    id="address"
                    value={address}
                    onChange={onChange}
                    placeholder='Address'
                    required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'>
                </textarea>
                {!geolocationEnabled && (
                    <div className="flex space-x-6 justify-start mb-6">
                        <div className="">
                            <p className='text-lg font-semibold'>Latitude
                            </p>
                            <input type='number'
                                id='latitude'
                                value={latitude}
                                onChange={onChange}
                                required
                                min={-90}
                                max={90}
                                ClassName='w-full px-4 py-2 text-xl text-gray-700 bg-white-border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600'>
                            </input>
                        </div>
                        <div className="">
                            <p className='text-lg font-semibold'>Longitude
                            </p>
                            <input type='number'
                                id='longitude'
                                value={longitude}
                                onChange={onChange}
                                required
                                min={-180}
                                max={180}
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white-border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600'>
                            </input>
                        </div>
                    </div>
                )}
                <div className='flex items-center mb-6'>
                    <div className=''>
                        <p className='text-lg font-semibold'>Regular price</p>
                        <div className='flex w-full justify-center items-center space-x-4'>
                            <input type="number"
                                name=""
                                id="regularPrice"
                                value={regularPrice}
                                onChange={onChange}
                                min="10000"
                                required
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />
                            {type === "追加" && (
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
                                <input type="number"
                                    name=""
                                    id="DiscountedPrice"
                                    value={DiscountedPrice}
                                    onChange={onChange}
                                    min="10000"
                                    required={Offer}
                                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />
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
