<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" text v-t="'core.edit'" @click="opened" />
    </template>
    <v-card>
      <v-form ref="form" v-model="valid">
        <v-toolbar flat color="accent">
          <v-toolbar-title v-t="'project.role.update'" />
          <v-spacer />
          <v-btn icon class="mr-0" @click="showHelp = !showHelp">
            <v-icon v-if="showHelp">help_outline</v-icon>
            <v-icon v-else>help</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text v-if="showHelp">
          <i class="subtitle-1" v-t="'project.role.updateDescription'" />
        </v-card-text>
        <v-card-text class="pa-2">
          <NameControl :model="nameModel" translationPath="project.role.nameDescription" />
        </v-card-text>
        <div v-if="role.editable">
          <v-divider />
          <v-card-text class="pa-2">
            <v-layout wrap>
              <v-divider />

              <PermissionControl
                :model="calendarModel"
                translationPath="project.role.calendar"
                :showDescription="showHelp"
                @change="(value) => role.setPermissionModel('calendar', value)"
              />

              <PermissionControl
                :model="settingsModel"
                translationPath="project.role.settings"
                :showDescription="showHelp"
                @change="(value) => role.setPermissionModel('settings', value)"
              />

              <PermissionControl
                :model="rolesModel"
                translationPath="project.role.roles"
                :showDescription="showHelp"
                @change="(value) => role.setPermissionModel('roles', value)"
              />

              <PermissionControl
                :model="participantsModel"
                translationPath="project.role.participants"
                :showDescription="showHelp"
                @change="(value) => role.setPermissionModel('participants', value)"
              />

              <PermissionControl
                :model="knowledgeBaseModel"
                translationPath="project.role.knowledgeBase"
                :showDescription="showHelp"
                @change="(value) => role.setPermissionModel('knowledgeBase', value)"
              />
            </v-layout>
          </v-card-text>
        </div>

        <v-divider />

        <EligibilityControl
          v-for="(eligibility, index) in eligibilities"
          :key="index"
          :eligibility="eligibility"
          :showDescription="showHelp"
        />

        <v-divider />

        <v-card-actions>
          <v-btn text v-t="'core.cancel'" @click.stop="dialog = false" />
          <DeleteRoleDialog v-if="canBeDeleted && role.editable" :roleId="role.id" />
          <v-spacer />
          <v-btn
            text
            type="submit"
            color="primary"
            v-t="'core.save'"
            :loading="loading"
            :disabled="!valid"
            @click.prevent="save"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import i18n from '../../i18n'
import PersonModule from '../../store/persons'
import RoleModule from '../../store/roles'
import { Role } from '../../models'
import DeleteRoleDialog from './DeleteRoleDialog.vue'
import NameControl from '../controls/NameControl.vue'
import PermissionControl from '../controls/PermissionControl.vue'
import EligibilityControl from '../controls/EligibilityControl.vue'

@Component({
  components: {
    DeleteRoleDialog,
    NameControl,
    PermissionControl,
    EligibilityControl,
  },
})
export default class UpdateRoleDialog extends Vue {
  private personModule = getModule(PersonModule, this.$store)
  private roleModule = getModule(RoleModule, this.$store)

  @Prop(Object)
  private readonly role?: Role

  @Prop(Boolean)
  private readonly canBeDeleted?: boolean

  private dialog = false
  private valid: any = null
  private loading = false
  private showHelp = false

  private nameModel = { value: '' }
  private calendarModel = { value: 'none' }
  private settingsModel = { value: 'none' }
  private rolesModel = { value: 'none' }
  private participantsModel = { value: 'none' }
  private knowledgeBaseModel = { value: 'none' }
  private eligibilities: any[] = []

  private opened() {
    if (this.role) {
      this.nameModel = { value: this.role.name }

      if (this.role.editable) {
        this.calendarModel = this.role.getPermissionModel('calendar')
        this.settingsModel = this.role.getPermissionModel('settings')
        this.rolesModel = this.role.getPermissionModel('roles')
        this.participantsModel = this.role.getPermissionModel('participants')
        this.knowledgeBaseModel = this.role.getPermissionModel('knowledgeBase')

        this.eligibilities = [...this.role.eligibilities]
      }
    }
  }

  private async save() {
    if (this.valid && this.role) {
      this.loading = true

      this.role.name = this.nameModel.value
      this.role.eligibilities = this.eligibilities

      await this.roleModule.updateRole(this.role)

      this.loading = false
      this.dialog = false
    }
  }
}
</script>
