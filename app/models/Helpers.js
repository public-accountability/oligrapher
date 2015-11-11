import shortid from 'shortid';
import { clone, each, isEmpty, isNumber, isBoolean, isArray, isPlainObject } from 'lodash';

const compact = (o) => {
  let cloned = clone(o);

  if (isArray(cloned) || isPlainObject(cloned)) {
    each(cloned, (v, k) => {
      let newV = compact(v);

      if (isEmpty(newV) && !isNumber(newV) && !isBoolean(newV)) {
        delete cloned[k];
      } else {
        cloned[k] = newV;
      }
    });
  }

  return cloned;
};

export default {
  generateId: () => shortid.generate(),
  compactObject: compact
};