import readline from "readline";
import * as yup from "yup";
const rl = readline.createInterface(process.stdin, process.stdout);

const question = (str: string) =>
  new Promise((resolve) => rl.question(str, resolve));

async function askEmail(): Promise<string> {
  const emailSchema = yup.string().email();
  while (true) {
    const email = await question("Enter email: ");
    if (email) {
      if (!emailSchema.isValidSync(email)) {
        console.log("Email is not valid");
        continue;
      }
      return String(email);
    }
  }
}

async function askPassword(): Promise<string> {
  while (true) {
    const password = await question("Enter password: ");
    if (password) return String(password);
  }
}

export { askEmail, askPassword };
