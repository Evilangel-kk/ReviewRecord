<template>
    <div class="calendar">
        <div class="header">
            <button class="lastYear" title="Last year">&lt;&lt;</button>
            <button class="lastMonth" title="Last month">&lt;</button>
            <div class="currentDate"></div>
            <button class="nextMonth" title="Next month">&gt;</button>
            <button class="nextYear" title="Next year">&gt;&gt;</button>
        </div>
        <div class="days">
            <div class="day">Mon</div>
            <div class="day">Tue</div>
            <div class="day">Wed</div>
            <div class="day">Thu</div>
            <div class="day">Fri</div>
            <div class="day">Sat</div>
            <div class="day">Sun</div>
        </div>
        <div class="dates"></div>
    </div>
</template>

<script>
import MonthData from '../api/MonthData'
import bus from '../eventBus.js'
export default {
    name:"Calender",
    data(){
        return{
            color:["#ff5500","#ff9900","#9bff68"],
            calendarData: [], 
            selectedDate:"",
        }
    },
    created(){
        bus.on('changeSchedule',(newSchedule)=>{
            const selectedDiv = document.querySelector('.selected');
            const rectDiv = selectedDiv.querySelector('.rect');
            const fillRectDiv = rectDiv.querySelector('.fillrect');
            fillRectDiv.style.width=newSchedule+"%";
            fillRectDiv.style.backgroundColor=this.color[Math.floor(newSchedule/40)];
        })
    },
    mounted(){
        class Calendar {
            constructor({
                element,
                defaultDate
            }) {
                if (defaultDate instanceof Date) {
                this.defaultDate = defaultDate
                } else {
                this.defaultDate = new Date();
                }
                if (element instanceof HTMLElement) {
                this.element = element;
                }
                this.#init();
            }

            // private properties
            #year;
            #month;
            #date;
            #dateString;
            #calendarData=[];
            #color=["#ff5500","#ff9900","#9bff68"];

            #init = () => {
                const defaultYear = this.defaultDate.getFullYear();
                const defaultMonth = this.defaultDate.getMonth() + 1;
                const defaultDate = this.defaultDate.getDate();
                this.#setDate(defaultYear, defaultMonth, defaultDate);
                this.#listenEvents();
            }

            #listenEvents = () => {
                // DOMS
                const lastYearButton = this.element.querySelector('.lastYear');
                const lastMonthButton = this.element.querySelector('.lastMonth');
                const nextYearButton = this.element.querySelector('.nextYear');
                const nextMonthButton = this.element.querySelector('.nextMonth');
                // last year
                lastYearButton.addEventListener('click', () => {
                    this.#year--;
                    this.#setDate(this.#year, this.#month);
                });
                // next year
                nextYearButton.addEventListener('click', () => {
                    this.#year++;
                    this.#setDate(this.#year, this.#month);
                });
                // last month
                lastMonthButton.addEventListener('click', () => {
                    if (this.#month === 1) {
                        this.#month = 12;
                        this.#year--;
                    } else {
                        this.#month--;
                    }
                    this.#setDate(this.#year, this.#month);
                });
                // next month
                nextMonthButton.addEventListener('click', () => {
                    if (this.#month === 12) {
                        this.#month = 1;
                        this.#year++;
                    } else {
                        this.#month++
                    }
                    this.#setDate(this.#year, this.#month);
                });
                // click dates
                this.element.addEventListener('click', (e) => {
                    if (e.target.classList.contains('date')) {
                        const params = e.target.title.split('-').map(str => parseInt(str, 10));
                        if(e.target.classList.contains('currentMonth')){
                            this.#setDate(...params, false, false);
                        }else{
                            this.#setDate(...params, true, true);
                        }
                        bus.emit('selectedDate',e.target.title);
                    }
                });
            }

            #setDate = (year, month, date, reRenderDate = true, isFlashRecord = true) => {
                this.#year = year;
                this.#month = month;
                this.#date = date;
                // the only place to do renders
                this.#renderCurrentDate();
                this.#renderDates(reRenderDate);
                if(reRenderDate){
                    this.#getMonthData(this.#year+"-"+this.#month+"-1");
                }
            }

            #renderCurrentDate = () => {
                const currentDateEL = this.element.querySelector('.currentDate');
                this.#dateString = this.#getDateString(this.#year, this.#month, this.#date);
                currentDateEL.textContent = this.#dateString;
            }

            #getLastMonthInfo = () => {
                let lastMonth = this.#month - 1;
                let yearOfLastMonth = this.#year;
                if (lastMonth === 0) {
                    lastMonth = 12;
                    yearOfLastMonth -= 1;
                }
                let dayCountInLastMonth = this.#getDayCount(yearOfLastMonth, lastMonth);

                return {
                    lastMonth,
                    yearOfLastMonth,
                    dayCountInLastMonth
                }
            }

            #getNextMonthInfo = () => {
                let nextMonth = this.#month + 1;
                let yearOfNextMonth = this.#year;
                if (nextMonth === 13) {
                    nextMonth = 1;
                    yearOfNextMonth += 1;
                }
                let dayCountInNextMonth = this.#getDayCount(yearOfNextMonth, nextMonth);

                return {
                    nextMonth,
                    yearOfNextMonth,
                    dayCountInNextMonth
                }
            }

            #getDateString = (year, month, date) => {
                if (date) {
                    return `${year}-${month}-${date}`;
                } else {
                    return `${year}-${month}`;
                }
            }

            #renderDates = (reRender) => {
                // DOM
                const datesEL = this.element.querySelector('.dates');
                if (!reRender) {
                    const dateELs = datesEL.querySelectorAll('.date');
                    for (const el of dateELs) {
                        el.classList.toggle('selected', el.title === this.#dateString);
                    }
                    return;
                }

                datesEL.innerHTML = '';
                const dayCountInCurrentMonth = this.#getDayCount(this.#year, this.#month);
                const firstDay = this.#getDayOfFirstDate();
                const { lastMonth, yearOfLastMonth, dayCountInLastMonth } = this.#getLastMonthInfo();
                const { nextMonth, yearOfNextMonth } = this.#getNextMonthInfo();

                for (let i = 1; i <= 42; i++) {
                    const dateEL = document.createElement('div');
                    dateEL.classList.add('date');
                    let dateString;
                    let date;
                    if (firstDay > 1 && i < firstDay) {
                        // dates in last month
                        date = dayCountInLastMonth - (firstDay - i) + 1;
                        dateString = this.#getDateString(yearOfLastMonth, lastMonth, date);
                    } else if (i >= dayCountInCurrentMonth + firstDay) {
                        // dates in next month
                        date = i - (dayCountInCurrentMonth + firstDay) + 1;
                        dateString = this.#getDateString(yearOfNextMonth, nextMonth, date);
                    } else {
                        // dates in currrent month
                        date = i - firstDay + 1;
                        dateString = this.#getDateString(this.#year, this.#month, date);
                        dateEL.classList.add('currentMonth');
                        if (date === this.#date) {
                            dateEL.classList.add('selected');
                        }
                    }
                    dateEL.textContent = date;
                    dateEL.title = dateString;
                    datesEL.append(dateEL);
                }
            }

            /**
             * Get day count with year, month
             * @param {number} year year number
             * @param {number} month month number that starts from 1
             * @returns 
             */
            #getDayCount = (year, month) => {
                return new Date(year, month, 0).getDate();
            }

            #getDayOfFirstDate = () => {
                let day = new Date(this.#year, this.#month - 1, 1).getDay();
                return day === 0 ? 7 : day;
            }

            #getMonthData=(date)=>{
                console.log(date);
                this.#calendarData=[];
                MonthData({date:date}).then(res=>{
                    console.log(res);
                    for(let i in res.data){
                        this.#calendarData.push({date:res.data[i].Date,schedule:res.data[i].Schedule});
                    }
                    this.#flashRecord();
                })
            }

            #flashRecord=()=>{
                const days=document.querySelectorAll(".currentMonth");
                days.forEach((e,i)=>{
                    const div = document.createElement('div'); // 创建一个 div 元素
                    div.classList.add("rect");
                    e.appendChild(div); // 将 div 元素添加到每个 currMonth 元素的子节点列表中
                    if(i<this.#calendarData.length){
                        const fillrect=document.createElement('div');
                        fillrect.classList.add("fillrect");
                        div.appendChild(fillrect);
                        fillrect.style.width=this.#calendarData[i].schedule+"%";
                        fillrect.style.height="100%";
                        fillrect.style.backgroundColor=this.#color[Math.floor(this.#calendarData[i].schedule/40)];
                    }
                })
            }
        }
        // DOM
        const calendar = document.querySelector('.calendar');

        new Calendar({
            element: calendar,
            // defaultDate: new Date(1999, 9, 9)
        });
        let today=new Date();
        this.selectedDate=`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        const dates=document.querySelectorAll('.date');
        dates.forEach(element=>{
            element.addEventListener('click', (e) => {
                this.selectedDate = e.target.title;
                // bus.emit('selectedDate',this.selectedDate);
            })
        })
    },
}
</script>

<style>
.calendar {
    background-color: #ecffe1;
    width: 40vw;
    user-select: none;
    border-radius: 10px;
    padding: 20px;
    border: 2px solid rgb(176, 208, 176);
}

.header {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 20px;
}


.currentDate {
    font-size: 2rem;
    font-weight: bold;
    color: var(--accent-color);
    text-align: center;
    min-width: 28vmin;
}

.header button {
    border: 2px solid transparent;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    padding: 0 10px;
    transition: all 0.3s;
    font-size: 1.3rem;
    color: rgb(53, 214, 53);
}

.header button:hover {
    color: var(--accent-color);
}

/* days */

.days {
    display: flex;
    justify-content: space-around;
    text-align: center;
    padding: 20px 0;
    font-size: 1.2rem;
    color: var(--accent-color);
}


/* dates */

.dates {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
}

.date {
    text-align: center;
    padding: 10px 0;
    height: 70px;
    font-size: 1.6rem;
    transition: all 0.3s;
    border: 3px solid transparent;
    color: rgba(0, 0, 0, 0.36);
    cursor: pointer;
    border-radius: 5px;
    background-color: transparent;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
}

.date.currentMonth {
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.date:hover,
.date.selected {
    border-color: var(--accent-color);
}

.date.selected {
    background-color: var(--accent-color);
    color: #094e00;
}

.rect{
    width: 70%;
    height: 5px;
    border-radius: 1.5rem;
    background-color: rgb(232, 232, 232);
    overflow: hidden;
}

.fillrect{
    transition: all 0.3s ease-in-out;
}
</style>