import { dim, bold as strong, yellow, red, green } from "colorette";

export const info = (message: string | number = "") =>
  console.log(dim(message));
export const warn = (message: string | number = "") =>
  console.warn(yellow(message));
export const success = (message: string | number = "") =>
  console.log(green(message));
export const error = (message: string | number = "") =>
  console.error(strong(red(message)));
export const bold = (message: string | number = "") =>
  console.log(strong(message));
export const die = (errorOrMessage: Error | string, instructions?: string) => {
  if (errorOrMessage instanceof Error) {
    error(errorOrMessage.message);
    info(errorOrMessage.stack);
  } else {
    error(errorOrMessage);
    if (instructions) {
      info(instructions);
    }
  }
};
