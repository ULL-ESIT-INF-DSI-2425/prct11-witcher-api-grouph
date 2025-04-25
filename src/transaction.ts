import { Armor, Weapon, Potion } from "./item.js";
import { Merchant } from "./merchant.js";
import { Hunter } from "./hunter.js";

/**
 * Type representing an item that can be transacted
 */
type Item = Armor | Weapon | Potion;

/**
 * Type representing the operation type of a transaction
 */
export type OperationType = "buy" | "sell" | "return";

/**
 * Interface representing a base transaction
 */
export interface BaseTransaction {
  date: Date;
  items: Item[];
  totalCrowns: number;
}

/**
 * Interface representing a sale transaction
 */
export interface SaleTransaction extends BaseTransaction {
  client: Hunter;
  operationType: "sell";
}

/**
 * Interface representing a purchase transaction
 */
export interface PurchaseTransaction extends BaseTransaction {
  merchant: Merchant;
  operationType: "buy";
}

/**
 * Interface representing a return transaction
 */
export interface ReturnTransaction extends BaseTransaction {
  from: Hunter | Merchant;
  reason: string;
  operationType: "return";
}

/**
 * Type representing a transaction
 */
export type Transaction =
  | SaleTransaction
  | PurchaseTransaction
  | ReturnTransaction;
