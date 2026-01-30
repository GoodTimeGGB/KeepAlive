const Storage = require('../../utils/storage.js')

Page({
  data: {
    userInfo: null,
    settings: {},
    isLoggedIn: false,
    tempAvatarUrl: '',
    tempNickName: ''
  },

  onLoad() {
    this.loadUserData()
  },

  onShow() {
    this.loadUserData()
  },

  loadUserData() {
    const userData = Storage.getUser()
    const settings = Storage.getSettings()
    
    this.setData({
      userInfo: userData.userInfo || null,
      settings: {
        waterReminder: settings.remindSwitch || false,
        moveReminder: settings.remindSwitch || false,
        remindStartTime: settings.remindStartTime || '09:00',
        remindEndTime: settings.remindEndTime || '18:00'
      },
      isLoggedIn: !!userData.userInfo
    })
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      tempAvatarUrl: avatarUrl
    })
  },

  onNicknameBlur(e) {
    this.setData({
      tempNickName: e.detail.value
    })
  },

  onSaveUserInfo() {
    const { tempAvatarUrl, tempNickName } = this.data
    
    if (tempAvatarUrl && tempNickName) {
      Storage.saveUser({
        avatarUrl: tempAvatarUrl,
        nickName: tempNickName
      })
      
      this.setData({
        isLoggedIn: true,
        userInfo: {
          avatarUrl: tempAvatarUrl,
          nickName: tempNickName
        },
        tempAvatarUrl: '',
        tempNickName: ''
      })
      
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: '请填写昵称',
        icon: 'none'
      })
    }
  },

  onWaterReminderChange(e) {
    const waterReminder = e.detail.value
    Storage.updateSettings({ remindSwitch: waterReminder })
    
    this.setData({
      'settings.waterReminder': waterReminder,
      'settings.moveReminder': waterReminder
    })
    
    if (waterReminder) {
      this.requestSubscribeMessage()
    }
  },

  onMoveReminderChange(e) {
    const moveReminder = e.detail.value
    Storage.updateSettings({ remindSwitch: moveReminder })
    
    this.setData({
      'settings.waterReminder': moveReminder,
      'settings.moveReminder': moveReminder
    })
  },

  onStartTimeChange(e) {
    Storage.updateSettings({ remindStartTime: e.detail.value })
    this.setData({
      'settings.remindStartTime': e.detail.value
    })
  },

  onEndTimeChange(e) {
    Storage.updateSettings({ remindEndTime: e.detail.value })
    this.setData({
      'settings.remindEndTime': e.detail.value
    })
  },

  requestSubscribeMessage() {
    wx.requestSubscribeMessage({
      tmplIds: ['YOUR_TEMPLATE_ID'],
      success: (res) => {
        console.log('订阅成功', res)
      },
      fail: (err) => {
        console.log('订阅失败', err)
        wx.showToast({
          title: '订阅失败，请重试',
          icon: 'none'
        })
      }
    })
  },

  onAddToCalendar() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    
    wx.addPhoneCalendar({
      title: '喝水提醒',
      startTime: `${year}${month}${day}100000`,
      endTime: `${year}${month}${day}100500`,
      description: '该喝水了，起来走走吧！',
      success: () => {
        wx.showToast({
          title: '已添加到日历',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.log('添加日历失败', err)
        wx.showToast({
          title: '添加失败',
          icon: 'none'
        })
      }
    })
  }
})
