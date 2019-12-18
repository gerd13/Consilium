import axios from 'axios'
import { Module, VuexModule, Action, Mutation, MutationAction } from 'vuex-module-decorators'
import { Topic } from '../../models/definitions'

@Module({ name: 'KnowledgeBaseModule' })
export default class KnowledgeBaseModule extends VuexModule {
  public topics: Topic[] = []

  public get allTopics(): Topic[] {
    return this.topics
  }

  @Action
  public async initKnowledgeBaseModule() {
    const response = await axios.get('/knowledge-base/topics')
    this.context.commit('setTopics', response.data)
  }

  @MutationAction({ mutate: ['topics'] })
  public async clearKnowledgeBases() {
    return { topics: [] }
  }

  @Action
  public async createTopic(topic: Topic) {
    const response = await axios.post('/knowledge-base/topics', {
      projectId: topic.projectId,
      name: topic.name,
    })
    this.context.commit('insertTopic', response.data)
  }

  @Action
  public async renameTopic(topic: Topic) {
    await axios.put('/knowledge-base/topics', {
      id: topic.id,
      name: topic.name,
    })
    this.context.commit('updateTopic', topic)
  }

  @Action
  public async deleteTopic(topicId: string) {
    await axios.delete(`/knowledge-base/topics/${topicId}`)
    this.context.commit('removeTopic', topicId)
  }

  @Mutation
  protected setTopics(topics: Topic[]) {
    this.topics = topics
  }

  @Mutation
  protected insertTopic(topic: Topic) {
    this.topics.push(topic)
  }

  @Mutation
  protected updateTopic(updatedTopic: Topic) {
    for (const topic of this.topics) {
      if (topic.id === updatedTopic.id) {
        topic.name = updatedTopic.name
      }
    }
  }

  @Mutation
  protected removeTopic(topicId: string) {
    this.topics = this.topics.filter((x: Topic) => x.id !== topicId)
  }

}