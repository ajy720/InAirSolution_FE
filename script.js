class Weather {
    main = null
    id = null
    pm10 = null
    pm25 = null
    inAir = null
    temp_max = null
    temp_min = null

    setWeather() {
        this.setMain();
        $("#temperature").text(`${this.temp_max}º / ${this.temp_min}º`)
    }

    setMain() {
        this.main = "맑음"
        console.log(this.id)
        switch (parseInt(this.id / 100)) {
            case 2:
            case 3:
            case 5:
                this.main = "비"
                $("#weatherIcon").attr("src", "./img/rainny.png")
                break

            case 6:
                this.main = "눈"
                $("#weatherIcon").attr("src", "./img/snowy.png")
                break

            case 8:
                if (this.id % 100 > 0) {
                    this.main = "흐림"
                    $("#weatherIcon").attr("src", "./img/cloud.png")
                } else {
                    this.main = "맑음"
                    $("#weatherIcon").attr("src", "./img/sunny.png")
                }
                break

            default:
                this.main = "흐림"
                $("#weatherIcon").attr("src", "./img/cloud.png")
                break


        }
        $("#weather").text(this.main)
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
                el.attr("class", "text-primary font-weight-bold")
                break
            case 2:
                el.text("보통")
                el.attr("class", "text-info font-weight-bold")
                break
            case 3:
                el.text("나쁨")
                el.attr("class", "text-warning font-weight-bold")
                break
            case 4:
                el.text("매우 나쁨")
                el.attr("class", "text-danger font-weight-bold")
                break
        }
    }
}

$(document).ready(function () {
    state = new Weather()

    $("#open").click(() => {
        postCmd(true);
    })

    $("#close").click(() => {
        postCmd(false);
    })


    getWeather();
    setInterval(() => {
        getWeather();

    }, 3000)
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
            // state.main = weather[0].main    
            state.id = weather[0].id
            state.id = 701
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

function postCmd(state) {
    url = `http://ec2-13-125-251-11.ap-northeast-2.compute.amazonaws.com:8000/`

    $.ajax({
        url: url + ((state) ? "open" : "close"),
        method: "post",

    })

    console.log(state)

}