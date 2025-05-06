import { Document, connect, model, Schema } from 'mongoose';
import validator from 'validator';

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

interface HunterDocumentInterface extends Document {
  name: string,
  race: Race,
  location: string
}

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

export const Hunter = model<HunterDocumentInterface>('Hunters', HunterSchema);
