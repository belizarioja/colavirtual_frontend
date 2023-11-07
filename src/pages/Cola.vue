<template>
  <q-page class="col" style="padding: 20px;">
    <div class="row">
      <div style="display: grid;">
        <span style="font-size: 24px;">Cola activa</span>
        <span style="font-size: 20px;">{{evento}}</span>
      </div>
    </div>
    <div class="row">
      <q-card
       v-if="rows.length === 0"
       class="my-card col-7"
       flat
       bordered
       style="margin: 20px;">
        <q-card-section class="col-4 flex flex-center"  style="display: grid;">
            <q-card
              class="my-card"
            >
              <q-card-section>
                <div class="text-negative flex flex-center" style="font-size: 30px;font-weight: bold;">No hay números disponibles</div>
              </q-card-section>
            </q-card>
        </q-card-section>
      </q-card>
      <q-card
       v-for="item in rows" :key='item'
       class="my-card col-7"
       flat
       bordered
       style="margin: 20px;">
        <q-item>
          <q-item-section>
            <q-item-label>{{item.nombre}}</q-item-label>
            <q-item-label caption>
              {{item.abrev}} {{item.documento}}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-card-section horizontal>
          <q-card-section style="width: 80%;height: 150px;">
            <div style="display: flex; justify-content: space-between;"><span>Correo:</span><span style="font-weight: bold;">{{item.correo}}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Teléfono:</span><span style="font-weight: bold;">{{item.telefono}}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Empresa:</span><span style="font-weight: bold;">{{item.empresa}}</span></div>
          </q-card-section>

          <q-separator vertical />

          <q-card-section class="col-4 flex flex-center"  style="display: grid;">
            <div v-if="item.numero" style=" margin-bottom: 10px;font-weight: 900;">Número actual</div>
            <q-card
              v-if="item.numero"
              class="my-card"
            >
              <q-card-section>
                <div class="text-negative flex flex-center" style="font-size: 40px;font-weight: bold;">{{ item.numero }}</div>
              </q-card-section>
            </q-card>
          </q-card-section>
        </q-card-section>
      </q-card>
      <div v-if="rows.length > 0" class="col-3" style="display: flex;align-items: end; margin-bottom: 20px;">
        <q-btn
          color="primary"
          label="SIGUIENTE"
          @click="mostrar" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const ENDPOINT_PATH_V2 = process.env.VUE_APP_ENDPOINT

export default defineComponent({
  name: 'IndexPage',
  data () {
    return {
      rows: [],
      evento: ''
    }
  },
  methods: {
    mostrar () {
      const data = {
        idevento: sessionStorage.getItem('co_evento')
      }
      axios.post(ENDPOINT_PATH_V2 + 'evento/obtenersiguiente', data).then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.id = datos[i].id
          obj.nombre = datos[i].nombre
          obj.abrev = datos[i].abrev
          obj.documento = datos[i].documento
          obj.empresa = datos[i].empresa
          this.evento = datos[i].evento
          obj.numero = datos[i].numero
          obj.correo = datos[i].correo
          obj.telefono = datos[i].telefono
          this.rows.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Eventos ' + error)
      })
    }
  },
  mounted () {
    this.mostrar()
  }
})
</script>
