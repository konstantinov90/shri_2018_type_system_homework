const hasOwnProperty: (prop: string) => boolean = Object.prototype.hasOwnProperty;
const toString: () => string = Object.prototype.toString;

/**
 * Проверяет, что переданный объект является "плоским" (т.е. созданным с помощью "{}"
 * или "new Object").
 *
 * @param {Object} obj
 * @returns {Boolean}
 */
function isPlainObject(obj: object): boolean {
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
const extend: (deep?: boolean, target: object, ...objects: object[]) => object =
    function extend(deep: boolean = false, target: object, ...objects: object[]): object {
    console.log(target, deep, objects)

    // Обрабатываем ситуацию глубокого копирования.

    for (let obj of objects) {
        if (!obj) {
            continue;
        }

        for (const key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                const val: any = obj[key];
                const isArray: boolean = val && Array.isArray(val);

                // Копируем "плоские" объекты и массивы рекурсивно.
                if (deep && val && (isPlainObject(val) || isArray)) {
                    const src: any = target[key];
                    let clone: object | any[];
                    if (isArray) {
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[key] = extend(deep, clone, val);
                } else {
                    target[key] = val;
                }
            }
        }
    }

    return target;
};

export default extend;
