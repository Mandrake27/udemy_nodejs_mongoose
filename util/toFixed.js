const toFixedNumber = (num, digits) => {
    const pow = Math.pow(10, digits); // exponentiation
    return Math.round(num * pow) / pow;
};

module.exports = toFixedNumber;