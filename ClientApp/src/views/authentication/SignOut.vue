<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <h3
        class="headline"
        v-t="'account.signingOut'"
      />
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import UserModule from '../../store/users'

@Component
export default class SignOut extends Vue {
  private userModule = getModule(UserModule, this.$store)

  private async created() {
    await this.userModule.signOut()
    this.$router.replace({ name: 'signIn' })
  }
}
</script>
