class Weather {
    main = null
    pm10 = null
    pm25 = null
    inAir = null
    temp_max = null
    temp_min = null

    setWeather() {
        $("#weather").text(this.main)
        $("#temperature").text(`${this.temp_max}º / ${this.temp_min}º`)
    }

    setAir() {
        this.setPm(this.pm10, $("#pm10"))
        this.setPm(this.pm25, $("#pm25"))
        this.setPm(this.inAir, $("#inAir"))
    }

    setPm(grade, el) {
        switch (grade) {
            case 1:
                el.text("좋음")
                el.addClass("text-primary")
                break
            case 2:
                el.text("보통")
                el.addClass("text-info")
                break
            case 3:
                el.text("나쁨")
                el.addClass("text-warning")
                break
            case 4:
                el.text("매우 나쁨")
                el.addClass("text-danger")
                break
        }
    }
}

$(document).ready(function () {
    state = new Weather()

    $("#open").click(()=>{
        postCmd(true);
    })

    $("#close").click(()=>{
        postCmd(false);
    })


    getWeather();
    setInterval(() => {
        getWeather();

    }, 5000)
})

function getWeather(city = "종로구") {
    lat = 37.275829
    lon = 127.049812
    key = "dcdea72917356232c43b40113bdd3a74"

    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
    url2 = `http://ec2-13-125-251-11.ap-northeast-2.compute.amazonaws.com:8000/latest`


    $.ajax({
        url: url,
        method: "get",
        success: ({ weather, main }) => {
            // console.log(main)
            state.main = weather[0].main
            state.temp_max = parseInt(main.temp_max - 273)
            state.temp_min = parseInt(main.temp_min - 273)

            state.setWeather()
        }
    })
    
    $.ajax({
        url: url2,
        method: "get",
        success: (data) => {
            // console.log(data)
            state.pm10 = data.pm10
            state.pm25 = data.pm25
            state.inAir = data.quality
            
            state.setAir()
        }
    })

    console.log(state)
}

function postCmd(state){
    url = `http://ec2-13-125-251-11.ap-northeast-2.compute.amazonaws.com:8000/`
    
    $.ajax({
        url: url + ((state) ? "open" : "close"),
        method: "post",

    })
    
    console.log(state)
    
}