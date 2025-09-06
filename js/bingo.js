// lib/plugins/bingo/js/bingo.js
// Expose initBingo so the PHP renderer can call it for each instance
(function(window){
  'use strict';

  // simple shuffle (Fisher-Yates)
  function shuffleArray(array){
    for (var i = array.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
    return array;
  }

  // create single instance
  function createInstance(config){
    var words = Array.isArray(config.words) ? config.words.slice() : [];
    var size = parseInt(config.size, 10) || 3;
    var containerId = config.containerId;
    var scoreId = config.scoreId;
    var sound = config.sound || '';

    var container = document.getElementById(containerId);
    var scoreDiv = document.getElementById(scoreId);

    if(!container) return;

    if(words.length !== size * size){
      container.innerHTML = '<div class="bingo-error">Bitte ' + (size*size) + ' Wörter angeben.</div>';
      return;
    }

    // prepare audio
    var bingoSound = null;
    if(sound){
      try {
        bingoSound = new Audio(sound);
        bingoSound.preload = 'auto';
      } catch(e) { bingoSound = null; }
    }

    // create shuffled display array
    var displayWords = shuffleArray(words.slice());

    // state
    var currentIndex = 0;
    var score = 0;

    function updateScore(delta){
      score += delta;
      if(scoreDiv) scoreDiv.textContent = 'Punkte: ' + score;
    }

    function handleCorrect(cell){
      cell.classList.add('clicked');
      cell.setAttribute('aria-pressed','true');
      cell.style.pointerEvents = 'none';
      updateScore(1);
      if(bingoSound && typeof bingoSound.play === 'function') bingoSound.play().catch(function(){});
      currentIndex++;
      if(currentIndex === words.length){
        setTimeout(function(){
          alert('Super! Alle Wörter korrekt angeklickt!\\nEndstand: ' + score + ' Punkte');
        }, 120);
      }
    }

    function handleWrong(){
      updateScore(-1);
      alert('Falsches Wort!');
    }

    // render grid
    container.innerHTML = '';
    container.classList.add('bingo-grid');
    // set CSS grid template according to size
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(' + size + ', 1fr)';
    container.style.gap = '10px';

    // build cells from displayWords
    displayWords.forEach(function(w){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bingo-cell';
      btn.textContent = w;

      // correct index in listening order = position in original words array
      var correctIndex = words.indexOf(w);
      btn.dataset.correctIndex = correctIndex;

      btn.addEventListener('click', function(){
        var idx = parseInt(this.dataset.correctIndex, 10);
        if(idx === currentIndex) handleCorrect(this);
        else handleWrong();
      });

      container.appendChild(btn);
    });

    // init score display
    updateScore(0);
  }

  // global init function called from PHP renderer
  window.initBingo = function(config){
    // allow passing single config or array of configs
    if(Array.isArray(config)){
      config.forEach(createInstance);
    } else {
      createInstance(config);
    }
  };

})(window);
