const keys = require("../../config/keys");
const SafeBuffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');

module.exports = (user = { _id: '5ea946087d6953d914584c5f' }) => {
    const session = ({
        name: "session",
        value: new SafeBuffer.from(JSON.stringify({
            passport: {
                user: user._id.toString(),
            }
        })).toString("base64"),
    });
    const sig = ({
        name: "session.sig",
        value: new Keygrip([keys.cookieKey]).sign("session=" + session.value),
    })

    return [session, sig];
}