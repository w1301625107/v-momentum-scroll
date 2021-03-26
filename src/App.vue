<template>
  <div id="app">
    <div class="header">
      <img class="vue_logo"
           alt="Vue logo"
           src="./assets/logo.png">
      <span>v-momentum-scroll</span>
      <svg @click="toGithub"
           class="github_icon"
           height="32"
           viewBox="0 0 16 16"
           version="1.1"
           width="32"
           aria-hidden="true">
        <path fill-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
        </path>
      </svg>
    </div>
    <div class="demo-container">
      <div class="control_panel">
        <div>
          滚动到:<select v-model="elementIndex" style="width:70px">
            <option v-for="n in list.length"
                    :value="n-1"
                    :key="n">{{n-1}}</option>
          </select>
        </div>
        <div>
          匀速speed: <input v-model="scrollSpeed" type="range" min="1" max="50"/> {{scrollSpeed}}
        </div>
        <div>
          <button @click="bounceToElement">变速 滚动</button>
          <button style="margin-left:20px" @click="scrollToElement">匀速滚动</button>
        </div>
        <div style="border-top: 1px solid #ebebeb;margin-top:20px">
          回弹原因:<select v-model="backBounceType" style="width:100px">
            <option value="">--choose an element--</option>
            <option value="noBounce">noBounce: 手动拖动触界</option>
            <option value="weekBounce">weekBounce：慢速滚动触界</option>
            <option value="strongBounce">strongBounce：快速滚动触界</option>
          </select>
        </div>
        <div>
          遇顶回弹到:<select v-model="touchTopBackElementIndex" style="width:100px">
            <option value="">--choose an element--</option>
            <option v-for="n in list.length"
                    :value="n-1"
                    :key="n">{{n-1}}</option>
          </select>
        </div>
        <div>
          遇底回弹到:<select v-model="touchButtomBackElementIndex" style="width:100px">
            <option value="">--choose an element--</option>
            <option v-for="n in list.length"
                    :value="n-1"
                    :key="n">{{n-1}}</option>
          </select>
        </div>
      </div>
      <v-momentum-scroll class="wrapper" ref="wrapper"
                         :hitBorder="hitBorder">
        <ul class="list"
            ref="scroller">
          <li class="list-item"
              v-for="(item,index) in list"
              :key="index">
            {{item}}
          </li>
        </ul>
      </v-momentum-scroll>

    </div>
    <footer class="main-footer">
      MIT ©wuchouchou
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      elementIndex: 1,
      scrollSpeed:8,
      touchTopBackElementIndex:"",
      touchButtomBackElementIndex:"",
      backBounceType:""
    };
  },
  computed: {
    list() {
      const list = [];
      for (let i = 1; i <= 50; i++) {
        list.push(i);
      }
      return list;
    },
  },
  methods: {
    toGithub() {
      window.open("https://github.com/w1301625107/v-momentum-scroll");
    },
    hitBorder(args) {
      if (args.type !== this.backBounceType) {
        return;
      }
      if (args.direction == "bottom") {
        if(this.touchButtomBackElementIndex=="")return
        return document.querySelector(`.list li:nth-child(${this.touchButtomBackElementIndex})`);
      } else if (args.direction == "top") {
        if(this.touchTopBackElementIndex=="")return
        return document.querySelector(`.list li:nth-child(${this.touchTopBackElementIndex})`);
      }
    },
    bounceToElement(){
      this.$refs.wrapper.bounceTo(this.getEl(this.elementIndex))
    },
    scrollToElement(){
      this.$refs.wrapper.scrollTo(this.getEl(this.elementIndex),parseInt(this.scrollSpeed))
    },
    getEl(n){
      return document.querySelector(`.list li:nth-child(${n})`)
    }
    
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 30px;
}
.header {
  text-align: left;
  font-size: 50px;
  margin-left: 30px;
  margin-bottom: 30px;
}
.header span {
  margin-left: 20px;
  word-break: break-all;
}
.vue_logo {
  width: 50px;
  vertical-align: middle;
}
.github_icon {
  float: right;
  margin-top: 15px;
  margin-right: 25px;
}
.github_icon:hover {
  transform: scale(1.1);
}
.demo-container {
  border-top: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;
  height: calc(100vh - 150px);
  display: flex;
}
.control_panel {
  width: 300px;
  padding-top: 20px;
  border-right: 1px solid #ebebeb;
}
.control_panel div{
  padding-top: 20px;
}
.main-footer {
  margin-top: 10px;
  float: right;
}
</style>

<style scoped>
body,
ul {
  margin: 0;
  padding: 0;
}

ul {
  list-style: none;
}

.wrapper {
  /* position: absolute;
  top: 50%;
  left: 0;
  right: 0; */
  margin: 0 auto;
  margin-top: 20px;
  height: 60% !important;
  width: 60% !important;
  max-width: 300px;
  max-height: 600px;
  border: 1px solid #000;
  /* transform: translateY(-50%); */
  overflow: hidden;
}

.list {
  background-color: #70f3b7;
}

.list-item {
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #ccc;
}
</style>
