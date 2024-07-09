/*! 汇播工具类 */

const is = (val, type) => {
  const toString = Object.prototype.toString;
  return toString.call(val) === `[object ${type}]`;
};
const isDef = (val) => {
  return typeof val !== "undefined";
};
const isUnDef = (val) => {
  return !isDef(val);
};

const huiboBox = {
  /**
   * 将dataURL转换为File对象
   *
   * @param dataurl dataURL字符串
   * @param filename 文件名
   * @returns 返回一个File对象
   */
  dataURLtoFile: (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  },
  /**
   * 将base64编码字符串转换为Blob对象
   *
   * @param base64 base64编码字符串
   * @returns 转换后的Blob对象
   */
  base64ToBlob: (base64) => {
    let arr = base64.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime,
    });
  },
  /**
   * 生成一个全局唯一标识符（GUID）
   *
   * @returns 返回一个形如 "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 的字符串
   */
  guid: () => {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  },

  /**
   * 深度克隆对象
   *
   * @param target 需要克隆的对象
   * @returns 返回克隆后的对象
   */
  deepClone: (target) => {
    const map = new WeakMap();

    function clone(data) {
      if (!huiboBox.isObject(data)) {
        return data;
      }
      if ([Date, RegExp].includes(data.constructor)) {
        return new data.constructor(data);
      }
      if (typeof data === "function") {
        return new Function("return " + data.toString())();
      }
      const exist = map.get(data);
      if (exist) {
        return exist;
      }
      if (data instanceof Map) {
        const result = new Map();
        map.set(data, result);
        data.forEach((val, key) => {
          if (huiboBox.isObject(val)) {
            result.set(key, clone(val));
          } else {
            result.set(key, val);
          }
        });
        return result;
      }
      if (data instanceof Set) {
        const result = new Set();
        map.set(data, result);
        data.forEach((val) => {
          if (huiboBox.isObject(val)) {
            result.add(clone(val));
          } else {
            result.add(val);
          }
        });
        return result;
      }
      const keys = Reflect.ownKeys(data);
      const allDesc = Object.getOwnPropertyDescriptors(data);
      const result = Object.create(Object.getPrototypeOf(data), allDesc);
      map.set(data, result);
      keys.forEach((key) => {
        const val = data[key];
        if (huiboBox.isObject(val)) {
          result[key] = clone(val);
        } else {
          result[key] = val;
        }
      });
      return result;
    }

    return clone(target);
  },
  /**
   * 生成指定长度的UUID字符串
   *
   * @param len 生成的UUID字符串的长度
   * @param radix 生成UUID字符串时可选的基数，默认为0
   * @returns 生成的UUID字符串
   */
  createUUID: (len, radix = 0) => {
    var chars = "0123456789".split("");
    var uuid = [],
      i;
    radix = radix || chars.length;
    if (len) {
      for (i = 0; i < len; i++) {
        uuid[i] = chars[0 | (Math.random() * radix)];
      }
    }
    return uuid.join("");
  },
  /**
   * 对对象属性进行排序
   *
   * @param arys 需要排序的对象
   * @returns 返回排序后的新对象
   */
  objSort: (arys) => {
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newkey = Object.keys(arys).sort();
    //console.log('newkey='+newkey);
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {
      //遍历newkey数组
      newObj[newkey[i]] = arys[newkey[i]];
      //向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj; //返回排好序的新对象
  },
  /**
   * 将对象转换为字符串类型
   *
   * @param o 待转换的对象
   * @param method 请求方法（可选），默认为空字符串
   * @returns 转换后的对象
   */
  anyToString: (o, method) => {
    method && (method = method.toLowerCase());
    Object.keys(o).forEach((k) => {
      if (huiboBox.isObject(o[k]) || huiboBox.isArray(o[k])) {
        o[k] = "";
      }
      if ((method !== "POST" && o[k] === null) || o[k] === undefined) {
        delete o[k];
      } else {
        o[k] = "";
      }
    });
    return o;
  },

  isObject: (val) => {
    return val !== null && is(val, "Object");
  },

  isEmpty: (val) => {
    if (huiboBox.isArray(val) || huiboBox.isString(val)) {
      return val.length === 0;
    }

    if (val instanceof Map || val instanceof Set) {
      return val.size === 0;
    }

    if (huiboBox.isObject(val)) {
      return Object.keys(val).length === 0;
    }

    return false;
  },

  isDate: (val) => {
    return is(val, "Date");
  },

  isNull: (val) => {
    return val === null;
  },

  isNullAndUnDef: (val) => {
    return isUnDef(val) && huiboBox.isNull(val);
  },

  isNullOrUnDef: (val) => {
    return isUnDef(val) || huiboBox.isNull(val);
  },

  isNumber: (val) => {
    return is(val, "Number");
  },

  isPromise: (val) => {
    return (
      is(val, "Promise") &&
      huiboBox.isObject(val) &&
      huiboBox.isFunction(val.then) &&
      huiboBox.isFunction(val.catch)
    );
  },

  isString: (val) => {
    return is(val, "String");
  },

  isFunction: (val) => {
    return typeof val === "function";
  },

  isBoolean: (val) => {
    return is(val, "Boolean");
  },

  isRegExp: (val) => {
    return is(val, "RegExp");
  },

  isArray: (val) => {
    return val && Array.isArray(val);
  },

  isWindow: (val) => {
    return typeof window !== "undefined" && is(val, "Window");
  },

  isElement: (val) => {
    return huiboBox.isObject(val) && !!val.tagName;
  },

  isMap: (val) => {
    return is(val, "Map");
  },

  isServer: typeof window === "undefined",

  isClient: typeof window !== "undefined",

  isUrl: (path) => {
    const reg =
      /(((^https?:(?:\/\/)?)(?:[-:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&%@.\w_]*)#?(?:[\w]*))?)$/;
    return reg.test(path);
  },

  isDark: () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  },

  // 判断值是否空值
  isKeyError: (val) => {
    return [null, undefined, "undefined", "null", ""].includes(val);
  },

  isObjectError: (row) => {
    return huiboBox.isNullOrUnDef(row)
      ? false
      : Reflect.ownKeys(row).length > 0;
  },

  isChinese: (val) => {
    var re = /[^\u4E00-\u9FA5]/;
    if (re.test(val)) return false;
    return true;
  },
  /**
   * 初始化懒加载交叉观察器
   *
   * @param fn 回调函数，当目标元素进入或离开视口时触发
   * @returns 返回 IntersectionObserver 实例
   */
  initLazyIntersectionObserver: (fn) => {
    const observer = new IntersectionObserver(
      (entrys) => entrys.forEach((entry) => fn(entry)),
      {
        rootMargin: "0px",
        threshold: 0,
      }
    );
    return observer;
  },
  /**
   * 判断两个对象是否相等
   *
   * @param obj1 第一个对象
   * @param obj2 第二个对象
   * @returns 如果两个对象相等返回true，否则返回false
   */
  isObjectEqual: (obj1, obj2) => {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);
    if (obj1Keys.length !== obj2Keys.length) {
      return false;
    }
    for (let key of obj1Keys) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  },
  /**
   * 比较版本号大小
   *
   * @param v1 版本号1
   * @param v2 版本号2
   * @returns 返回1表示v1 > v2，返回-1表示v1 < v2，返回0表示v1 = v2
   */
  compareVersion: (v1, v2) => {
    v1 = v1.split(".");
    v2 = v2.split(".");
    const len = Math.max(v1.length, v2.length);
    while (v1.length < len) {
      v1.push("0");
    }
    while (v2.length < len) {
      v2.push("0");
    }
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i]);
      const num2 = parseInt(v2[i]);
      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }
    return 0;
  },
  /**
   * 获取文件名与类型
   * @param val 文件默认的name
   * @param split
   * @returns { name: string, type: string, fileType: string }
   */
  getNameAndType: (val, split = ".") => {
    const name = val.substr(0, val.lastIndexOf(split));
    const type = val.substr(val.lastIndexOf(split) + 1);
    const config = {
      pdf: ["pdf"],
      ppt: ["ppt", "pptx"],
      word: ["doc", "docx"],
      excel: ["xlsx", "xls"],
      video: ["mp4", "mov", "wmv", "m4v", "avi"],
      audio: ["mp3", "m4a"],
      zip: ["rar", "zip", "7z"],
    };
    let fileType = "";
    Object.values(config).forEach((v, index) => {
      if (v.includes(type)) {
        fileType = Object.keys(config)[index];
      }
    });
    return { name, type, fileType };
  },
  /**
   * 判断一个对象是否为整数
   *
   * @param obj 待判断的对象
   * @returns 如果为整数返回true，否则返回false
   */
  isInteger: (obj) => {
    // 或者使用 Number.isInteger()
    return Math.floor(obj) === obj;
  },
  /**
   * 将浮点数转为整数，并返回包含整数和精度倍数的对象
   *
   * @param floatNum 浮点数
   * @returns 包含整数和精度倍数的对象
   */
  toInteger: (floatNum) => {
    // 初始化数字与精度 times精度倍数  num转化后的整数
    const ret = { times: 1, num: 0 };
    const isNegative = floatNum < 0; // 是否是小数
    if (huiboBox.isInteger(floatNum)) {
      // 是否是整数
      ret.num = floatNum;
      return ret; // 是整数直接返回
    }
    const strfi = `${floatNum}`;
    const dotPos = strfi.indexOf(".");
    const len = strfi.substr(dotPos + 1).length;
    const times = Math.pow(10, len);
    let intNum = parseInt(`${Math.abs(floatNum) * times + 0.5}`, 10);
    ret.times = times;
    if (isNegative) {
      intNum = -intNum;
    }
    ret.num = intNum;
    return ret;
  },
  /**
   * 计算两个带小数点和时间单位的数值进行加、减、乘、除运算后的结果
   *
   * @param a 第一个数值，由小数点和时间单位组成，例如："3.25h"
   * @param b 第二个数值，由小数点和时间单位组成，例如："3.153h"
   * @param op 运算符，可选值为'+', '-', '*', '/'，默认为'-'
   * @returns 返回计算后的结果，为不带时间单位的数值
   */
  jsCount: (a, b, op = "-") => {
    const o1 = huiboBox.toInteger(a);
    const o2 = huiboBox.toInteger(b);
    const n1 = o1.num; // 3.25+3.153
    const n2 = o2.num;
    const t1 = o1.times;
    const t2 = o2.times;
    const max = t1 > t2 ? t1 : t2;
    let result;
    switch (op) {
      case "+":
        if (t1 === t2) {
          result = n1 + n2;
        } else if (t1 > t2) {
          result = n1 + n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) + n2;
        }
        return result / max;
      case "-":
        if (t1 === t2) {
          result = n1 - n2;
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) - n2;
        }
        return result / max;
      case "*":
        result = (n1 * n2) / (t1 * t2);
        return result;
      case "/":
        result = (n1 / n2) * (t2 / t1);
        return result;
      default:
        return 0;
    }
  },
  /**
   * 格式化数字，保留小数点后一位，并进行四舍五入
   *
   * @param num 要格式化的数字
   * @returns 格式化后的字符串
   */
  formattedNumber: (num) => {
    const numStr = num.toString();
    const decimalIndex = numStr.indexOf(".");
    if (decimalIndex !== -1) {
      // 截取小数点后一位
      let dotNum = numStr.split(".")[1];
      if (dotNum.length >= 2) {
        if (Number(dotNum[1]) >= 5) {
          return huiboBox.jsCount(numStr.slice(0, decimalIndex + 2), 0.1, "+");
        } else {
          return numStr.slice(0, decimalIndex + 2);
        }
      } else {
        return numStr.slice(0, decimalIndex + 2);
      }
    } else {
      // 如果是整数，直接返回
      return numStr;
    }
  },
  /**
   * 获取指定范围内的随机浮点数
   *
   * @param min 最小值
   * @param max 最大值
   * @returns 返回一个指定范围内的随机浮点数
   */
  getRandom: (min, max) => {
    return Math.random() * (max - min) + min;
  },

  /**
   * 获取指定范围内的随机整数
   *
   * @param min 最小值（包含）
   * @param max 最大值（包含）
   * @returns 返回指定范围内的随机整数
   */
  getRandomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * 生成随机单词
   *
   * @returns 返回一个长度为6的随机单词字符串，由数字、大写字母和小写字母组成
   */
  randomWord: () => {
    let code = "";
    for (let i = 0; i < 6; i++) {
      const type = huiboBox.getRandomRound(1, 3);
      switch (type) {
        case 1:
          code += String.fromCharCode(huiboBox.getRandomRound(48, 57)); // 数字
          break;
        case 2:
          code += String.fromCharCode(huiboBox.getRandomRound(65, 90)); // 大写字母
          break;
        case 3:
          code += String.fromCharCode(huiboBox.getRandomRound(97, 122)); // 小写字母
          break;
      }
    }
    return code;
  },

  /**
   * 获取指定范围内的随机整数（四舍五入）
   *
   * @param min 最小值（包含）
   * @param max 最大值（包含）
   * @returns 返回指定范围内的随机整数
   */
  getRandomRound: (min, max) => {
    return Math.round(huiboBox.getRandom(min, max));
  },

  /**
   * 将天数转换为毫秒数
   *
   * @param day 天数，默认为1
   * @returns 转换后的毫秒数
   */
  getDayValueOfTime: (day = 1) => {
    return day * 24 * 3600 * 1000;
  },

  /**
   * 获取随机字符串拼接日期
   *
   * @param date 日期
   * @returns 返回拼接后的字符串
   */
  getRandomD: (date) => {
    let s = parseInt(String(Math.random() * 9000 + 1000));
    let e = parseInt(String(Math.random() * 9000 + 1000));
    const d = "" + s + date + e;
    return d;
  },

  /**
   * 更新贝塞尔曲线上的点
   *
   * @param data 贝塞尔曲线控制点数组，包含4个点的坐标，每个点有x和y属性
   * @param factor 包含t属性的对象，表示在贝塞尔曲线上的位置，取值范围为[0, 1]
   * @returns 返回一个包含更新后点的x和y坐标的对象
   */
  updatePoint: (data, factor) => {
    const p0 = data[0];
    const p1 = data[1];
    const p2 = data[2];
    const p3 = data[3];
    const t = factor.t;
    const cx1 = 3 * (p1.x - p0.x);
    const bx1 = 3 * (p2.x - p1.x) - cx1;
    const ax1 = p3.x - p0.x - cx1 - bx1;
    const cy1 = 3 * (p1.y - p0.y);
    const by1 = 3 * (p2.y - p1.y) - cy1;
    const ay1 = p3.y - p0.y - cy1 - by1;
    const x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x;
    const y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y;
    return {
      x,
      y,
    };
  },
  /**
   * 将字符串中的双引号替换为中文引号
   *
   * @param str 待处理的字符串
   * @returns 返回替换后的字符串
   */
  replaceDqm: (str) => {
    const val = str.replace(/"([^"]*)"/g, "“$1”");
    if (val.indexOf('"') < 0) {
      return val;
    }
    return huiboBox.replaceDqm(val);
  },

  /**
   * 转换数字的小数位数
   *
   * @param number 需要转换的数字
   * @param i 保留的小数位数
   * @returns 转换后的数字，如果原数字不是数值型则返回 null
   */
  transformDecimal: (number, i) => {
    let decimalNum = null;
    // 先转换为数值型
    let num = Number(number);
    // 判断是否为数值型
    if (!isNaN(num)) {
      // 切分整数与小数
      const arr = num.toString().split(".");
      // 是小数且小数位大于保留个数
      if (arr.length > 1 && arr[1].length > i) {
        // 小数部分字符串
        const decimal = arr[1].slice(i, i + 1);
        // toFixed 有 bug，四舍六入五随机
        // 当四舍五入的数为 5，给其 + 1
        if (decimal === "5") {
          // 这里可能会存在 0.1 ** 5 = 0.000010000000000000003 但不影响四舍五入
          num += Math.pow(0.1, i + 1);
        }
        decimalNum = num.toFixed(i);
      } else {
        decimalNum = num;
      }
      decimalNum = Number(decimalNum);
    }
    return decimalNum;
  },

  /**
   * 替换路径参数
   *
   * @param path 路径字符串
   * @param name 参数名称
   * @param val 参数值
   * @returns 替换后的路径字符串
   */
  replacePathParams: (path, name, val) => {
    if (huiboBox.getParams2Object(path)[name]) {
      path = huiboBox.resertUrlParams(path, name, val);
    } else {
      if (path.includes("?")) {
        path = `${path}&${`${name}`}=${val}`;
      } else {
        path = `${path}?${`${name}`}=${val}`;
      }
    }
    return path;
  },

  /**
   * 将URL参数转换为对象
   *
   * @param url 要解析的URL，默认为当前窗口的URL
   * @returns 返回一个包含URL参数的对象，若URL中无参数则返回空对象
   */
  getParams2Object: (url = window.location.href) => {
    if (url.includes("?")) {
      const keyValueArr = url.split("?")[1].split("&");
      const paramObj = {};
      keyValueArr.forEach((item) => {
        const keyValue = item.split("=");
        paramObj[keyValue[0]] = keyValue[1];
      });
      return paramObj;
    }
    return {};
  },

  /**
   * 重置URL参数
   *
   * @param url URL地址
   * @param params 需要重置的参数名
   * @param value 重置后的参数值
   * @returns 返回重置后的URL地址
   */
  resertUrlParams: (url, params, value) => {
    let cacheUrl = url.split("?")[0];
    const obj = huiboBox.getParams2Object(url);
    if (Object.keys(obj).length > 0) {
      Object.keys(obj).forEach((v, index) => {
        if (v === params) {
          obj[v] = value;
        }
        if (index === 0) {
          cacheUrl += `?${v}=${obj[v]}`;
        } else {
          cacheUrl += `&${v}=${obj[v]}`;
        }
      });
    }
    return cacheUrl;
  },

  /**
   * 更改URL参数值
   *
   * @param url 原始URL
   * @param arg 要更改的参数名
   * @param argVal 更改后的参数值
   * @returns 返回更改后的URL
   */
  changeURLArg: (url, arg, argVal) => {
    const pattern = `${arg}=([^&]*)`;
    const replaceText = `${arg}=${argVal}`;
    if (url.match(pattern)) {
      let retuenUrl = url;
      const temp = `/(&${arg}=)([^&]*)/gi`;
      if (eval(temp).test(retuenUrl)) {
        retuenUrl = retuenUrl.replace(eval(temp), `&${replaceText}`);
      }
      const temps = `/([?])(${arg}=)([^&]*)/gi`;
      if (eval(temps).test(retuenUrl)) {
        retuenUrl = retuenUrl.replace(eval(temps), `?${replaceText}`);
      }
      return retuenUrl;
    } else {
      // if (url.match('[\?]')) {
      if (url.indexOf("?") > 0) {
        return `${url}&${replaceText}`;
      } else {
        return `${url}?${replaceText}`;
      }
    }
    return `${url}\n${arg}\n${argVal}`;
  },

  /**
   * 将JSON对象转换为URL参数形式
   *
   * @param json 待转换的JSON对象
   * @returns 转换后的URL参数字符串
   */
  jsonToUrlParam: (json) => {
    return Object.keys(json)
      .map((key) => `${key}=${json[key]}`)
      .join("&");
  },

  /**
   * 将文件转换为DataURL格式的Promise对象
   *
   * @param file 要转换的文件对象
   * @returns 返回一个Promise对象，解析后的结果为转换后的DataURL字符串
   */
  fileToDataURL: (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  },

  /**
   * 将dataURL转换成Promise封装的Image对象
   *
   * @param dataURL 图片的dataURL
   * @returns 返回一个Promise对象，解析完成后得到Image对象
   */
  dataURLToImage: (dataURL) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = dataURL;
    });
  },

  /**
   * 拼接带有参数的页面URL
   *
   * @param obj 包含路由和参数的对象
   * @param obj.route 页面路由
   * @param obj.options 页面参数对象
   * @returns 拼接好的带参数的URL
   */
  splicePageUrlWithParams: (obj) => {
    const path = obj.route;
    const query = obj.options;
    // 拼接url的参数
    let urlWithParams = `/${path}?`;
    for (const key in query) {
      const value = query[key];
      urlWithParams += `${key}=${value}&`;
    }
    urlWithParams = urlWithParams.substring(0, urlWithParams.length - 1);
    return urlWithParams;
  },

  /**
   * 自定义定时器，每隔一定时间执行一次函数
   *
   * @param fn 需要执行的函数
   * @param t 间隔时间，单位毫秒
   * @returns 返回一个对象，包含取消定时器的函数 cancel
   */
  anySetInterval: (fn, t) => {
    let timer;
    function interval() {
      fn();
      timer = setTimeout(interval, t);
    }
    interval();
    return {
      cancel: () => {
        clearTimeout(timer);
      },
    };
  },

  /**
   * 将任意长度的字节数组编码为基于指定字符集的Base62字符串
   *
   * @param ALPHABET 字符集，默认值为 '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
   * @returns 返回一个包含encode, decodeUnsafe, decode方法的对象
   */
  anyBase62: (
    ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  ) => {
    if (!ALPHABET) {
      ALPHABET =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    }
    if (ALPHABET.length >= 255) {
      throw new TypeError("Alphabet too long");
    }
    const BASE_MAP = new Uint8Array(256);
    for (let j = 0; j < BASE_MAP.length; j += 1) {
      BASE_MAP[j] = 255;
    }
    for (let i = 0; i < ALPHABET.length; i += 1) {
      const x = ALPHABET.charAt(i);
      const xc = x.charCodeAt(0);
      if (BASE_MAP[xc] !== 255) {
        throw new TypeError(`${x} is ambiguous`);
      }
      BASE_MAP[xc] = i;
    }
    const BASE = ALPHABET.length;
    const LEADER = ALPHABET.charAt(0);
    const FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up
    const iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up
    function encode(source) {
      if (Array.isArray(source) || !(source instanceof Uint8Array)) {
        source = Uint8Array.from(source);
      }
      if (!(source instanceof Uint8Array)) {
        throw new TypeError("Expected Uint8Array");
      }
      if (source.length === 0) {
        return "";
      }
      // Skip & count leading zeroes.
      let zeroes = 0;
      let length = 0;
      let pbegin = 0;
      const pend = source.length;
      while (pbegin !== pend && source[pbegin] === 0) {
        pbegin += 1;
        zeroes += 1;
      }
      // Allocate enough space in big-endian base58 representation.
      const size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
      const b58 = new Uint8Array(size);
      // Process the bytes.
      while (pbegin !== pend) {
        let carry = source[pbegin];
        // Apply "b58 = b58 * 256 + ch".
        let i = 0;
        for (
          let it1 = size - 1;
          (carry !== 0 || i < length) && it1 !== -1;
          it1 -= 1, i += 1
        ) {
          carry += (256 * b58[it1]) >>> 0;
          b58[it1] = carry % BASE >>> 0;
          carry = (carry / BASE) >>> 0;
        }
        if (carry !== 0) {
          throw new Error("Non-zero carry");
        }
        length = i;
        pbegin += 1;
      }
      // Skip leading zeroes in base58 result.
      let it2 = size - length;
      while (it2 !== size && b58[it2] === 0) {
        it2 += 1;
      }
      // Translate the result into a string.
      let str = LEADER.repeat(zeroes);
      for (; it2 < size; it2 += 1) {
        str += ALPHABET.charAt(b58[it2]);
      }
      return str;
    }
    function decodeUnsafe(source) {
      if (typeof source !== "string") {
        throw new TypeError("Expected String");
      }
      if (source.length === 0) {
        return new Uint8Array(0);
      }
      let psz = 0;
      // Skip and count leading '1's.
      let zeroes = 0;
      let length = 0;
      while (source[psz] === LEADER) {
        zeroes += 1;
        psz += 1;
      }
      // Allocate enough space in big-endian base256 representation.
      const size = ((source.length - psz) * FACTOR + 1) >>> 0; // log(58) / log(256), rounded up.
      const b256 = new Uint8Array(size);
      // Process the characters.
      while (source[psz]) {
        // Decode character
        let carry = BASE_MAP[source.charCodeAt(psz)];
        // Invalid character
        if (carry === 255) {
          return;
        }
        let i = 0;
        for (
          let it3 = size - 1;
          (carry !== 0 || i < length) && it3 !== -1;
          it3 -= 1, i += 1
        ) {
          carry += (BASE * b256[it3]) >>> 0;
          b256[it3] = carry % 256 >>> 0;
          carry = (carry / 256) >>> 0;
        }
        if (carry !== 0) {
          throw new Error("Non-zero carry");
        }
        length = i;
        psz += 1;
      }
      // Skip leading zeroes in b256.
      let it4 = size - length;
      while (it4 !== size && b256[it4] === 0) {
        it4 += 1;
      }
      const vch = new Uint8Array(zeroes + (size - it4));
      let j = zeroes;
      while (it4 !== size) {
        vch[j] = b256[it4];
        j += 1;
        it4 += 1;
      }
      return vch;
    }
    function decode(string) {
      const buffer = decodeUnsafe(string);
      if (buffer) {
        return new TextDecoder().decode(buffer);
      }
      throw new Error(`Non-base${BASE} character`);
    }
    return {
      encode,
      decodeUnsafe,
      decode,
    };
  },

  /**
   * 节流函数，限制函数的执行频率。
   *
   * @param fn 需要进行节流的函数。
   * @param delay 两次函数调用之间的最小时间间隔，单位为毫秒，默认为500毫秒。
   * @returns 返回一个新的函数，该函数具有节流功能。
   */
  throttle: function (fn, delay = 500) {
    let flag = true;
    let timer;
    let resultFunc;
    resultFunc = function () {
      if (flag) {
        flag = false;
        const context = this;
        const args = arguments;
        timer = setTimeout(function () {
          fn.apply(context, args);
          flag = true;
        }, delay);
      }
    };
    resultFunc.cancel = function () {
      clearTimeout(timer);
      flag = true;
    };
    return resultFunc;
  },

  /**
   * 防抖函数
   *
   * @param fn 要防抖的函数
   * @param delay 防抖延迟时间，默认为500毫秒
   * @returns 返回防抖后的函数
   */
  debounce: function (fn, delay = 500) {
    //默认300毫秒
    let timer;
    return function () {
      const args = arguments;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  },
};
export default huiboBox;
