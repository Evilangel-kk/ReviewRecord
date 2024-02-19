<template>
    <div class="checkitem">
        <div class="checkbox" ref="check">
            <input type="checkbox" ref="input" :checked="isCheck">
            <svg width="31" height="31">
                <polyline class="tick" fill="none" stroke="#68e534" stroke-width="6" points="5.5,15 13,24.5 25.5,7.5" stroke-linecap="round" stroke-linejoin="round"></polyline>
            </svg>
        </div>
        <div class="item" ref="sentence">{{ sentence }}</div>
    </div>
</template>

<script>
import ChangeRecord from '../api/changeRecord'
import bus from '../eventBus.js'
export default {
    name:"CheckItem",
    data(){
        return{
            isCheck:0,
        }
    },
    props:{
        sentence:"",
        itemType:"",
        date:"",
    },
    mounted(){
        this.$refs.check.addEventListener("click",()=>{
            if(this.isCheck){
                this.isCheck=0;
            }else{
                this.isCheck=1;
            }
            this.postHttp();
        })
    },
    methods:{
        postHttp(){
            ChangeRecord({date:this.date,type:this.itemType,istrue:this.isCheck}).then(res=>{
                console.log(res.data.Schedule);
                bus.emit('changeSchedule',res.data.Schedule);
            })
        },
        change(is){
            if(is){
                this.isCheck=1;
            }else{
                this.isCheck=0;
            }
            console.log(this.isCheck);
        }
    },
    watch: {
        isCheck(newValue,oldValue){
            if(newValue==1){
                this.$refs.sentence.style.color="green";
            }else{
                this.$refs.sentence.style.color="#013a01";
            }
        }
    }
}
</script>

<style scoped>
.checkitem{
    display: flex;
    padding: 10px 10px;
    align-items: center;
}
.checkbox{
    width: 40px;
    height: 40px;
    border: 4px solid rgb(15, 81, 15);
    border-radius: 0.4rem;
}
.item{
    color: #013a01;
    font-size: larger;
    font-weight: 600;
    padding: 0 10px;
}
input{
    width: 32px;
    height: 32px;
    position: absolute;
    opacity: 0;
}
.tick{
    stroke-dasharray: 35;
    stroke-dashoffset: 35;
    /* stroke-dashoffset: 0; */
}

input[type="checkbox"]:checked + svg .tick{
    animation: tick 0.3s ease-out;
    animation-fill-mode: forwards;
}

@keyframes tick{
    from{
        stroke-dashoffset: 35;
    }
    to{
        stroke-dashoffset: 0;
    }
}
</style>