import eel

import data.db as db
from utils.logger import LOGGER_CONFIG
import logging.config

# Создание таблиц в базе данных при инициализации
db.create_tables()

# Конфигурация логгера
logging.config.dictConfig(LOGGER_CONFIG)
logging.raiseExceptions = False
logger = logging.getLogger("main")
logger.debug("------------------------------------------------------------------")

# Инициализация Eel
eel.init("web")

# Функции, экспортированные для использования из JavaScript

@eel.expose
def get_books():
    try:
        return db.view_books()
    except Exception as e:
        logger.exception("Ошибка при получении списка книг: %s", str(e))
        return []

@eel.expose
def get_book(bookId):
    try:
        bookData = db.view_book(int(bookId))
        return bookData
    except Exception as e:
        logger.exception("Ошибка при получении информации о книге: %s", str(e))
        return None

@eel.expose
def add_book(title, author, description, genre):
    try:
        db.add_book(title, author, description, genre)
        logger.info("Добавлена новая книга: %s, %s", title, author)
    except Exception as e:
        logger.exception("Ошибка при добавлении книги: %s", str(e))

@eel.expose
def edit_book(bookId, title, author, description, genre):
    try:
        bookId = int(bookId)
        db.edit_book(bookId, title, author, description, genre)
        logger.info("Книга изменена: %s", bookId)
    except Exception as e:
        logger.exception("Ошибка при редактировании книги: %s", str(e))

@eel.expose
def delete_book(bookId):
    try:
        db.delete_book(int(bookId))
        logger.info("Книга удалена: %s", bookId)
    except Exception as e:
        logger.exception("Ошибка при удалении книги: %s", str(e))

@eel.expose
def search_books(keyword):
    try:
        bookData = db.search_books(keyword)
        return bookData
    except Exception as e:
        logger.exception("Ошибка при поиске книг: %s", str(e))
        return []

@eel.expose
def get_genres():
    try:
        genres = db.get_genres()
        return genres
    except Exception as e:
        logger.exception("Ошибка при получении списка жанров: %s", str(e))
        return []

@eel.expose
def search_books_by_genre(genre):
    try:
        bookData = db.search_books_by_genre(genre)
        return bookData
    except Exception as e:
        logger.exception("Ошибка при поиске книг по жанру: %s", str(e))
        return []

# Запуск Eel
try:
    logger.info("$MAGENTAПрограмма запущена")
    eel.start('index.html', size=(800, 800))
except Exception as e:
    logger.exception("Ошибка при запуске Eel: %s", str(e))