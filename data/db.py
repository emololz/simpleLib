import sqlite3

# Указываем имя файла для базы данных
DB_FILENAME = './data/library.db'

# Функция для создания таблицы, если её нет
def create_tables():
    with sqlite3.connect(DB_FILENAME) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                author TEXT,
                description TEXT,
                genre TEXT
            )
        ''')
        conn.commit()

# Функция для добавления книги в базу данных
def add_book(title, author, description, genre):
    with sqlite3.connect(DB_FILENAME) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO books (title, author, description, genre)
            VALUES (?, ?, ?, ?)
        ''', (title, author, description, genre))
        conn.commit()

# Функция для редактирования информации о книге
def edit_book(book_id, title, author, description, genre):
    with sqlite3.connect(DB_FILENAME) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE books
            SET title = ?, author = ?, description = ?, genre = ?
            WHERE id = ?
        ''', (title, author, description, genre, book_id))
        conn.commit()

# Функция для просмотра всех книг в базе данных
def view_books():
    with sqlite3.connect(DB_FILENAME) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM books')
        books = cursor.fetchall()
        return books

# Функция для просмотра информации о конкретной книге
def view_book(bookId):
    with sqlite3.connect(DB_FILENAME) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM books WHERE id = ?', (bookId,))
        book = cursor.fetchall()
        return book

# Функция для поиска книг по жанру
def search_books_by_genre(genre):
    with sqlite3.connect(DB_FILENAME) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM books WHERE genre = ?', (genre,))
        books = cursor.fetchall()
        return books

# Функция для поиска книг по ключевому слову (заголовок или автор)
def search_books(keyword):
    with sqlite3.connect(DB_FILENAME) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM books WHERE title LIKE ? OR author LIKE ?',
                       ('%' + keyword + '%', '%' + keyword + '%'))
        books = cursor.fetchall()
        return books

# Функция для удаления книги из базы данных
def delete_book(bookId):
    with sqlite3.connect(DB_FILENAME) as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM books WHERE id = ?', (bookId,))
        conn.commit()

# Функция для получения всех уникальных жанров
def get_genres():
    with sqlite3.connect(DB_FILENAME) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT genre FROM books')
        genres = cursor.fetchall()
        return genres
