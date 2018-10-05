import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';
import { __read } from 'tslib';

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

const DATA_STORE_RATE_KEY = 'rated';

let _willAsked;

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  // cache data in the memory. default is true.
  enableCache: true,
  sync: {
  }
});

class DataStore {
  static async initRate() {
    await storage.load({
      key: DATA_STORE_RATE_KEY,
    }).then((res) => {
      // found data goes to then()
      _willAsked = res;
      return res;
    }).catch((err) => {
      console.log(err.message);
    });
  }

  static async getRated(){
    return await _willAsked;
  }

  static setRated(){
    _willAsked = false;
    this.persist_r();
  }

  static persist_r() {
    storage.save({
      key: DATA_STORE_RATE_KEY,
      data: _willAsked,
      expires: null,
    });
  }
}

export default DataStore;
