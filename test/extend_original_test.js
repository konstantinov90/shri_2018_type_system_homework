const mocha = require('mocha');
const { expect } = require('chai');

for (const module of [ '../src/js/extend_original', '../build/flow/extend', '../build/ts/extend' ]) {
  let extend = require(module);
  if (module.includes('ts')) {
    extend = extend.default;
  }


  describe(module, () => {
    describe('deep argument', () => {
      it('when true should copy attributes recursively', () => {
        const obj = {
          a: 10,
          b: {
            c: 11,
          },
        };
  
        const ans = extend(true, {}, obj);
        obj.b.c = 123;
        expect(ans).to.not.deep.equal(obj);
      });
  
      it('when false should copy attributes shallowly', () => {
        const obj = {
          a: 10,
          b: {
            c: 11,
          },
        };
  
        const ans = extend(false, {}, obj);
        obj.b.c = 123;
        expect(ans).to.be.deep.equal(obj);
      });
    });
  
    it('should join multiple objects', () => {
      const a = {
        a: 10,
        b: 20,
      };
      const b = {
        c: 20,
        d: {
          e: 'abc',
        },
      };
  
      expect(extend({}, a, b)).to.deep.equal(Object.assign({}, a, b));
    });
  
    it('should extend object', () => {
      const init = {
        a: 10,
        cruel: 'world',
      };
      const extension = {
        hello: 123,
        goodbye: 'abc',
      };
  
      expect(extend(init, extension)).to.deep.equal(Object.assign({}, init, extension));
    });
  
    it('should extend subobjects (when deep)', () => {
      const init = {
        a: {
          a: 1,
          b: 2,
        },
      };
      const extension1 = {
        a: {
          c: 3,
        },
      };
      const extension2 = {
        a: {
          d: 4,
        },
      };
      
      expect(extend(true, init, extension1, extension2)).to.deep.equal({ a: { a: 1, b: 2, c: 3, d: 4 } });
    });
  
    it('should replace subobjects (when shallow)', () => {
      const init = {
        a: {
          a: 1,
          b: 2,
        },
      };
      const extension = {
        a: {
          c: 3,
        },
      };
      
      expect(extend(false, init, extension)).to.deep.equal({ a: { c: 3 } });
    });
  
    it('should also extend arrays', () => {
      const init = {
        a: [ 1, 2, 3 ],
      };
      const extension = {
        a: [ 10, 20, 30, 40 ],
      };
  
      expect(extend(true, init, extension)).to.deep.equal({ a: [ 10, 20, 30, 40 ] });
    });
  });
}
