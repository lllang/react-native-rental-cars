// eslint-disable-next-line import/prefer-default-export
// export const isPhone = phone => /^(\+?0?86-?)?1[345789]\d{9}$/.test(phone);
export const isPhone = phone => /^\d{11}$/.test(phone);
export const isPhoneCode = code => /^\d{4,10}$/.test(code);
export const isBikeCode = code => /^\d{8}$/.test(code);
export const isBikeURLCode = code => /^https:\/\/dc\.tt\/hm\?vehicleId=\d{8}$/.test(code);
export const isBatteryCode = code => /^baa|c\d{13}$/i.test(code);
export const isCharingCode = code => /^CU[A-Z]\d+$/i.test(code);
