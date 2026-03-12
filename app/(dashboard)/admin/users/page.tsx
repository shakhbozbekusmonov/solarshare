import { AdminUsersList } from '@/components/dashboard/admin-users'

export default function AdminUsersPage() {
	return (
		<div className='p-6 space-y-6'>
			<h1 className='text-2xl font-bold'>Foydalanuvchilar</h1>
			<AdminUsersList />
		</div>
	)
}
