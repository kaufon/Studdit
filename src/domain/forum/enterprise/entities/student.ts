import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface studentProps {
  name: string
}

export class Student extends Entity<studentProps> {
  get content() {
    return this.props.name
  }

  static create(props: studentProps, id?: UniqueEntityId) {
    const student = new Student(props, id)
    return student
  }
}
