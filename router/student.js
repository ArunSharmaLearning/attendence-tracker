
const router = require('express').Router();
const studentCnt = require('../controllers/studentCnt');
const authorizedCnt = require('../controllers/authenticateCnt').authenticate

router.post('/register', studentCnt.register)
router.post('/login', studentCnt.login)
router.post('/markattendence' , authorizedCnt, studentCnt.markAttendence)
router.post('/addfav' , authorizedCnt, studentCnt.addFavTeacher)
router.post('/remfav' , authorizedCnt, studentCnt.remFavTeacher)
router.get('/mostfav' ,authorizedCnt, studentCnt.mostFavTeacher)
router.get('/attendencereport/:id', authorizedCnt, studentCnt.attendenceReport)

module.exports = router