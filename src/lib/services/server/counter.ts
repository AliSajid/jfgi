// SPDX-FileCopyrightText: 2022 - 2025 Ali Sajid Imami
//
// SPDX-License-Identifier: MIT

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '../firebase';
import { getFirestore, CollectionReference, collection } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import type { Counter } from '$lib/types/Counter';

const firestore = getFirestore(app);

const getVisitors = async (): Promise<Counter> => {
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
    return { count: data.count };
  } else {
    const update = {
      count: 1
    };
    await setDoc(counterRef, update);
    return { count: update.count };
  }
};

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

const countersCollection = createCollection<Counter>('count');

export default getVisitors;
