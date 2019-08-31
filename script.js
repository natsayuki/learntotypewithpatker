let data = {
  mode: "title",
  toType: "",
  haveTyped: "",
  playing: false,
  patkerify: true,
  mistakes: 0,
  quickplay: {
    time: [],
    sentence: 0,
    seconds: 0,
  }
}

let methods = {
  startQuickplay(){
    data.mode = "quickplay";
    data.playing = true;
    data.toType = methods.makeSentence();
  },
  misspell(string){
    if(!data.patkerify){
      return string;
    }
    string = string.toLowerCase();
    words = string.split(" ");
    final = [];
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    words.forEach(word => {
      if(random(0, 2) == 0){
        let done = false;
        if(random(0, 1) == 0 && misspellings[word]){
          word = misspellings[word]
          done = true;
        }
        else{
          vowels.forEach(vowel => {
            if(word.indexOf(vowel) != -1 && !done){
              word = word.replace(vowel, vowels[random(0, 5)]);
              done = true;
            }
          });
        }
      }
      final.push(word);
    });
    return final.join(" ");
  },
  makeSentence(){
    $.get("/api", {"type": "sentence"}, response => {
      console.log(response);
      data.toType = methods.misspell(response.trim());
      data.quickplay.time.push({start: new Date().getTime()});
    });
    // sentence = "Welcome to learn to type with patker sexton"
  },
  newSentence(){
    methods.makeSentence();
    data.haveTyped = "";
  },
  showSeconds(){
    const seconds = document.querySelector('#seconds');
    seconds.classList.add('secondsShow');
    seconds.addEventListener('animationend', e => {
      seconds.classList.remove('secondsShow');
    });
  }
}

computed = {
  quickplayTotalTime: function(){
    let elapsed = 0;
    data.quickplay.time.forEach(stamp => {
      console.log(stamp);
      elapsed += stamp.seconds;
    });
    return elapsed;
  },
  quickplayAverageTime: function(){
    return computed.quickplayTotalTime() / data.quickplay.time.length;
  },
  quickplayFastestSentence: function(){
    let sentenceTime = false;
    let sentence;
    data.quickplay.time.forEach(stamp => {
      if(!sentenceTime){
        sentenceTime = stamp.seconds
        sentence = stamp.sentence;
      }
      else if(stamp.seconds < sentenceTime){
        sentenceTime = stamp.seconds
        sentence = stamp.sentence;
      }
    });
    return {time: sentenceTime, sentence: sentence};
  },
  quickplaySlowestSentence: function(){
    let sentenceTime = false;
    let sentence;
    data.quickplay.time.forEach(stamp => {
      if(!sentenceTime){
        sentenceTime = stamp.seconds
        sentence = stamp.sentence;
      }
      else if(stamp.seconds > sentenceTime){
        sentenceTime = stamp.seconds
        sentence = stamp.sentence;
      }
    });
    return {time: sentenceTime, sentence: sentence};
  },
  quickplayWordsPerMinute: function(){
    let words = 0;
    data.quickplay.time.forEach(stamp => {
      words += stamp.sentence.split(" ").length;
    });
    return (words / computed.quickplayTotalTime()) * 60;
  }
}

watch = {
  haveTyped: function(){
    const end = 10;
    if(data.haveTyped == data.toType){
      const time = data.quickplay.time[data.quickplay.sentence];
      time.end = new Date().getTime();
      time.miliseconds = time.end - time.start;
      time.seconds = time.miliseconds / 1000;
      time.sentence = data.toType;
      data.quickplay.seconds = time.seconds;
      data.quickplay.sentence++;
      methods.showSeconds();
      if(data.quickplay.sentence == end){
        data.playing = false;
        data.mode = "quickplayEnd";
        return;
      }
      methods.newSentence();
    }
  },
}

function random(min, max){
  return Math.floor(Math.random() * max) + min;
}
Vue.use(VueMaterial.default);

Vue.config.productionTip = false;

const vm = new Vue({
  el: "#app",
  data: data,
  methods: methods,
  computed: computed,
  watch: watch,
});

document.addEventListener('keypress', e => {
  if(data.playing){
    e.preventDefault();
    if(data.toType[data.haveTyped.length] == e.key) data.haveTyped += e.key;
    else{
      const qpWrapper = document.querySelector("#quickplayWrapper");
      data.mistakes++;
      qpWrapper.classList.add('shake');
      qpWrapper.addEventListener('animationend', e => {
        qpWrapper.classList.remove('shake');
      });
    }
  }
});
