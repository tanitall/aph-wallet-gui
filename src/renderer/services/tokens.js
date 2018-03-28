import lockr from 'lockr';

const TOKENS_STORAGE_KEY = 'aph.tokens';

export default {

  add(symbol, data) {
    if (this.tokenExists(symbol)) {
      const existing = this.getOne(symbol);
      if (existing.isCustom === data.isCustom
          || (existing.isCustom === true && data.isCustom === false)) {
        return this;
      }
    }

    const tokens = this.getAll();
    lockr.set(TOKENS_STORAGE_KEY, _.set(tokens, symbol, data));
    return this;
  },

  remove(symbol) {
    const tokens = this.getAll();
    lockr.set(TOKENS_STORAGE_KEY, _.omit(tokens, symbol));
    return this;
  },

  getAll() {
    return lockr.get(TOKENS_STORAGE_KEY, {});
  },

  getAllAsArray() {
    return _.values(this.getAll()).sort((a, b) => {
      if (a.symbol > b.symbol) {
        return 1;
      } else if (a.symbol < b.symbol) {
        return -1;
      }
      return 0;
    });
  },

  getOne(symbol) {
    return _.get(this.getAll(), symbol);
  },

  tokenExists(symbol) {
    return !!this.getOne(symbol);
  },

};
