import { reportsRepository } from '../repositories'

export class ReportsService {
  async getMonthlySummary(year: number, month: number) {
    return reportsRepository.getMonthlySummary(year, month)
  }

  async getExpensesByCategory(year: number, month: number) {
    return reportsRepository.getExpensesByCategory(year, month)
  }

  async getExpensesByPerson(year: number, month: number) {
    return reportsRepository.getExpensesByPerson(year, month)
  }

  async getIncomeVsExpense(year: number, month: number) {
    return reportsRepository.getIncomeVsExpense(year, month)
  }

  async getAllReports(year: number, month: number) {
    const [summary, byCategory, byPerson, incomeVsExpense] = await Promise.all([
      this.getMonthlySummary(year, month),
      this.getExpensesByCategory(year, month),
      this.getExpensesByPerson(year, month),
      this.getIncomeVsExpense(year, month)
    ])

    return {
      summary,
      byCategory,
      byPerson,
      incomeVsExpense
    }
  }
}

export const reportsService = new ReportsService()