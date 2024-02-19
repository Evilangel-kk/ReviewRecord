<template>
    <div class="describe">
        <div class="descriptions"></div>
        <div class="inputBox">
            <el-input v-model="input" placeholder="要不写点什么记录一下"/>
            <el-button color="#626aef" @click="Send">发送</el-button>
        </div>
    </div>
</template>

<script>
import SendDescribe from '../api/SendDescribe'
import Descriptions from '../api/Descriptions'
import bus from '../eventBus.js'
export default {
    name:"Describe",
    data(){
        return{
            input:"",
            date:"",
            textarea:null,
            isNULL:true,
        }
    },
    created(){
        const today=new Date();
        this.date=`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        this.getDescribe(this.date);
        bus.on("selectedDate",(date)=>{
            this.date=date;
            this.textarea.innerHTML="";
            this.getDescribe(this.date);
        })
    },
    mounted(){
        this.textarea=document.querySelector(".descriptions");
    },
    methods:{
        Send(){
            if(this.input!=""){
                SendDescribe({date:this.date,des:this.input}).then(res=>{
                    console.log(res);
                    if(res.code==200){
                        this.Insert(this.input);
                        this.input="";
                        if(this.isNULL==true){
                            this.isNULL = false;
                            var firstChild = this.textarea.firstChild;
                            this.textarea.removeChild(firstChild);                   
                        }
                    }
                })
            }else{
                this.$message.error('输入内容不能为空');
            }
        },
        getDescribe(date){
            Descriptions({date:date}).then(res=>{
                console.log(res.data);
                if(res.code==200){
                    if(res.data.length==1){
                        this.isNULL=true;
                        this.Insert(res.data[0]);
                    }else{
                        this.isNULL=false;
                        for(let i in res.data){
                            if(i>0){
                                this.Insert(res.data[i]);
                            }
                        }
                    }
                }
            })
        },
        Insert(str){
            // 创建一个新的 <p> 元素
            var newDiv=document.createElement('div');
            newDiv.style.display="flex";
            var newParagraph = document.createElement('span');
            newParagraph.textContent = str;
            newParagraph.style.fontSize="larger";
            newParagraph.style.padding="5px 5px";
            newParagraph.style.margin="5px 5px";
            newParagraph.style.backgroundColor="#ffe000";
            newParagraph.style.borderRadius="0.4rem";
            // 将新创建的 <p> 元素添加到 div 中
            newDiv.appendChild(newParagraph);
            this.textarea.appendChild(newDiv);
            this.textarea.scrollTop = this.textarea.scrollHeight;
        }
    },
}
</script>

<style scoped>
.describe{
    height: 100%;
    width: 300px;
    position: relative;
    border-top-right-radius: 0.6rem;
    border-top-left-radius: 0.6rem;
    /* background-color: rgb(241, 255, 245); */
    overflow: hidden;
}
.descriptions{
    width: 104%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    position: absolute;
    bottom: 40px;
    max-height: 600px;
    padding-top: 10px;
}
.inputBox{
    display: flex;
    position: absolute;
    width: 100%;
    align-items: center;
    justify-content: center;
    bottom: 0;
}
</style>