import axios from 'axios'
import { Module, VuexModule, Action } from 'vuex-module-decorators'
import store from '../plugins/vuex'
import { Role } from '../models'

@Module({ dynamic: true, store, name: 'RoleModule' })
export default class RoleModule extends VuexModule {

  @Action
  public async loadRoles() {
    const { personId, projectId } = this.context.getters.resolvePersonAndProject
    if (personId && projectId) {
      const response = await axios.get(`/persons/${personId}/projects/${projectId}/roles`)
      const roles = response.data.map((x: any) => Role.create(x))

      this.context.commit('upsertProjectRoles', {
        projectId,
        roles,
        clearFirst: true,
      })
    }
  }

  @Action
  public async createRole(role: Role) {
    const { personId, projectId } = this.context.getters.resolvePersonAndProject

    const response = await axios.post(`/persons/${personId}/projects/${projectId}/roles`, role)
    const createdRole = Role.create(response.data)

    this.context.commit('upsertProjectRoles', {
      projectId,
      roles: [createdRole],
    })
  }

  @Action
  public async updateRole(role: Role) {
    const { personId, projectId } = this.context.getters.resolvePersonAndProject

    const response = await axios.put(`/persons/${personId}/projects/${projectId}/roles/${role.id}`, role)
    const updatedRole = Role.create(response.data)

    this.context.commit('upsertProjectRoles', {
      projectId,
      roles: [updatedRole],
    })
  }

  @Action
  public async deleteRole(roleId: string) {
    const { personId, projectId } = this.context.getters.resolvePersonAndProject

    await axios.delete(`/persons/${personId}/projects/${projectId}/roles/${roleId}`)

    this.context.commit('removeProjectRole', {
      projectId,
      roleId,
    })
  }

}
