import { db, collection, addDoc, serverTimestamp } from './firebase';
import { MOCK_PRODUCTS } from './constants';

export const seedProducts = async () => {
  console.log('Seeding products...');
  try {
    for (const product of MOCK_PRODUCTS) {
      const { id, ...productData } = product;
      await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp()
      });
    }
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};
