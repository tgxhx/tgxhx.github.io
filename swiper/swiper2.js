/**
 * Created by 12 on 2017/7/13.
 */

;(function () {
  function byId(str) {
    return typeof str === 'string' ? document.getElementById(str) : null
  }

  function Swiper(id) {
    this.container = byId(id)
    this.list = this.container.getElementsByTagName('ul')[0],
      this.items = this.list.getElementsByTagName('li'),
      this.width = this.items[0].offsetWidth,
      this.length = this.items.length,
      this.prev = byId('prev'),
      this.next = byId('next'),
      this.autoTimer = null,
      this.buttons = byId('buttons').getElementsByTagName('span'),
      this.timeBefore = null,
      this.index = 1,
      this.options = {
        auto: true,  //是否自动滚动
        delay: 5000,
        speed: 200
      }

    var firstNode = this.items[0],
      lastNode = this.items[this.items.length - 1]
    this.list.insertBefore(lastNode.cloneNode(true), firstNode)
    this.list.appendChild(firstNode.cloneNode(true))
  }

  Swiper.prototype = {
    swiper: function (obj) {
      this.config(obj)
      this.events()
      if (this.options.auto) {
        this.play()
      }
    },
    config: function (obj) {
      if (!obj) return
      for (var i in obj) {
        this.options[i] = obj[i]
      }
    },
    events: function () {
      var _this = this
      this.prev.onclick = function () {
        if (_this.clickDelay()) {
          _this.index--
          if (_this.index < 1) {
            _this.index = 5
          }
          _this.animate(_this.width)
          _this.buttonShow()
        }
      }
      this.next.onclick = function () {
        if (_this.clickDelay()) {
          _this.index++
          if (_this.index > 5) {
            _this.index = 1
          }
          _this.animate(-_this.width)
          _this.buttonShow()
        }
      }
      this.container.onmouseover = this.stop.bind(this)
      this.container.onmouseout = function () {
        if (_this.options.auto) {
          _this.play()
        }
      }
      window.onblur = this.stop.bind(this)
      window.onfocus = this.play.bind(this)

      for (var i = 0; i < this.buttons.length; i++) {
        (function (i) {
          _this.buttons[i].onclick = function () {
            // console.log(i)
            var clickIndex = parseInt(this.getAttribute('index'))
            var offset = (_this.index - clickIndex) * _this.width
            _this.animate(offset)
            _this.index = clickIndex
            _this.buttonShow()
          }
        })(i)
      }
    },
    clickDelay: function () {
      var timeNow = Date.now()
      if (this.timeBefore) {
        var delay = timeNow - this.timeBefore
        if (delay > 500) {
          this.timeBefore = timeNow
          // console.log(delay)
          return true
        } else {
          return false
        }
      } else {
        this.timeBefore = timeNow
        return true
      }
    },
    animate: function (offset) {
      var _this = this
      var curLeft = this.list.offsetLeft
      var time = 20 //移动次数
      var animateTime = this.options.speed  //动画时间
      var intervalTime = animateTime / time  //setInterval 每次间隔
      var speed = offset / time  //切换速度，每一次的移动距离
      var i = 0 //移动次数计数器
      var timer = setInterval(function () {
        i++
        curLeft += speed
        _this.list.style.left = curLeft + 'px'
        if (i === time) {
          clearInterval(timer)
          // console.log(curLeft)
          if (curLeft < -(_this.length * _this.width)) {
            _this.list.style.left = -_this.width + 'px'
          } else if (curLeft > -_this.width) {
            _this.list.style.left = -(_this.length * _this.width) + 'px'
          }
        }
      }, intervalTime)
    },
    play: function () {
      this.autoTimer = setInterval(this.next.onclick.bind(this), this.options.delay)
    },
    stop: function () {
      clearInterval(this.autoTimer)
    },
    buttonShow: function () {
      for (var i = 0; i < this.buttons.length; i++) {
        if (this.buttons[i].className == 'on') {
          this.buttons[i].className = ''
        }
      }
      this.buttons[this.index - 1].className = 'on'
    }
  }

  window.Swiper = Swiper
})()