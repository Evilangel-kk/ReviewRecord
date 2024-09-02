<template>
    <div class="record">
        <div class="check">
            <CheckItem ref="item0" :sentence="sentences[0]" :itemType="types[0]" :date="date" />
            <CheckItem ref="item1" :sentence="sentences[1]" :itemType="types[1]" :date="date" />
            <CheckItem ref="item2" :sentence="sentences[2]" :itemType="types[2]" :date="date" />
            <CheckItem ref="item3" :sentence="sentences[3]" :itemType="types[3]" :date="date" />
            <CheckItem ref="item4" :sentence="sentences[4]" :itemType="types[4]" :date="date" />
            <CheckItem ref="item5" :sentence="sentences[5]" :itemType="types[5]" :date="date" />
            <CheckItem ref="item6" :sentence="sentences[6]" :itemType="types[6]" :date="date" />
            <CheckItem ref="item7" :sentence="sentences[7]" :itemType="types[7]" :date="date" />
            <CheckItem ref="item8" :sentence="sentences[8]" :itemType="types[8]" :date="date" />
            <CheckItem ref="item9" :sentence="sentences[9]" :itemType="types[9]" :date="date" />
        </div>
        <Describe />
    </div>
</template>

<script>
import DateData from '../api/DateData'
import CheckItem from './CheckItem.vue'
import Describe from './Describe.vue'
import bus from '../eventBus.js'
export default {
    name:"Record",
    data(){
        return{
            sentences:["八点之前起床","背单词","复习数学","复习英语","练习编程","复习计算机网络","复习数据结构","复习计算机组成原理","复习操作系统","锻炼身体"],
            types:["IsGetup","IsWord","IsMath","IsEnglish","IsCode","IsMianjing","IsDS","IsCCP","IsOS","IsSport"],
            isFinish:{isGetup:false,isWord:false,isMath:false,isEnglish:false,isCode:false,isMianjing:false,isDS:false,isCCP:false,isOS:false,isSport:false},
            date:"",
            schedule:0,
        }
    },
    created(){
        const today=new Date();
        this.date=`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        this.getDateData(this.date);
        bus.on("selectedDate",(date)=>{
            this.date=date;
            this.getDateData(this.date);
        })
    },
    components:{
        CheckItem,
        Describe,
    },
    mounted(){

    },
    methods:{
        getDateData(date){
            DateData({date:date}).then((res)=>{
                console.log(res.data[0]);
                this.isFinish.isGetup=(res.data[0].IsGetup==1);
                this.$refs.item0.change(this.isFinish.isGetup);
                this.isFinish.isWord=(res.data[0].IsWord==1);
                this.$refs.item1.change(this.isFinish.isWord);
                this.isFinish.isMath=(res.data[0].IsMath==1);
                this.$refs.item2.change(this.isFinish.isMath);
                this.isFinish.isEnglish=(res.data[0].IsEnglish==1);
                this.$refs.item3.change(this.isFinish.isEnglish);
                this.isFinish.isCode=(res.data[0].IsCode==1);
                this.$refs.item4.change(this.isFinish.isCode);
                this.isFinish.isMianjing=(res.data[0].IsMianjing==1);
                this.$refs.item5.change(this.isFinish.isMianjing);
                this.isFinish.isDS=(res.data[0].IsDS==1);
                this.$refs.item6.change(this.isFinish.isDS);
                this.isFinish.isCCP=(res.data[0].IsCCP==1);
                this.$refs.item7.change(this.isFinish.isCCP);
                this.isFinish.isOS=(res.data[0].IsOS==1);
                this.$refs.item8.change(this.isFinish.isOS);
                this.isFinish.isSport=(res.data[0].IsSport==1);
                this.$refs.item9.change(this.isFinish.isSport);
                console.log(this.isFinish);
                this.schedule=parseInt(res.data[0].Schedule);
            })
        }
    },
}
</script>

<style scoped>
.record{
    display: flex;
    justify-content: center;
}
.check{
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>