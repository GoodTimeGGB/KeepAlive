// 本地存储管理工具类
const STORAGE_KEYS = {
  USER: 'ka_user',
  LOGS: 'ka_logs'
}

class Storage {
  // 保存用户信息
  static saveUser(userInfo) {
    const userData = wx.getStorageSync(STORAGE_KEYS.USER) || {}
    userData.userInfo = userInfo
    userData.lastLoginTime = new Date().getTime()
    wx.setStorageSync(STORAGE_KEYS.USER, userData)
  }

  // 获取用户信息
  static getUser() {
    return wx.getStorageSync(STORAGE_KEYS.USER) || {}
  }

  // 更新打卡记录
  static updateLog(type) {
    const logs = wx.getStorageSync(STORAGE_KEYS.LOGS) || []
    const today = this.getTodayDate()
    const todayLog = logs.find(log => log.date === today)

    if (todayLog) {
      if (type === 'water') todayLog.waterCount++
      if (type === 'exercise') todayLog.movementDone = true
      todayLog.lastUpdate = new Date().getTime()
    } else {
      logs.push({
        date: today,
        waterCount: type === 'water' ? 1 : 0,
        movementDone: type === 'exercise',
        lastUpdate: new Date().getTime()
      })
    }
    wx.setStorageSync(STORAGE_KEYS.LOGS, logs)
    return this.getTodayLog()
  }

  // 获取今日记录
  static getTodayLog() {
    const logs = wx.getStorageSync(STORAGE_KEYS.LOGS) || []
    const today = this.getTodayDate()
    return logs.find(log => log.date === today) || {
      date: today,
      waterCount: 0,
      movementDone: false
    }
  }

  // 获取所有记录
  static getAllLogs() {
    return wx.getStorageSync(STORAGE_KEYS.LOGS) || []
  }

  // 更新设置
  static updateSettings(settings) {
    const userData = wx.getStorageSync(STORAGE_KEYS.USER) || {}
    userData.settings = { ...userData.settings, ...settings }
    wx.setStorageSync(STORAGE_KEYS.USER, userData)
  }

  // 获取设置
  static getSettings() {
    const userData = wx.getStorageSync(STORAGE_KEYS.USER) || {}
    return userData.settings || this.getDefaultSettings()
  }

  // 获取默认设置
  static getDefaultSettings() {
    return {
      dailyTarget: 8,
      remindSwitch: true,
      remindStartTime: '09:00',
      remindEndTime: '18:00',
      remindInterval: 60
    }
  }

  // 获取今日日期 YYYY-MM-DD
  static getTodayDate() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
}

module.exports = Storage
