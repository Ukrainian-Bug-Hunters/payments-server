const calculateHomeAmount = ({ amount, exchangeRate }) => {
    return Math.round((amount / exchangeRate) * 100) / 100;
};

const calculateTotalhomeAmount = (payments) => {
    const totalAmountHomeCurrency = payments.reduce((total, payment) => {
        return total + calculateHomeAmount(payment);
        }, 0);
    
    return Number((totalAmountHomeCurrency * 100 / 100).toFixed(2));
};

export {calculateHomeAmount, calculateTotalhomeAmount};
// export default calculateTotalhomeAmount;