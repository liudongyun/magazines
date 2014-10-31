angular.module("app").controller('HermesController', function($scope, $location) {
  //数据：是数组，里面是json格式的数据
  var List=[
  {
    height:1008,
    width:640,
    img:'../img/1.jpg'
  },
  {
    height:1008,
    widht:640,
    img:'../img/2.jpg'
  },
  {
    height:1008,
    width:640,
    img:'../img/3.jpg'
  },
  {
    height:1008,
    width:640,
    img:'../img/4.jpg'
  }
  ];

  //music播放部分的js(做了一个开关来控制"一个按键"上面的播放)
  $('.musicImg').addClass('play');
  var oAudio=document.getElementById('audio');
  var a=true;
  function playfn(){
    $('.musicImg').removeClass('play');
    oAudio.pause();
  }
  function pausefn(){
    $('.musicImg').addClass('play');
    oAudio.play();  
  }
  
  $('.musicImg').click(function(){
    
    if(a){
      playfn();
      a=false;
    }else{
      pausefn();
      a=true;
    }   
  });



  //定义一个构造函数，用于生成滑动组建
  function Slider(opts){
    //dom节点
    this.wrap=opts.dom;
    //数据
    this.list=opts.list;
    //构造三部曲
      //1初始化
      this.init();
      //2生成dom
      this.renderDOM();
      //3插入到最外层容器中去
      this.bindDOM();
  }

  //1.初始化部分
  Slider.prototype.init=function(){    
    //窗口的长宽比
    this.radio=window.innerHeight/window.innerWidth;
    //滚动一屏的距离(高度)
    this.scaleH=window.innerHeight; 
    //当前图片的索引值
    this.idy=0;

  };

  //2.生成DOM
  Slider.prototype.renderDOM=function(){
    //获取节点
    var wrap=this.wrap;
    //获取数据
    var data=this.list;    
    //数据的长度
    var len=data.length;    
    //创建一个uL
    this.outer=document.createElement('ul');

    for(var i=0;i<len;i++){
      var li=document.createElement('li');
      var item=data[i];
      li.style.height=window.innerHeight+'px';
      li.style.webkitTransform='translate3d(0,'+i*this.scaleH+'px,0)';  

      //图片判定
      if(item){
        //长宽比大于窗口长宽比（说明是细条状的所以根据高度缩放;否则根据宽度缩放）
        if(item['height']/item['width']>this.radio){
          li.innerHTML='<img height="'+ window.innerHeight +'" src="'+ item['img'] +'">';
        }else{
          li.innerHTML='<img width="'+ window.innerWidth +'" src="'+ item['img'] +'">';
        }
      }

      this.outer.appendChild(li);
    }

    this.outer.style.cssText='height:' + this.scaleH +'px';
    wrap.style.height=window.innerHeight+'px';
    wrap.appendChild(this.outer);
  };

  Slider.prototype.bindDOM=function(){
    //定义
      //绑定DOM事件时this会漂移
      var self=this;
      //window.innerHeight
      var scaleH=self.scaleH;      
      //ul
      var outer=self.outer;
      //length
      var len=self.list.length;

      //touchstart时执行的函数
      var startHandler=function(evt){
        //记录手指点的那个点
        self.starty=evt.touches[0].pageY;       
        //再次touchstart的时候把之前的记录清零
        self.offsetY=0;        
        //乘以1是一个小技巧：自动转成数字形式的时间戳
        self.startTime=new Date()*1;         
        //把之前的scale全部清掉 
        var lis=outer.getElementsByTagName('li'); 
        
        for(var i=0;i<len;i++){          
          lis[i].style.webkitTransform='translate3d(0,'+((i-self.idy)*scaleH)+'px,0) scale(1)'; 
          var aaa=true;
        } 
      };

      //touchmove时执行的函数
      var moveHandler=function(evt){

        //阻止浏览器的默认行为
        evt.preventDefault();
        //记录移动的距离
        self.offsetY=evt.touches[0].pageY-self.starty;        
        //获取到所有的li
        var lis=outer.getElementsByTagName('li');   



        var i;
        var m;      
        //向上翻的时候  
        if(self.offsetY<0){
          //从当前索引的下一个开始
          i=self.idy+1;
          //到当前坐标的下一个的下一个结束
          m=i+2;
          /*scale = 1 - Math.abs(self.offsetY*0.8/scaleH); */
          //这里循环的是下一个和下下一个，所以i是当前的下一个；m是当前的下一个的下一个
          for(i;i<m;i++){    
            if(lis[i]){
              lis[i].style.webkitTransform='translate3d(0,'+((i-self.idy)*scaleH+self.offsetY*2)+'px,0)';       
            }

            //这种简写的if格式,cmd里会报错！(原因不详......)
            /*lis[i] && (lis[i].style.webkitTransform='translate3d(0,'+((i-self.idy)*scaleH+self.offsetY*2)+'px,0)');    
            lis[i] && (lis[i].style.zIndex='0'); */ 
          }
          /*alert((self.idy+1)+'|'+i);*/
          //滑动上来，当前要展示的页面给一个最高的zIndex
          if(lis[self.idy+1]){
            lis[self.idy+1].style.zIndex='2';            
          }         
          //滑动上来，当前展示页面的上上个页面    
                
          if(lis[i-3]){            
            lis[i-3].style.webkitTransform='translate3d(0,'+self.offsetY+'px,0) scale(0.85)';           
          }

        }

        //向下翻的时候
        if(self.offsetY>0){  
          //从当前页面的上上个开始        
          i=self.idy-2;
          //当前页面结束          
          m=i+3;              
          for(i;i<m;i++){            
            if(lis[i]){
              lis[i].style.webkitTransform='translate3d(0,'+((i-self.idy)*scaleH+self.offsetY*2)+'px,0)';
              lis[i].style.zIndex='0';             
            }             
            if(lis[self.idy-1]){
              lis[self.idy-1].style.zIndex='2';                            
            }
            if(lis[self.idy]){
              lis[self.idy].style.zIndex='1';
            }
            if(lis[self.idy+1]){
              lis[self.idy+1].style.zIndex='0';
            }                   
          }

          if(lis[i-1]){
            lis[i-1].style.webkitTransform='translate3d(0,'+self.offsetY+'px,0) scale(0.85)';
          }          
        }

      };
      var endHandler=function(evt){
        evt.preventDefault();
        //当移动到屏幕的五分之一的时候进入下一张或上一张
        var boundary=scaleH/5;
        var endTime=new Date()*1;
        var lis=outer.getElementsByTagName('li');        
        if(endTime-self.startTime>200){

          if(self.offsetY>=boundary){
            //进入前一页            
            self.goIndex('-1');
          }else if(self.offsetY<-boundary){
            //进入后一页
            self.goIndex('+1');
          }else{
            //留在本页
            self.goIndex('0');
          }

        }else{
          //快操作
          if(self.offsetY>50){
            self.goIndex('-1');            
          }else if(self.offsetY<-50){
            self.goIndex('1');            
          }else{
            self.goIndex('0');
          }
        }        
        
      };
    //绑定事件
    outer.addEventListener('touchstart',startHandler,false);
    outer.addEventListener('touchmove',moveHandler,false);
    outer.addEventListener('touchend',endHandler,false);
  };

  Slider.prototype.goIndex=function(n){
    //当前状态
    var idy=this.idy;
    scale=1;
    //下一个状态
    var cidy;
    var lis=this.outer.getElementsByTagName('li');
    var len=lis.length;
    if(typeof n ==='number'){
      cidy=idy;
    }else if(typeof n ==='string'){
      cidy=idy+n*1;
    }

    //当索引从右边超出
    if(cidy>len-1){
      cidy=len-1;
    }else if(cidy<0){
      cidy=0;
    }
    this.idy=cidy;
    
    //改变过渡的方式，从无动画到有动画
    lis[cidy].style.webkitTransition = '-webkit-transform 0.4s ease-out';
    if(lis[cidy-1]){
      lis[cidy-1].style.webkitTransition = '-webkit-transform 0.4s ease-out';
    }
    if(lis[cidy+1]){
      lis[cidy+1].style.webkitTransition = '-webkit-transform 0.4s ease-out';
    }
    //改变动画后所应该有的位移值和缩放值

    lis[cidy].style.webkitTransform='translate3d(0,0,0)';    
    if(lis[cidy-1]){      
      lis[cidy-1].style.webkitTransform='translate3d(0,-'+self.offsetY+'px,0)'+'scale(1)';          
    }
    if(lis[cidy+1]){
      lis[cidy+1].style.webkitTransform='translate3d(0,'+self.offsetY+'px,0)'+'scale(1)';
    }   


  };
  //执行滑动组建,通过上述传参
    new Slider({
      //dom节点
      'dom':document.getElementById('canvas'),
      //已经定义的list
      'list':List      
    });
  
});
