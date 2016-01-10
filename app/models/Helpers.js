import shortid from 'shortid';
import clone from 'lodash/lang/clone';
import each from 'lodash/collection/each';
import isEmpty from 'lodash/lang/isEmpty';
import isNumber from 'lodash/lang/isNumber';
import isBoolean from 'lodash/lang/isBoolean';
import isArray from 'lodash/lang/isArray';
import isPlainObject from 'lodash/lang/isPlainObject';

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