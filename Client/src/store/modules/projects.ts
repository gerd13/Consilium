import axios from '@/tools/axios'
import { Module, VuexModule, Mutation, Action, MutationAction } from 'vuex-module-decorators'
import { Project } from '@/models/definitions'

@Module({ name: 'ProjectModule' })
export default class ProjectModule extends VuexModule {
  public projects: Project[] = []

  public get myProjects(): Project[] {
    return this.projects
  }

  @MutationAction({ mutate: ['projects'] })
  public async fetchProjects() {
    const response = await axios.get('/projects')
    return { projects: response.data }
  }

  @Action({ commit: 'setNameAndEmail' })
  public async updateProjectGeneral(project: Project) {
    await axios.put(`/projects/${project.id}`, {
      name: project.name,
      email: project.email
    })
    return project
  }

  @Action({ commit: 'insertProject' })
  public async createProject(project: Project): Promise<Project> {
    const response = await axios.post(`/projects`, {
      name: project.name,
      email: project.email
    })
    return response.data
  }

  @Action({ commit: 'removeProject' })
  public async deleteProject(projectId: string) {
    await axios.delete(`/projects/${projectId}`)
    return projectId
  }

  @Mutation
  public setNameAndEmail(project: Project) {
    this.projects = this.projects.map((x: Project) => {
      if (x.id === project.id) {
        x.name = project.name
        x.email = project.email
      }
      return x
    })
  }

  @Mutation
  public insertProject(project: Project) {
    this.projects.push(project)
  }

  @Mutation
  public removeProject(projectId: string) {
    this.projects = this.projects.filter((x: Project) => x.id !== projectId)
  }

}
