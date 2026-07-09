import { dashboardRepository } from '../repositories'

export class DashboardService {
  async getDataByCompetence(year: number, month: number) {
    return dashboardRepository.getDataByCompetence(year, month)
  }

  async getCurrentMonthData() {
    const now = new Date()
    return this.getDataByCompetence(now.getFullYear(), now.getMonth() + 1)
  }
}

export const dashboardService = new DashboardService()