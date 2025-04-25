import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";

export function clearConsole(): void {
  console.clear();
}

export function displayTitle(title: string): void {
  clearConsole();
  console.log(
    boxen(chalk.bold(title), {
      title: "The White Wolf Inn",
      padding: 1,
      borderStyle: "round",
      borderColor: "red",
      backgroundColor: "#222",
    })
  );
}

export function pressEnterToContinue(): Promise<void> {
  return new Promise((resolve) => {
    console.log("\nPress Enter to continue...");
    process.stdin.resume();
    process.stdin.once("data", () => {
      process.stdin.pause();
      resolve();
    });
  });
}


export function showSuccess(message: string): void {
  console.log(chalk.green(`✔ ${message}`));
}

export function showError(message: string): void {
  console.log(chalk.red(`✖ ${message}`));
}