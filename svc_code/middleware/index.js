
const { db, admin } = require('../server/firebase');
class Middleware {
    async decodeToken(req, res, next) {
        // console.log(req.headers.authorization);
        // console.log(req.headers);
        
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            // console.log(token);
            try {
                // console.log('wdiuwbduw');
                const decodeValue = await admin.auth().verifyIdToken(token);
                // console.log(decodeValue);
                if (decodeValue) {
                    return next()
                }
                else {
                    return res.json({
                        message: 'UnAuthorized'
                    })
                }
            }
            catch (e) {

                // console.log(e);
                return res.json({ message: 'Internal Error' })
            }
        } else {
            // console.log("hiii");
            return res.json({ message: 'Not Authorized!' })
        }

    }
}

module.exports = new Middleware();