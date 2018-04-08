// @flow

import extend from './extend';

// ==================================
// правильные вызовы
// ==================================
let res1 = extend(true, { a: 5 }, { b: 6, c: 123, d:466 });
let res2 = extend(true, { a: 5 }, null, { b: 6 }, null, undefined, {c: 123, d: 435});
let res3 = extend({ a: 5, b: 123 }, { b: 6 }, );

// ==================================
// ошибочные вызовы
// ==================================
// в отличие от решения на Typescript массивы в качестве объекта не подходят
// ибо FLOW ругается на for .. in для массивов
// можно было бы отрефакторить функцию, но так как цель этой функции мне неясна,
// т.е. непонятно, подразумевается ли использование массивов
// -------------------------------------------------------
// так же для более строгой типизации я зафиксировал второй аргумент,
// который может оказаться первым миксином, т.е. мог бы быть null или undefined
// в данной реалиации это невозможно (в отличии от Typescript с условной типизацией второго аргумента)
extend({ a: 5 }, { b: 6 }, { a: 'a', b: 'abc' }, [ 11, 22, 33 ]);
extend({ a: 5 }, null, { a: 10, b: 20 }, { a: [1,2,3] }, [4,5,6] );
extend(['asd', 123, ','], null, { a: 5 }, { b: 6 });

// это "правильные" ошибки
extend(false, { a: 5 }, { b: 6 }, false);
// Cannot call `extend` because boolean [1] is incompatible with `ISomeObject` [2] in array element. (References: [1] [2])
extend({ a: 5 }, { b: 6 }, 123, );
// Cannot call `extend` because number [1] is incompatible with `ISomeObject` [2] in array element. (References: [1] [2])
extend(undefined, null, { a: 5 }, { b: 6 });
// Cannot call `extend` with `undefined` bound to `deepOrTarget` because: Either undefined [1] is incompatible with boolean [2].
// Or undefined [1] is incompatible with `ISomeObject` [3]. (References: [1] [2] [3])

// Здесь следовало бы как-то исключить второй аргумент null
// Как это сделать статически - я не понял, потому сделал динамическое выбрасывание ошибки
// все же это лучше чем ничего!
let res4 = extend(true, null, { a: 5 }, { b: 6 });
