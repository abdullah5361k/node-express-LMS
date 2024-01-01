const { CourierClient } = require("@trycourier/courier")

async function sendEmail(url, email) {
    const courier = new CourierClient(
        { authorizationToken: process.env.AUTHRO });


    try {
        const { requestId } = await courier.send({
            message: {
                content: {
                    title: "Password reset request for Apna Store!",
                    body: `Hello {{name}}.
                        We have recieved a request to reset your account password. Please click the link the below to complete the
                        process:
                        {{url}}
        
                        Regards,
                        Apna Store team`
                },
                data: {
                    // joke: "Why was the JavaScript developer sad? Because they didn't Node how to Express themselves",
                    name: "Abdullah",
                    url: url
                },
                to: {
                    email: email
                }
            }
        });
        return requestId

    } catch (err) {
        return next(new AppError(403, "Try again after some seconds"));
    }

}

module.exports = sendEmail;