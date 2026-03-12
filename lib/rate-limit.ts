const rateMap = new Map<string, { count: number; resetTime: number }>()

const CLEANUP_INTERVAL = 60 * 1000 // 1 minute

let lastCleanup = Date.now()

function cleanup() {
	const now = Date.now()
	if (now - lastCleanup < CLEANUP_INTERVAL) return
	lastCleanup = now
	for (const [key, value] of rateMap) {
		if (now > value.resetTime) {
			rateMap.delete(key)
		}
	}
}

export function rateLimit(
	identifier: string,
	{ limit = 5, windowMs = 60 * 1000 } = {},
): { success: boolean; remaining: number } {
	cleanup()

	const now = Date.now()
	const record = rateMap.get(identifier)

	if (!record || now > record.resetTime) {
		rateMap.set(identifier, { count: 1, resetTime: now + windowMs })
		return { success: true, remaining: limit - 1 }
	}

	if (record.count >= limit) {
		return { success: false, remaining: 0 }
	}

	record.count++
	return { success: true, remaining: limit - record.count }
}
