import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner';
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, reload } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Navigate, useNavigate, useParams } from 'react-router';


export default function EditBook() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [loading, setLoading] = useState(false);
    const [book, setBook] = useState(false);
    const [formData, setFormData] = useState({
        bookType: "ビジネス書",
        bookName: "",
        publicationYear: 2010,
        author: "",
        publisher: "",
        ISBN: "",
        borrower: "",
        status: false,
        description: "",
        images: {}
    });
    const {
        bookType,
        bookName,
        publicationYear,
        author,
        publisher,
        ISBN,
        borrower,
        status,
        description,
        images,
    } = formData;

    const params = useParams()

    useEffect(() => {
        setLoading(true);
        async function fetchBook() {
            const docRef = doc(db, "books", params.bookId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setBook(docSnap.data());
                setFormData({ ...docSnap.data() })
                setLoading(false)
            } else {
                navigate("/")
                toast.error("リストが存在しません。");
            }
        }
        fetchBook();
    }, [navigate, params.bookId])

    useEffect(() => {
        //if (book && book.userRef !== auth.currentUser.uid) {
        //    toast.error("この投稿は編集できません。")
        //    navigate("/")
        //}

        if (book && book.borrower !== auth.currentUser.uid) {
            if (book && book.borrower !== "") {
                toast.error("この投稿は編集できません。")
                navigate("/")
            }
        }
    })

    function onChange(e) {
        let boolean = null;
        if (e.target.value === "true") {
            boolean = true
        }
        if (e.target.value === "false") {
            boolean = false
        }
        // Files
        //if (e.target.files) {
        //    setFormData((prevState) => ({
        //        ...prevState,
        //        images: e.target.files
        //    }));
        //}

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

        {/*}
        if (images.length > 1) {
            setLoading(false);
            toast.error("画像は1枚のみ登録可能です。")
            return
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

    */}

        const formDataCopy = {
            ...formData,
            //imgUrls,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
        }

        delete formDataCopy.images;

        const docRef = doc(db, "books", params.bookId);

        await updateDoc(docRef, formDataCopy);
        setLoading(false);
        toast.success("変更が完了しました");
        navigate(`/bookCategory/${formDataCopy.bookType}/${docRef.id}`);
    }

    if (loading) {
        return <Spinner />;
    }
    return (
        <main className='max-w-md px-2 mx-auto'>

            <h1 className='text-3xl text-center mt-6 font-bold'>
                利用状況を編集する
            </h1>
            <form onSubmit={onSubmit}>
                <p className='text-lg mt-6 font-semibold'>
                    カテゴリ
                </p>
                <div className='flex'>
                    <button
                        type="button"
                        id="bookType"
                        value="ビジネス書"
                        onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${bookType === "tech" ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}
                        disabled>
                        ビジネス書
                    </button>
                    <button type="button"
                        id="bookType"
                        value="技術書"
                        onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${bookType === "business" ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}
                        disabled>
                        技術書
                    </button>
                </div>

                <p className='text-lg mt-6 font-semibold'>
                    本の名前
                </p>
                <input type="text"
                    id="bookName"
                    value={bookName}
                    onChange={onChange}
                    placeholder='Book Name'
                    maxLength="32"
                    minLength="1"
                    required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
                    disabled>
                </input>

                <p className='text-lg mt-6 font-semibold'>
                    著者
                </p>
                <input type="text"
                    id="author"
                    value={author}
                    onChange={onChange}
                    placeholder='Author'
                    maxLength="32"
                    minLength="1"
                    required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
                    disabled>
                </input>

                <p className='text-lg mt-6 font-semibold'>
                    出版社
                </p>
                <input type="text"
                    id="publisher"
                    value={publisher}
                    onChange={onChange}
                    placeholder='Publisher'
                    maxLength="32"
                    minLength="1"
                    required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
                    disabled>
                </input>

                <div className='flex space-x-6 mb-6'>
                    <div>
                        <p className='text-lg font-semibold'>
                            出版年
                        </p>
                        <input type='number'
                            id="publicationYear"
                            value={publicationYear}
                            onChange={onChange}
                            min="1"
                            max="2999"
                            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 '
                            disabled>
                        </input>
                    </div>
                </div>


                <p className='text-lg mt-6 font-semibold'>
                    ISBN-13
                </p>
                <input type="text"
                    id="ISBN"
                    value={ISBN}
                    onChange={onChange}
                    placeholder='ハイフンなし13桁'
                    maxLength="32"
                    minLength="1"
                    required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
                    disabled>
                </input>

                <p className='text-lg mt-6 font-semibold'>
                    本の説明
                </p>
                <textarea
                    type="text"
                    id="description"
                    value={description}
                    onChange={onChange}
                    placeholder='Description'
                    required
                    className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
                    disabled>
                </textarea>

                {/*
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
                        */}

                <p className='text-lg mt-6 font-semibold'>
                    貸出状況
                </p>
                <div className='flex mb-6'>
                    <button
                        type="button"
                        id="status"
                        value="true"
                        onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!status ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>
                        貸出中
                    </button>
                    <button
                        type="button"
                        id="status"
                        value="false"
                        onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${status ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>
                        貸出可
                    </button>
                </div>

                {/*
                {status && (
                    <div className='flex items-center mb-6'>
                        <div className=''>
                            <p className='text-lg font-semibold'>
                                利用者
                            </p>
                            <input type="text"
                                id="borrower"
                                value={borrower}
                                onChange={onChange}
                                placeholder='Borrower'
                                maxLength="128"
                                minLength="1"
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'>
                            </input>
                        </div>
                    </div>
                )}
                */}

                <button type='submit' className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
                    決定
                </button>
            </form>
        </main >
    )
}
