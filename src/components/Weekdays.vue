<template>
    <div class="container">
        <swiper @slideChange="dateChange" class="swiper" ref="mySwiper" :options="swiperOption">
            <swiper-slide v-for="(date, index) in transformDates" 
                          :key="index">
                {{date}}
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
    export default {
        name: "Weekdays",
        data() {
            return {
                swiperOption: {
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    // grabCursor: true,
                    slideToClickedSlide: true,
                }
            }
        },
        methods: {
            dateChange() {
                let index = this.$refs.mySwiper.swiper.activeIndex
                this.$store.commit('setDishes', index)
            }
        },
        computed: {
            date() {
                return this.$store.getters.dates
            },
            transformDates() {
                const curentDates = []
                for (let i = 0; i < this.date.length; i++) {
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
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/scss/vars.scss";
    @import "../assets/scss/root.scss";

    .container {
        z-index: 300;
        position: sticky;
        top: 20px;
        height: auto;
    }

    .swiper {
        width: auto;
        padding-top: 20px;
        padding-bottom: 10px;
        cursor: pointer;

        &-slide {
            font-weight: 700;
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 150px !important;
            margin: 0 10px !important;
            height: 40px;
            background: white;
            color: $font-color;
            border-radius: 46px;
            opacity: 0.5;

            &-active {
                background: linear-gradient(90deg, #460B79 0%, #88267F 100%) !important;
                width: 150px !important;
                height: 40px;
                transition: 0.3s;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white !important;
                -webkit-text-fill-color: white !important;
                opacity: 1;
            }

            &-next, &-prev {
                opacity: 0.75;
            }
        }
    }

    @media (max-width: 790px) {
        .swiper {
            &-slide {
                width: 150px !important;

                &-active {
                    width: 150px !important;
                }
            }
        }
    }
    @media (max-width: 660px) {
        .swiper{
            padding: 0;
            &-slide{
                font-size: 12px;
                height: 30px;
                width: 100px !important;
                &-active{
                    height: 30px;
                    width: 100px !important;
                }
            }
        }
    }
    @media (max-width: 660px) {
        .swiper{
            padding: 0;
            &-slide{
                font-size: 12px;
                height: 30px;
                width: 100px !important;
                &-active{
                    height: 30px;
                    width: 100px !important;
                }
            }
        }
    }
</style>