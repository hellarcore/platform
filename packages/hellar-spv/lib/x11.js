const { configure: configurehellarcore } = require('@hellarpro/hellarcore-lib');
const X11 = require('wasm-x11-hash');

let x11Promise = null;
let x11Ready = false;

const load = async () => {
  if (!x11Promise) {
    x11Promise = X11().then(
      (x11Hash) => {
        configurehellarcore({
          x11hash: x11Hash,
        });
        x11Ready = true;
      },
    );
  }

  return x11Promise;
};

const ready = () => x11Ready;

module.exports = {
  ready,
  load,
};
