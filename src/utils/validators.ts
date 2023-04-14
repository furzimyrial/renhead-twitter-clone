export const nameValidators = [
  {
    message: "Field cannot be empty",
    validatorFunction: (value: string) => {
      return !!value.trim().length;
    },
  },
];

export const emailValidators = [
  {
    message: "Field cannot be empty",
    validatorFunction: (value: string) => {
      return !!value.trim().length;
    },
  },
  {
    message: "Not a valid email format",
    validatorFunction: (value: string) => {
      return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      );
    },
  },
];

export const passwordValidators = [
  {
    message: "Field cannot be empty",
    validatorFunction: (value: string) => {
      return !!value.trim().length;
    },
  },
  {
    message:
      "Password needs to be at least 8 characters long and have at least 1 uppercase, lowercase, symbol and a number",
    validatorFunction: (value: string) => {
      return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)[^\s]{8,}$/.test(value);
    },
  },
];
