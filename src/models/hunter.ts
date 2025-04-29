import { Document, connect, model, Schema } from 'mongoose';
import validator from 'validator';

connect('mongodb://127.0.0.1:27017/Client').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

interface ClientDocumentInterface extends Document {
  name: string,
  story: string,
  profession: 'Hunter' | 'Witcher' | 'Knight' | 'Royal' | 'Villager'
}

const ClientSchema = new Schema<ClientDocumentInterface>({
  name: {
    type: String,
    required: true,
    default: 'John Doe',
    validate: (value: string) => {
        if (!value.match(/^[A-Z]/)) {
          throw new Error('Note title must start with a capital letter');
        } else if (!validator.default.isAlphanumeric(value)) {
          throw new Error('Note title must contain alphanumeric characters only');
        }
      },
  },
  story: {
    type: String,
    required: true,
    default: 'None',
  },
  profession: {
    type: String,
    required: true,
    default: 'Witcher',
    enum: ['Hunter', 'Witcher', 'Knight', 'Royal', 'Villager']
    
  },
});

const Client = model<ClientDocumentInterface>('Client', ClientSchema);

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

