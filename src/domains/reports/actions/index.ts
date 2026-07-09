'use server'

import { reportsService } from '../services'

export async function getMonthlySummary(year: number, month: number) {
  return reportsService.getMonthlySummary(year, month)
}

export async function getExpensesByCategory(year: number, month: number) {
  return reportsService.getExpensesByCategory(year, month)
}

export async function getExpensesByPerson(year: number, month: number) {
  return reportsService.getExpensesByPerson(year, month)
}

export async function getIncomeVsExpense(year: number, month: number) {
  return reportsService.getIncomeVsExpense(year, month)
}

export async function getAllReports(year: number, month: number) {
  return reportsService.getAllReports(year, month)
}