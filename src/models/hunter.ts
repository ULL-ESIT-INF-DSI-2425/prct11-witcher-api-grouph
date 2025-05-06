import { Document, model, Schema } from 'mongoose';
import validator from 'validator';

/**
 * Union type representing all valid hunter races.
 */
export type Race =
  | "Human"
  | "Elf"
  | "Dwarf"
  | "Halfling"
  | "Warlock"
  | "Lycanthropic"
  | "Vran"
  | "Dryad"
  | "Spectral Cat"
  | "Half-Elf";

  /**
   * Array of all acceptable race values, used for validation and enum constraint.
   * @type {const}
   */
export const RaceValues = [
  "Human",
  "Elf",
  "Dwarf",
  "Halfling",
  "Warlock",
  "Lycanthropic",
  "Vran",
  "Dryad",
  "Spectral Cat",
  "Half-Elf",
] as const;

/**
 * Interface representing the structure of a Hunter document in MongoDB.
 * This interface extends the Mongoose Document interface to include custom fields.
 * @interface HunterDocumentInterface
 * @extends Document
 * @property {string} name - The name of the hunter.
 * @property {race} race - The race of the hunter, which must be one of the predefined values.
 * @property {string} location - The location of the hunter.
 */
interface HunterDocumentInterface extends Document {
  name: string,
  race: Race,
  location: string
}

/**
 * Mongoose schema definition for the Hunter model.
 * This schema defines the structure of the Hunter documents in MongoDB.
 * @type {Schema<HunterDocumentInterface>}
 */
const HunterSchema = new Schema<HunterDocumentInterface>({
  name: {
    type: String,
    required: true,
    default: 'John Doe',
    validate: {
      validator: (value: string) => !validator.isEmpty(value, { ignore_whitespace: true }),
      message: 'Hunter name must not be empty',
    },
    unique: true,
  },
  race: {
    type: String,
    required: true,
    default: 'Human',
    validate: [ 
      { 
        validator: (value: string) => !validator.isEmpty(value, { ignore_whitespace: true }),
        message: 'Race must not be empty',
      },
      {
        validator: (value: string) => RaceValues.includes(value as Race),
        message: 'Race is not valid',
      },
    ],
    enum: {
      values: RaceValues,
      message: 'Race must be one of the following: ' + RaceValues.join(', '),
    },
  },
  location: {
    type: String,
    required: true,
    default: 'Kaer Morhen',
    validate: {
      validator: (value: string) => !validator.isEmpty(value, { ignore_whitespace: true }),
      message: 'Location must not be empty',
    },
  }
});

/**
 * Mongoose model for the Hunter schema.
 * This model provides an interface to interact with the Hunter collection in MongoDB.
 * @type {model<HunterDocumentInterface>}
 * @remarks Collection name: 'Hunters'.
 */
export const Hunter = model<HunterDocumentInterface>('Hunters', HunterSchema);
