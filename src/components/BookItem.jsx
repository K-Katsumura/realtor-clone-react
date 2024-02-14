import Moment from "react-moment"
import { Link } from "react-router-dom"
import { GrUserManager } from "react-icons/gr";
import { MdEdit, MeEdit } from "react-icons/md";

export default function BookItem({ book, id, onEditBook }) {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
      <Link className="contents" to={`/bookCategory/${book.bookType}/${id}`}>
        <img className="h-full w-[170px] object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
          src={book.imgUrls[0]}>
        </img>
        <Moment className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg" fromNow>
          {book.timestamp?.toDate()}
        </Moment>
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <GrUserManager className="h-4 w-4" />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">{book.author}</p>
          </div>
          <p className="font-semibold m-0 text-xl truncate">{book.bookName}</p>
          <p className="text-[#457b9d] mt-2 font-semibold">
            {book.status ?
              <p className="text-[#d04e4e] mt-2 font-semibold">貸出中</p>
              :
              <p className="text-[#457b9d] mt-2 font-semibold">貸出可</p>
            }
          </p>
          <p>
            <div className="flex item-center mt-[10px] space-x-3">
              <div className="flex item-center space-x-1">
                <p className="font-semibold text-xs">{book.publicationYear}年出版</p>
              </div>
              <div className="flex item-center space-x-1">
                <p className="font-semibold text-xs">{book.publisher}</p>
              </div>
            </div>
          </p>
        </div>
      </Link >
      {onEditBook && (
        <MdEdit MdEdit className="absolute bottom-2 right-2 h-4 cursor-pointer" onClick={() => onEditBook(book.id)}>
        </MdEdit>
      )
      }
    </li >
  );
}
