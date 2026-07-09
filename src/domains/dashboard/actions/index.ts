'use server'

import { dashboardService } from '../services'

export async function getDashboardData(year: number, month: number) {
  return dashboardService.getDataByCompetence(year, month)
}

export async function getCurrentMonthDashboardData() {
  return dashboardService.getCurrentMonthData()
}