const Staff = require('../models/staff')
const Attendence = require('../models/attendence')
const User = require('../models/users')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var moment = require('moment');

exports.register = async (req, res) => {

    try {
        const { name, email, password, phoneNumber, type } = req.body;
        const staff = new User({ name, email, password, phoneNumber, type });
        await staff.save();
        return res.send('Registered');
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.login = async (req, res) => {
    try {
        console.log(req.body)
        const { email, password, type } = req.body;
        const user = await User.findOne({ email, type });
        if (user == null)
            return res.send("Incorrect Details")

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
        console.log(err)
        res.status(500).send(err)
    }
}

exports.markAttendence = async (req, res) => {
    try {
        const reportingTime = moment(req.body.currentTime);
        const type = req.body.type;
        const expectedTime = moment(reportingTime).hours(7).minutes(0).seconds(1);
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, 'private_keyL#23nk13!32323', async (err, user) => {
            try {

                if (err)
                    return res.status(401).send("Not authorized")
                else {
                    const student = await User.findOne({ _id: user.id, type: type });

                    if (student == null)
                        return res.send(`ReLogin with ${type} credential`)
                    else {
                        const prevAttendence = await Attendence.findOne({ userId: student.id });
                        if (prevAttendence != null) {
                            const prevAttendenceDate = moment(prevAttendence.updatedAt);
                            if (!prevAttendenceDate.isSameOrBefore(reportingTime))
                                return res.send('Attendence already marked')
                        }
                        const flag = expectedTime.isSameOrBefore(reportingTime)
                        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
                        await Attendence.findOneAndUpdate({ _id: user.id }, {
                            userId: user.id,
                            $inc: { 'attendence': 1, 'late': flag }

                        }, options)
                        return res.send("Attendence Marked")
                    }
                }
            }
            catch (err) {

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