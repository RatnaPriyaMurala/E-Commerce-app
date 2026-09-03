import Razorpay from "razorpay";

let razorpay = null;

const getRazorpay = () => {
    if (razorpay) {
        return razorpay;
    }

    if (
        !process.env.RAZORPAY_KEY_ID ||
        !process.env.RAZORPAY_SECRET
    ) {
        throw new Error(
            "Razorpay environment variables are missing"
        );
    }

    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    });

    return razorpay;
};

export default getRazorpay;