import { UniqueEntityId } from "./unique-entity-id";

export abstract class Entity<Props> {
	private _id: UniqueEntityId;
	protected props: Props;

	get id(): UniqueEntityId {
		return this._id;
	}

	protected constructor(props: Props, id?: UniqueEntityId) {
		this.props = props;
		this._id = id ?? new UniqueEntityId();
	}
	public equals(entity: Entity<unknown>): boolean {
		if (entity === this) {
			return true;
		}
		if (entity.id === this._id) {
			return true;
		}
		return false;
	}
}
