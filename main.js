// menyimpan data buku dalam bentuk array
const books = [];

//fungsi untuk menyimpan buku
function saveBooksToStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

document.addEventListener("DOMContentLoaded", function () {
  renderBooks();
});

// Contoh fungsi pengambilan dari localStorage
function getBooksFromStorage() {
  const storedBooks = localStorage.getItem("books");
  return storedBooks ? JSON.parse(storedBooks) : [];
}

//fungsi untuk menambah buku baru
const form = document.getElementById("bookForm");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const newBook = {
    id: Date.now(),
    title: title,
    author: author,
    year: Number(year),
    isComplete: isComplete,
  };

  // Fungsi untuk pengambilan dari Local Storage
  let books = getBooksFromStorage();
  books.push(newBook);
  saveBooksToStorage(books);
  renderBooks();
});

//fungsi untuk me-render buku pada rak yang sesuai
function renderBooks() {
  const incompleteBooksList = document.getElementById("incompleteBookList"); //buku yang belum selesai dibaca
  const completeBooksList = document.getElementById("completeBookList"); //buku yang sudah selesai dibaca
  // Kosongkan rak sebelum menampilkan ulang
  incompleteBooksList.innerHTML = "";
  completeBooksList.innerHTML = "";
  const books = getBooksFromStorage(); // Ambil semua buku dari Local Storage

  // Tampilkan ulang semua buku di rak yang sesuai
  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBooksList.appendChild(bookElement); // Buku selesai dibaca
    } else {
      incompleteBooksList.appendChild(bookElement); // Buku belum selesai dibaca
    }
  });
}

// Fungsi untuk membuat element buku
function createBookElement(book) {
  const bookDiv = document.createElement("div");
  bookDiv.setAttribute("data-bookid", book.id);
  bookDiv.setAttribute("data-testid", "bookItem"); // tambahkan data-testid untuk item buku
  bookDiv.innerHTML = `
    <h3 data-testid = "bookItemTitle">Judul Buku: ${book.title}</h3>
    <p data-testid = "bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid = "bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid = "bookItemIsCompleteButton" onclick = "toggleBookStatus(${
        book.id
      })">${
    book.isComplete ? "Belum Selesai Dibaca" : " Sudah Selesai Dibaca"
  }</button>
      <button data-testid = "bookItemDeleteButton" onclick = "deleteBook(${
        book.id
      })">Hapus Buku</button>
    </div>
  `;
  return bookDiv;
}

//fungsi untuk memindahkan buku dari penyimpanan
function toggleBookStatus(bookId) {
  let books = getBooksFromStorage();
  const bookIndex = books.findIndex((book) => book.id === bookId);
  books[bookIndex].isComplete = !books[bookIndex].isComplete;

  saveBooksToStorage(books);
  renderBooks();
}

// Fungsi untuk mancari Buku
const searchForm = document.getElementById("searchBook");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchTerm = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const books = getBooksFromStorage();
  const filterBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm)
  );

  if (filterBooks.length === 0) {
    alert("Buku yang Anda cari tidak ditemukan!"); // muncul pesan pop-up jika buku yang dicari tidak ada dalam penyimpanan
  } else {
    displayFilterBooks(filterBooks);
  }
});

function displayFilterBooks(filterBooks) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filterBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

document
  .getElementById("searchBookTitle")
  .addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    if (searchTerm === "") {
      renderBooks();
    }
  });
// Fungsi untuk menghapus Buku
function deleteBook(bookId) {
  const books = getBooksFromStorage();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    const isConfirm = confirm("Apakah Anda yakin ingin menghapus Buku ini?"); //muncul pesan pop-up untuk konfirmasi

    if (isConfirm) {
      books.splice(bookIndex, 1);
      saveBooksToStorage(books);
      renderBooks();
    }
  }
}
