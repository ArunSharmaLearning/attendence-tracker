
const router = require('express').Router();
const teacherCnt = require('../controllers/teacherCnt');

router.post('/register'  , teacherCnt.register)

router.post('/login' ,teacherCnt.login)

router.get('/authenticate' , teacherCnt.authenticate)
module.exports = router