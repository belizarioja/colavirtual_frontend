<template>
  <q-page class="col" style="padding: 20px;">
    <div class="row">
      <div class="col">
          <span class="row" style="font-size: 24px;">Eventos</span>
          <q-btn
            style="margin: 20px;"
            color="primary"
            :disabled="btndisable"
            label="Crear (+)"
            @click="openCrear" />
      </div>
    </div>
    <div class="row">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="name"
        style="width: -webkit-fill-available;"
      >
        <template v-slot:body-cell-activo="props">
          <q-td :props="props">
            <div>
            <q-btn
             :color="props.row.activo === '1' ? 'primary' : 'negative'"
             :icon="props.row.estatus === '0' ? 'toggle_on' : 'toggle_off'"
             @click.stop="actualizar(props.row)" dense/>
          </div>
          </q-td>
        </template>
        <template v-slot:body-cell-cola="props">
          <q-td :props="props">
            <div>
              <q-btn
                color="primary"
                icon="receipt_long"
                @click="cola(props.row.id)" />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="modalcrear" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Evento</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="crear" class="q-gutter-md">
            <q-select
              dense
              class="col-md-3 col-sm-6 col-xs-12"
              filled
              options-dense
              v-model="modelEmpresa"
              :options="optionsEmpresa"
              option-label="name"
              option-value="id"
              label="Seleccione empresa"
              @update:model-value="changeEmpresa()"
            />
            <q-input
              dense
              filled
              label="Ingrese nombre del evento"
              v-model="evento"
              :rules="[ val => val.length > 0 || 'Ingresar evento' ]"
            />
            <q-input
              dense
              filled
              v-model="descripcion"
              label="Ingrese descripción del evento"
              :rules="[ val => val.length > 0 || 'Ingresar descripción' ]"
            />
            <div>Ingrese fecha del evento</div>
            <q-input filled v-model="fecha">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="fecha" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="fecha" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <div style="text-align: center;">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                color="primary"
                label="Aceptar"
                type="submit"
              />
            </div>
           </q-form>
          </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'
import moment from 'moment'

const ENDPOINT_PATH_V2 = process.env.VUE_APP_ENDPOINT

export default defineComponent({
  name: 'EventoPage',
  setup () {
    const columns = [
      { name: 'id', align: 'center', label: 'N°', field: 'id', sortable: true },
      {
        name: 'name',
        required: true,
        label: 'Evento',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: 'descripcion',
        required: true,
        label: 'Descripcion',
        align: 'left',
        field: row => row.descripcion,
        format: val => `${val}`,
        sortable: true
      },
      { name: 'fechainicio', align: 'center', label: 'Inicio Asignación', field: 'fechainicio', sortable: true },
      { name: 'fechafin', align: 'center', label: 'Fin de Asignación', field: 'fechafin', sortable: true },
      { name: 'fecha', align: 'center', label: 'Fecha de Evento', field: 'fecha', sortable: true },
      { name: 'empresa', label: 'Empresa', field: 'empresa', sortable: true },
      { name: 'estatus', label: 'Estatus', field: 'estatus', sortable: true },
      { name: 'activo', label: 'Activo', field: 'activo', sortable: true },
      { name: 'cola', label: 'Cola', field: 'cola' }
    ]
    return {
      columns,
      fecha: ref(moment().format('YYYY-MM-DD HH:mm')),
      btndisable: ref(true),
      empresa: ref(''),
      evento: ref(''),
      descripcion: ref(''),
      modalcrear: ref(false)
    }
  },
  data () {
    return {
      rows: [],
      optionsEmpresa: [],
      modelEmpresa: ''
    }
  },
  methods: {
    cola (id) {
      console.log(id)
      sessionStorage.setItem('co_evento', id)
      this.$router.push('/cola')
    },
    changeEmpresa () {
      this.idempresa = this.modelEmpresa.id
      this.empresa = this.modelEmpresa.name
    },
    openCrear () {
      this.limpiar()
      this.modalcrear = true
    },
    limpiar () {
      this.empresa = ''
      this.correo = ''
      this.telefono = ''
      this.modelEmpresa = ''
    },
    actualizar (item) {
      const data = {
        idevento: item.id,
        activo: item.activo === '1' ? 0 : 1
      }
      console.log(data)
      axios.post(ENDPOINT_PATH_V2 + 'evento/actualizar', data).then(async response => {
        this.listar()
      })
    },
    crear () {
      if (this.evento.length === 0) {
        return
      }
      if (this.descripcion.length === 0) {
        return
      }
      const data = {
        idempresa: this.idempresa,
        evento: this.evento,
        descripcion: this.descripcion,
        fecha: this.fecha
      }
      console.log(data)
      axios.post(ENDPOINT_PATH_V2 + 'evento', data).then(async response => {
        this.modalcrear = false
        console.log(response.data)
        this.limpiar()
        this.listar()
      })
    },
    listarEmpresas () {
      axios.get(ENDPOINT_PATH_V2 + 'empresa').then(async response => {
        const datos = response.data.resp
        this.optionsEmpresa = []
        for (const i in datos) {
          const obj = {}
          obj.id = datos[i].id
          obj.name = datos[i].empresa
          this.optionsEmpresa.push(obj)
        }
        console.log(this.optionsEmpresa)
      }).catch(error => {
        Notify.create('Problemas al listar Empresas ' + error)
      })
    },
    listar () {
      this.btndisable = false
      axios.get(ENDPOINT_PATH_V2 + 'evento').then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.id = datos[i].id
          obj.name = datos[i].evento
          obj.descripcion = datos[i].descripcion
          obj.empresa = datos[i].empresa
          obj.fecha = moment(datos[i].fecha).format('DD/MM/YYYY HH:mm')
          obj.fechainicio = moment(datos[i].fechainicio).format('DD/MM/YYYY HH:mm')
          obj.fechafin = moment(datos[i].fechafin).format('DD/MM/YYYY HH:mm')

          obj.estatus = datos[i].estatus > 0 ? 'ABIERTO' : 'CERRADO'
          obj.activo = datos[i].activo
          this.rows.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Eventos ' + error)
      })
    }
  },
  mounted () {
    this.listarEmpresas()
    this.listar()
  }
})
</script>
