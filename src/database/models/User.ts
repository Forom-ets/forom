type UserRecord = {
	id: number
	email?: string
	username?: string
	fullName?: string
	googleId?: string
	jwtSecureCode: string
}

type FindOneParams = {
	where: Partial<UserRecord>
}

class User {
	private static users: UserRecord[] = []
	private static nextId = 1

	static async findOne(params: FindOneParams): Promise<UserRecord | null> {
		const { where } = params
		const user = User.users.find((candidate) => {
			return Object.entries(where).every(([key, value]) => {
				return (candidate as Record<string, unknown>)[key] === value
			})
		})

		return user || null
	}

	static async create(data: Omit<UserRecord, 'id'>): Promise<UserRecord> {
		const created: UserRecord = {
			id: User.nextId,
			...data,
		}

		User.nextId += 1
		User.users.push(created)
		return created
	}
}

export type { UserRecord }
export default User
