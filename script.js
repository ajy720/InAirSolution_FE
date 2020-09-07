$(document).ready(function(){
    getWeather();
    setInterval(()=>{
        getWeather();

    }, 5000)
})

function getWeather(city="종로구"){
    lat = 37.275829
    lon = 127.049812
    key="dcdea72917356232c43b40113bdd3a74"
    key2="YIekZJzgybQx43oc%2BFxCBzfdMAe%2Bd0237vkKrvwyKrbP9WKrXKex5wPySUvFOV9eB5H6HDgAViF7NsEfgU1kyQ%3D%3D"

    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
    url2 = `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=${city}&dataTerm=month&ServiceKey=${key2}&ver=1.3&_returnType=json`


    $.ajax({
        url: url,
        method: "get",
        success:({weather, main})=>{
            console.log(main)
            weather = weather[0].main
            maxTemp = main.temp_max
            minTemp = main.temp_min
        }
    })

    $.ajax({
        url: url2,
        method: "get",
        dataType: 'jsonp',
        success:(data)=>{
            console.log(data[1])
        }
    })

    


}