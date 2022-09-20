const Teacher = require('../models/teacher')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.register = async (req, res) => {

    try {
        const newTeacher = new Teacher(req.body);
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        newTeacher.password = hashedPassword
        await newTeacher.save();

        return res.send('Registered');
    }
    catch (err) {
        res.status(500).send(err)
    }


}

exports.login = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Teacher.findOne({ email, password });
        if(user==null)
        return res.send("Incorrect Details")
        bcrypt.compare(password, user.password, async function (err, result) {
            if (result) {
                var token =  jwt.sign({ id: user._id }, 'private_keyL#23nk13!32323', { expiresIn: '24h' });
                return res.status(200).json({ token: token });
            }
            else
                return res.status(401).send(err)
        })

    }
    catch (err) {
        res.status(500).send(err)
    }


}

exports.authenticate = (req, res) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, 'private_keyL#23nk13!32323', (err, user) => {

        if (err)
            return res.status(401).send("Not authorized")
        else {
            return res.status(401).send("Authorized")
        }
    })

}
