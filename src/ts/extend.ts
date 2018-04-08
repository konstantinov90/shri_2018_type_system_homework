const hasOwnProperty: (k: string) => boolean = Object.prototype.hasOwnProperty;
const toString: () => string = Object.prototype.toString;

interface ISomeObject {
    // можно предположить, что ключ может быть и сложным объектом,
    // но я остановлюсь на string
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
// объявляем несколько перегрузок для комбинаций до 5 объектов с или без deep
function extend <T extends ISomeObject, T1 extends ISomeObject>
    (deep: boolean, target: T, mixin1: T1): T & T1;

function extend <T extends ISomeObject, T1 extends ISomeObject>
    (target: T, mixin1: T1): T & T1;

function extend <T extends ISomeObject, T1 extends ISomeObject, T2 extends ISomeObject>
    (deep: boolean, target: T, mixin1: T1, mixin2: T2): T & T1 & T2;
    
function extend <T extends ISomeObject, T1 extends ISomeObject, T2 extends ISomeObject>
    (target: T, mixin1: T1, mixin2: T2): T & T1 & T2;

function extend <T extends ISomeObject, T1 extends ISomeObject, T2 extends ISomeObject, T3 extends ISomeObject>
    (deep: boolean, target: T, mixin1: T1, mixin2: T2, mixin3: T3): T1 & T2 & T3;

function extend <T extends ISomeObject, T1 extends ISomeObject, T2 extends ISomeObject, T3 extends ISomeObject>
    (target: T, mixin1: T1, mixin2: T2, mixin3: T3): T1 & T2 & T3;

function extend <T extends ISomeObject, T1 extends ISomeObject, T2 extends ISomeObject, T3 extends ISomeObject, T4 extends ISomeObject>
    (deep: boolean, target: T, mixin1: T1, mixin2: T2, mixin3: T3, mixin4: T4): T & T1 & T2 & T3 & T4;

function extend <T extends ISomeObject, T1 extends ISomeObject, T2 extends ISomeObject, T3 extends ISomeObject, T4 extends ISomeObject>
    (target: T, mixin1: T1, mixin2: T2, mixin3: T3, mixin4: T4): T & T1 & T2 & T3 & T4;

function extend <T extends ISomeObject, T1 extends ISomeObject, T2 extends ISomeObject, T3 extends ISomeObject, T4 extends ISomeObject, T5 extends ISomeObject>
    (deep: boolean, target: T, mixin1: T1, mixin2: T2, mixin3: T3, mixin4: T4, mixin5: T5): T & T1 & T2 & T3 & T4 & T5;

function extend <T extends ISomeObject, T1 extends ISomeObject, T2 extends ISomeObject, T3 extends ISomeObject, T4 extends ISomeObject, T5 extends ISomeObject>
    (target: T, mixin1: T1, mixin2: T2, mixin3: T3, mixin4: T4, mixin5: T5): T & T1 & T2 & T3 & T4 & T5;
//fallback сигнатура, которая обрабатывает более 5 объектов,
// а также предусматривает случаи передачи null и undefined,
// но не возвращает объединение интерфейсов =(
function extend <T extends boolean | ISomeObject>
    (targetOrDeep: T, mixin1OrTarget: T extends boolean? ISomeObject: ISomeObject | undefined | null, ...mixins: (ISomeObject | null | undefined)[]): ISomeObject;

function extend(...args: (boolean | ISomeObject | null | undefined)[]): ISomeObject {
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

export default extend;
