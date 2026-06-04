const generateOtp = () => {
    return Math.floor(Math.random() * 900000) + 100000; // return between 100000 to 999999
};

export { generateOtp };
