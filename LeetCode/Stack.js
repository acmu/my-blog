/**
 * LeetCode 刷题代码模板，栈的实现
 * 
 * 代码复制于 https://github.com/datastructures-js/stack/blob/master/src/stack.js
 * API文档 https://github.com/datastructures-js/stack/blob/master/README.md
 */

class Stack {
  /**
   * Creates a stack.
   * @param {array} [elements]
   */
  constructor(elements) {
    this._elements = Array.isArray(elements) ? elements : [];
  }

  /**
   * Checks if the stack is empty.
   * @public
   * @returns {boolean}
   */
  isEmpty() {
    return this._elements.length === 0;
  }

  /**
   * Returns the number of elements in the stack.
   * @public
   * @returns {number}
   */
  size() {
    return this._elements.length;
  }

  /**
   * Returns the top element in the stack.
   * @public
   * @returns {number|string|object}
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    }

    return this._elements[this._elements.length - 1];
  }

  /**
   * Adds an element to the top of the stack.
   * @public
   * @param {number|string|object} element
   */
  push(element) {
    this._elements.push(element);
    return this;
  }

  /**
   * Removes and returns the top element in the stack.
   * @public
   * @returns {number|string|object}
   */
  pop() {
    if (this.isEmpty()) {
      return null;
    }

    return this._elements.pop();
  }

  /**
   * Returns the remaining elements as an array.
   * @public
   * @returns {array}
   */
  toArray() {
    return this._elements.slice();
  }

  /**
   * Clears all elements from the stack.
   * @public
   */
  clear() {
    this._elements = [];
  }

  /**
   * Creates a shallow copy from the stack.
   * @public
   * @return {Stack}
   */
  clone() {
    return new Stack(this._elements.slice());
  }

  /**
   * Creates a stack from an existing array
   * @public
   * @static
   * @param {array} [elements]
   * @return {Stack}
   */
  static fromArray(elements) {
    return new Stack(elements);
  }
}
