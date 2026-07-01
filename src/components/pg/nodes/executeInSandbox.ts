/**
 * Safely runs a function with a completely custom global scope.
 * @param {Function} userCode - The function to sandbox.
 * @param {Object} customGlobals - The custom global variables to expose.
 */
export function executeInSandbox(userCode, customGlobals) {
  // 1. Create a proxy to handle missing variables safely
  const proxyScope = new Proxy(customGlobals, {
    has(target, prop) {
      // By returning true, we force the 'with' statement to look up
      // variables inside our customGlobals object first.
      return true;
    },
    get(target, prop, receiver) {
      // If the property exists in our custom globals, return it.
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      // If a property is not in our custom environment, throw an error
      // instead of leaking out to the browser's global scope.
      throw new ReferenceError(`${String(prop)} is not defined in the sandbox`);
    }
  });

  // 2. Wrap the code in a 'with' block and a new Function() to drop outer lexical scope
  const sandboxedFunction = new Function('sandbox',
    'with (sandbox) { (' + userCode.toString() + ')(); }'
  );

  // 3. Execute with our proxied custom globals
  sandboxedFunction(proxyScope);
}
