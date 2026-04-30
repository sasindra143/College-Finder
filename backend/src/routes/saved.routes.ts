import { Router } from 'express';
import * as savedController from '../controllers/saved.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { saveCollegeSchema, saveComparisonSchema } from '../validators/saved.validator';

const router = Router();

// All saved routes require authentication
router.use(authenticate);

// Saved Colleges
router.get('/colleges', savedController.getSavedColleges);
router.post('/colleges', validate(saveCollegeSchema), savedController.saveCollege);
router.delete('/colleges/:collegeId', savedController.unsaveCollege);

// Saved Comparisons
router.get('/comparisons', savedController.getSavedComparisons);
router.post('/comparisons', validate(saveComparisonSchema), savedController.saveComparison);
router.delete('/comparisons/:id', savedController.deleteComparison);

export { router as savedRoutes };
