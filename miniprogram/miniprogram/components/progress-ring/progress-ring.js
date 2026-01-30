Component({
  properties: {
    current: {
      type: Number,
      value: 0
    },
    total: {
      type: Number,
      value: 8
    }
  },

  data: {
    progress: 0
  },

  observers: {
    'current, total': function(current, total) {
      const progress = total > 0 ? (current / total) * 100 : 0
      this.setData({ progress })
    }
  }
})
