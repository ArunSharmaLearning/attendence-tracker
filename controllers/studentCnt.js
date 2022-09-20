const Student = require('../models/student')
const Teacher = require('../models/teacher')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const newStudent = new Student(req.body);

        var hashedPassword = await bcrypt.hash(req.body.password, 8);
        newStudent.password = hashedPassword
        await newStudent.save();
        res.send("Registered")

    }
    catch (err) {
        res.status(500).send(err)
    }

}

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Student.findOne({ email });
        if(user==null)
        return res.send("Incorrect Details")
        bcrypt.compare(password, user.password, function (err, result) {

            console.log(err , result)
            if (result) {
                var token = jwt.sign({ id: user._id }, 'private_keyL#23nk13!32323', { expiresIn: '24h' });
                return res.status(200).json({ token: token });
            }
            else {
                return res.status(401).send(err)
            }
        })

    }
    catch (err) {
        res.status(500).send(err);
    }

}

exports.authenticate = (req, res) => {

    try {
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
    catch (err) {
        res.status(500).send(err);
    }

}

exports.addFavTeacher = async (req, res) => {

    try {
        const teacherId = req.body.teacherId
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        const user = jwt.verify(token, 'private_keyL#23nk13!32323', (err, user) => {

            if (err)
                return res.status(401).send("Not authorized")
            else {
                return user;
            }
        })
        const student = await Student.findOne({ _id: user.id });

        if (student == null)
            return res.send("Token Expires. ReLogin")
        else {
            await Student.findOneAndUpdate({ _id: user.id }, {
                "$push": { favourites: teacherId }
            })

            return res.send("Added Successfully")
        }

    }
    catch (err) {
        res.status(500).send(err)
    }
}


exports.remFavTeacher = async (req, res) => {

    try {
        const teacherId = req.body.teacherId
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        const user = jwt.verify(token, 'private_keyL#23nk13!32323', (err, user) => {

            if (err)
                return res.status(401).send("Not authorized")
            else {
                return user;
            }
        })
        const student = await Student.findOne({ _id: user.id });

        if (student == null)
            return res.send("Token Expires. ReLogin")
        else {
            await Student.findOneAndUpdate({ _id: user.id }, {
                "$pull": { favourites: teacherId }
            }, (err, ans) => {

                if (err)
                    return res.send("Favourite teacher not found")
                else
                    return res.send("Removed Successfully")
            })

        }

    }
    catch (err) {
        res.status(500).send(err)
    }
}

exports.mostFavTeacher = async (req, res) => {

    try {
        const result = await Student.aggregate(
            [
                { "$unwind": "$favourites" },
                { "$group": { "_id": "$favourites", "count": { "$sum": 1 } } },
            ]
        )

        let maxFavCnt = 0;
        let favTeachersId = [], favTeachers = [];
        for await (const doc of result) {
            maxFavCnt = Math.max(maxFavCnt, doc.count)
        }
        for await (const doc of result) {
            if (doc.count == maxFavCnt)
                favTeachersId.push(doc._id)
        }

        for await (const doc of favTeachersId) {
            const teacher = await Teacher.findOne({ _id: doc });

            favTeachers.push(teacher)
        }

        return res.status(200).send(favTeachers)

    }
    catch (err) {
        res.status(500).send(err)
    }
}