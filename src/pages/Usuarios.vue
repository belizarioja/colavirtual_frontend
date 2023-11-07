<template>
  <q-page class="col" style="padding: 20px;">
    <div class="row">
      <div class="col">
          <span class="row" style="font-size: 24px;">Usuarios</span>
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
        class="col"
        :rows="rows"
        :columns="columns"
        row-key="id"
      />
    </div>
    <q-dialog v-model="modalcrear" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Empresa</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="crear" class="q-gutter-md">
            <div class="row">
              <div class="col-12">
                <q-input
                  dense
                  label="Ingrese nombre completo"
                  v-model="nombre"
                  autofocus
                  :rules="[ val => val.length > 0 || 'Ingresar nombre' ]"
                />
              </div>
              <div class="col-6">
                <q-input
                  dense
                  label="Ingrese usuario"
                  v-model="usuario"
                  :rules="[ val => val.length > 0 || 'Ingresar usuario' ]"
                  style="margin-right: 20px;"
                />
              </div>
              <div class="col-6">
                <q-input
                  dense
                  label="Ingrese clave"
                  v-model="clave"
                  :rules="[ val => val.length > 0 || 'Ingresar clave' ]"
                />
              </div>
              <div class="col-6">
                <q-select
                  dense
                  filled
                  options-dense
                  v-model="modelroles"
                  :options="optionsroles"
                  option-label="name"
                  option-value="id"
                  label="Seleccione rol"
                  style="margin-right: 20px;"
                />
              </div>
              <div class="col-6">
                <q-input
                  dense
                  v-model="telefono"
                  label="Ingrese Teléfono de contacto"
                  :rules="[ val => val.length > 0 || 'Ingresar TELÉFONO' ]"
                />
              </div>
              <div class="col-6">
                <q-select
                  dense
                  filled
                  options-dense
                  v-model="modeltipos"
                  :options="optionstipos"
                  option-label="tipodocumento"
                  option-value="id"
                  label="Seleccione tipo documento"
                  style="margin-right: 20px;"
                />
              </div>
              <div class="col-6">
                <q-input
                  dense
                  v-model="documento"
                  label="Ingrese Documento"
                  :rules="[ val => val.length > 0 || 'Ingresar EMAIL' ]"
                />
              </div>
              <div class="col-6">
                <q-input
                  dense
                  v-model="correo"
                  label="Ingrese Email"
                  :rules="[ val => val.length > 0 || 'Ingresar EMAIL' ]"
                  style="margin-right: 20px;"
                />
              </div>
              <div class="col-6">
                <q-input
                  dense
                  v-model="direccion"
                  label="Ingrese dirección habitación"
                  :rules="[ val => val.length > 0 || 'Ingresar DIRECCIÓN' ]"
                />
              </div>
            </div>
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
        name: 'nombre',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: row => row.nombre,
        format: val => `${val}`,
        sortable: true
      },
      { name: 'usuario', align: 'center', label: 'Usuario', field: 'usuario', sortable: true },
      { name: 'clave', align: 'center', label: 'Clave', field: 'clave', sortable: true },
      { name: 'rol', align: 'center', label: 'Rol', field: 'rol', sortable: true },
      { name: 'direccion', align: 'center', label: 'Dirección', field: 'direccion', sortable: true },
      { name: 'correo', align: 'center', label: 'Correo', field: 'correo', sortable: true },
      { name: 'telefono', label: 'Teléfono', field: 'telefono', sortable: true }
    ]
    return {
      columns,
      btndisable: ref(true),
      modelroles: ref(''),
      modeltipos: ref(''),
      optionsroles: ref([]),
      optionstipos: ref([]),
      nombre: ref(''),
      usuario: ref(''),
      clave: ref(''),
      direccion: ref(''),
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
      this.nombre = ''
      this.correo = ''
      this.telefono = ''
      this.usuario = ''
      this.clave = ''
    },
    crear () {
      if (this.usuario.length === 0) {
        return
      }
      if (this.clave.length === 0) {
        return
      }
      if (this.nombre.length === 0) {
        return
      }
      if (this.correo.length === 0) {
        return
      }
      const data = {
        nombre: this.nombre,
        usuario: this.usuario,
        clave: this.clave,
        direccion: this.direccion,
        correo: this.correo,
        telefono: this.telefono,
        idrol: this.modelroles.id,
        iddocumento: this.modeltipos.id,
        documento: this.documento
      }
      console.log(data)
      axios.post(ENDPOINT_PATH_V2 + 'usuario/crear', data).then(async response => {
        this.modalcrear = false
        this.limpiar()
        this.listar()
      })
    },
    listar () {
      this.btndisable = false
      axios.get(ENDPOINT_PATH_V2 + 'usuario').then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.id = datos[i].id
          obj.nombre = datos[i].nombre
          obj.usuario = datos[i].usuario
          obj.clave = datos[i].clave
          obj.correo = datos[i].correo
          obj.telefono = datos[i].telefono
          obj.direccion = datos[i].direccion
          obj.rol = datos[i].rol
          obj.idrol = datos[i].idrol
          this.rows.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Usuarios ' + error)
      })
    },
    listarRoles () {
      this.btndisable = false
      axios.get(ENDPOINT_PATH_V2 + 'usuario/roles').then(async response => {
        const datos = response.data.resp
        this.optionsroles = []
        for (const i in datos) {
          const obj = {}
          obj.id = datos[i].id
          obj.name = datos[i].rol
          this.optionsroles.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Roles ' + error)
      })
    },
    listarTipos () {
      this.btndisable = false
      axios.get(ENDPOINT_PATH_V2 + 'usuario/tipos').then(async response => {
        const datos = response.data.resp
        this.optionstipos = []
        for (const i in datos) {
          const obj = {}
          obj.id = datos[i].id
          obj.tipodocumento = datos[i].tipodocumento
          obj.abrev = datos[i].abrev
          this.optionstipos.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Roles ' + error)
      })
    }
  },
  mounted () {
    this.listarTipos()
    this.listarRoles()
    this.listar()
  }
})
</script>
