
const router = require('express').Router();
const staffCnt = require('../controllers/staffCnt');
const authorizedCnt = require('../controllers/authenticateCnt').authenticate

router.post('/register'  , staffCnt.register)
router.post('/login' ,staffCnt.login)
router.post('/markattendence' ,authorizedCnt ,  staffCnt.markAttendence)
router.get('/attendencereport/:id' , authorizedCnt ,staffCnt.attendenceReport)

module.exports = router