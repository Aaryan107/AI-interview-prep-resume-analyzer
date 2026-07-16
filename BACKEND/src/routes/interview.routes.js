const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');
const authMiddleware = require('../middleware/auth.middleware')
const upload = require('../middleware/file.middleware')

router.post('/', authMiddleware.authUser,upload.single('resume'),interviewController.generateInterviewReport);
router.get('/:interviewId',authMiddleware.authUser,interviewController.getInterviewReport)
router.get('/',authMiddleware.authUser,interviewController.getAllInterviewReportsByAUser)
router.post('/resume/pdf/:interviewId',authMiddleware.authUser,interviewController.generateResumePdf)
module.exports = router;