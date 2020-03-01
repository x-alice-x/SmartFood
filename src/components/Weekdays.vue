<template>
    <div class="container">
        <swiper @click="qwe" class="swiper" ref="mySwiper" :options="swiperOption">
            <swiper-slide v-for="(date, index) in transformDates" :key="index">
                {{date}}
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
export default {
    name: "Weekdays",
    data() {
        return{
            swiperOption: {
                slidesPerView: 'auto',
                centeredSlides: true,
                grabCursor: true,
                slideToClickedSlide: true,
            }
        }
    },
    methods:{
        qwe() {
            //
            // let date = 'ФЕВ'
            // console.log(date.replace(/(\D+)/, '$1. '))
        }
    },
    computed:{
        dates() {
            return this.$store.getters.allDishes
        },
        transformDates(){
            const curentDates = []
            for (let i = 0; i < this.dates.length; i++){
                if (i === 0){
                    curentDates.push('Сегодня')
                }
                else {
                    let options = {day: 'numeric', month: 'short'}
                    let date = new Date(this.dates[i].date).toLocaleString("ru", options).replace(/(\d+) (\D+)/, '$2 $1').toUpperCase()
                    curentDates.push(date)
                }
            }
            return curentDates
        }
    }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/vars.scss";
@import "../assets/scss/root.scss";
.swiper{
    width: auto;
    margin-top: 110px;
    margin-left: 5px;
    &-slide{
        font-weight: 700;
        font-size: 24px;
        line-height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px !important;
        margin-right: 0px !important;
        height: 50px;
        background: $c-main;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        opacity: 0.5;
        &-active{
            background: $c-main !important;
            width: 200px !important;
            margin-right: 0px !important;
            height: 50px;
            border-radius: 46px;
            transition: 0.3s;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white !important;
            -webkit-text-fill-color: white !important;
        }
        &-active,&-next,&-prev{
            opacity: 1 !important;
        }
    }
}
</style>