export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string) => {
  const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return re.test(password);
};
