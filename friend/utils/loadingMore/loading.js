Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isHideLoadMore: { // 是否显示
      type: Number,
      value: 0,
    },
  },
  ready() {
    console.log(this.data.isHideLoadMore)
  }
})