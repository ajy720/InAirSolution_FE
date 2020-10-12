class Weather {
  main = null;
  id = null;
  pm10 = null;
  pm25 = null;
  inAir = null;
  temp_max = null;
  temp_min = null;

  setWeather() {
    this.setMain(); // 날씨정보 변경
    $("#temperature").text(`${this.temp_max}º / ${this.temp_min}º`);
  } // 현재 상태에 따른 날씨 정보 변경

  setMain() {
    this.main = "맑음";
    switch (parseInt(this.id / 100)) {
      case 2:
      case 3:
      case 5:
        this.main = "비";
        $("#weatherIcon").attr("src", "./img/rainny.png");
        break;

      case 6:
        this.main = "눈";
        $("#weatherIcon").attr("src", "./img/snowy.png");
        break;

      case 8:
        if (this.id % 100 > 0) {
          this.main = "흐림";
          $("#weatherIcon").attr("src", "./img/cloud.png");
        } else {
          this.main = "맑음";
          $("#weatherIcon").attr("src", "./img/sunny.png");
        }
        break;

      default:
        this.main = "흐림";
        $("#weatherIcon").attr("src", "./img/cloud.png");
        break;
    } // 날씨 코드에 따른 글씨 및 날씨 아이콘 변경
    $("#weather").text(this.main);
  }

  setAir() {
    this.setPm(this.pm10, $("#pm10"));
    this.setPm(this.pm25, $("#pm25"));
    this.setPm(this.inAir, $("#inAir"));
  } // 공기 상태에 따른 글씨와 스타일 변경

  setPm(grade, el) {
    switch (grade) {
      case 1:
        el.text("좋음");
        el.attr("class", "text-primary font-weight-bold");
        break;
      case 2:
        el.text("보통");
        el.attr("class", "text-info font-weight-bold");
        break;
      case 3:
        el.text("나쁨");
        el.attr("class", "text-warning font-weight-bold");
        break;
      case 4:
        el.text("매우 나쁨");
        el.attr("class", "text-danger font-weight-bold");
        break;
    }
  } // 공기 상태를 4단계로 분류해 구분
}

class Vent {
  is_venting = null;
  need_venting = null;
  last_select = true;

  setWindow() {
    if (this.is_venting) {
      $("#windowImg").attr("src", "./img/windows_open.png");
    } else {
      $("#windowImg").attr("src", "./img/windows_close.png");
    } // 현재 상태에 따른 창문 사진 변경

    if (this.need_venting && !this.is_venting) {
      if (this.last_select) {
        this.openModal();
        this.last_select = false;
      }
    } else {
      this.last_select = true; 
      // 취소했음에도 불구하고 계속 알람이 뜨는 것을 방지하기 위한 변수
    } // 환기가 필요하다면 알람을 띄워주기
  }

  openModal() {
    $("#modal").modal();
  }

  windowCmd(state) {
    url = `http://ec2-54-180-150-255.ap-northeast-2.compute.amazonaws.com:8000/`;

    $.ajax({
      url: url + (state ? "open" : "close"),
      method: "post",
    });
  } // 사용자 선택에 따른 창문 조작 신호 서버로 전송
}

class Led {
  state = null;

  setLamp() {
    if (this.state) {
      $("#ledImg").attr("src", "./img/lamp_on.png");
    } else {
      $("#ledImg").attr("src", "./img/lamp_off.png");
    }
  } // 현재 상태에 따른 LED 사진 변경

  ledCmd(state) {
    url = `http://ec2-54-180-150-255.ap-northeast-2.compute.amazonaws.com:8000/`;

    $.ajax({
      url: url + (state ? "on" : "off"),
      method: "post",
    });
  } // 사용자 선택에 따른 LED 조작 신호 서버로 전송
}

$(document).ready(function () {
  state = new Weather();
  vent = new Vent();
  lamp = new Led();
  // 각종 컴포넌트 선언부

  $("#open").click(() => {
    vent.windowCmd(true);
  });

  $("#close").click(() => {
    vent.windowCmd(false);
  });

  $("#popupOpen").click(() => {
    vent.windowCmd(true);
  });

  $("#popupClose").click(() => {
    vent.windowCmd(false);
  });

  $("#on").click(() => {
    lamp.ledCmd(true);
  });

  $("#off").click(() => {
    lamp.ledCmd(false);
  });
  // 창문 열기/닫기, 램프 켜기/끄기 이벤트 리스너 부분

  getInfo(); // 각종 API 정보를 받아오는 함수

  setInterval(() => {
    getInfo();
  }, 1500);
  // 1.5초마다 반복해서 상태 업데이트
});

function getInfo() {
  lat = 37.275829;
  lon = 127.049812;
  key = "dcdea72917356232c43b40113bdd3a74";

  url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
  url2 = `http://ec2-54-180-150-255.ap-northeast-2.compute.amazonaws.com:8000/`;

  $.ajax({
    url: url,
    method: "get",
    success: ({ weather, main }) => {
      state.id = weather[0].id;
      state.id = 701;
      state.temp_max = parseInt(main.temp_max - 273);
      state.temp_min = parseInt(main.temp_min - 273);
      // 가져온 데이터 저장

      state.setWeather();
      // 데이터에 따른 UI 조작 메서드
    },
  });
  // openweathermap의 API를 활용해서 현재 날씨 가져오기

  $.ajax({
    url: url2 + "latest",
    method: "get",
    success: (data) => {
      console.log(data);
      state.pm10 = data.pm10;
      state.pm25 = data.pm25;
      state.inAir = data.quality;
      vent.is_venting = data.is_venting;
      vent.need_venting = data.need_venting;
      // 가져온 데이터 저장

      state.setAir();
      vent.setWindow();
      // 데이터에 따른 UI 조작 메서드
    },
  });
  // 보드에서 전송한 가장 최근 데이터를 서버에서 가져옴(미세먼지, 실내 공기질 등)

  $.ajax({
    url: url2 + "cmdState",
    method: "get",
    success: ({ led }) => {
      lamp.state = led;
      // 가져온 데이터 저장

      lamp.setLamp();
      // 데이터에 따른 UI 조작 메서드
    },
  });
  // 서버에서 현재 LED 상태를 가져옴
}
