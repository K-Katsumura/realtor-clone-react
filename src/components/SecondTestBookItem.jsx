import Moment from "react-moment"
import { Link } from "react-router-dom"

export default function SecondTestBookItem({ book, id }) {
    return (
        <li>
            <Link to={`/category/${book.bookType}/${id}`}>
                <img src={book.imgUrls[0]} alt="" />
                <Moment>
                    {book.timestamp?.toDate()}
                </Moment>
            </Link>
        </li>
    );
}
