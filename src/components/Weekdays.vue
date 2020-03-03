<template>
    <div class="container">
        <swiper @slideChange="dateChange" class="swiper" ref="mySwiper" :options="swiperOption">
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
                    effect: 'nonr'
                }
            }
        },
        methods:{
            dateChange() {
                let index = this.$refs.mySwiper.swiper.activeIndex
                this.$store.commit('setDishes',index)
            }
        },
        computed:{
            date() {
                return this.$store.getters.dates
            },
            transformDates(){
                const curentDates = []
                for (let i = 0; i < this.date.length; i++){
                    let options = {day: 'numeric', month: 'short'}
                    let date = new Date(this.date[i].date).toLocaleString("ru", options).replace(/(\d+) (\D+)/, '$2 $1').toUpperCase()
                    curentDates.push(date)
                    // !!! ЕСЛИ НАДО БУДЕТ СЕГОДНЯ КАК ПЕРВЫЙ ДЕНЬ
                    // if (i === 0){
                    //     curentDates.push('Сегодня')
                    // }
                    // else {
                    //     let options = {day: 'numeric', month: 'short'}
                    //     let date = new Date(this.dates[i].date).toLocaleString("ru", options).replace(/(\d+) (\D+)/, '$2 $1').toUpperCase()
                    //     curentDates.push(date)
                    // }
                }
                return curentDates
            },
            // curentDate() {
            //
            // }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/scss/vars.scss";
    @import "../assets/scss/root.scss";
    .swiper{
        width: auto;
        margin-top: 60px;
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
            background: $font-color;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            opacity: 0.5;
            &-active{
                background: $font-color !important;
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