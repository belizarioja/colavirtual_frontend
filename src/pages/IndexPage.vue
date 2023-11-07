<template>
  <q-page class="col" style="padding: 20px;">
    <div class="row">
        <span style="font-size: 24px;">Eventos activos</span>
    </div>
    <div class="row">
      <q-card
       v-for="item in rows" :key='item'
       class="my-card col-7"
       flat
       bordered
       style="margin: 20px;">
        <q-item>
          <q-item-section>
            <q-item-label>{{item.name}}</q-item-label>
            <q-item-label caption>
              {{item.descripcion}}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-card-section horizontal>
          <q-card-section style="width: 80%;height: 150px;">
            <div style="display: flex; justify-content: space-between;"><span>Inicio toma del número:</span><span style="font-weight: bold;">{{item.fechainicio}}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Fin toma del número:</span><span style="font-weight: bold;">{{item.fechafin}}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Inicio del evento:</span><span style="font-weight: bold;">{{item.fecha}}</span></div>
          </q-card-section>

          <q-separator vertical />

          <q-card-section class="col-4 flex flex-center"  style="display: grid;">
            <div v-if="item.numero" style=" margin-bottom: 10px;font-weight: 900;">Número asignado</div>
            <q-card
              v-if="item.numero"
              class="my-card"
            >
              <q-card-section>
                <div class="text-negative flex flex-center" style="font-size: 40px;font-weight: bold;">{{ item.numero }}</div>
              </q-card-section>
            </q-card>
            <q-btn
              v-else
              dense
              :disable="item.estatus === 'ABIERTO' ? false : true"
              :color="item.estatus === 'ABIERTO' ? 'info' : 'negative'"
              @click="tomarNumero(item.id)"
              :label="item.estatus"/>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'
import moment from 'moment'

const ENDPOINT_PATH_V2 = process.env.VUE_APP_ENDPOINT

export default defineComponent({
  name: 'IndexPage',
  data () {
    return {
      rows: []
    }
  },
  methods: {
    tomarNumero (id) {
      const data = {
        idevento: id,
        idusuario: sessionStorage.getItem('co_usuario'),
        fecha: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      console.log(data)
      axios.post(ENDPOINT_PATH_V2 + 'evento/obtenernumero', data).then(async response => {
        console.log(response.data)
        this.listar()
      })
    },
    listar () {
      const data = {
        idusuario: sessionStorage.getItem('co_usuario')
      }
      axios.post(ENDPOINT_PATH_V2 + 'evento/activos', data).then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.id = datos[i].id
          obj.name = datos[i].evento
          obj.descripcion = datos[i].descripcion
          obj.empresa = datos[i].empresa
          obj.numero = datos[i].numero
          obj.fecha = moment(datos[i].fecha).format('DD/MM/YYYY HH:mm')
          obj.fechainicio = moment(datos[i].fechainicio).format('DD/MM/YYYY HH:mm')
          obj.fechafin = moment(datos[i].fechafin).format('DD/MM/YYYY HH:mm')
          obj.estatus = datos[i].estatus > 0 ? 'ABIERTO' : 'CERRADO'
          obj.activo = datos[i].activo > 0 ? 'ACTIVO' : 'INACTIVO'
          this.rows.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Eventos ' + error)
      })
    }
  },
  mounted () {
    this.listar()
  }
})
</script>
