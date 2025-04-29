import { Document, connect, model, Schema } from 'mongoose';
import validator from 'validator';

type Race =
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

const RaceValues = [
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

interface ClientDocumentInterface extends Document {
  name: string,
  race: Race,
  location: string
}

const ClientSchema = new Schema<ClientDocumentInterface>({
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
    validate: {
      validator: (value: string) => !validator.isEmpty(value, { ignore_whitespace: true }),
      message: 'Race must not be empty',
    },
    enum: RaceValues,
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

export const Client = model<ClientDocumentInterface>('Client', ClientSchema);

/* 
const note = new Client({
    name: 'Gerald',
    story: 'Comes from Rivia (I think).',
    profession: 'Witcher',
});

note.save().then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error);
});

Client.find().then((client) => {
    console.log(client)
}).catch((error) => {
    console.log('Uh oh, something went wrong\n\n\n' + error)
})
*/