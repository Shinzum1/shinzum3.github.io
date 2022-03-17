



$ = document.querySelector.bind(document)
$$ = document.querySelectorAll.bind(document)


const PLAYER_STORAGE_KEY = 'LTH_PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        app.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
     songs: [
        {
            name: 'Fashion Tán Gái',
            singer: 'Wren Evans ft. Low G',
            path: './music/song1.mp3',
            image: './music/musicpic/fashion.jpg'
        },
        
        {
            name: 'Talking To The Moon',
            singer: 'Bruno Mars',
            path: './music/song2.mp3',
            image: './music/musicpic/talking.jpg'
        },
     
        {
            name: 'Tam Giác',
            singer: 'Anh Phan ft. Low G',
            path: './music/song3.mp3',
            image: './music/musicpic/tamgiac.jpg'
        },
        
        {
            name: 'Tội',
            singer: 'Hazard Clique',
            path: './music/song4.mp3',
            image: './music/musicpic/toi.jpg'
        },
        
        {
            name: 'Out of Control',
            singer: 'Unknown',
            path: './music/song5.mp3',
            image: './music/musicpic/outofcontrol.jpg'
        },
        
        {
            name: 'Bốn Ba Hai Một',
            singer: 'Hazard Clique',
            path: './music/song6.mp3',
            image: './music/musicpic/4321.jpg'
        },
        
        {
            name: 'Đừng Ai Nhắc Về Cô Ấy',
            singer: 'Phan Anh Quân',
            path: './music/song7.mp3',
            image: './music/musicpic/dungainhac.jpg'
        },
        
        {
            name: 'Harder ,Better, Faster, Stronger',
            singer: 'Keanu Reaves',
            path: './music/song8.mp3',
            image: './music/musicpic/harderbetter.jpg'
        },
        
        {
            name: 'Flexin trên Circle K',
            singer: 'Low G',
            path: './music/song9.mp3',
            image: './music/musicpic/flexin.jpg'
        },
        
        {
            name: 'Lost Time Memory',
            singer: 'IA',
            path: './music/song10.mp3',
            image: './music/musicpic/losttime.jpg'
        },
        
        {
            name: 'Wake Up',
            singer: 'EDEN',
            path: './music/song11.mp3',
            image: './music/musicpic/EDEN.jpg'
        }
    ],

    // Render ra bài hát
    render: function() {
        const htmls =  this.songs.map((song, index) => {
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>

                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>

                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    
    // Định nghĩa lại thuộc tính
    defineProperties: function () {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    // Xử lý event
    handleEvents: function() {
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 8000,
            iterations: Infinity
        }) 
        cdThumbAnimate.pause()

        // Lướt lên ẩn cd đi
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth 
        }

        // Xử lý khi ấn play
       playBtn.onclick = function () {
           if(app.isPlaying) {
            audio.pause()
           } else {
            audio.play()
           }
       }

       // Xử lý khi song được play

       audio.onplay = function () {
        app.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
       }

       // xỬ LÝ KHI BÀI HÁT PAUSE
       audio.onpause = function () {
        app.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
       }

       // Bắt tiến độ bài hát

       audio.ontimeupdate = function () {
        if (audio.duration) {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
            
        }

       }

       // Xử lí khi thay dổi tiến độ 

       progress.onchange = function (e) {
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime

       }

       // Khi next song
       
       nextBtn.onclick = function () {
          if (app.isRandom) {
              app.playRandomSong()
          } else {
              app.nextSong()
          }
        audio.play()
        app.render()
        app.scrolltoActiveSong()

       }

       // Khi prev song

       prevBtn.onclick = function () {

        if (app.isRandom) {
            app.playRandomSong()
        } else {
            app.prevSong()
        }

        audio.play()
        app.render()
        app.scrolltoActiveSong()
       }

       // Khi random
       randomBtn.onclick = function (e) {
           app.isRandom = !app.isRandom
           app.setConfig('isRandom', app.isRandom)
           randomBtn.classList.toggle('active', app.isRandom)
       }
        

       // Khi end song chuyển sang bài mới

       audio.onended = function () {
        if (app.IsRepeat) {
            audio.play()
        } else {
            nextBtn.click()
        }
        scrolltoActiveSong()
       }

       // Lặp lại 1 song

       repeatBtn.onclick = function(e) {
           app.isRepeat = !app.isRepeat
           app.setConfig('isRepeat', app.isRepeat)
           repeatBtn.classList.toggle('active', app.isRepeat)
           randomBtn.classList.toggle('active', app.isRandom)
       }
       

       // Listen event playlist
       playlist.onclick = function (e) {
        const songNode = e.target.closest('.song:not(.active)')

           if (songNode || (e.target.closest('.option')))  {
            
               // Xử lý khi click vào song trong playlist
            if (songNode) {
                app.currentIndex = Number(songNode.dataset.index)
                app.loadCurrentSong()
                app.render()
            }

            // Click vào option

            if (e.target.closest('.option')) {

            }
           }
       }

    },
    
    scrolltoActiveSong: function () {
        setTimeout(function() {
          $('.song.active').scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline:'start',
          })
         
        }, 200)

    },

    // Load bài hát hiện tại
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path   
    },

    loadConfig: function () {
        app.isRandom = app.config.isRandom
        app.isRepeat = app.config.isRepeat
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {

        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        
        this.loadCurrentSong()
    },
    
    start: function() {

        this.loadConfig()

        this.defineProperties()
        
        this.handleEvents()
        
        this.loadCurrentSong()

        this.render()

        // Hiển thị trạng thái ban đầu của button repeat/random
        repeatBtn.classList.toggle('active', app.isRepeat)
        randomBtn.classList.toggle('active', app.isRandom)
        
    }

    
}

app.start()