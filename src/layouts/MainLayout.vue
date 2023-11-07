<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          {{ nombreusuario }}
        </q-toolbar-title>
        <div>{{ rolusuario }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="drawer"
        show-if-above

        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"

        :width="230"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
      >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding>
            <q-item clickable v-ripple @click="listado" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="dashboard" />
              </q-item-section>
              <q-item-section>
                <div>Principal</div>
              </q-item-section>
            </q-item>
            <q-item v-if="idrol === '1'" clickable v-ripple @click="eventos" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="event" />
              </q-item-section>
              <q-item-section>
                <div>Eventos</div>
              </q-item-section>
            </q-item>
            <q-item v-if="idrol === '1'" clickable v-ripple @click="empresas" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="factory" />
              </q-item-section>
              <q-item-section>
                <div>Empresas</div>
              </q-item-section>
            </q-item>
            <q-item v-if="idrol === '1'" clickable v-ripple @click="listado" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="bookmark_remove" />
              </q-item-section>
              <q-item-section>
                <div>Reportes</div>
              </q-item-section>
            </q-item>
            <q-item v-if="idrol === '1'" clickable v-ripple @click="usuarios" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="manage_accounts" />
              </q-item-section>
              <q-item-section>
                <div>Usuarios</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="salir" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="logout" />
              </q-item-section>
              <q-item-section>
                <div>Salir</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false)
    const nombreusuario = ref(sessionStorage.getItem('tx_nombre'))
    const rolusuario = ref(sessionStorage.getItem('tx_rol'))
    const idrol = ref(sessionStorage.getItem('co_rol'))

    return {
      idrol,
      nombreusuario,
      leftDrawerOpen,
      rolusuario,
      drawer: ref(false),
      miniState: ref(true),
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  methods: {
    listado () {
      this.$router.push('/principal')
    },
    reportes () {
      this.$router.push('/usuarios')
    },
    eventos () {
      this.$router.push('/eventos')
    },
    empresas () {
      this.$router.push('/empresas')
    },
    usuarios () {
      this.$router.push('/usuarios')
    },
    salir () {
      this.$q.dialog({
        title: 'Confirmación!',
        message: '¿Está seguro que quieres cerrar sesión?',
        ok: {
          color: 'primary',
          label: 'Sí'
        },
        cancel: {
          color: 'secondary',
          label: 'No'
        },
        persistent: true
      }).onOk(() => {
        sessionStorage.removeItem('tx_rol')
        sessionStorage.removeItem('tx_nombre')
        sessionStorage.removeItem('tx_usuario')
        sessionStorage.removeItem('co_rol')
        this.$router.push('/')
      })
    }
  },
  mounted () {
    // this.consultarSaldo()
  }
})
</script>
