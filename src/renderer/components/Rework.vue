<template>
    <div class="bg-blue">
        <div class="container">
            <header>
                <h1>Rework</h1>
                <router-link :to="{name:'home', params:{lineId:lineId}}" class="close">X</router-link>
            </header>
            <form class="big-form">
                <div class="form-group row">
                    <label class="col-sm-5 col-form-label">Line</label>
                    <div class="col-sm-7">
                        <span class="badge badge-secondary">{{lineSelected}}</span>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-sm-5 col-form-label">Jumlah Rework</label>
                    <div class="col-sm-7">
                        <NumberInputSpinner
                            :min="0"
                            :max="99"
                            :integerOnly="true"
                            v-model="counterMin"
                        />
                    </div>
                </div>
                <footer>
                    <button @click="updateRework(lineId, counterMin)" type="button" class="btn btn-lg btn-block btn-warning btn-big">SIMPAN</button>
                    <!--router-link :to="{name:'home', params:{lineId:lineId, reworkMinus:counterMin}}" class="btn btn-lg btn-block btn-warning btn-big">SIMPAN</router-link-->
                </footer>
            </form>
        </div>
    </div>
</template>
<script>
import devices from '@/assets/json/devices.json';
import NumberInputSpinner from 'vue-number-input-spinner';
// https://github.com/krystalcampioni/vue-number-input-spinner
export default {
    name: 'rework',
    data: () => ({
        lineId: 0,
        lineSelected : "Line 23",
        counterMin: 0
    }),
    mounted(){
        this.lineId = this.$route.params.lineId;
        var lines = devices.lines;
        for (var k in lines) {
            if (lines[k].id == this.lineId) {
                this.lineSelected = lines[k].label;
                this.lineId = lines[k].id;
            }
        }
    },
    components: {
        NumberInputSpinner,
    },
    methods : {
        updateRework: function(lineid, reworkCount){
            var lines = devices.lines;
            for (var k in lines) {
                if (lines[k].id == lineid) {
                    lines[k].counter = lines[k].counter - reworkCount;
                }
            }
            this.$router.push({ name: "home", params:{lineId:lineid}});
        },

    }
}
</script>
<style>
    #app {
        position: relative;
        padding: 0;
    }
    .bg-blue {
        background-color: #4161d8;
        color: #fff; 
        min-height: 200px;
    }
    header {
        position: relative;
        text-align: center;
        color: #e68910;
        padding: 3px 0;
    }
    header a.close {
        position: absolute;
        right: 0;
        top: 10px;
        color: red;
        text-shadow: none;
        font-size: 2rem;
        font-weight: bold;
    }
    .big-form {
        font-size: 3.7rem;
        font-weight: lighter;
    }
    .big-form label {
        /* line-height: 1; */
    }
    .big-form label,
    .big-form input {}
    .vnis {
        height: 5rem;
        margin: 20px 0;
    }
    .vnis button.vnis__button {
        margin-top: 10px;
        background: none;
        text-indent: -9999px;
    }
    .vnis button.vnis__button:hover, 
    .vnis button.vnis__button:visited {
        background: none;
    } 
    .vnis button.vnis__button:first-child {
        width: 0; 
        height: 0; 
        border-top: 45px solid transparent;
        border-bottom: 45px solid transparent;
        border-right:45px solid #fff; 
    }
    .vnis button.vnis__button:last-child {
        width: 0; 
        height: 0; 
        border-top: 45px solid transparent;
        border-bottom: 45px solid transparent;
        border-left: 45px solid #fff;
    }
    .vnis input {
        font-size: 7rem !important;
        border: none !important;
        height: 5rem !important;
        width: 7rem !important;
        background: none;
    }
    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
    }
    .btn-big {
        color: #fff;
        font-size: 3rem;
        border-radius: 0;
    }
</style>


