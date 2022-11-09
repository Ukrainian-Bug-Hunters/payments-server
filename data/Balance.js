import paymentsIn from "./payments-in.js";

const calculateHomeAmount = ({ amount, exchangeRate }) => {
    return Math.round((amount / exchangeRate) * 100) / 100;
};

const calculateTotalhomeAmount = (paymentsIn) => {
    const totalAmountHomeCurrency = paymentsIn.reduce((total, payment) => {
        return total + calculateHomeAmount(payment);
        }, 0);
    
    return Number(totalAmountHomeCurrency * 100 / 100).toFixed(2);
};

const balance = calculateTotalhomeAmount(paymentsIn);

export default balance;