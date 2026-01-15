import {
	H1,
	H2,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from '@adminjs/design-system'
import { ApiClient, useCurrentAdmin } from 'adminjs'
import { useCallback, useEffect, useState } from 'react'
import type { DashboardHandler } from './dashboardHandler'

const initialDashboard: DashboardHandler = {
	Courses: 0,
	Episodes: 0,
	Users: 0,
	Categories: 0
}

const Dashboard = () => {
	const [dashboard, setDashboard] = useState<DashboardHandler>(initialDashboard)
	const api = new ApiClient()

	const [currentAdmin] = useCurrentAdmin()

	const fetchDashboard = useCallback(async () => {
		try {
			const response = await api.getDashboard<DashboardHandler>()
			setDashboard(response.data)
		} catch {
			setDashboard(initialDashboard)
		}
	}, [])

	useEffect(() => {
		fetchDashboard()
	}, [fetchDashboard])

	return (
		<section style={{ padding: '1.5rem' }}>
			<H1>Seja bem-vindo, {currentAdmin?.title}!</H1>

			<section style={{ backgroundColor: '#FFF', padding: '1.5rem' }}>
				<H2>Resumo</H2>
				<Table>
					<TableHead>
						<TableRow style={{ backgroundColor: '#FF0043' }}>
							<TableCell style={{ color: '#FFF' }}>Recurso</TableCell>
							<TableCell style={{ color: '#FFF' }}>Registros</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.entries(dashboard).map(([resource, count]) => (
							<TableRow key={resource}>
								<TableCell>{resource}</TableCell>
								<TableCell>{count}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</section>
		</section>
	)
}

export default Dashboard
