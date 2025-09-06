import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { searchHandler } from '../controllers/search.controller';
import { geminiSearchHandler } from '../controllers/gemini.controller';
import { upload } from '../utils/upload';

const router = Router();

router.post('/search', upload.single('image'), searchHandler);
router.post('/search/gemini', upload.single('image'), geminiSearchHandler);

export default router;
