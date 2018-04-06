const hasOwnProperty: (k: string) => boolean = Object.prototype.hasOwnProperty;
const toString: () => string = Object.prototype.toString;

interface ISomeObject {
    [key: string]: any;
}

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
const extend: <T extends boolean | ISomeObject>
(target: T, firstArg: T extends boolean? ISomeObject: ISomeObject | undefined | null, ...args: (ISomeObject | null | undefined)[])
    => ISomeObject =
    function (...args: (boolean | ISomeObject | null | undefined)[]): ISomeObject {
    let target = args[0] as boolean | ISomeObject;
    let deep: boolean;
    let i: number;

    // Обрабатываем ситуацию глубокого копирования.
    if (typeof target === 'boolean') {
        deep = target as boolean;
        target = args[1] as ISomeObject;
        i = 2;
    } else {
        deep = false;
        i = 1;
    }

    for (; i < arguments.length; i++) {
        const obj = args[i] as ISomeObject | null | undefined;
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
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[key] = extend(deep, clone, val as ISomeObject);
                } else {
                    target[key] = val;
                }
            }
        }
    }

    return target as ISomeObject;
};
console.log(extend([1, 2, 3], null, [15, 20, { a: 5 }, 147], { 4: 879 }));


extend(true, { a: 5 }, { b: 6 }, { a: 'a', b: 'abc' });
extend(true, { a: 5 }, { b: 6, c: 123, d:466 });
extend(false, { a: 5 }, { b: 6 }, false);
extend(true, { a: 5 }, null, { b: 6 }, null, undefined, {c: 123, d: 435});
extend({ a: 5 }, { b: 6 }, 123, );
extend({ a: 5 }, null, { a: 10, b: 20 }, { a: [1,2,3] }, [4,5,6] );
extend({ a: 5, b: 123 }, { b: 6 }, );
extend(true, null, { a: 5 }, { b: 6 });
extend(['asd', 123, ','], null, { a: 5 }, { b: 6 });
extend(undefined, null, { a: 5 }, { b: 6 });
