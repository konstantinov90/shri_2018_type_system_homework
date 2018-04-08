import extend from './extend';


// правильные вызовы
let res1 = extend(true, { a: 5 }, { b: 6, c: 123, d:466 });
let res2 = extend({ a: 5 }, { b: 6 }, { a: 'a', b: 'abc' }, [ 11, 22, 33 ]);
let res3 = extend(true, { a: 5 }, null, { b: 6 }, null, undefined, {c: 123, d: 435});
let res4 = extend({ a: 5 }, null, { a: 10, b: 20 }, { a: [1,2,3] }, [4,5,6] );
let res5 = extend({ a: 5, b: 123 }, { b: 6 }, );
let res6 = extend(['asd', 123, ','], null, { a: 5 }, { b: 6 });

// ошибочные вызовы
extend(false, { a: 5 }, { b: 6 }, false);
// Argument of type 'false' is not assignable to parameter of type 'ISomeObject | null | undefined'.
extend({ a: 5 }, { b: 6 }, 123, );
// Argument of type '123' is not assignable to parameter of type 'ISomeObject | null | undefined'.
extend(true, null, { a: 5 }, { b: 6 });
// Argument of type 'null' is not assignable to parameter of type 'ISomeObject'.
extend(undefined, null, { a: 5 }, { b: 6 });
// Argument of type 'undefined' is not assignable to parameter of type 'boolean | ISomeObject'.
