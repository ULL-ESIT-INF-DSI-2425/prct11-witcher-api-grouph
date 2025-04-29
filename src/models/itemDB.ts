import { Document, connect, model, Schema } from 'mongoose';
import validator from 'validator';
import { GenericMaterial, GenericMaterialValues } from '../../pr7/item.js';

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
  quantity: number;
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
    unique: true,
  },
  description: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length <= 0) {
        throw new Error('Item description must not be empty');
      }
    },
    unique: true,
  },
  material: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length <= 0) {
        throw new Error('Item material must not be empty');
      }
    },
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
}, { discriminatorKey: 'kind', collection: 'items' });

const Item = model<ItemDocumentInterface>('Item', ItemSchema);


const WeaponSchema = new Schema<ItemDocumentInterface> ({
  material: {
    type: String,
    required: true,
    enum: GenericMaterialValues.WeaponMaterial,
    validate: (value: string) => {
      if (value.length <= 0) {
        throw new Error('Weapon material must not be empty');
      }
    },
  },
});
const Weapon = Item.discriminator<ItemDocumentInterface>('Weapon', WeaponSchema);


const ArmorSchema = new Schema<ItemDocumentInterface> ({
  material: {
    type: String,
    required: true,
    enum: GenericMaterialValues.ArmorMaterial,
    validate: (value: string) => {
      if (value.length <= 0) {
        throw new Error('Armor material must not be empty');
      }
    }
  },
});
const Armor = Item.discriminator<ItemDocumentInterface>('Armor', ArmorSchema);

interface PotionDocumentInterface extends ItemDocumentInterface {
  effect: string;
}

const PotionSchema = new Schema<PotionDocumentInterface>({
  material: {
    type: String,
    required: true,
    enum: GenericMaterialValues.PotionMaterial,
    validate: (value: string) => {
      if (value.length <= 0) {
        throw new Error('Potion material must not be empty');
      }
    },
  },
  effect: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length <= 0) {
        throw new Error('Potion effect must not be empty');
      }
      if (!validator.isAlpha(value)) {
        throw new Error('Potion effect must contain only letters');
      }
    },
  },
});

const Potion = Item.discriminator<PotionDocumentInterface>('Potion', PotionSchema);

const sword = new Weapon({
  name: 'Sword',
  description: 'A sharp blade', 
  material: 'Steel',
  weight: 3,
  price: 100,
});

sword.save().then(() => {
  console.log('Sword saved');
  console.log(sword);
}).catch((error) => {
  console.error('Error saving sword:', error);
});

const armor = new Armor({
  name: 'Armor',
  description: 'A protective suit',
  material: 'Leather',
  weight: 10,
  price: 200,
});

armor.save().then(() => {
  console.log('Armor saved');
  console.log(armor);
}).catch((error) => {
  console.error('Error saving armor:', error);
});

const potion = new Potion({
  name: 'Healing Potion',
  description: 'Restores health',
  material: 'Mandrake',
  weight: 1,
  price: 50,
  effect: 'Heal',
});
potion.save().then(() => {
  console.log('Potion saved');
  console.log(potion);
}
).catch((error) => {
  console.error('Error saving potion:', error);
});