const { CourierClient } = require("@trycourier/courier");

const courier = CourierClient(
    { authorizationToken: "pk_prod_DEXAK9TX8ZMMYAGT8PQ4T5G694JA" });

const { requestId } = await courier.send({
    message: {
        content: {
            title: "Welcome to Courier!",
            body: "Want to hear a joke? {{joke}}"
        },
        data: {
            joke: "Why was the JavaScript developer sad? Because they didn't Node how to Express themselves"
        },
        to: {
            email: "aa@gmail.com"
        }
    }
});
