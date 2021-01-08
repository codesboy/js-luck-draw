const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]

const defaultArr = [1, 2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]


let arr = []

for (let index = 1; index <= 100; index++) {
    arr.push(index)
}

console.log(arr);

const config = [
    {
        'round': 1, //轮次
        'm': 600, //金额
        'title': '600元代金券', //标题
        'count': 5, //抽取个数
        'self': [1, 3] //内
    },
    {
        'round': 2, //轮次
        'm': 1000, //金额
        'title': '1000元代金券', //标题
        'count': 3, //抽取个数
        'self': [2, 11] //内
    }
]

const drawMethod = 'one' //抽取方法：one一次性抽完,each分次抽取

// 洗牌算法 打乱数组
function shuffle(array) {
    const length = array == null ? 0 : array.length
    if (!length) {
      return []
    }
    let index = -1
    const lastIndex = length - 1
    const [...newArr] = array //拷贝数组
    while (++index < length) {
      const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
      const value = newArr[rand]
      newArr[rand] = newArr[index]
      newArr[index] = value
    }
    return newArr
}



let newArr = shuffle(arr) //参与抽奖的号码-乱序


let allSelf = [] //所有内号
for (let item of config) {
    allSelf = allSelf.concat(item.self)
}
let joinNum = []; //剔除内号 得到真实参与抽奖的号码
newArr.forEach( v => {
    if(allSelf.indexOf(v) === -1) joinNum.push(v)
})
/**
 * 抽取
 * @param {arr} 参与的号码
 * @param {count} 抽取的个数
 */
function draw(arr,count){
    return arr.splice(0,count)
}
let res = [
    // {
    //     title: '600元代金券',
    //     lucky: [1,2,4,5]
    // }
]

console.log(res);

const main = function (arr,turn = 1,drawMethod, config) {
    let result = []
    if (drawMethod == 'one') {
        config.map(i => {
            result.push({
                title: i.title,
                lucky: shuffle([...i.self,...draw(joinNum,i.count)])
            })
        })
    }else{

    }
}