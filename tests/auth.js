import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';

// Configure chai (Use the 'Should' style)
chai.use(chaiHttp);
chai.should();

describe('Test', () => {
  describe('1', () => {
    it('should equal 1', () => {
      assert.equal(1, 1);
    });
  });
});
