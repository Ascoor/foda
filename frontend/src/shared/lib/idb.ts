const isBrowser = typeof window !== "undefined" && typeof indexedDB !== "undefined";

const openDatabase = (name: string, storeName: string) =>
  new Promise<IDBDatabase>((resolve, reject) => {
    if (!isBrowser) {
      reject(new Error("IndexedDB is not available in this environment"));
      return;
    }

    const request = indexedDB.open(name, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"));
  });

export const getFromStore = async <T>(
  name: string,
  storeName: string,
  key: IDBValidKey,
): Promise<T | undefined> => {
  try {
    const db = await openDatabase(name, storeName);
    return await new Promise<T | undefined>((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result as T | undefined);
      };

      request.onerror = () => {
        reject(request.error ?? new Error("Failed to read value"));
      };
    });
  } catch (error) {
    console.error("IndexedDB read error", error);
    return undefined;
  }
};

export const setInStore = async <T>(
  name: string,
  storeName: string,
  key: IDBValidKey,
  value: T,
): Promise<void> => {
  try {
    const db = await openDatabase(name, storeName);
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      store.put(value, key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Failed to write value"));
    });
  } catch (error) {
    console.error("IndexedDB write error", error);
  }
};

export const removeFromStore = async (
  name: string,
  storeName: string,
  key: IDBValidKey,
): Promise<void> => {
  try {
    const db = await openDatabase(name, storeName);
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      store.delete(key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Failed to delete value"));
    });
  } catch (error) {
    console.error("IndexedDB remove error", error);
  }
};
