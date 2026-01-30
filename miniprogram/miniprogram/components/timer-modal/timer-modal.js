Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {
    timerCount: 60,
    timer: null
  },

  observers: {
    'show': function(show) {
      if (show) {
        this.startTimer()
      } else {
        this.stopTimer()
      }
    }
  },

  methods: {
    startTimer() {
      this.setData({
        timerCount: 60
      })
      
      this.data.timer = setInterval(() => {
        const count = this.data.timerCount - 1
        
        if (count <= 0) {
          this.stopTimer()
          this.onComplete()
        } else {
          this.setData({ timerCount: count })
        }
      }, 1000)
    },

    stopTimer() {
      if (this.data.timer) {
        clearInterval(this.data.timer)
        this.setData({ timer: null })
      }
    },

    onClose() {
      this.stopTimer()
      this.triggerEvent('close')
    },

    onComplete() {
      this.stopTimer()
      this.triggerEvent('complete')
    }
  },

  detached() {
    this.stopTimer()
  }
})
