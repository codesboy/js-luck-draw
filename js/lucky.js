/**
 * ES6类的使用
 * 用到了构造器、箭头函数、模板字符串`${}`、
 */
class Lucky{
    constructor(startNum,endNum,numPwrap,totalTurns,smTitle=[]){
        this.startNum=startNum;//参与抽奖的起始号码
        this.endNum=endNum;//参与抽奖的结束号码
        this.digits=this.endNum.toString().length;//中奖号码显示的位数
        this.aJoinNum=[];
        this.totalTurns=totalTurns;//总抽奖轮次
        this.smTitle=smTitle;//轮次小标题
        this.luckyNum=null;//中奖号码
        this.flag=true;//开始与停止标记
        this.numPwrap=document.getElementById(numPwrap);//号码显示父容器
        this.turnsWrap=document.getElementById('turns');//显示轮次容器
        this.timer=null;//定时器
        this.oLocalStorage=window.localStorage;//本地存储对象
        this.turn=1;//97->1 98->2 ... 抽奖轮次编号 按左右方向键进行切换
    }

    init(){
        // 如果还没有存储参与抽奖号码就进行存储
        if(!this.oLocalStorage.getItem("sJoinNum")){
            // 得到参与抽奖号码数组
            let arr=[];
            for(let i=this.startNum;i<=this.endNum;i++){
                let j=this.buquan(i,this.digits)
                arr.push(j);
            }
            // let str = JSON.stringify(arr);
            let str = arr.join(',');
            localStorage.setItem("sJoinNum",str);
        }else{
            console.log(`已经存储了aJoinNum${this.oLocalStorage.getItem('sJoinNum')}`);
        }
        // this.aJoinNum=JSON.parse(this.oLocalStorage.getItem('sJoinNum'));//参与抽奖号码数组
        this.aJoinNum=this.oLocalStorage.getItem('sJoinNum').split(",");//参与抽奖号码数组





        //刷新页面，从localStoreage中恢复
        this.fill();
        // console.log(this.getLocalStorage())
        document.onkeyup=(e)=>{
            let oEvent=e||window.event;//let在当前作用域内有用，未声明前不可用，不可重复声明


            // alert(oEvent.keyCode)

            // 空格键开始和停止抽奖
            if(oEvent.keyCode==32 && this.flag){
                // console.log(oEvent.keyCode);
                this.flag=false;
                this.run();
                console.log('开始')
            }else if (oEvent.keyCode==32 && !this.flag) {
                this.flag=true;
                this.stop();
                console.log('停止')
            }

            // 左右方向键切换抽奖轮次，Ctrl + z清除localStorage
            switch (oEvent.keyCode || oEvent.ctrlKey ) {
                case 37:
                    this.turn-=1;
                    if(this.turn==0){
                        this.turn=this.totalTurns;
                    }
                    this.fill();
                    break;
                case 39:
                    this.turn+=1;
                    if(this.turn>this.totalTurns){
                        this.turn=1;
                    }
                    this.fill();
                    break;
                case 38://查询全部中奖记录
                    this.showAllLucky();
                    break;
                case 90 || true:
                    this.oLocalStorage.clear();
                    break;
                default:
                    break;
            }
        }
    }

    // 补全前导0
    buquan(num,length){
        let numstr = num.toString();
        let l=numstr.length;
        if (l>=length) {return numstr;}
        for(let  i = 0 ;i<length - l;i++){
            numstr = "0" + numstr;
        }
        return numstr;
    }

    //从数组中移除指定值
    removeLuckyNum(num,arr){
        // 数组扩展方法 从数组删除指定元素
        Array.prototype.removeByValue = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val) {
                    this.splice(i, 1);
                    break;
                }
            }
        }
        arr.removeByValue(num);
        return arr;
    }


    /**
     * [getLucky 从参与抽奖号码中随机获取中奖号码]
     * @return {[number]} [带前导0的数字]
     */
    getLucky(arr){
        let randomNum=Math.floor(Math.random() * arr.length);//随机抽取一个中奖号码
        // alert(arr[randomNum]);
        return arr[randomNum];
    }



    // 开始滚动号码效果
    run(){
        clearInterval(this.timer);//清除之前的定时器
        this.playRuningMusic();//同时播放音效

        if(this.aJoinNum.length<1){
            alert('参与抽奖号码已抽完！');
            return false;
        }
        this.numPwrap.innerHTML='';
        this.timer=setInterval(()=>{
            let randomIndex=Math.floor(Math.random()*this.aJoinNum.length);
            console.log(`参与号码：${this.aJoinNum}`);
            this.numPwrap.innerHTML=`<b>${this.aJoinNum[randomIndex]}</b>`; //号码不断滚动

        },50);

    }

    // 停止号码滚动
    stop(){
        clearInterval(this.timer);
        this.playStopMusic();
        this.luckyNum=this.getLucky(this.aJoinNum);//随机抽取一个号码
        console.log(`中奖号码：${this.luckyNum}`);

        let arr=this.removeLuckyNum(this.luckyNum,this.aJoinNum);//移除该中奖号码
        this.oLocalStorage.setItem('sJoinNum',arr);//出现存储剩余号码，更新参与抽奖号码
        console.log(`抽取后剩余号码：${this.aJoinNum}--个数${this.aJoinNum.length}`);
        this.saveLuckyNum(this.luckyNum);//存储
        this.numPwrap.innerHTML=`<b>${this.luckyNum}</b>`;

    }

    // 滚动音效
    playRuningMusic(){

    }

    // 停止音效
    playStopMusic(){

    }

    //将中奖号码进行存储
    saveLuckyNum(num){
        if(!this.oLocalStorage[this.turn]){//如果次轮抽奖结果没有存储就进行存储
            this.oLocalStorage.setItem(this.turn,num);
        }else{
            this.oLocalStorage.setItem(this.turn,`${this.getLocalStorage(this.turn)}、${num}`);
        }
    }

    getLocalStorage(turn){
        if(this.oLocalStorage[turn]){
            return this.oLocalStorage[turn];
        }else{
            return '';
        }
    }

    // 将中奖号码填充到页面 && 轮次标题填充
    fill(){

        if(this.smTitle[this.turn-1]){

            this.turnsWrap.innerHTML=`第${this.turn}轮${this.smTitle[this.turn-1]}`;
        }else{
            this.turnsWrap.innerHTML=`第${this.turn}轮`;
        }
        this.numPwrap.innerHTML='';
        // this.d=0;
        if(this.getLocalStorage(this.turn)){
            this.numPwrap.innerHTML=`<span class="show">恭喜本轮中奖号码：${this.getLocalStorage(this.turn)}</span>`;
        }else{

        }
    }

    // 显示全部中奖号码
    showAllLucky(){
        this.numPwrap.innerHTML='';
        this.numPwrap.innerHTML='恭喜本次活动所有中奖号码：<br />';
        this.turnsWrap.style.display = 'none';
        // console.log(this.oLocalStorage.length);//object
        for(let i=1;i<=this.totalTurns;i++){
            if(this.oLocalStorage.getItem(i)){
                this.numPwrap.innerHTML+=`<div class="show">第${i}轮${this.smTitle[i-1]}中奖号码：${this.oLocalStorage.getItem(i)}</div>`;
            }

        }
    }

}


window.onload=function(){
    if(!window.localStorage){
        alert('您的浏览器不支持window.localStorage，请更换');
        return false;
    }

    let lucky=new Lucky(1,30,'get_num',5,['200元代金券','300元代金券','500元代金券','半价种植牙','免费种植牙']);
    lucky.init();

}
