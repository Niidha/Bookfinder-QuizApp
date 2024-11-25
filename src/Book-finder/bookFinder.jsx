import axios from "axios";
import { useEffect, useState } from "react";
import './bookFinder.css'
let mounted = false;

const BookFinder = () => {
  const [books, setBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setLoading] = useState(true);
 

  const getData = async () => {
    setLoading(true);
    const query = searchText || "bestsellers";
  
   
    try {
      const { data: res } = await axios.get("https://www.googleapis.com/books/v1/volumes", {
        params: {
          q: query,
          
        },
      });

      const booksData = res.items.map((book) => ({
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || ["Unknown Author"],
       
        image: book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x200",
        url: book.volumeInfo.infoLink,
      }));

      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
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
  }, [searchText]);

  return (
    <div className="book-finder">
      <h1>Book Library</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Find Your Favorite Books Here..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={getData}>Search</button>
      </div>
      <div className="books-container my-2 d-flex justify-content-center gap-2 flex-wrap">
        {!isLoading &&
          books.map((book) => (
            <div key={book.id} className="book-card bg-light" style={{ width: "15rem", marginBottom: "1rem" }}>
              <div>
                <img
                  src={book.image}
                  alt={book.title}
                  className="book-image"
                  style={{ aspectRatio: "1/1", objectFit: "contain", width: "100%" }}
                />
              </div>
              <div className="text-center">
                <h5>{book.title}</h5>
                <p>{book.authors.join(", ")}</p>
                <p>{book.description}</p>
                <a href={book.url} target="_blank" rel="noopener noreferrer">
                  View Book
                </a>
              </div>
            </div>
          ))}
        {isLoading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default BookFinder;
