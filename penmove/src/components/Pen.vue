<template>
  <div class="hello" style="height: 100%">
    <el-container style="height: 100%">
      <el-header style="height: 8%">手势跳转由你定义  <input type="radio" name="search" id="useProtractor" style="opacity: 0;"></el-header>
      <el-main style="height: 60%;">
<!--        <div style="margin-bottom: 10px">-->
<!--          <el-row :gutter="12">-->
<!--            <el-col :span="8">-->
<!--              <el-card shadow="always" style="background-color: #B3C0D1; font-family: bold">-->
<!--                1.Define Your Posture-->
<!--              </el-card>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <el-card shadow="always" style="background-color: #B3C0D1;font-family: bold">-->
<!--                2.Use Your Posture-->
<!--              </el-card>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <el-card shadow="always" style="background-color: #B3C0D1;font-family: bold">-->
<!--                3.Page Jump-->
<!--              </el-card>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </div>-->

        <div style="width: 100%;height:100%;margin:0;padding:0;">
          <canvas class="myCanvasclass" id="myCanvas" width="800" height="600" style="border-radius:10px; box-shadow: darkgrey 5px 10px 10px 5px; width: 100%;height:100%;margin:0;padding:0;display: block;background-color:#ffffff;"
                  @touchstart="touchstartEvent"
                  @touchmove="touchmoveEvent"
                  @touchend="touchendEvent"
                  oncontextmenu="return false;">
            <span style="background-color:#ffff88;">The &lt;canvas&gt; element is not supported by this browser.</span>
          </canvas>
        </div>
<!--        <div class="demo-input-suffix"style="margin-top:20px ">-->
<!--          Add as example of existing type:-->
<!--          <el-select id="unistrokes" v-model="value" placeholder="Please Choose" style="width: 150px">-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--          <el-button type="primary" round @click="onClickAddExisting">ADD</el-button>-->
<!--        </div>-->

      </el-main>
      <el-main style="height: 30%">
        <div class="demo-input-suffix" style="margin-top:10px;height: 100%" >
          <el-row>
            <el-slider v-model="valueLineWidth" :min="1" :max="8" show-input @change="changeLineWidth"></el-slider>
          </el-row>
          <el-row >
            <el-button style="background-color: blue" circle @click="changePenColor('blue')"></el-button>
            <el-button style="background-color: #42b983" circle  @click="changePenColor('#42b983')"></el-button>
            <el-button style="background-color: #ffff88" circle  @click="changePenColor('#ffff88')"></el-button>
            <el-button style="background-color: orange" circle  @click="changePenColor('orange')"></el-button>
            <el-button style="background-color: peachpuff" circle  @click="changePenColor('peachpuff')"></el-button>
            <el-button style="background-color: plum" circle  @click="changePenColor('plum')"></el-button>
            <!--            Define Your Pen Color-->
            <!--            <el-color-picker-->
            <!--              v-model="color"-->
            <!--              show-alpha-->
            <!--              :predefine="predefineColors">-->
            <!--            </el-color-picker>-->
          </el-row>
          <el-row style="margin-top: 15px">
<!--            <el-input placeholder="Type name here..." style="width: 200px" v-model="input1" id="custom" @click="onClickCustom" >-->
<!--            </el-input>-->
            <el-select v-model="value" placeholder="选择应用" id="custom" style="width:90%">
            <el-option v-for="item in optionsApp" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-edit" @click="onClickAddCustom" >添加手势</el-button>
            <el-button type="primary" icon="el-icon-delete"  @click="onClickDelete" >删除手势</el-button>
          </el-row>

        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {DollarRecognizer,Point} from '../../static/js/dollar.js';
export default {
  name: 'Pen',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      input1:'',
      color: 'blue',
      optionsApp: [{
        value: 'alipay://',
        label: '支付宝'
      }, {
        value: 'taobao://',
        label: '淘宝'
      }, {
        value: 'weixin://',
        label: '微信'
      }, {
        value: 'sinaweibo://',
        label: '打电话'
      }, {
        value: 'zhihu://',
        label: '知乎'
      }],
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      options: [{
        value: 'triangle',
        label: 'triangle'
      }, {
        value: 'x',
        label: 'x'
      }, {
        value: 'rectangle',
        label: 'rectangle'
      }, {
        value: 'circle',
        label: 'circle'
      }, {
        value: 'check',
        label: 'check'
      },{
        value: 'caret',
        label: 'caret'
      },{
        value: 'zig-zag',
        label: 'zig-zag'
      },{
        value: 'arrow',
        label: 'arrow'
      },{
        value: 'left square bracket',
        label: 'left square bracket'
      },{
        value: 'right square bracket',
        label: 'right square bracket'
      },{
        value: 'v',
        label: 'v'
      },{
        value: 'delete',
        label: 'delete'
      },{
        value: 'left curly brace',
        label: 'left curly bracet'
      },{
        value: 'right curly brace',
        label: 'right curly brace'
      },{
        value: 'star',
        label: 'star'
      },{
        value: 'pigtail',
        label: 'pigtail'
      }],
      value:'',
      valueLineWidth:3,
      _isDown:null,
      _points:null,
      _r:null,
      _g:null,
      _rc:null
    }
  },
  methods:{
    onLoadEvent:function() {
      this._points = new Array();
      this._r = new DollarRecognizer();
      var canvas = document.getElementById('myCanvas');
      this._g = canvas.getContext('2d');
      this._g.fillStyle =this.color;
      this._g.strokeStyle = this.color;
      this._g.lineWidth = 3;
      this._g.font = "16px Gentilis";
      this._rc = this.getCanvasRect(canvas); // canvas rect on page
      // this._g.fillStyle = "rgb(255,255,136)";
      // this._g.fillRect(0, 0, this._rc.width, 20);
      this._isDown = false;
    },
    changeLineWidth:function(){
      this._g.lineWidth=this.valueLineWidth;
    },
    changePenColor:function(color){
      this.color=color;
      this._g.strokeStyle=this.color;
    },
    getCanvasRect:function (canvas) {
      var w = canvas.width;
      var h = canvas.height;
      var cx = canvas.offsetLeft;
      var cy = canvas.offsetTop;
      while (canvas.offsetParent != null) {
        canvas = canvas.offsetParent;
        cx += canvas.offsetLeft;
        cy += canvas.offsetTop;
      }
      return {
        x: cx,
        y: cy,
        width: w,
        height: h
      };
    },
    getScrollX:function () {
      var scrollX = $(window).scrollLeft();
      return scrollX;
    },
    getScrollY:function () {
      var scrollY = $(window).scrollTop();
      return scrollY;
    },
    //
    // Touch Events
    //
    touchstartEvent:function (event) {
      event.preventDefault();
      var x=event.touches[0].clientX;
      var y=event.touches[0].clientY;
      this._isDown = true;
      x -= this._rc.x - this.getScrollX();
      y -= this._rc.y - this.getScrollY();
      if (this._points.length > 0)
        this._g.clearRect(0, 0, this._rc.width, this._rc.height);
      this._points.length = 1; // clear
      this._points[0] = new Point(x, y);
    //  this.drawText("Recording unistroke...");
      this._g.fillRect(x - 4, y - 3, 9, 9);
    },
    touchmoveEvent:function(event) {
      event.preventDefault();
      var x=event.touches[0].clientX;
      var y=event.touches[0].clientY;
      console.log(this._isDown);
      if (this._isDown) {
        x -= this._rc.x - this.getScrollX();
        y -= this._rc.y - this.getScrollY();
        this._points[this._points.length] = new Point(x, y); // append
        this.drawConnectedPoint(this._points.length - 2, this._points.length - 1);
      }

  },
    touchendEvent:function () {
      event.preventDefault();
      if (this._isDown) {
        this._isDown = false;
        if (this._points.length >= 10) {
          var result = this._r.Recognize(this._points, document.getElementById('useProtractor').checked);
       //   this.drawText("Result: " + result.Name + " (" + this.round(result.Score,2) + ") in " + result.Time + " ms.");
          console.log(result.Name);
          if(/\./.test(result.Name)){
            console.log(result.Name);
            window.location.href="http://"+result.Name;
          }else if(result.Name.indexOf("/") != -1 )
            window.location.href = result.Name;
        } else // fewer than 10 points were inputted
        {
          this.drawText("Too few points made. Please try again.");
         }
      }
  },
    drawText:function (str) {
      this._g.fillStyle = "rgb(255,255,136)";
      this._g.fillRect(0, 0, this._rc.width, 20);
      this._g.fillStyle = "rgb(0,0,255)";
      this._g.fillText(str, 1, 14);
    },
    drawConnectedPoint:function (from, to) {
      this._g.beginPath();
      this._g.moveTo(this._points[from].X, this._points[from].Y);
      this._g.lineTo(this._points[to].X, this._points[to].Y);
      this._g.closePath();
      this._g.stroke();
    },
    round:function (n, d){ // round 'n' to 'd' decimals
      d = Math.pow(10, d);
      return Math.round(n * d) / d;
    },
    //
    // Unistroke Adding and Clearing
    //
    onClickAddExisting:function () {
      if (this._points.length >= 10) {
        var unistrokes = document.getElementById('unistrokes');
        var name = unistrokes[unistrokes.selectedIndex].value;
        var num = this._r.AddGesture(name, this._points);
        this.drawText("\"" + name + "\" added. No. of \"" + name + "\" defined: " + num + ".");
      }
    },
    onClickAddCustom:function () {
      var name = document.getElementById("custom").value;
      var url="";
      if(name=='淘宝')url="taobao://"
      if(name=='微信')url="weixin://"
      if(name=='打电话')url="tel://"+prompt("请输入电话号码：");
      if(name=='知乎')url="zhihu://"
      if(name=='支付宝')url="alipay://"
      if (this._points.length >= 10 && name.length > 0) {
        var num = this._r.AddGesture(url, this._points);
        this.drawText(
          '"' + name + '" added. No. of "' + name + '" defined: ' + num + "."
        );
      }
    },
    onClickCustom:function () {
      document.getElementById('custom').select();
    },
    onClickDelete:function () {
      var num = this._r.DeleteUserGestures(); // deletes any user-defined unistrokes
      alert("All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types.");
    }
  },
  mounted() {
    this.onLoadEvent();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
 .el-header{
   background-color: black;
   color: #ffffff;
   text-align: center;
   line-height: 60px;
   font-size: 20px;
   font-family: "Arial Black";
   font-weight: bold;
 }


.el-main {
  /*background-color: #E9EEF3;*/
  color: #333;
  text-align: center;
  line-height: 40px;
}

body > .el-container {
  margin-bottom: 40px;
}



</style>
