import axios from 'axios'
import { Module, VuexModule, Action, Mutation, MutationAction } from 'vuex-module-decorators'
import { Person, Gender } from '@/models/definitions'

@Module({ name: 'PersonModule' })
export default class PersonModule extends VuexModule {
  public activePersonId: string | null = null
  public persons: Person[] = []

  public get getPersons(): Person[] {
    return this.persons
  }

  public get getActivePerson(): Person | undefined {
    return this.persons.find((x) => x.id === this.activePersonId)
 }

  @Action
  public async initPersonModule() {
    const response = await axios.get('/persons')

    if (response.data && response.data.length > 0) {
      const currentlyActivePerson = this.persons.find((x) => x.id === this.activePersonId)

      const persons = response.data.map((data: Person) => {
        return new Person(
          data.id,
          data.firstname,
          data.lastname,
          data.gender,
        )
      })

      this.context.commit('setPersons', persons)

      if (currentlyActivePerson && persons.includes(currentlyActivePerson)) {
        this.context.dispatch('activatePerson', currentlyActivePerson.id)
      } else {
        this.context.dispatch('activatePerson', persons[0].id)
      }
    }
  }

  @Action
  public async clearPersons() {
    this.context.commit('setPersons', [])
    this.context.dispatch('activatePerson', null)
  }

  @Action
  public async createPerson(person: { firstname: string, lastname: string }) {
    const response = await axios.post('/persons', {
      firstname: person.firstname,
      lastname: person.lastname,
      gender: Gender.Male,
    })

    const newPerson = new Person(
      response.data.id,
      response.data.firstname,
      response.data.lastname,
      Gender.Male)

    this.context.commit('insertPerson', newPerson)
    this.context.dispatch('activatePerson', newPerson.id)
  }

  @Action({ commit: 'setGeneral' })
  public async updatePersonGeneral(person: {
    id: string,
    firstname: string,
    lastname: string,
    gender: string,
  }) {
    await axios.put(`/persons`, {
      id: person.id,
      firstname: person.firstname,
      lastname: person.lastname,
      gender: person.gender,
    })
    return person
  }

  @Action({ commit: 'removePerson' })
  public async deletePerson(personId: string) {
    await axios.delete(`/persons/${personId}`)

    const otherPerson = this.persons.find((x: Person) => x.id !== personId)
    if (otherPerson) {
      this.context.dispatch('activatePerson', otherPerson.id)
    }

    return personId
  }

  @Action
  public async activatePerson(personId: string | null) {
    this.context.commit('setActivePersonId', personId)

    if (personId) {
      this.context.dispatch('loadProjects')
    } else {
      this.context.dispatch('clearProjects')
    }
  }

  @Mutation
  public setActivePersonId(personId: string | null) {
    this.activePersonId = personId
  }

  @Mutation
  protected setPersons(persons: Person[]) {
    this.persons = persons
  }

  @Mutation
  protected setGeneral(person: Person) {
    this.persons = this.persons.map((x: Person) => {
      if (x.id === person.id) {
        x.firstname = person.firstname
        x.lastname = person.lastname
        x.gender = person.gender
      }
      return x
    })
  }

  @Mutation
  protected insertPerson(person: Person) {
    this.persons.push(person)
  }

  @Mutation
  protected removePerson(personId: string) {
    const person = this.persons.find((x: Person) => x.id === personId)
    if (person) {
      this.persons.splice(this.persons.indexOf(person), 1)
    }
  }

}
