// @flow

const hasOwnProperty: (k: string) => boolean = Object.prototype.hasOwnProperty;
const toString: () => string = Object.prototype.toString;

type ISomeObject = {
    // можно предположить, что ключ может быть и сложным объектом,
    // но я остановлюсь на string
    [key: string]: any;
};

/**
 * Проверяет, что переданный объект является "плоским" (т.е. созданным с помощью "{}"
 * или "new Object").
 *
 * @param {Object} obj
 * @returns {Boolean}
 */
function isPlainObject(obj: any): boolean {
    if (toString.call(obj) !== '[object Object]') {
        return false;
    }

    const prototype: any = Object.getPrototypeOf(obj);
    return prototype === null ||
        prototype === Object.prototype;
}

/**
 * Копирует перечислимые свойства одного или нескольких объектов в целевой объект.
 *
 * @param {Boolean} [deep=false] При значении `true` свойства копируются рекурсивно.
 * @param {Object} target Объект для расширения. Он получит новые свойства.
 * @param {...Object} objects Объекты со свойствами для копирования. Аргументы со значениями
 *      `null` или `undefined` игнорируются.
 * @returns {Object}
 */
// Flow кажется не умеет в перегрузки...
const extend: (deepOrTarget: boolean | ISomeObject, targetOrMixin1: ISomeObject, ...args: Array<?ISomeObject>) => ISomeObject =
function extend(...args: Array<?any>): ISomeObject {
    let target = ((args[0]: any): ISomeObject | boolean);
    let i: number;
    let deep: boolean;

    // Обрабатываем ситуацию глубокого копирования.
    if (typeof target === 'boolean') {
        deep = (target: boolean);
        target = ((args[1]: any): ISomeObject);
        i = 2;
    } else {
        deep = false;
        i = 1;
    }

    for (; i < arguments.length; i++) {
        const obj = ((args[i]: any): ?ISomeObject);
        if (!obj) {
            continue;
        }

        for (const key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                const val = obj[key];
                const isArray: boolean = val && Array.isArray(val);

                // Копируем "плоские" объекты и массивы рекурсивно.
                if (deep && val && (isPlainObject(val) || isArray)) {
                    const src: any = target[key];
                    let clone: ISomeObject;
                    if (isArray) {
                        clone = ((src && Array.isArray(src) ? src : []: any): ISomeObject);
                    } else {
                        clone = ((src && isPlainObject(src) ? src : {}: any): ISomeObject);
                    }
                    target[key] = extend(deep, clone, (val: ISomeObject));
                } else {
                    target[key] = val;
                }
            }
        }
    }

    return (target: ISomeObject);
};


let res1 = extend(true, { a: 5 }, { b: 6, c: 123, d:466 });
let res3 = extend(true, { a: 5 }, null, { b: 6 }, null, undefined, {c: 123, d: 435});
let res5 = extend({ a: 5, b: 123 }, { b: 6 }, );
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
// extend({ a: 5 }, { b: 6 }, { a: 'a', b: 'abc' }, [ 11, 22, 33 ]);
// extend({ a: 5 }, null, { a: 10, b: 20 }, { a: [1,2,3] }, [4,5,6] );
// extend(['asd', 123, ','], null, { a: 5 }, { b: 6 });

// // это "правильные" ошибки
// extend(false, { a: 5 }, { b: 6 }, false);
// // Argument of type 'false' is not assignable to parameter of type 'ISomeObject | null | undefined'.
// extend({ a: 5 }, { b: 6 }, 123, );
// // Argument of type '123' is not assignable to parameter of type 'ISomeObject | null | undefined'.
// extend(true, null, { a: 5 }, { b: 6 });
// // Argument of type 'null' is not assignable to parameter of type 'ISomeObject'.
// extend(undefined, null, { a: 5 }, { b: 6 });
// Argument of type 'undefined' is not assignable to parameter of type 'boolean | ISomeObject'.



module.exports = extend;
