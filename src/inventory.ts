import { BaseItem, Item } from "./item.js";
import { Merchant } from "./merchant.js";
import { Hunter } from "./hunter.js";
import {
  Transaction,
  SaleTransaction,
  PurchaseTransaction,
  ReturnTransaction,
} from "./transaction.js";
import { ClientCollection } from "./collections/clientCollection.js";
import { MerchantCollection } from "./collections/merchantCollection.js";
import { ItemCollection } from "./collections/itemCollection.js";

/**
 * Type that represents the stock of items in the inventory.
 * The key is the item ID and the value is an object with the item and the quantity in stock.
 */
type ItemStock = Map<string, { item: Item; quantity: number }>;

/**
 * Class that represents an inventory system.
 */
export class Inventory {
  private transactions: Transaction[] = [];
  private stock: ItemStock = new Map();
  private clientCollection: ClientCollection;
  private merchantCollection: MerchantCollection;
  private itemCollection: ItemCollection;

  /**
   * Constructor that initializes the inventory with the collections of clients, merchants, and items.
   * @param clientCollection The collection of clients.
   * @param merchantCollection The collection of merchants.
   * @param itemCollection The collection of items.
   */
  constructor(
    clientCollection: ClientCollection,
    merchantCollection: MerchantCollection,
    itemCollection: ItemCollection,
  ) {
    this.clientCollection = clientCollection;
    this.merchantCollection = merchantCollection;
    this.itemCollection = itemCollection;
  }

  /**
   * Method that adds an item to the stock of the inventory.
   * @param item The item to add to the stock.
   * @param quantity The quantity of the item to add.
   */
  addItemToStock(item: Item, quantity: number): void {
    if (quantity <= 0) {
      throw new Error(`Quantity must be greater than 0 for item: ${item.name}`);
    }
    const currentRecord = this.stock.get(item.id);
    if (currentRecord) {
      currentRecord.quantity += quantity;
    } else {
      this.stock.set(item.id, { item, quantity });
    }
  }

  /**
   * Method that removes an item from the stock of the inventory.
   * @param item The item to remove from the stock.
   * @param quantity The quantity of the item to remove.
   */
  removeItemFromStock(item: Item, quantity: number): void {
    if (quantity <= 0) {
      throw new Error(`Quantity must be greater than 0 for item: ${item.name}`);
    }
    const currentRecord = this.stock.get(item.id);
    if (!currentRecord || currentRecord.quantity < quantity) {
      throw new Error(`Not enough stock for item: ${item.name}`);
    }
    currentRecord.quantity -= quantity;
    if (currentRecord.quantity === 0) {
      this.stock.delete(item.id);
    }
  }

  /**
   * Method that returns the stock level of an item.
   * @param item The item to get the stock level for.
   * @returns The stock level of the item
   */
  getStockLevel(item: Item): number {
    const record = this.stock.get(item.id);
    return record ? record.quantity : 0;
  }

  /**
   * Method that records a sale transaction in the inventory.
   * @param client The client that made the sale.
   * @param items The items sold in the transaction.
   */
  recordSale(client: Hunter, items: Item[]): void {
    if (!this.clientCollection.getClientById(client.id)) {
      throw new Error(`Client with ID ${client.id} does not exist.`);
    }
    const itemQuantities = new Map<Item, number>();
    items.forEach((item) => {
      itemQuantities.set(item, (itemQuantities.get(item) || 0) + 1);
    });
    itemQuantities.forEach((quantity, item) => {
      if (!this.itemCollection.getItems().includes(item)) {
        throw new Error(`Item with ID ${item.id} does not exist.`);
      }
      if (this.getStockLevel(item) < quantity) {
        throw new Error(`Not enough stock for item: ${item.name}`);
      }
    });

    const totalCrowns = this.calculateTotalCrowns(items);
    const transaction: SaleTransaction = {
      date: new Date(),
      items,
      client,
      operationType: "sell",
      totalCrowns,
    };
    this.transactions.push(transaction);
    itemQuantities.forEach((quantity, item) => {
      this.removeItemFromStock(item, quantity);
    });
  }

  /**
   * Method that records a purchase transaction in the inventory.
   * @param merchant The merchant that made the purchase.
   * @param items The items purchased in the transaction.
   */
  recordPurchase(merchant: Merchant, items: Item[]): void {
    if (!this.merchantCollection.getMerchantById(merchant.id)) {
      throw new Error(`Merchant with ID ${merchant.id} does not exist.`);
    }
    items.forEach((item) => {
      if (!this.itemCollection.getItems().includes(item)) {
        throw new Error(`Item with ID ${item.id} does not exist.`);
      }
    });

    const totalCrowns = this.calculateTotalCrowns(items);
    const transaction: PurchaseTransaction = {
      date: new Date(),
      items,
      merchant,
      operationType: "buy",
      totalCrowns,
    };
    this.transactions.push(transaction);
    items.forEach((item) => {
      this.addItemToStock(item, 1);
    });
  }

  /**
   * Method that records a return transaction in the inventory.
   * @param from The client or merchant that made the return.
   * @param items The items returned in the transaction.
   * @param reason The reason for the return
   */
  recordReturn(from: Hunter | Merchant, items: Item[], reason: string): void {
    if (from instanceof Hunter) {
      if (!this.clientCollection.getClientById(from.id)) {
        throw new Error(`Client with ID ${from.id} does not exist.`);
      }
    } else if (from instanceof Merchant) {
      if (!this.merchantCollection.getMerchantById(from.id)) {
        throw new Error(`Merchant with ID ${from.id} does not exist.`);
      }
      items.forEach((item) => {
        if (!this.itemCollection.getItems().includes(item)) {
          throw new Error(`Item with ID ${item.id} does not exist.`);
        }
        if (this.getStockLevel(item) < 1) {
          throw new Error(`Not enough stock for item: ${item.name}`);
        }
      });
    }

    const totalCrowns = this.calculateTotalCrowns(items);
    const transaction: ReturnTransaction = {
      date: new Date(),
      items,
      from,
      reason,
      operationType: "return",
      totalCrowns,
    };
    this.transactions.push(transaction);
    if (from instanceof Hunter) {
      items.forEach((item) => {
        this.addItemToStock(item, 1);
      });
    } else if (from instanceof Merchant) {
      items.forEach((item) => {
        this.removeItemFromStock(item, 1);
      });
    }
  }

  /**
   * Method that calculates the total price in crowns of a list of items.
   * @param items The items to calculate the total price for.
   * @returns The total price in crowns.
   */
  private calculateTotalCrowns(items: Item[]): number {
    return items.reduce((total, item) => total + item.price, 0);
  }

  /**
   * Method that returns all the transactions in the inventory.
   * @returns An array with all the transactions.
   */
  getAllTransactions(): Transaction[] {
    return this.transactions;
  }

  /**
   * Method that returns all the sale transactions in the inventory.
   * @returns An array with all the sale transactions.
   */
  getSales(): SaleTransaction[] {
    return this.transactions.filter(
      (t) => t.operationType === "sell",
    ) as SaleTransaction[];
  }

  /**
   * Method that returns all the purchase transactions in the inventory.
   * @returns An array with all the purchase transactions.
   */
  getPurchases(): PurchaseTransaction[] {
    return this.transactions.filter(
      (t) => t.operationType === "buy",
    ) as PurchaseTransaction[];
  }

  /**
   * Method that returns all the return transactions in the inventory.
   * @returns An array with all the return transactions.
   */
  getReturns(): ReturnTransaction[] {
    return this.transactions.filter(
      (t) => t.operationType === "return",
    ) as ReturnTransaction[];
  }

  /**
   * Method that prints all the transactions in the inventory.
   */
  printTransactionsByClient() {
    console.log("Transactions by Client:");
    console.log("Sales:");
    this.getSales().forEach((t) => {
      console.log("CLIENT:", t.client.name);
      console.log("\tDate:", t.date.toDateString());
      console.log("\tItems:", t.items.map((i) => i.name).join(", "));
      console.log("\tTotal:", t.totalCrowns);
    });
    console.log("Returns:");
    this.getReturns().forEach((t) => {
      if (t.from instanceof Hunter) {
        console.log("CLIENT:", t.from.name);
        console.log("\tDate:", t.date.toDateString());
        console.log("\tItems:", t.items.map((i) => i.name).join(", "));
        console.log("\tTotal:", t.totalCrowns);
      }
    });
  }

  /**
   * Method that prints all the transactions in the inventory.
   */
  printTransactionsByMerchant() {
    console.log("Transactions by Merchant:");
    console.log("Purchases:");
    this.getPurchases().forEach((t) => {
      console.log("MERCHANT:", t.merchant.name);
      console.log("\tDate:", t.date.toDateString());
      console.log("\tItems:", t.items.map((i) => i.name).join(", "));
      console.log("\tTotal:", t.totalCrowns);
    });
    console.log("Returns:");
    this.getReturns().forEach((t) => {
      if (t.from instanceof Merchant) {
        console.log("MERCHANT:", t.from.name);
        console.log("\tDate:", t.date.toDateString());
        console.log("\tItems:", t.items.map((i) => i.name).join(", "));
        console.log("\tTotal:", t.totalCrowns);
      }
    });
  }

  /**
   * Method that prints all the stock in the inventory.
   */
  printAllStock() {
    console.log("Stock:");
    this.stock.forEach((record) => {
      console.log(`${record.item.name}: ${record.quantity}`);
    });
  }

  /**
   * Method that prints the economic report of the inventory
   */
  printEconomicReport() {
    console.log("Economic Report");
    console.log("Total Crowns Earned by Sales:", this.getEarnedCrownsbySales());
    console.log(
      "Total Crowns Spent by Purchases:",
      this.getSpentCrownsbyPurchases(),
    );
    console.log("Total Crowns Spent by Returns:", this.getReturnedCrowns());
    console.log("Net Crowns:", this.getNetCrowns());
  }

  /**
   * Method that prints all the transactions in the inventory.
   */
  printAllTransactions() {
    this.transactions.forEach((t) => {
      console.log("Date:", t.date.toDateString());
      console.log("Operation:", t.operationType);
      console.log("Items:", t.items.map((i) => i.name).join(", "));
      console.log("Total:", t.totalCrowns);
    });
  }

  /**
   * Method that returns the most sold item in the inventory.
   * @returns The most sold item in the inventory.
   */
  getMostSoldItem() {
    let mostSoldItem = this.itemCollection.getItems()[0];
    let mostSoldItemTimes = 0;
    this.itemCollection
      .getItems()
      .filter((item): item is Item => item instanceof BaseItem)
      .forEach((item) => {
        const timesSold = this.getTransactionsByItem(item).length;
        if (timesSold > mostSoldItemTimes) {
          mostSoldItem = item;
          mostSoldItemTimes = timesSold;
        }
      });
    return mostSoldItem;
  }

  /**
   * Method that prints the most sold item in the inventory.
   */
  printMostSoldItem() {
    const mostSoldItem = this.getMostSoldItem();
    console.log("Most Sold Item:");
    console.log("Name:", mostSoldItem.name);
    console.log("Price:", mostSoldItem.price);
  }

  /**
   * Method that returns the total number of crowns earned by sales.
   * @returns The total number of crowns earned by sales.
   */
  getEarnedCrownsbySales(): number {
    return this.getSales().reduce((total, t) => total + t.totalCrowns, 0);
  }

  /**
   * Method that returns the total number of crowns spent by purchases.
   * @returns The total number of crowns spent by purchases.
   */
  getSpentCrownsbyPurchases(): number {
    return this.getPurchases().reduce((total, t) => total + t.totalCrowns, 0);
  }

  /**
   * Method that returns the total number of crowns spent by returns.
   * @returns The total number of crowns spent by returns.
   */
  getReturnedCrowns(): number {
    return this.getReturns().reduce((total, t) => total + t.totalCrowns, 0);
  }

  /**
   * Method that returns the net number of crowns in the inventory.
   * @returns The net number of crowns in the inventory
   */
  getNetCrowns(): number {
    return (
      this.getEarnedCrownsbySales() -
      this.getSpentCrownsbyPurchases() +
      this.getReturnedCrowns()
    );
  }

  /**
   * Method that returns the transactions that involve a specific item.
   * @param item The item to filter the transactions by.
   * @returns An array with the transactions that involve the item.
   */
  getTransactionsByItem(item: Item): Transaction[] {
    return this.transactions.filter((t) => t.items.includes(item));
  }

  /**
   * Method that returns the transactions that involve a specific client.
   * @param client The client to filter the transactions by.
   * @returns An array with the transactions that involve the client.
   */
  getTransactionsByDate(date: Date): Transaction[] {
    return this.transactions.filter(
      (t) => t.date.toDateString() === date.toDateString(),
    );
  }

  /**
   * Method that returns the transactions that involve a specific merchant.
   * @param merchant The merchant to filter the transactions by.
   * @returns An array with the transactions that involve the merchant.
   */
  getTransactionsByDateRange(start: Date, end: Date): Transaction[] {
    return this.transactions.filter((t) => t.date >= start && t.date <= end);
  }

  /**
   * Method that returns the transactions that involve a specific client.
   * @param client The client to filter the transactions by.
   * @returns An array with the transactions that involve the client.
   */
  getClientReturns(): ReturnTransaction[] {
    return this.getReturns().filter((t) => t.from instanceof Hunter);
  }

  /**
   * Method that returns the transactions that involve a specific merchant.
   * @param merchant The merchant to filter the transactions by.
   * @returns An array with the transactions that involve the merchant.
   */
  getMerchantReturns(): ReturnTransaction[] {
    return this.getReturns().filter((t) => t.from instanceof Merchant);
  }
}
