// app.js
const Storage = require('./utils/storage.js')

App({
  onLaunch() {
    // 初始化默认设置
    this.initSettings()
    
    // 检查提醒
    this.checkReminders()
  },

  onShow() {
    // 小程序显示时检查提醒
    this.checkReminders()
  },

  initSettings() {
    const settings = Storage.getSettings()
    if (!settings || Object.keys(settings).length === 0) {
      const defaultSettings = Storage.getDefaultSettings()
      Storage.updateSettings(defaultSettings)
    }
  },

  checkReminders() {
    const settings = Storage.getSettings()
    
    if (settings.remindSwitch) {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinutes = now.getMinutes()
      const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`
      
      const startTime = settings.remindStartTime
      const endTime = settings.remindEndTime
      
      // 检查是否在工作时间内
      if (currentTime >= startTime && currentTime <= endTime) {
       
        
        // 获取今日记录
        const todayLog = Storage.getTodayLog()
        const lastUpdate = todayLog.lastUpdate || 0
        
        // 计算距离上次活动的时间（毫秒）
        const timeDiff = Date.now() - lastUpdate
        
        // 转换为分钟
        const minutesDiff = Math.floor(timeDiff / (1000 * 60))
        
        // 如果超过设定的间隔，显示提醒
        if (minutesDiff >= settings.remindInterval) {
          this.showReminderModal()
        }
      }
    }
  },

  showReminderModal() {
    // 可以在这里显示全局提醒弹窗
    // 或者使用 wx.showModal
    wx.showModal({
      title: '健康提醒',
      content: '你已经工作很久了，起来走两步，喝杯水吧！',
      confirmText: '好的',
      cancelText: '稍后',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          // 用户确认，可以跳转到首页
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null
  }
})
