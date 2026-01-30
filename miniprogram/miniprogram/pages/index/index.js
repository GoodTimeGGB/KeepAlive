const Storage = require('../../utils/storage.js')
const { getTimePeriodText } = require('../../utils/date.js')

Page({
  data: {
    waterCount: 0,
    dailyTarget: 8,
    streak: 0,
    focusTime: 4,
    showTimerModal: false
  },

  onLoad() {
    this.loadTodayData()
  },

  onShow() {
    this.loadTodayData()
    this.updateHeaderInfo()
  },

  loadTodayData() {
    const todayLog = Storage.getTodayLog()
    const settings = Storage.getSettings()
    
    this.setData({
      waterCount: todayLog.waterCount,
      dailyTarget: settings.dailyTarget
    })
  },

  updateHeaderInfo() {
    const now = new Date()
    const period = getTimePeriodText(now)
    this.setData({ period })
  },

  onDrinkWater() {
    wx.vibrateShort({ type: 'light' })
    
    const updatedLog = Storage.updateLog('water')
    const settings = Storage.getSettings()
    
    this.setData({
      waterCount: updatedLog.waterCount,
      dailyTarget: settings.dailyTarget
    })
    
    wx.showToast({
      title: 'HP +1',
      icon: 'success',
      duration: 1000
    })
  },

  onExercise() {
    this.setData({
      showTimerModal: true
    })
  },

  onCloseModal() {
    this.setData({
      showTimerModal: false
    })
  },

  onCompleteExercise() {
    wx.vibrateShort({ type: 'medium' })
    
    Storage.updateLog('exercise')
    
    wx.showToast({
      title: '底盘加固成功！',
      icon: 'success',
      duration: 2000
    })
    
    this.setData({
      showTimerModal: false
    })
  }
})
