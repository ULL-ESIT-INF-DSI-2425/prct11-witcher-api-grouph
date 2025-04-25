import inquirer from "inquirer";
import { displayTitle, pressEnterToContinue, showSuccess } from "../utils/menuUtils.js";
import { clientDB, clientMenu } from "./clientMenu.js";

/**
 * Function to delete a client from the database
 */
export function deleteClient(): void {
  displayTitle("Delete Client");
  inquirer
    .prompt([{ type: "input", name: "id", message: "Enter the client's ID:" }])
    .then(({ id }) => {
      if (!clientDB.getClientById(id)) {
        console.log("Client not found.");
        pressEnterToContinue().then(() => clientMenu());
        return;
      }
      clientDB.removeClient(id);

      showSuccess(`Client "${id.name}" deleted successfully!`)
      pressEnterToContinue().then(() => clientMenu());
    });
}
