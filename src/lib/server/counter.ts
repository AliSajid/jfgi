import { doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '$lib/firebase';
import { getFirestore, CollectionReference, collection } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

const firestore = getFirestore(app);

const getVisitors = async () => {
  const counterRef = doc(countersCollection, 'visitors');

  const counterDoc = await getDoc(counterRef);
  if (counterDoc.exists()) {
    const data = counterDoc.data();
    console.timeStamp('getVisitors');
    console.log('getVisitors', data.count);
    const update = {
      count: data.count + 1
    };
    console.timeStamp('setVisitors');
    console.log('setVisitors', update.count);
    await setDoc(counterRef, update);
    return data.count;
  } else {
    const update = {
      count: 1
    };
    await setDoc(counterRef, update);
    return update.count;
  }
};

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

// Add the cont type
import type { Counter } from '$lib/types/Counter';
const countersCollection = createCollection<Counter>('count');

export default getVisitors;
