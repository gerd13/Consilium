enum Theme {
  Light = 'light',
  Dark = 'dark',
}

class User {
  public id: string
  public email: string
  public language: string
  public theme: Theme

  constructor(id: string, email: string, language: string | null) {
    this.id = id
    this.email = email
    this.language = language || 'en-US'
    this.theme = Theme.Light
  }
}

enum Gender {
  Male = 'male',
  Female = 'female',
}

class Person {
  public id: string
  public firstname: string
  public lastname: string
  public gender: Gender

  constructor(id: string, firstname: string, lastname: string, gender: Gender) {
    this.id = id
    this.firstname = firstname
    this.lastname = lastname
    this.gender = gender
  }

  public fullName() {
    return this.firstname + ' ' + this.lastname
  }

}

class Project {
  public id?: string // TODO: remove optional
  public name: string
  public email: string

  constructor(name: string, email: string) {
    this.name = name
    this.email = email
  }
}

class Topic {
  public id: string
  public projectId: string
  public name: string
  public order: number

  constructor(projectId: string, name: string) {
    this.id = ''
    this.projectId = projectId
    this.name = name
    this.order = 0
  }
}

class Article {
  public id: string
  public topicId: string
  public title: string
  public content: string

  constructor(topicId: string, title: string, content: string) {
    this.id = ''
    this.topicId = topicId
    this.title = title
    this.content = content
  }
}

export {
  User,
  Theme,
  Person,
  Gender,
  Project,
  Topic,
  Article,
}
