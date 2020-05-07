import Debugger from './debugger.js';
import Machine from './machine.js';

export { default as Debugger } from './debugger.js';
export { default as Machine } from './machine.js';

/**
 * Sugar to create a debugger without worrying about the machine.
 * @api
 * @param options
 */
export function createDebugger(options = {}) {
  return new Debugger(new Machine(options.sandbox, options));
}
