export const addHours = (date: Date, hours: number) => {
	return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

export const addMinutes = (date: Date, minutes: number) => {
	return new Date(date.getTime() + minutes * 60 * 1000)
}

export const addSeconds = (date: Date, seconds: number) => {
	return new Date(date.getTime() + seconds * 1000)
}

export const addMilliseconds = (date: Date, milliseconds: number) => {
	return new Date(date.getTime() + milliseconds)
}

export const addDays = (date: Date, days: number) => {
	return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}
