import shortid from 'shortid';
import clone from 'lodash/clone';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import isBoolean from 'lodash/isBoolean';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

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
