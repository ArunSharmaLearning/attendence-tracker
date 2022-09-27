var jwt = require('jsonwebtoken');
const User = require('../models/users')
exports.authenticate = async (req, res ,next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, 'private_keyL#23nk13!32323', (err, user) => {

        if (err)
            return res.status(401).send("Not authorized")
        else {

            const saveUser = User.findOne({_id: user.id});
            if(saveUser==null)
            return res.status(401).send("User not exist")
            else
            return next();
        }
    })

}
