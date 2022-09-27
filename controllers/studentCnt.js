const User = require('../models/users');
const FavouriteTeacher = require('../models/favouriteTeacher')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const Attendence = require('../models/attendence');
var moment = require('moment')
exports.register = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, type } = req.body;
        const newUser = new User({ name, email, password, phoneNumber, type: 'student' });
        await newUser.save();
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
        const user = await User.findOne({ email, type: 'student' });

        if (user == null)
            return res.send("Incorrect Details!")
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ id: user._id }, 'private_keyL#23nk13!32323', { expiresIn: '24h' });
                return res.status(200).json({ token: token });
            }
            else {
                return res.status(401).send("Password Mismatch")
            }
        })
    }
    catch (err) {
        res.status(500).send(err);
    }
}

exports.markAttendence = async (req, res) => {
    try {
        const reportingTime = moment(req.body.currentTime);
        const expectedTime = moment(reportingTime).hours(7).minutes(0).seconds(1);
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, 'private_keyL#23nk13!32323', async (err, user) => {

            try {

                if (err)
                    return res.status(401).send("Not authorized")
                else {
                    const student = await User.findOne({ _id: user.id, type: 'student' });

                    if (student == null)
                        return res.send("ReLogin with student credential")
                    else {
                        const prevAttendence = await Attendence.findOne({ userId: student.id });
                        if (prevAttendence != null) {
                            const prevAttendenceDate = moment(prevAttendence.updatedAt);
                            if (!prevAttendenceDate.isSameOrBefore(reportingTime))
                                return res.send('Attendence already marked')
                        }
                        const flag = expectedTime.isSameOrBefore(reportingTime)
                        console.log(flag, reportingTime, expectedTime)
                        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
                        await Attendence.findOneAndUpdate({ _id: user.id }, {
                            userId: user.id,
                            $inc: { 'attendence': 1, 'late': flag }

                        }, options)
                        return res.send("Attendence Marked")
                    }
                }
            }
            catch (e) {

                console.log(err)
                res.status(500).send(err)
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.addFavTeacher = async (req, res) => {
    try {
        const teacherId = req.body.teacherId
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, 'private_keyL#23nk13!32323', async (err, user) => {

            if (err)
                return res.status(401).send("Not authorized")
            else {
                const student = await User.findOne({ _id: user.id, type: 'student' });

                if (student == null)
                    return res.send("ReLogin with student credential")
                else {
                    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
                    await FavouriteTeacher.findOneAndUpdate({ _id: user.id }, {
                        "$push": { teachersId: teacherId }, studentId: user.id
                    }, options)
                    return res.send("Added Successfully")
                }
            }
        })


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
        jwt.verify(token, 'private_keyL#23nk13!32323', async (err, user) => {

            if (err)
                return res.status(401).send("Not authorized")
            else {
                const student = await User.findOne({ _id: user.id, type: 'student' });

                if (student == null)
                    return res.send("Token Expires. ReLogin")
                else {
                    await FavouriteTeacher.findOneAndUpdate({ _id: user.id }, {
                        "$pull": { teachersId: teacherId }
                    }, (err, result) => {

                        if (err)
                            return res.send("Favourite teacher not found.")
                        else
                            return res.send("Removed Successfully")
                    })

                }
            }
        })
    }
    catch (err) {
        res.status(500).send(err)
    }
}

exports.mostFavTeacher = async (req, res) => {

    try {
        const result = await FavouriteTeacher.aggregate(
            [
                { "$unwind": "$teachersId" },
                {
                    $lookup: {
                        from: 'users',
                        localField: "teachersId",
                        foreignField: "_id",
                        as: "teacher"
                    }
                },
                { "$group": { "_id": "$teachersId", "teacher": { "$first": "$teacher" }, "count": { "$sum": 1 } } },
            ]
        )

        let maxFavCnt = 0;
        let favTeachers = [];
        for await (const doc of result) {
            maxFavCnt = Math.max(maxFavCnt, doc.count)
        }
        for await (const doc of result) {
            if (doc.count == maxFavCnt)
                favTeachers.push(doc.teacher[0])
        }
        return res.status(200).send(favTeachers)
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.attendenceReport = async (req, res) => {
    try {
        const id = req.params.id;
        const attendenceUser = await Attendence.findOne({ userId: id });
        let onTimePercent = 0, latePercent = 0;

        latePercent = attendenceUser.late / attendenceUser.attendence * 100;
        onTimePercent = 100 - latePercent;

        res.json({"On Time(%)" : onTimePercent , "Late(%)" : latePercent})
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}