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

// =====================================
// Flow кажется не умеет в перегрузки...
// =====================================
// type Overload1 = <T: ISomeObject, T1: ISomeObject> (deep: boolean, target: T, mixin1: T1) => T & T1;
// type Overload2 = <T: ISomeObject, T1: ISomeObject, T2: ISomeObject> (deep: boolean, target: T, mixin1: T1, mixin: T2) => T & T1 & T2;
// type Overload3 = <T: ISomeObject, T1: ISomeObject, T2: ISomeObject, T3: ISomeObject> (deep: boolean, target: T, mixin1: T1, mixin: T2, mixin: T3) => T & T1 & T2 & T3;

// type Overload = (target: ISomeObject, ...mixins: Array<?ISomeObject>) => ISomeObject;
// type OverloadDeep = (deep: boolean, target: ISomeObject, ...mixins: Array<?ISomeObject>) => ISomeObject;
// const extend: OverloadDeep | Overload =

function extend(deepOrTarget: boolean | ISomeObject, targetOrMixin1: ?ISomeObject, ...args: Array<?ISomeObject>): ISomeObject {
    let target: ISomeObject;
    let deep: boolean;

    // Обрабатываем ситуацию глубокого копирования.
    if (typeof deepOrTarget === 'boolean') {
        deep = (deepOrTarget: boolean);
        if (targetOrMixin1 === undefined || targetOrMixin1 === null) {
            throw new Error('targetOrMixin1 should be an Object when deep === true!');
        }
        target = (targetOrMixin1: ISomeObject);
    } else {
        deep = false;
        target = (deepOrTarget: ISomeObject);
        args.push(targetOrMixin1);
    }

    for (let obj of args) {
        if (!obj) {
            continue;
        }
        obj = (obj: ISomeObject);

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

    return target;
};

module.exports = extend;
