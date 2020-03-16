/** Generates code that could be used as email confirmfation or security code */
export default function generateCode(charsNumber: number): string {
  let code: string = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  while (code.length < charsNumber) {
    // Randomly choosing between digits or letters
    if (Math.round(Math.random())) {
      // Digit case
      code += String(Math.round(Math.random() * 9));
    } else {
      code += characters[Math.round(Math.random() * (characters.length - 1))];
    }
  }
  return code;
}
