import { Router } from 'express';
import {signup } from '../controllers/auth.controllers';
const router = Router();

router.post('/signup', signup);
// router.get('/signin', signin);

export default router;