<template>
  <q-page class="col" style="padding: 20px;">
    <div class="row">
      <div class="col">
          <span class="row" style="font-size: 24px;">Empresas</span>
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
      />
    </div>
    <q-dialog v-model="modalcrear" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Empresa</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="crear" class="q-gutter-md">
            <q-input
              dense
              label="Ingrese Nombre de Empresa"
              v-model="empresa"
              autofocus
              :rules="[ val => val.length > 0 || 'Ingresar Nombre' ]"
            />
            <q-input
              dense
              v-model="correo"
              label="Ingrese Email"
              :rules="[ val => val.length > 0 || 'Ingresar EMAIL' ]"
            />
            <q-input
              dense
              v-model="telefono"
              label="Ingrese Teléfono de contacto"
              :rules="[ val => val.length > 0 || 'Ingresar TELÉFONO' ]"
            />
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
const ENDPOINT_PATH_V2 = process.env.VUE_APP_ENDPOINT

export default defineComponent({
  name: 'EventoPage',
  setup () {
    const columns = [
      { name: 'id', align: 'center', label: '#', field: 'id', sortable: true },
      {
        name: 'empresa',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
      },
      { name: 'correo', align: 'center', label: 'Correo', field: 'correo', sortable: true },
      { name: 'telefono', label: 'Teléfono', field: 'telefono', sortable: true }
    ]
    return {
      columns,
      btndisable: ref(true),
      empresa: ref(''),
      correo: ref(''),
      telefono: ref(''),
      modalcrear: ref(false)
    }
  },
  data () {
    return {
      rows: []
    }
  },
  methods: {
    openCrear () {
      this.limpiar()
      this.modalcrear = true
    },
    limpiar () {
      this.empresa = ''
      this.correo = ''
      this.telefono = ''
    },
    crear () {
      if (this.empresa.length === 0) {
        return
      }
      if (this.correo.length === 0) {
        return
      }
      if (this.telefono.length === 0) {
        return
      }
      const data = {
        empresa: this.empresa,
        correo: this.correo,
        telefono: this.telefono
      }
      console.log(data)
      axios.post(ENDPOINT_PATH_V2 + 'empresa', data).then(async response => {
        this.modalcrear = false
        console.log(response.data)
        this.limpiar()
        this.listar()
      })
    },
    listar () {
      this.btndisable = false
      axios.get(ENDPOINT_PATH_V2 + 'empresa').then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.id = datos[i].id
          obj.name = datos[i].empresa
          obj.correo = datos[i].correo
          obj.telefono = datos[i].telefono
          this.rows.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Empresas ' + error)
      })
    }
  },
  mounted () {
    this.listar()
  }
})
</script>
