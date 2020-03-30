<template>
    <div class="container-week">
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
                console.log("weeks")
                this.$store.commit('setDishes', index)
                let menu = this.date;
                let cart = this.$store.getters.getCart;
                // console.log(cart, menu);
                for (let i = 0; i < cart.length; i++) {
                    // console.log(cart[i].id);
                    if (cart[i].id == menu[index].id) {
                        // console.log(i);
                        this.$store.commit("SET_CART", i);
                    }
                }
                
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

    .container-week {
        z-index: 10;
        position: sticky;
        top: 20px;
        height: auto;
        margin-bottom: 10px;
    }

    .swiper {
        width: auto;
        padding-top: 45px;
        padding-bottom: 10px;
        cursor: pointer;
        margin-left: -10px;

        &-slide {
            font-weight: 700;
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 150px !important;
            height: 40px;
            background: linear-gradient(90deg, #460B79 0%, #88267F 100%);
            color: white;
            border-radius: 46px;
            opacity: 0.5;
            margin: 0 10px !important;

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
            padding-top: 20px;
            margin-top: 40px;

            &-slide {
                width: 150px !important;

                &-active {
                    width: 150px !important;
                }
            }
        }
    }

    @media (max-width: 660px) {
        .swiper {
            padding: 0;

            &-slide {
                font-size: 12px;
                height: 30px;
                width: 100px !important;

                &-active {
                    height: 30px;
                    width: 100px !important;
                }
            }
        }
    }

    @media (max-width: 660px) {
        .swiper {
            padding: 0;

            &-slide {
                font-size: 12px;
                height: 30px;
                width: 100px !important;

                &-active {
                    height: 30px;
                    width: 100px !important;
                }
            }
        }
    }
</style>
