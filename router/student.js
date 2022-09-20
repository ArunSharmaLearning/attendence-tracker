
const router = require('express').Router();
const studentCnt = require('../controllers/studentCnt');

router.post('/register', studentCnt.register)

router.post('/login' ,studentCnt.login)

router.get('/authenticate' , studentCnt.authenticate)

router.post('/addfav', studentCnt.addFavTeacher)
router.post('/remfav', studentCnt.remFavTeacher)
router.get('/mostfav', studentCnt.mostFavTeacher)

module.exports = router