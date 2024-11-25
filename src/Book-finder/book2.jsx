import axios from "axios";
import { useEffect, useState } from "react";
import './book2.css'

let mounted = false;

const BookFinders = () => {
  const [books, setBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [pages, setPages] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);

  const getData = async () => {
    const limit = 20;
    const skip = (currentPage - 1) * 20;
    const { data: res } = await axios.get(
      `https://www.dbooks.org/api/search/{query}skip=${skip}&limit=${limit}`
    );

    if (pages === -1) {
      setPages(Math.ceil(res.total / limit));
    }

    const filteredBooks = res.books.filter((book) =>
      book.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setBooks(filteredBooks);
    setLoading(false);
  };

  useEffect(() => {
    let timeOut;
    if (!mounted) {
      getData();
      mounted = true;
    } else {
      timeOut = setTimeout(() => {
        getData();
      }, 2000);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [searchText, currentPage]);

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search for books..."
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          className="p-2 border-0 rounded w-50"
          
        />
      </div>
      <div className="books-container  my-2 d-flex justify-content-center gap-2 flex-wrap">
        {!isLoading && 
          books.map((book) => (
            <div
              key={book.id}
              className="book-card bg-light"
              style={{
                width: "15rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <img
                  src={book.image}
                  alt={book.title}
                  style={{
                    aspectRatio: "1/1",
                    objectFit: "contain",
                    width: "100%",
                  }}
                />
              </div>
              <div className="text-center">
                <h5>{book.title}</h5>
                <p>{book.authors}</p>
                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View Book
                </a>
              </div>
            </div>
          ))
        }
        {isLoading && <p>Loading...</p>}
      </div>
      {books.length > 0 && (
        <div className="my-3 d-flex justify-content-center gap-2">
          {pages > -1 &&
            new Array(pages)
              .fill(0)
              .map((_, index) => index + 1)
              .map((label) => {
                return (
                  <button
                    className="bg-success border-0 rounded-circle text-light"
                    style={{ width: "30px", height: "30px" }}
                    key={label}
                    onClick={() => setCurrentPage(label)}
                  >
                    {label}
                  </button>
                );
              })}
        </div>
      )}
    </div>
  );
};

export default BookFinders;
