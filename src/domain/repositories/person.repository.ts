import {IPerson, Person} from '../entities'

export interface IPersonRepository {
  create(person: IPerson): Promise<Person>
  findAll(filters: any, limit: number, page: number): Promise<Person[]>
  findById(id: string): Promise<Person>
  updateById(id: string, personToUpdate: Partial<Person>): Promise<Person>
  replaceById(id: string, personToUpdate: Person): Promise<Person>
  deleteById(id: string): Promise<void>
}
