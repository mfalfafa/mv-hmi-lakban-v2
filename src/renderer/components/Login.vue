<template>
    <div class="container">
      <div class="row">
        <div class="col-sm-6">
          <div class="brand-logo"></div>
        </div>
        <div class="col-sm-6 text-right">
          <br/>
          <span class="border border-primary" style="padding: 10px; background:#fff;">HMI COOLING &amp; CUTTING</span>
        </div>
      </div>
      <div class="col-sm-6 offset-sm-3">
        <br/>
        <div class="form-signin">
          <div v-if="$store.state.Login.userid === 0">
            <h1 class="h3 mb-3 font-weight-normal text-center">Login</h1>
            <div class="form-group">
              <label for="rfid">RFID</label>
              <input type="text" id="rfid" class="form-control" v-model="user" @keyup.enter="postLogin()" v-focus="selFocus">
              <small class="form-text">Tap kartu anda</small>
            </div>
            <div class="form-group">
              <br/><br/>
            </div>
            <button class="btn btn-warning btn-block" @click="selFocus = !selFocus">SIGN IN</button>
          </div>
          <div v-if="$store.state.Login.userid !== 0">
            <h1 class="h3 mb-3 font-weight-normal text-center">Berhasil login</h1>
            <router-link :class="['btn-machine', 'btn', 'btn-outline-primary', 'btn-sm']" to="/downtimepage">Tekan untuk melanjutkan</router-link>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <br/><br/><br/><br/>
          <span class="copyright">&copy;MachineVision2018</span>
        </div>
        <div class="col-sm-6 text-right">
          
        </div>
      </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { focus } from 'vue-focus'
    import konfigur from '@/assets/json/konfigurasi.json'

    axios.defaults.baseURL = konfigur.webserviceurl
    axios.defaults.headers = {'Access-Control-Allow-Origin': '*'}

    export default {
      name: 'login',
      directives: { focus: focus },
      data: () => ({
        user: '',
        selFocus: true
      }),
      beforeMount () {
        this.$store.commit('setOffLogin')
        this.$store.commit('updateMachines',konfigur.machines)
        axios.get('/devices/loadreason').then(ress => {
          let reas = {
            mainreason: ress.data.mainreason,
            subreason: ress.data.subreason
          }
          this.$store.commit('updateReason',reas)
        }).catch(error => {
          console.log('error get reason', error.response.data)
        })
      },
      methods: {
        postLogin: function () {
          axios.post('/device/loginrfid', {rfid: this.user}).then(ress => {
            this.$store.commit('updateLogin', {userid: ress.data.userid, role: ress.data.role, username: ress.data.username})
          }).catch(error => {
            console.log('login gagal', error.response.data)
            this.user = ''
          })
        },
        enterData: function () {
          console.log(this.user)
        },
        loadStart: function(){
          this.$store.commit('updateMachines',konfigur.machines)
        }
      }
    }
</script>
