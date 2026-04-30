import { Router } from 'express';
import * as collegeController from '../controllers/college.controller';

const router = Router();

// GET /api/colleges - List with search + filters + pagination
router.get('/', collegeController.listColleges);

// GET /api/colleges/compare?ids=id1,id2,id3
router.get('/compare', collegeController.compareColleges);

// GET /api/colleges/locations - Unique states/cities for filter dropdown
router.get('/locations', collegeController.getLocations);

// GET /api/colleges/:id - By ID or slug
router.get('/:id', collegeController.getCollege);

// POST /api/colleges/bulk - Bulk import from JSON
router.post('/bulk', collegeController.bulkImport);

export { router as collegeRoutes };
