
var MusicList = []
var currentIndex = 1
var audio = new Audio()
audio.autoplay = true

function $(selector){
    return document.querySelector(selector)
}

function getMusicList(callback){
var xhr = new XMLHttpRequest()
xhr.open("GET","/music.json",true)
xhr.onload = function(){
    callback(JSON.parse(xhr.responseText))
}
xhr.send()
}

function loadMusic(MusicObj){
    audio.src = MusicObj.src
    $('.info .title').innerText = MusicObj.title
    $('.info .author').innerText = MusicObj.author
    $('.cover').style.backgroundImage = 'url'+'('+MusicObj.img+')'
    for(var i = 0; i < $('.musicList').children.length; i++){
        $('.musicList').children[i].classList.remove('playing')
      }
}


audio.ontimeupdate = function(){
    $('.process-now').style.width = (this.currentTime/this.duration)*100 + '%'
    var min = Math.floor(this.currentTime/60)
    var second = ''+Math.floor(this.currentTime%60)
    if(second.length != 2){
        second = '0' + second 
    }
    $('.time').innerText = min + ':' +second
}

getMusicList(function(list){
    loadMusic(list[currentIndex])
    MusicList = list
    generateList(list)
})

$('.play').addEventListener('click',function(){
    if(audio.paused == true){
        audio.play()
        this.querySelector('.fa').classList.remove('fa-play')
        this.querySelector('.fa').classList.add('fa-pause')
    }
    else {
    audio.pause()
    this.querySelector('.fa').classList.remove('fa-pause')
    this.querySelector('.fa').classList.add('fa-play')
    }
})

$('.forward').addEventListener('click',function(){
    currentIndex = ++currentIndex%MusicList.length
    loadMusic(MusicList[currentIndex])
})

$('.back').addEventListener('click',function(){
    currentIndex = (MusicList.length + --currentIndex)%MusicList.length
    loadMusic(MusicList[currentIndex])
})

$('.bar').addEventListener('click',function(e){
    var percent = e.offsetX/parseInt(getComputedStyle($('.bar')).width)
    audio.currentTime = audio.duration*percent
})

audio.onended = function(){
    currentIndex = ++currentIndex%MusicList.length
    loadMusic(MusicList[currentIndex])
}

function generateList(list){
    var container = document.createDocumentFragment()
    list.forEach(function(musicObj){
      var node = document.createElement('li')
      node.innerText = musicObj.author + '-' + musicObj.title
      console.log(node)
      container.appendChild(node)
    })
    $('.musicList').appendChild(container)

}

$('.musicList').addEventListener('click',function(e){
    if(e.target.tagName.toLowerCase() === 'li'){
      for(var i = 0; i < this.children.length; i++){
        if(this.children[i] === e.target){
          musicIndex = i
        }
      }
      loadMusic(MusicList[musicIndex])
      this.children[musicIndex].classList.add('playing')
    }
  }
)
