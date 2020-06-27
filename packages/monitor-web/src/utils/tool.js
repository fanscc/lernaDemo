import store from "@/store";
import router from "@/router/routers";
// 封装深度克隆
const deepClone = function (origin, target) {
  // eslint-disable-next-line
  var target = target || {}, //设置target的默认值，不传值默认为空对象
    toStr = Object.prototype.toString, // 原型链方法：判断数值类型
    arrStr = "[object Array]";
  for (var prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      // 判断对象下面是否有属性，没有属性的即为原始值

      if (origin[prop] !== "null" && typeof origin[prop] === "object") {
        // 判断需要被克隆的对象的属性是否为原始值
        target[prop] = toStr.call(origin[prop]) === arrStr ? [] : {}; // 不是原始值，将其转为数组或对象
        deepClone(origin[prop], target[prop]); // 如果不是原始值，继续调用自身，判断该属性的子属性是否为原始值
      } else {
        target[prop] = origin[prop]; // 如果是原始值的话，将其复制给克隆对象
      }
    }
  }
  return target;
};

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

const formatDate = function (time, fmt) {
  const date = new Date(time);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, date.getFullYear());
  }
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
};

const fliterSensorName = function (num, objs) {
  const objNum = parseInt(num / 1000) || 1;
  const addName = num % 1000;
  const sensor = {
    1: {
      name: "空气温度",
      iconName: "iconkongqiwendu",
      unit: "°C"
    },
    2: {
      name: "空气湿度",
      iconName: "iconkongqishidu",
      unit: "%"
    },
    3: {
      name: "气压",
      iconName: "iconqiya",
      unit: "kPa"
    },
    4: {
      name: "土壤温度",
      iconName: "iconkongqiwendu",
      unit: "°C"
    },
    5: {
      name: "土壤湿度",
      iconName: "iconkongqishidu",
      unit: "%"
    },
    6: {
      name: "光照",
      iconName: "iconguangzhao",
      unit: "lux"
    },
    7: {
      name: "电压",
      iconName: "icondianya",
      unit: "v"
    },
    8: {
      name: "空调",
      iconName: "iconkongtiao-",
      unit: "°C"
    },
    9: {
      name: "电磁阀",
      iconName: "icondiancilu",
      unit: ""
    },
    10: {
      name: "电池电压",
      iconName: "icondianya1",
      unit: "v"
    },
    11: {
      name: "太阳能板电压",
      iconName: "iconIOTtubiao_huabanfuben",
      unit: "v"
    },
    12: {
      name: "风速",
      iconName: "iconfengsu",
      unit: "m/s"
    },
    13: {
      name: "风向",
      iconName: "iconfengxiang",
      unit: ""
    },
    14: {
      name: "二氧化碳",
      iconName: "iconeryanghuatan",
      unit: "mg/m3"
    },
    15: {
      name: "GPS",
      iconName: "icongps",
      unit: ""
    },
    16: {
      name: "继电器",
      iconName: "icondianqixingye",
      unit: ""
    },
    17: {
      name: "电流",
      iconName: "iconeryanghuatan",
      unit: ""
    },
    18: {
      name: "卡号",
      iconName: "iconniuli",
      unit: ""
    },
    19: {
      name: "总电量",
      iconName: "iconeryanghuatan",
      unit: "%"
    },
    20: {
      name: "光合有效值",
      iconName: "icongps",
      unit: ""
    },
    21: {
      name: "降雨量",
      iconName: "icondianqixingye",
      unit: ""
    },
    22: {
      name: "扭矩",
      iconName: "iconniuli",
      unit: ""
    },
    23: {
      name: "油压",
      iconName: "iconjiyouyali",
      unit: ""
    },
    24: {
      name: "油量",
      iconName: "iconyouliang",
      unit: ""
    },
    25: {
      name: "水温",
      iconName: "iconshuiwenji",
      unit: "°C"
    },
    26: {
      name: "发动机转速",
      iconName: "iconsuduspeed8",
      unit: ""
    },
    27: {
      name: "角度",
      iconName: "iconjiaodu",
      unit: ""
    },
    28: {
      name: "角速度",
      iconName: "iconzhuansubiao",
      unit: ""
    },
    29: {
      name: "PM1.0",
      iconName: "iconPM",
      unit: "ug/m³"
    },
    30: {
      name: "PM2.5",
      iconName: "iconPM",
      unit: "ug/m³"
    },
    31: {
      name: "PM10",
      iconName: "iconPM",
      unit: "ug/m³"
    },
    32: {
      name: "噪声",
      iconName: "iconzaoyin",
      unit: "db"
    },
    33: {
      name: "网关电池信息",
      iconName: "icondianqixingye",
      unit: "%"
    }
  };
  if (!objs) {
    return sensor[objNum].name + "" + addName;
  } else {
    return sensor[objNum];
  }
};

const valueUnit = function (items) {
  const num = parseInt(items.sensor / 1000);
  const val = items.value1 - 0;
  const val2 = items.value2 - 0;
  const objs = {
    1: `${val.toFixed(0)}°C`,
    2: `${val.toFixed(2)}%`,
    3: `${val.toFixed(3)} kPa`,
    4: `${val.toFixed(0)}°C`,
    5: `${val.toFixed(2)}%`,
    6: `${val.toFixed(0)}lux`,
    7: `${val.toFixed(1)}v`,
    8: `${val.toFixed(0)}°C`,
    9: `${val === 2 ? "开" : "关"}`,
    10: `${val.toFixed(1)}v`,
    11: `${val.toFixed(1)}v`,
    12: `${val.toFixed(1)}m/s`,
    13: `${val}`,
    14: `${val.toFixed(1)}mg/m3`,
    15: `经纬度：${val},${val2}`,
    16: `${val === 2 ? "开" : "关"}`,
    17: `${val}`,
    18: `${val}`,
    19: `${val}`,
    20: `${val}`,
    21: `${val}`,
    22: `${val}`,
    23: `${val}`,
    24: `${val}`,
    25: `${val}`,
    26: `${val}`,
    27: `${val}`,
    28: `${val}`,
    29: `${val}ug/m³`,
    30: `${val}ug/m³`,
    31: `${val}ug/m³`,
    32: `${val}db`,
    33: `${val}%`
  };
  return objs[num];
};

const closeTag = function (view, toPath) {
  store.dispatch("delView", view).then(() => {
    if (toPath) {
      router.push(toPath.path);
    } else {
      router.go(-1);
    }
  });
};

export const utils = {
  deepClone,
  formatDate,
  fliterSensorName,
  valueUnit,
  closeTag
};
