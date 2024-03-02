import React, { useEffect, useState } from 'react'
import { collection, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, {
    EffectFade,
    Autoplay,
    Navigation,
    Pagination
} from "swiper"
import "swiper/css/bundle"
import { useNavigate } from 'react-router';

export default function Slider() {
    const [books, setBooks] = useState(null);
    const [loading, setLoading] = useState(true);
    SwiperCore.use([Autoplay, Navigation, Pagination])
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchBooks() {
            const booksRef = collection(db, "books");
            const q = query(booksRef, orderBy("timestamp", "desc"), limit(5));
            const querySnap = await getDocs(q);
            let books = [];
            querySnap.forEach((doc) => {
                return books.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setBooks(books);
            setLoading(false);
        }
        fetchBooks()
    }, []);
    if (loading) {
        return <Spinner></Spinner>
    }
    if (books.length === 0) {
        return <></>
    }

    return (
        books && (
            <>
                <Swiper
                    slidesPreView={1}
                    navigation
                    pagination={{ type: "progressbar" }}
                    //effect="fade"
                    modules={[EffectFade]}
                    autoplay={{ delay: 3000 }}
                >
                    {books.map(({ data, id }) => (
                        <SwiperSlide key={id} onClick={() => navigate(`/bookCategory/${data.type}/${id}`)}>
                            <div
                                style={{
                                    background: `url(${data.imgUrls[0]}) center, no-repeat`,
                                    backgroundSize: "cover",
                                    crossFade: "true"
                                }}
                                //className="w-full h-[300px] overflow-hidden"
                                className="mx-auto w-[257px] h-[364px] overflow-hidden"
                            ></div>
                            <p className='text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl'>{data.bookName}</p>
                            <p className='text-[#f1faee] absolute left-1 bottom-3 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-br-3xl'>
                                {/*${data.discountedPrice ?? data.regularPrice}
                                {data.type === "追加" && " / month"}*/}
                                {data.author}
                            </p>
                        </SwiperSlide>
                    ))}
                </Swiper >
            </>
        )
    )
}
