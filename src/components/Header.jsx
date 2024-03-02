import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { IoMenu } from "react-icons/io5";
import logo_r1 from "../components/assets/svg/logo_r1.png";
import logo_r2 from "../components/assets/svg/logo_r2.png";
import logo_r3 from "../components/assets/svg/logo_r3.png";
import logo_r4 from "../components/assets/svg/logo_r4.png";

export default function Header() {
  const [pageState, setPageState] = useState("ログイン")
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("マイページ")
      } else {
        setPageState("ログイン")
      }
    })
  })
  const auth = getAuth();

  const [open, setOpen] = useState(false);
  const onClickOpen = () => {
    setOpen(true);
  }
  const onClickClose = () => {
    setOpen(false);
  }

  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-40'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
          {/*
          <img src='https://placehold.jp/500x150.png' alt='logo' className='h-8 cursor-pointer' onClick={() => navigate("/")} />
  */}
          <img src={logo_r4} alt='logo' className='cursor-pointer h-[20px] ml-1' onClick={() => navigate("/")} />

        </div>

        <ul className='flex space-x-10 mt-1'>
          <li className={`max-sm:hidden cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/") && '!text-black !border-b-red-500'}`} onClick={() => navigate("/")}>ホーム</li>
          <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/notonloanbook") && '!text-black !border-b-red-500'}`} onClick={() => navigate("/notonloanbook")}>今すぐ借りる</li>
          <button className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && '!text-black !border-b-red-500'}`} onClick={() => navigate("/profile")}>{pageState}</button>
        </ul>

      </header >
    </div >
  )
}
