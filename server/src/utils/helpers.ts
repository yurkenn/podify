export const generateToken = (length = 6) => {
  // declare a variable
  let otp = '';

  for (let i = 0; i < length; i++) {
    // generates a random number between 0 and 9
    const digit = Math.floor(Math.random() * 10);
    // append the digit to the otp variable
    otp += digit;
  }

  return otp;
};
