import AsyncStorage from '@react-native-async-storage/async-storage';

const set = async (key, val) => {
  try {
    await AsyncStorage.setItem(key, val);
    console.log(`set ${key} with value ${val} -> ok`);
  } catch (error) {
    console.error(`set ${key} with value ${val} -> fail`);
    console.error(error);
  }
};

const get = async key => {
  try {
    const value = AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error(`get value with key:${key} -> fail`);
    console.error(error);
  }
};

const remove = async key => {
  try {
    const value = AsyncStorage.removeItem(key);
    return value;
  } catch (error) {
    console.error(`remove value with key:${key} -> fail`);
    console.error(error);
  }
};
export default {set, get, remove};
