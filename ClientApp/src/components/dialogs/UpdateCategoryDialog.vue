<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" text v-t="'core.edit'" @click="opened" />
    </template>
    <v-card>
      <v-form v-model="valid" ref="form">
        <v-toolbar flat color="accent">
          <v-toolbar-title v-t="'shift.category.update'" />
          <v-spacer />
          <v-btn icon class="mr-0" @click="showHelp = !showHelp">
            <v-icon v-if="showHelp">help_outline</v-icon>
            <v-icon v-else>help</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text v-if="showHelp">
          <i class="subtitle-1" v-t="'shift.category.updateDescription'" />
        </v-card-text>

        <v-card-text class="pa-2">
          <NameControl :model="nameModel" translationPath="shift.category.nameDescription" />
        </v-card-text>

        <v-divider />

        <EligibilityControl
          v-for="(eligibility, index) in category.eligibilities"
          :key="index"
          :eligibility="eligibility"
          :showDescription="showHelp"
        />

        <v-divider />

        <v-card-actions>
          <v-btn text v-t="'core.cancel'" @click.stop="dialog = false" />
          <v-spacer />
          <DeleteCategoryDialog :category="category" />
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
import CategoryModule from '../../store/categories'
import { Role, Category, Eligibility } from '../../models'
import DeleteCategoryDialog from './DeleteCategoryDialog.vue'
import NameControl from '../controls/NameControl.vue'
import EligibilityControl from '../controls/EligibilityControl.vue'

@Component({
  components: {
    DeleteCategoryDialog,
    NameControl,
    EligibilityControl,
  },
})
export default class UpdateCategoryDialog extends Vue {
  private categoryModule = getModule(CategoryModule, this.$store)

  @Prop(Category)
  private readonly category?: Category

  private dialog = false
  private valid: any = null
  private loading = false
  private showHelp = false

  private nameModel = { value: '' }

  private opened() {
    this.nameModel = { value: this.category?.name || '' }

    if (this.category) {
      this.category.eligibilities.forEach(x => (x.category = undefined))
    }
  }

  private async save() {
    if (this.valid && this.category) {
      this.loading = true

      this.category.name = this.nameModel.value

      await this.categoryModule.updateCategory(this.category)

      this.loading = false
      this.dialog = false
    }
  }
}
</script>
