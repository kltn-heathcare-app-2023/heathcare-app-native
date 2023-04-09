const isValidVNPhoneNumber = phoneNumber => {
  const regex =
    /^(\\+84|0)((3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}|1[35789][0-9]{8})$/;
  return regex.test(phoneNumber);
};

const isValidVNName = name => {
  const regex = /^([\p{L}]+\s)*[\p{L}]+$/u;
  return regex.test(name);
};

export default {isValidVNPhoneNumber, isValidVNName};
