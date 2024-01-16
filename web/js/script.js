class LibraryApp {
    constructor() {
        // Получаем таблицу и модальные окна, инициализируем выбранный ID книги
        this.table = document.getElementById('booksTable');
        this.modals = document.getElementsByClassName('modal');
        this.selectedBookId = null;

        // Инициализируем таблицу и прослушиватели событий
        this.initializeTable();
        this.initializeEventListeners();
    }

    initializeTable() {
        // Загружаем книги и жанры при инициализации
        eel.get_books()((books) => this.updateBooksTable(books));
        eel.get_genres()(genres => this.populateGenreSelect(genres));
    }

    initializeEventListeners() {
        // Обработчик клика вне окна для закрытия модальных окон
        window.onclick = (event) => this.handleWindowClick(event);

        // Обработчик поискового ввода
        let searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('keydown', (event) => this.handleSearchInput(event));

        // Обработчик изменения выбранного жанра
        let genreSelect = document.getElementById('genreSelect');
        genreSelect.addEventListener('change', () => this.handleGenreSelect());
    }

    handleSearchInput(event) {
        // Обработчик поискового ввода
        if (event.key === 'Enter') {
            let keyword = event.target.value.trim();
            if (keyword !== '') {
                // Выполняем поиск и обновляем таблицу
                eel.search_books(keyword)().then((books) => this.updateBooksTable(books));
            } else {
                // Если поле пустое, загружаем все книги
                eel.get_books()((books) => this.updateBooksTable(books));
            }
        }
    }

    updateBooksTable(books) {
        // Обновление таблицы с книгами
        this.clearTable();
        books.forEach((book) => {
            let row = this.table.insertRow(-1);
            row.innerHTML = `<td>${book[1]}</td><td>${book[2]}</td>`;

            row.classList.add('clickable-row');
            row.tabIndex = 0;
            row.setAttribute('data-title', book[1]);
            row.setAttribute('data-author', book[2]);
            row.setAttribute('data-id', book[0]);

            row.addEventListener('click', () => this.handleRowClick(row));
            row.addEventListener('dblclick', () => this.handleRowDoubleClick(row));
        });
    }

    clearTable() {
        // Очистка таблицы
        while (this.table.rows.length > 1) {
            this.table.deleteRow(1);
        }
    }

    handleWindowClick(event) {
        // Закрытие модальных окон при клике вне них
        for (let i = 0; i < this.modals.length; i++) {
            let modal = this.modals[i];
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }
    }

    selectBook(row) {
        // Выбор книги при клике
        this.selectedBookId = row.getAttribute('data-id');
    }

    handleRowClick(row) {
        // Обработчик клика по строке
        this.selectBook(row);
        let bookId = this.selectedBookId;
        eel.get_book(bookId)().then(this.populateEditBookModal);
    }

    handleRowDoubleClick(row) {
        // Обработчик двойного клика по строке
        this.selectBook(row);
        let bookId = this.selectedBookId;
        eel.get_book(bookId)().then(this.populateViewBookModal);
        this.openModal('viewBook');
    }

    handleGenreSelect() {
        // Обработчик изменения выбранного жанра
        let selectedGenre = document.getElementById('genreSelect').value;
        let searchTerm = document.getElementById('searchInput').value.trim();

        if (selectedGenre !== '') {
            // Выполняем поиск по жанру и обновляем таблицу
            eel.search_books_by_genre(selectedGenre)().then(books => this.updateBooksTable(books));
        } else {
            // Если жанр не выбран, загружаем все книги
            eel.get_books()(books => this.updateBooksTable(books));
        }
    }

    populateEditBookModal(bookData) {
        // Заполняем модальное окно редактирования книги данными
        let book = bookData[0];
        document.getElementById('edited_book_name').value = book[1];
        document.getElementById('edited_author').value = book[2];
        document.getElementById('edited_genre').value = book[4];
        document.getElementById('edited_description').value = book[3];
    }

    populateViewBookModal(bookData) {
        // Заполняем модальное окно просмотра книги данными
        let book = bookData[0];
        document.getElementById('bookTitleView').innerText = book[1] || 'Нет данных';
        document.getElementById('bookAuthorView').innerText = book[2] || 'Нет данных';
        document.getElementById('bookGenreView').innerText = book[4] || 'Нет данных';
        document.getElementById('bookDescriptionView').innerText = book[3] || 'Нет данных';
    }

    populateGenreSelect(genres) {
        // Заполняем выпадающий список жанров
        let genreSelect = document.getElementById('genreSelect');
        genres.forEach(genre => {
            let option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
    }

    openModal(modalId) {
        // Открытие модального окна
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        // Закрытие модального окна
        document.getElementById(modalId).style.display = 'none';
    }
}

// Создаем экземпляр приложения
const libraryApp = new LibraryApp();

// Функция для добавления книги
function addBook() {
    // Получаем данные из формы
    let title = document.getElementById('book_name').value;
    let author = document.getElementById('author').value;
    let genre = document.getElementById('genre').value;
    let description = document.getElementById('description').value;

    // Вызываем функцию добавления книги через eel
    eel.add_book(title, author, description, genre)();

    // Очищаем поля формы
    document.getElementById('book_name').value = '';
    document.getElementById('author').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('description').value = '';

    // Закрываем модальное окно добавления книги
    libraryApp.closeModal('addBook');

    // Обновляем таблицу
    libraryApp.initializeTable();
}

// Функция для редактирования книги
function editBook() {
    // Получаем данные из формы
    let bookId = libraryApp.selectedBookId;
    let editedTitle = document.getElementById('edited_book_name').value;
    let editedAuthor = document.getElementById('edited_author').value;
    let editedGenre = document.getElementById('edited_genre').value;
    let editedDescription = document.getElementById('edited_description').value;

    // Вызываем функцию редактирования книги через eel
    eel.edit_book(bookId, editedTitle, editedAuthor, editedDescription, editedGenre)();

    // Закрываем модальное окно редактирования книги
    libraryApp.closeModal('editBook');

    // Обновляем таблицу
    libraryApp.initializeTable();
}

// Функция для удаления книги
function deleteBook() {
    // Получаем ID выбранной книги
    let bookId = libraryApp.selectedBookId;

    // Вызываем функцию удаления книги через eel
    eel.delete_book(bookId)();

    // Закрываем модальное окно удаления книги
    libraryApp.closeModal('deleteBook');

    // Обновляем таблицу
    libraryApp.initializeTable();
}