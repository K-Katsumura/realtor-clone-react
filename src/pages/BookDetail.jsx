import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
    EffectFade,
    Autoplay,
    Navigation,
    Pagination
} from "swiper";
import "swiper/css/bundle";
import { FiShare } from "react-icons/fi"
import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa"
import { list } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { GrUserManager } from "react-icons/gr";
import { IoBookOutline } from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi";
import { LuCalendarDays } from "react-icons/lu";
import { FaRegBuilding } from "react-icons/fa";
import { MdEdit, MeEdit } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom'

export default function BookDetail() {
    const auth = getAuth();
    const navigate = useNavigate();
    const params = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(false);
    SwiperCore.use([Autoplay, Navigation, Pagination]);

    function onEditBook(bookID) {
        navigate(`/edit-book/${bookID}`);
    }

    useEffect(() => {
        async function fetchBook() {
            const docRef = doc(db, "books", params.bookId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setBook(docSnap.data());
                setLoading(false);
            }
        }
        fetchBook();
    }, [params.bookId]);
    if (loading) {
        return <Spinner />;
    }
    return (
        <main>
            <Swiper
                slidesPerView={1}
                navigation
                pagination={{ type: "progressbar" }}
                //effect="fade"
                modules={[EffectFade]}
                autoplay={{ delay: 2000 }}
            >
                {book?.imgUrls?.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div className="mx-auto w-[257px] h-[364px] overflow-hidden"
                            //className='w-full overflow-hidden h-[300px]'
                            style={{
                                background: `url(${book?.imgUrls[index]}) center no-repeat`,
                                backgroundSize: "cover"
                            }}>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className='fixed top-[8%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center' onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShareLinkCopied(true)
                setTimeout(() => {
                    setShareLinkCopied(false);
                }, 2000)
            }}>
                <FiShare className='text-lg text-slate-500'></FiShare>
            </div>
            {shareLinkCopied && (
                <p className='fixed top-[13%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2'>
                    リンクをコピーしました
                </p>
            )}


            <div className='m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5'>
                <div className='w-full'>
                    <p className='text-2xl font-bold text-blue-900 '>
                        {book?.bookName}
                    </p>

                    <p className='flex items-center mb-3'>
                        {book?.subtitle}
                    </p>

                    <div className='flex justify-start items-center space-x-4 w-[75%]'>
                        {book?.status === false ?
                            <p className='bg-blue-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md '>貸出可</p>
                            :
                            <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md '>貸出中</p>
                        }
                        {onEditBook && (
                            <MdEdit MdEdit className="cursor-pointer" onClick={() => onEditBook(params.bookId)}>
                            </MdEdit>
                        )
                        }
                    </div>
                    <p className='flex items-center mt-6 mb-1 font-semibold'>
                        <GrUserManager className='text-green-900 mr-1'></GrUserManager>著者：
                        {book?.author}
                    </p>


                    {/*
                        {listing.Offer && (
                            <p className='w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md'>${(+listing.regularPrice) - (+listing.DiscountedPrice)} discount</p>
                        )}
                        */}
                    <p className='flex items-center mt-3 font-semibold'>
                        <HiOutlineBookOpen className='mr-1'></HiOutlineBookOpen>
                        <p>概要：</p>
                    </p>
                    <p className='flex items-center mb-5 ml-7 mr-7'>
                        {book?.description}
                    </p>

                    <ul className='flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-3 mr-3'>
                        <li className='flex items-center whitespace-nowrap'>
                            <LuCalendarDays className='text-lg mr-1' />
                            出版年：{book?.publicationYear}年
                        </li>
                        <li className='flex items-center whitespace-nowrap'>
                            <FaRegBuilding className='ml-5 text-lg mr-1' />
                            出版社：{book?.publisher}
                        </li>

                    </ul>

                    {/*
                    <ul className='flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6 mr-3'>
                        <li className='flex items-center whitespace-nowrap'>
                            <FaBed className='text-lg mr-1' />
                            {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
                        </li>
                        <li className='flex items-center whitespace-nowrap'>
                            <FaBath className='text-lg mr-1' />
                            {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
                        </li>
                        <li className='flex items-center whitespace-nowrap'>
                            <FaParking className='text-lg mr-1' />
                            {+listing.parking ? "Parking Spot" : "No Parking"}
                        </li>
                        <li className='flex items-center whitespace-nowrap'>
                            <FaChair className='text-lg mr-1' />
                            {+listing.parking ? "Furnished" : "Not furnished"}
                        </li>
                    </ul>
                    {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
                        <div className="mt-6">
                            <button onClick={() => setContactLandlord(true)}
                                className='px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out'>
                                Contact Landlord
                            </button>
                        </div>
                    )}
                    {contactLandlord && <Contact userRef={listing.userRef} listing={listing} />}
                </div>
                <div className='w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:ml-3 lg:mt-0'>
                    <MapContainer center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}
                        style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                            <Popup>
                                {listing.address}
                            </Popup>
                        </Marker>
                    </MapContainer>
                    */}
                </div>
            </div>
        </main >
    )
}
