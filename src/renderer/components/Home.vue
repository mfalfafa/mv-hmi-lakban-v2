<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-8">
                <h2 class="text-danger">
                    <span class="time">
                        {{time}}
                    </span>
                    <!--span class="separator">|</span>
                    <span class="shift">{{shift}}</span-->
                </h2>
                <div class="alert custom-alert">
                    <div class="row">
                        <div class="col-sm-6 text-center">Line</div>
                        <div class="col-sm-6 text-center">Total</div>
                    </div>
                </div>
                <br/>
                <div v-for="line in lines" :key="line.id" class="row">
                    <div class="col-sm-6">
                        <button @click="selectLine(line)" type="button" class="btn btn-lg btn-block btn-outline-primary" v-bind:class="{ active : btnActive == line.id }">{{line.label}}</button>
                        <br>
                    </div>
                    <div class="col-sm-6">
                        <button type="button" class="btn btn-lg btn-block btn-outline-secondary" v-bind:class="{ active : btnActive == line.id }">{{line.counter}}</button>
                        <br>
                    </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="alert alert-white text-center" style="margin-top:5px;">
                    <!--h3 @click="reloadPage()">HMI Lakban</h3-->
                    <h3>HMI Lakban</h3>
                </div>
                <!-- <router-link :to="{name:'rework', params:{lineId:btnActive}}" class="btn-rework">R<br/>E<br/>W<br/>O<br/>R<br/>K</router-link> -->
                <b-btn class="btn-rework" v-b-modal.modalRework>R<br/>E<br/>W<br/>O<br/>R<br/>K</b-btn>
            </div>
        </div>
        <!-- Modal Rework -->
        <b-modal 
            id="modalRework" 
            ref="modalRework"
            size="custom" 
            :hide-footer="true"
            title="Rework"
            title-tag="h1"
            modal-class="reworkmod">
            <div class="container">
                <form class="form-horizontal" @submit.stop.prevent="submitRework">
                    <div class="form-group row">
                        <label class="col-sm-5 col-form-label">Line</label>
                        <div class="col-sm-7">
                            <span class="badge badge-secondary">{{lineSelectedLabel}}</span>
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
                        <b-button type="submit" variant="btn btn-lg btn-block btn-warning">SIMPAN</b-button>
                    </footer>
                </form>
            </div>
        </b-modal>
        <!-- End modal Rework -->
    </div>
</template>
<script>
import devices from '@/assets/json/devices.json';
import NumberInputSpinner from 'vue-number-input-spinner';

var defaultBtnActive = 0;
var lines_=0;
var first_run=0;

export default {
    name: 'home',
    data: () => ({
        lines: devices.lines,
        time: "00:00",
        date: "",
        shift: "Shift 1",
        btnActive:defaultBtnActive,
        counterMin: 0,
        lineSelectedLabel:"Pilih Line"
    }),
    components: {
        NumberInputSpinner,
    },
    created(){
        var hmi = this;
        var lines = hmi.lines;
        lines_=lines;
        
        // setInterval(function(){
        //     hmi.sendSocket(lines);
        // }, 1000);

        //defaultBtnActive = 0;
        // if (this.$route.params.lineId) {
            // defaultBtnActive = this.$route.params.lineId;
        // }
        this.$electron.ipcRenderer.on('sendlakban',function(err, data){
            for (var k in lines) {
                if (lines[k].id == defaultBtnActive) {
                    lines[k].counter++;
                }
            }
        })

        this.$electron.ipcRenderer.on('gantishift',function(err, data){
            for (var k in lines) {
                lines[k].counter = 0;
            }
        })

        setInterval(function(){
            var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            var cd = new Date();
            hmi.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2);
            //hmi.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
            hmi.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth()+1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];
            function zeroPadding(num, digit) {
                var zero = '';
                for(var i = 0; i < digit; i++) {
                    zero += '0';
                }
                return (zero + num).slice(-digit);
            }
        },1000)
    },
    methods : {
        selectLine: function(e){
            defaultBtnActive = e.id;
            this.btnActive = defaultBtnActive;
            this.lineSelectedLabel = e.label;
        },
        // sendSocket(data){
        //     this.$socket.emit('datalakban', data);
        // },
        submitRework(){
            var lines = devices.lines;
            for (var k in lines) {
                if (lines[k].id == this.btnActive) {
                    console.log('lineid : '+lines[k].id);
                    console.log('before : '+lines[k].counter);
                    lines[k].counter = lines[k].counter - this.counterMin;
                    console.log('minus : '+this.counterMin);
                    console.log('after : '+lines[k].counter);
                }
            }
            this.$refs.modalRework.hide();
        },
        reloadPage: function(){
            location.reload();
        }
    },
    beforeMount(){
        // For sending data every second through socket protocolSSSSSS
        var net = require('net');

        var client = new net.Socket();
        client.setTimeout(3000);

        // for Ready flag
        var f=0; 

        function connect_(){
            // Server IP and Port configuration
            if(f==0){
                try{
                    client.connect(5000, '192.168.10.250', function() {
                        console.log('Connected');
                        f=1;
                    });
                }catch(err){
                    console.log("Can't connect to server!");
                    client.destroy();
                    f=0;
                }
            }
        }

        if(first_run==0){
            // Connect for the first time to server
            connect_();
            first_run=1;
        }else if((first_run==1) && (f==0)){
            // Trying to reconnect if not connected to server
            connect_();
        }

        // Send data every second (if connected to the server)
        // If not connect to the server, then there is no delay time
        setInterval(function send_(){
            if(f==1){
                // console.log(lines_);
                var all_data=''
                for (var k in lines_) {
                    all_data=all_data + '@'+ lines_[k].label.toString() +'@'+ lines_[k].counter.toString() + '@' 
                }
                try{
                    client.write(all_data);
                }catch(err){
                    // If error while sending a data or disconnected from server
                    console.log("Error while sending datalakban!");
                    client.destroy();
                    f=0;
                    // Trying to reconnect
                    // connect_();
                }
            }else if(f==0){
                console.log("Client is not connected!!!");
                client.destroy();
            }
        }, 1000);

        client.on('error', function(err){
            console.log('There is an error in net socket!');
            console.log(err.toString());
            client.destroy();
            f=0;
        });

        // Add timeout if there is 
        client.on('data', function(data) {
          console.log('Received: ' + data);
          if(data=='ack'){
            try{
                client.write('ok')
                client.destroy(); // kill client after server's response
            }catch(err){
                console.log("Error in writing ack!");
                client.destroy();
            }
            f=0;
          }
        });

        client.on('timeout', function(){
            console.log('Client timeout!');
            // client.destroy();
        });

        client.on('close', function() {
          console.log('Connection closed');
          f=0;
          connect_();
        });
    }
}
</script>
<style>
.reworkmod {}
.reworkmod .modal-dialog {}
.reworkmod .modal-dialog.modal-custom {}
.reworkmod .modal-dialog .modal-content {
    background-color: #4161d8;
    color: #fff; 
    border-radius: 0;
}
.reworkmod .modal-dialog .modal-content .modal-header {
    text-align: center;
    color: #e68910;
}
.reworkmod .modal-dialog .modal-content .modal-header h1 {}
.reworkmod .modal-dialog .modal-content .modal-header button.close {
    color: red;
    text-shadow: none;
    font-size: 3rem;
    font-weight: bold;
}
.reworkmod .modal-dialog .modal-content .modal-body {}
.reworkmod .form-group {
    font-size: 2rem;
}

.vnis {
    height: 3rem;
    margin: 20px 0;
}
.vnis button.vnis__button {
    margin-top: 15px;
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
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-right:20px solid #fff; 
}
.vnis button.vnis__button:last-child {
    width: 0; 
    height: 0; 
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 20px solid #fff;
}
.vnis input {
    font-size: 3rem !important;
    border: none !important;
    height: 3rem !important;
    width: 4rem !important;
    background: none;
}
</style>

