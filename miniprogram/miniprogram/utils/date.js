// 日期处理工具类

// 格式化日期 YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取本周日期数组
function getWeekDates() {
  const now = new Date()
  const dayOfWeek = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + 1)
  
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push(formatDate(date))
  }
  return dates
}

// 计算连续打卡天数
function calculateStreak(logs) {
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date))
  let streak = 0
  let currentDate = new Date()
  
  for (const log of sortedLogs) {
    const logDate = new Date(log.date)
    const diffDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 1 && (log.waterCount > 0 || log.movementDone)) {
      streak++
      currentDate = logDate
    } else {
      break
    }
  }
  
  return streak
}

// 获取当前时间段显示文本
function getTimePeriodText(date) {
  const hour = date.getHours()
  if (hour < 6) return '凌晨'
  if (hour < 9) return '早晨'
  if (hour < 12) return '上午'
  if (hour < 14) return '中午'
  if (hour < 18) return '下午'
  return '晚上'
}

module.exports = {
  formatDate,
  getWeekDates,
  calculateStreak,
  getTimePeriodText
}
