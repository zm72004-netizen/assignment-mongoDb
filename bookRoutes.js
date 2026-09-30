import express from 'express';
import * as controller from '../controllers/bookController.js';

const router = express.Router();

router.post('/collection/books', controller.createBooksCollection);
router.post('/collection/authors', controller.createAuthorsCollection);
router.post('/collection/logs/capped', controller.createCappedLogs);
router.post('/collection/books/index', controller.createBookIndex);

router.post('/books', controller.insertSingleBook);
router.post('/books/batch', controller.insertBatchBooks);
router.post('/logs', controller.insertLog);

router.patch('/books/Future', controller.updateBookFuture);

router.get('/books/title', controller.findBookByTitle);
router.get('/books/year', controller.findBooksByYearRange);
router.get('/books/genre', controller.findBooksByGenre);
router.get('/books/skip-limit', controller.getSkipLimitBooks);
router.get('/books/year-integer', controller.findYearInteger);
router.get('/books/exclude-genres', controller.excludeGenres);
router.get('/books/before-year', controller.deleteBeforeYear);

router.get('/books/aggregate1', controller.aggregate1);
router.get('/books/aggregate2', controller.aggregate2);
router.get('/books/aggregate3', controller.aggregate3);
router.get('/books/aggregate4', controller.aggregate4);

export default router;