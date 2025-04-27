import { Document, connect, model, Schema } from 'mongoose';
import validator from 'validator';
import { GenericMaterial } from '../item.js';

connect('mongodb://127.0.0.1:27017/Client').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

interface ItemDocumentInterface extends Document {
  name: string;
  description: string;
  material: GenericMaterial
  weight: number;
  price: number;
}

const ItemSchema = new Schema<ItemDocumentInterface>({
  name: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length <= 0) {
        throw new Error('Item name must not be empty');
      }
    },
  },
  description: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length <= 0) {
        throw new Error('Item description must not be empty');
      }
    },
  },
  material: {
    type: String,
    required: true,
    enum: [
      "Steel",
      "Elven Steel",
      "Meteoric Steel",
      "Silver",
      "Reinforced Silver",
      "Ebony Wood",
      "Monster Bone",
      "Volcanic Glass",
      "Mithril",
      "Adamantite",
      "Leather",
      "Hardened Leather",
      "Steel Mesh",
      "Silver Mesh",
      "Dragon Scales",
      "Adamantite Plates",
      "Mithril",
      "Enchanted Fabric",
      "Monster Bone",
      "Insectoid Chitin",
      "Celandine Flower",
      "Mandrake",
      "Vervain",
      "Bryonia Root",
      "Crushed Kikimora Skull",
      "Nekker Gland",
      "Wraith Essence",
      "Griffin Marrow",
      "Endrega Mucus",
      "Ghoul Blood"
    ],
  },
  weight: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value <= 0) {
        throw new Error('Item weight must be greater than 0');
      }
    },
  },
  price: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value <= 0) {
        throw new Error('Item price must be greater than 0');
      }
    }
  },
});

const Item = model<ItemDocumentInterface>('Item', ItemSchema);

const item = new Item({
  name: 'Steel Sword',
  description: 'A sword made of steel.',
  material: 'Steel',
  weight: 1.5,
  price: 100,
});

item
  .save()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });