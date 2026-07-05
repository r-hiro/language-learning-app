(() => {
  "use strict";

  const SETTINGS_KEY = "triLangUserSettings";
  const STATS_KEY = "triLangStats";
  const languages = ["japanese", "english", "korean"];
  const labels = {
    japanese: { japanese: "日本語", english: "Japanese", korean: "일본어" },
    english: { japanese: "英語", english: "English", korean: "영어" },
    korean: { japanese: "韓国語", english: "Korean", korean: "한국어" },
  };
  const ui = {
    japanese: {
      hello: (name) => `こんにちは、${name || "ゲスト"}さん`,
      today: (count) => `今日は${count}問から軽く始めましょう。`,
      choose: "回答言語から1つずつ選んでください。",
      answered: "答え合わせをしました。正解と選んだ答えを確認しましょう。",
      allCorrect: "いいね！その調子！",
      partial: "あと少し！正解を見て覚えよう。",
      wrong: "惜しい！次で覚えよう。",
      reactions: {
        excellent: (rate) => `すごい！ここまで正解率${rate}%。完璧な流れです！`,
        good: (rate) => `正解！ここまで${rate}%、しっかり覚えられています。`,
        recovery: (rate) => `正解！ここから上げていこう。今は${rate}%です。`,
        almostGood: (rate) => `惜しい！ここまで${rate}%です。間違えた方だけ確認しよう。`,
        almost: (rate) => `あと少し。今は${rate}%、正解した方も一緒に覚えよう。`,
        slipped: (rate) => `今回は不正解。でもここまで${rate}%、落ち着いて確認しよう。`,
        support: (rate) => `大丈夫。今は${rate}%、この単語をここで覚えれば前進です。`,
      },
      noWeak: "まだ苦手単語はありません。通常学習から始めましょう。",
      weakReady: (count) => `${count}件の苦手単語があります。`,
      exampleDisabled: "回答後に例文を確認できます。",
      result: (ok, total) => `${total}問中${ok}問正解`,
      noMiss: "今回間違えた単語はありません。",
    },
    english: {
      hello: (name) => `Hello, ${name || "Guest"}`,
      today: (count) => `Let's start lightly with ${count} questions.`,
      choose: "Choose one answer for each language.",
      answered: "Checked. Review the correct answers and your choices.",
      allCorrect: "Great! Keep going!",
      partial: "Almost there. Review the answers once more.",
      wrong: "Close! Let's remember it next time.",
      reactions: {
        excellent: (rate) => `Excellent! Your accuracy is ${rate}% so far.`,
        good: (rate) => `Correct. You are at ${rate}% and doing well.`,
        recovery: (rate) => `Correct. Nice recovery. You are at ${rate}% now.`,
        almostGood: (rate) => `So close. You are at ${rate}%, so review the missed side.`,
        almost: (rate) => `Almost. You are at ${rate}%, and this one can still stick.`,
        slipped: (rate) => `Missed this one, but you are still at ${rate}%. Check it calmly.`,
        support: (rate) => `No worries. You are at ${rate}%; this word is good review.`,
      },
      noWeak: "No weak words yet. Start with normal practice.",
      weakReady: (count) => `${count} weak words are ready for review.`,
      exampleDisabled: "Examples are available after answering.",
      result: (ok, total) => `${ok} correct out of ${total}`,
      noMiss: "No missed words this time.",
    },
    korean: {
      hello: (name) => `안녕하세요, ${name || "게스트"}님`,
      today: (count) => `오늘은 ${count}문제로 가볍게 시작해요.`,
      choose: "각 언어에서 답을 하나씩 골라 주세요.",
      answered: "채점했어요. 정답과 선택한 답을 확인해요.",
      allCorrect: "좋아요! 이대로 계속해요!",
      partial: "거의 맞았어요. 정답을 다시 확인해요.",
      wrong: "아쉬워요! 다음에 기억해요.",
      reactions: {
        excellent: (rate) => `대단해요! 지금까지 정답률 ${rate}%예요.`,
        good: (rate) => `정답이에요. 지금까지 ${rate}%, 잘하고 있어요.`,
        recovery: (rate) => `정답이에요. 이제 올려 봐요. 지금은 ${rate}%예요.`,
        almostGood: (rate) => `아쉬워요. 지금까지 ${rate}%, 틀린 쪽만 확인해요.`,
        almost: (rate) => `거의 맞았어요. 지금은 ${rate}%, 같이 기억해요.`,
        slipped: (rate) => `이번엔 틀렸지만 지금까지 ${rate}%예요. 차분히 확인해요.`,
        support: (rate) => `괜찮아요. 지금은 ${rate}%, 이 단어를 복습하면 돼요.`,
      },
      noWeak: "아직 약한 단어가 없어요. 일반 학습부터 시작해요.",
      weakReady: (count) => `복습할 약한 단어가 ${count}개 있어요.`,
      exampleDisabled: "예문은 답변 후에 확인할 수 있어요.",
      result: (ok, total) => `${total}문제 중 ${ok}문제 정답`,
      noMiss: "이번에 틀린 단어가 없어요.",
    },
  };
  const speechLang = { japanese: "ja-JP", english: "en-US", korean: "ko-KR" };
  const reactionExpression = {
    excellent: "happy",
    good: "smile",
    recovery: "smile",
    almostGood: "wonder",
    almost: "wonder",
    slipped: "sad",
    support: "cry",
  };
  const answerSound = {
    correct: [
      { frequency: 784, duration: 0.12, gain: 0.24 },
      { frequency: 988, duration: 0.12, gain: 0.26 },
      { frequency: 1319, duration: 0.22, gain: 0.28 },
    ],
    incorrect: [
      { frequency: 220, duration: 0.16, gain: 0.22 },
      { frequency: 165, duration: 0.24, gain: 0.2 },
    ],
  };
  const answerSoundVolume = 1.6;
  const defaultSettings = {
    userName: "",
    defaultBaseLanguage: "english",
    defaultQuestionCount: 10,
    characterVisible: true,
  };
  const defaultStats = () => ({
    studyCount: 0,
    answeredCount: 0,
    correctCount: 0,
    byLanguage: Object.fromEntries(languages.map((lang) => [lang, { correct: 0, total: 0 }])),
    words: {},
  });

  const data = window.WORD_DATA || { words: [], categories: [] };
  const words = Array.isArray(data.words) ? data.words : [];
  let settings = loadJson(SETTINGS_KEY, defaultSettings);
  let stats = normalizeStats(loadJson(STATS_KEY, defaultStats()));
  let quiz = null;
  let toastTimer = 0;
  let audioContext = null;
  let answerSoundReady = false;

  const $ = (id) => document.getElementById(id);
  const views = {
    home: $("homeView"),
    setup: $("setupView"),
    weak: $("weakView"),
    quiz: $("quizView"),
    result: $("resultView"),
    stats: $("statsView"),
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    if (!words.length) {
      showToast("単語データを読み込めませんでした。");
      return;
    }
    bindEvents();
    fillTargetSelects();
    applySettingsToForms();
    refreshHome();
    showView("home");
  }

  function bindEvents() {
    prepareAnswerSoundOnFirstGesture();
    $("settingsButton").addEventListener("click", openSettings);
    $("settingsForm").addEventListener("submit", saveSettings);
    $("startButton").addEventListener("click", () => openSetup(false));
    $("weakButton").addEventListener("click", openWeak);
    $("resultButton").addEventListener("click", openStats);
    $("setupBackButton").addEventListener("click", () => showView("home"));
    $("weakBackButton").addEventListener("click", () => showView("home"));
    $("statsHomeButton").addEventListener("click", () => showView("home"));
    $("resultHomeButton").addEventListener("click", () => {
      refreshHome();
      showView("home");
    });
    $("quizExitButton").addEventListener("click", () => {
      refreshHome();
      showView("home");
    });
    $("setupForm").addEventListener("submit", (event) => {
      event.preventDefault();
      startQuiz(readQuizForm("quiz"), false);
    });
    $("weakForm").addEventListener("submit", (event) => {
      event.preventDefault();
      startQuiz(readQuizForm("weak"), true);
    });
    $("quizAnswerModeSelect").addEventListener("change", () => updateSingleTarget("quiz"));
    $("quizBaseLanguageSelect").addEventListener("change", () => updateSingleTarget("quiz"));
    $("weakAnswerModeSelect").addEventListener("change", () => updateSingleTarget("weak"));
    $("weakBaseLanguageSelect").addEventListener("change", () => updateSingleTarget("weak"));
    $("answerButton").addEventListener("click", gradeCurrentQuestion);
    $("nextQuestionButton").addEventListener("click", nextQuestion);
    $("retryButton").addEventListener("click", () => startQuiz(quiz.lastOptions, quiz.isWeakMode));
    $("resetStatsButton").addEventListener("click", resetStats);
    $("exampleButton").addEventListener("click", toggleExample);
    $("questionSpeakButton").addEventListener("click", () => speak(currentWord()[quiz.baseLanguage], quiz.baseLanguage));
  }

  function openSettings() {
    applySettingsToForms();
    const dialog = $("settingsDialog");
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "open");
    }
  }

  function saveSettings(event) {
    event.preventDefault();
    if (event.submitter?.id === "closeSettingsButton") {
      $("settingsDialog").close?.();
      return;
    }
    settings = {
      userName: $("userNameInput").value.trim(),
      defaultBaseLanguage: $("baseLanguageSelect").value,
      defaultQuestionCount: Number($("questionCountSelect").value),
      characterVisible: $("characterVisibleInput").checked,
    };
    saveJson(SETTINGS_KEY, settings);
    $("settingsDialog").close?.();
    applySettingsToForms();
    refreshHome();
    showToast("設定を保存しました。");
  }

  function openSetup() {
    applySettingsToForms();
    updateSingleTarget("quiz");
    showView("setup");
  }

  function openWeak() {
    applySettingsToForms();
    renderWeakPreview();
    updateSingleTarget("weak");
    showView("weak");
  }

  function openStats() {
    renderStats();
    showView("stats");
  }

  function showView(name) {
    Object.entries(views).forEach(([key, el]) => el.classList.toggle("hidden", key !== name));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function refreshHome() {
    const base = settings.defaultBaseLanguage;
    $("welcomeText").textContent = ui[base].hello(settings.userName);
    $("todayNote").textContent = ui[base].today(settings.defaultQuestionCount);
    $("totalStudyCount").textContent = stats.studyCount;
    $("totalCorrectRate").textContent = percent(stats.correctCount, stats.answeredCount);
    $("weakWordCount").textContent = weakWords().length;
    updateCharacter("characterFrame", "characterLabel", base);
  }

  function applySettingsToForms() {
    $("userNameInput").value = settings.userName || "";
    $("baseLanguageSelect").value = settings.defaultBaseLanguage;
    $("questionCountSelect").value = String(settings.defaultQuestionCount);
    $("characterVisibleInput").checked = settings.characterVisible;
    $("quizBaseLanguageSelect").value = settings.defaultBaseLanguage;
    $("quizQuestionCountSelect").value = String(settings.defaultQuestionCount);
    $("weakBaseLanguageSelect").value = settings.defaultBaseLanguage;
  }

  function fillTargetSelects() {
    ["quiz", "weak"].forEach((prefix) => updateSingleTarget(prefix));
  }

  function updateSingleTarget(prefix) {
    const base = $(`${prefix}BaseLanguageSelect`).value;
    const mode = $(`${prefix}AnswerModeSelect`).value;
    const field = $(`${prefix}SingleTargetField`);
    const select = $(`${prefix}SingleTargetSelect`);
    const current = select.value;
    select.innerHTML = "";
    targetLanguages(base, "one").forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang;
      option.textContent = labels[lang].japanese;
      select.append(option);
    });
    if (targetLanguages(base, "one").includes(current)) select.value = current;
    field.classList.toggle("hidden", mode !== "one");
  }

  function readQuizForm(prefix) {
    const baseLanguage = $(`${prefix}BaseLanguageSelect`).value;
    const answerMode = $(`${prefix}AnswerModeSelect`).value;
    return {
      baseLanguage,
      questionCount: prefix === "quiz" ? Number($("quizQuestionCountSelect").value) : weakWords().length,
      category: prefix === "quiz" ? $("quizCategorySelect").value : "all",
      answerMode,
      singleTargetLanguage: $(`${prefix}SingleTargetSelect`).value,
    };
  }

  function startQuiz(options, isWeakMode = false) {
    const source = isWeakMode ? weakWords() : filterWords(options.category);
    if (!source.length) {
      showToast(isWeakMode ? ui[options.baseLanguage].noWeak : "出題できる単語がありません。");
      return;
    }
    const count = Math.min(Number(options.questionCount) || 10, source.length);
    quiz = {
      baseLanguage: options.baseLanguage,
      answerMode: options.answerMode,
      targets: targetLanguages(options.baseLanguage, options.answerMode, options.singleTargetLanguage),
      questions: shuffle(source).slice(0, count),
      index: 0,
      selected: {},
      graded: false,
      results: [],
      lastOptions: { ...options },
      isWeakMode,
    };
    $("answerColumns").classList.toggle("single", quiz.targets.length === 1);
    updateQuizTexts();
    showView("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    quiz.selected = {};
    quiz.graded = false;
    const word = currentWord();
    const base = quiz.baseLanguage;
    $("quizProgressText").textContent = `${quiz.index + 1} / ${quiz.questions.length}`;
    $("quizProgressBar").style.width = `${((quiz.index + 1) / quiz.questions.length) * 100}%`;
    $("questionLanguage").textContent = labels[base][base];
    $("questionWord").textContent = word[base];
    $("quizMessage").textContent = ui[base].choose;
    $("answerButton").disabled = true;
    $("answerButton").classList.remove("hidden");
    $("nextQuestionButton").classList.add("hidden");
    $("exampleButton").disabled = true;
    $("examplePanel").classList.add("hidden");
    $("examplePanel").innerHTML = "";
    updateQuizCharacter(base, "normal");
    setQuizReactionClass("");
    renderCandidates(word);
  }

  function renderCandidates(word) {
    const container = $("answerColumns");
    container.innerHTML = "";
    const candidateSet = candidateWords(word);
    quiz.targets.forEach((lang) => {
      const group = document.createElement("section");
      group.className = "candidate-group";
      const heading = document.createElement("h3");
      heading.textContent = labels[lang][quiz.baseLanguage];
      const list = document.createElement("div");
      list.className = "candidate-list";
      shuffle(candidateSet).forEach((candidate) => {
        const row = document.createElement("div");
        row.className = "candidate-row";
        const button = document.createElement("button");
        button.className = "candidate-button";
        button.type = "button";
        button.dataset.lang = lang;
        button.dataset.wordId = candidate.id;
        button.innerHTML = `
          <span class="candidate-text">${escapeHtml(candidate[lang])}</span>
          <span class="candidate-base hidden">${escapeHtml(candidate[quiz.baseLanguage])}</span>
          <span class="answer-mark"></span>
        `;
        button.addEventListener("click", () => selectCandidate(lang, candidate.id));
        const speakButton = document.createElement("button");
        speakButton.className = "candidate-speak icon-button";
        speakButton.type = "button";
        speakButton.textContent = "音";
        speakButton.setAttribute("aria-label", `${candidate[lang]} の発音を聴く`);
        speakButton.addEventListener("click", () => speak(candidate[lang], lang));
        row.append(button, speakButton);
        list.append(row);
      });
      group.append(heading, list);
      container.append(group);
    });
  }

  function selectCandidate(lang, wordId) {
    if (quiz.graded) return;
    quiz.selected[lang] = wordId;
    document.querySelectorAll(`.candidate-button[data-lang="${lang}"]`).forEach((button) => {
      button.classList.toggle("selected", button.dataset.wordId === wordId);
    });
    $("answerButton").disabled = quiz.targets.some((target) => !quiz.selected[target]);
  }

  function gradeCurrentQuestion() {
    if (quiz.graded) return;
    quiz.graded = true;
    const word = currentWord();
    const perLanguage = {};
    let correctTargets = 0;
    quiz.targets.forEach((lang) => {
      const correct = quiz.selected[lang] === word.id;
      perLanguage[lang] = correct;
      if (correct) correctTargets += 1;
    });
    const allCorrect = correctTargets === quiz.targets.length;
    playAnswerSound(allCorrect ? "correct" : "incorrect");
    quiz.results.push({ wordId: word.id, perLanguage, allCorrect });
    updateStatsForAnswer(word, perLanguage, allCorrect, quiz.isWeakMode);
    renderGradedCandidates(word);
    applyQuizReaction(correctTargets);
    $("answerButton").classList.add("hidden");
    $("nextQuestionButton").classList.toggle("hidden", quiz.index >= quiz.questions.length - 1);
    if (quiz.index >= quiz.questions.length - 1) $("nextQuestionButton").textContent = "結果を見る";
    $("nextQuestionButton").classList.remove("hidden");
    $("exampleButton").disabled = false;
    saveJson(STATS_KEY, stats);
  }

  function renderGradedCandidates(word) {
    document.querySelectorAll(".candidate-button").forEach((button) => {
      const lang = button.dataset.lang;
      const isCorrect = button.dataset.wordId === word.id;
      const isSelected = quiz.selected[lang] === button.dataset.wordId;
      button.disabled = true;
      button.classList.toggle("correct", isCorrect);
      button.classList.toggle("wrong", isSelected && !isCorrect);
      button.querySelector(".candidate-base").classList.remove("hidden");
      button.querySelector(".answer-mark").textContent = isCorrect ? "◎" : isSelected ? "ｘ" : "";
    });
  }

  function applyQuizReaction(correctTargets) {
    const answered = quiz.results.length;
    const correctQuestions = quiz.results.filter((result) => result.allCorrect).length;
    const rateValue = Math.round((correctQuestions / Math.max(answered, 1)) * 100);
    const rate = String(rateValue);
    const allCorrect = correctTargets === quiz.targets.length;
    const partialCorrect = correctTargets > 0;
    let reaction = "support";

    if (allCorrect) {
      reaction = rateValue >= 90 ? "excellent" : rateValue >= 70 ? "good" : "recovery";
    } else if (partialCorrect) {
      reaction = rateValue >= 70 ? "almostGood" : "almost";
    } else {
      reaction = rateValue >= 70 ? "slipped" : "support";
    }

    $("quizMessage").textContent = ui[quiz.baseLanguage].reactions[reaction](rate);
    setQuizReactionClass(reaction);
  }

  function setQuizReactionClass(reaction) {
    const helper = $("quizHelper");
    const character = $("quizCharacter");
    const reactionClasses = [
      "reaction-excellent",
      "reaction-good",
      "reaction-recovery",
      "reaction-almost-good",
      "reaction-almost",
      "reaction-slipped",
      "reaction-support",
    ];
    helper.classList.remove(...reactionClasses);
    character.classList.remove(...reactionClasses);
    if (!reaction) return;
    const className = `reaction-${reaction.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
    helper.classList.add(className);
    character.classList.add(className);
    updateQuizCharacter(quiz.baseLanguage, reactionExpression[reaction] || "normal");
  }

  function nextQuestion() {
    if (quiz.index >= quiz.questions.length - 1) {
      finishQuiz();
      return;
    }
    quiz.index += 1;
    renderQuestion();
  }

  function finishQuiz() {
    stats.studyCount += 1;
    saveJson(STATS_KEY, stats);
    renderResult();
    showView("result");
  }

  function renderResult() {
    const total = quiz.results.length;
    const correct = quiz.results.filter((result) => result.allCorrect).length;
    $("resultRate").textContent = percent(correct, total);
    $("resultText").textContent = ui[quiz.baseLanguage].result(correct, total);
    const languageRates = $("languageRates");
    languageRates.innerHTML = "";
    quiz.targets.forEach((lang) => {
      const totalByLang = quiz.results.length;
      const correctByLang = quiz.results.filter((result) => result.perLanguage[lang]).length;
      languageRates.append(card("article", `<span>${labels[lang][quiz.baseLanguage]}</span><strong>${percent(correctByLang, totalByLang)}</strong>`));
    });
    const misses = quiz.results.filter((result) => !result.allCorrect).map((result) => words.find((word) => word.id === result.wordId)).filter(Boolean);
    $("missedList").innerHTML = `<h2>間違えた単語</h2>${
      misses.length
        ? misses.map((word) => `<p><strong>${escapeHtml(word[quiz.baseLanguage])}</strong><br>${languages.map((lang) => `${labels[lang].japanese}: ${escapeHtml(word[lang])}`).join(" / ")}</p>`).join("")
        : `<p>${ui[quiz.baseLanguage].noMiss}</p>`
    }`;
  }

  function renderStats() {
    $("statsStudyCount").textContent = stats.studyCount;
    $("statsAnsweredCount").textContent = stats.answeredCount;
    $("statsCorrectRate").textContent = percent(stats.correctCount, stats.answeredCount);
    const languageList = $("statsLanguageList");
    languageList.innerHTML = "";
    languages.forEach((lang) => {
      const item = stats.byLanguage[lang] || { correct: 0, total: 0 };
      languageList.append(card("article", `<div><strong>${labels[lang].japanese}</strong><small>${item.total}回答 / ${item.correct}正解</small></div><span>${percent(item.correct, item.total)}</span>`, "stats-language-card"));
    });
    renderWeakList($("statsWeakWordList"), weakWords(), "苦手単語はありません。");
  }

  function renderWeakPreview() {
    const list = weakWords();
    $("weakNote").textContent = list.length ? ui[settings.defaultBaseLanguage].weakReady(list.length) : ui[settings.defaultBaseLanguage].noWeak;
    $("weakStartButton").disabled = list.length === 0;
    renderWeakList($("weakPreviewList"), list.slice(0, 20), "苦手単語はありません。");
  }

  function renderWeakList(container, list, emptyText) {
    container.innerHTML = "";
    if (!list.length) {
      container.innerHTML = `<p>${emptyText}</p>`;
      return;
    }
    list.forEach((word) => {
      const record = stats.words[word.id] || {};
      container.append(card("article", `<strong>${escapeHtml(word.japanese)} / ${escapeHtml(word.english)} / ${escapeHtml(word.korean)}</strong><span>${word.categoryJa || word.category} - ${record.total || 0}回回答</span>`, "weak-word-card"));
    });
  }

  function toggleExample() {
    if (!quiz?.graded) {
      showToast(ui[quiz.baseLanguage].exampleDisabled);
      return;
    }
    const panel = $("examplePanel");
    if (!panel.classList.contains("hidden")) {
      panel.classList.add("hidden");
      return;
    }
    const word = currentWord();
    panel.innerHTML = quiz.targets
      .map((lang) => `<p><strong>${labels[lang][quiz.baseLanguage]}</strong><span>${escapeHtml(word.examples?.[lang] || "")}</span></p>`)
      .join("");
    panel.classList.remove("hidden");
  }

  function updateStatsForAnswer(word, perLanguage, allCorrect, isWeakMode) {
    stats.answeredCount += 1;
    if (allCorrect) stats.correctCount += 1;
    const record = stats.words[word.id] || {
      total: 0,
      correct: 0,
      incorrect: 0,
      streakCorrect: 0,
      weak: false,
      byLanguage: Object.fromEntries(languages.map((lang) => [lang, { correct: 0, total: 0 }])),
    };
    record.total += 1;
    if (allCorrect) {
      record.correct += 1;
      record.streakCorrect += 1;
    } else {
      record.incorrect += 1;
      record.streakCorrect = 0;
    }
    Object.entries(perLanguage).forEach(([lang, correct]) => {
      stats.byLanguage[lang].total += 1;
      record.byLanguage[lang].total += 1;
      if (correct) {
        stats.byLanguage[lang].correct += 1;
        record.byLanguage[lang].correct += 1;
      }
    });
    const rate = record.correct / Math.max(record.total, 1);
    record.weak = allCorrect && isWeakMode ? false : record.total >= 2 && rate < 0.8;
    if (!allCorrect) record.weak = true;
    if (record.streakCorrect >= 3) record.weak = false;
    record.lastStudiedAt = new Date().toISOString();
    stats.words[word.id] = record;
  }

  function resetStats() {
    if (!confirm("成績をリセットしますか？")) return;
    stats = defaultStats();
    saveJson(STATS_KEY, stats);
    renderStats();
    refreshHome();
    showToast("成績をリセットしました。");
  }

  function candidateWords(word) {
    const sameCategory = words
      .filter((item) => item.id !== word.id && item.category === word.category)
      .sort((a, b) => Math.abs(a.difficulty - word.difficulty) - Math.abs(b.difficulty - word.difficulty));
    const fallback = words.filter((item) => item.id !== word.id && item.category !== word.category);
    const candidates = [];
    [...sameCategory, ...shuffle(fallback)].forEach((item) => {
      if (candidates.length < 4 && !candidates.some((candidate) => candidate.id === item.id)) {
        candidates.push(item);
      }
    });
    return [word, ...shuffle(candidates)].slice(0, 5);
  }

  function filterWords(category) {
    return category && category !== "all" ? words.filter((word) => word.category === category) : words;
  }

  function targetLanguages(base, mode, singleTarget) {
    const targets = languages.filter((lang) => lang !== base);
    if (mode === "one") return [targets.includes(singleTarget) ? singleTarget : targets[0]];
    return targets;
  }

  function weakWords() {
    return words.filter((word) => stats.words[word.id]?.weak);
  }

  function currentWord() {
    return quiz.questions[quiz.index];
  }

  function updateQuizTexts() {
    const base = quiz.baseLanguage;
    $("questionSpeakButton").textContent = base === "english" ? "Voice" : base === "korean" ? "음성" : "音声";
    $("exampleButton").textContent = base === "english" ? "Examples" : base === "korean" ? "예문" : "例文";
    $("answerButton").textContent = base === "english" ? "Answer" : base === "korean" ? "답하기" : "回答する";
    $("nextQuestionButton").textContent = base === "english" ? "Next" : base === "korean" ? "다음 문제" : "次の問題へ";
  }

  function updateCharacter(frameId, labelId, lang) {
    const frame = $(frameId);
    frame.classList.toggle("hidden", !settings.characterVisible);
    frame.classList.remove("character-japanese", "character-english", "character-korean");
    frame.classList.add(`character-${lang}`);
    $(labelId).textContent = `${labels[lang].japanese}担当`;
  }

  function updateQuizCharacter(lang, expression = "normal") {
    const helper = $("quizHelper");
    const character = $("quizCharacter");
    const image = $("quizCharacterImage");
    helper.classList.toggle("hidden", !settings.characterVisible);
    character.classList.remove("character-japanese", "character-english", "character-korean");
    character.classList.add(`character-${lang}`);
    image.src = `assets/characters/${lang}-${expression}.png`;
    image.alt = `${labels[lang].japanese}担当キャラクター ${expression}`;
  }

  function prepareAnswerSoundOnFirstGesture() {
    const unlock = () => {
      const context = getAudioContext();
      if (!context || answerSoundReady) return;
      resumeAudioContext(context);
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.setValueAtTime(440, context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.015);
      answerSoundReady = true;
    };
    document.addEventListener("pointerdown", unlock, { once: true, passive: true });
    document.addEventListener("touchstart", unlock, { once: true, passive: true });
    document.addEventListener("click", unlock, { once: true });
  }

  function getAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    try {
      if (!audioContext) audioContext = new AudioContext();
      return audioContext;
    } catch {
      return null;
    }
  }

  function resumeAudioContext(context) {
    if (context.state === "suspended" && typeof context.resume === "function") {
      context.resume().catch?.(() => {});
    }
  }

  function playAnswerSound(type) {
    const context = getAudioContext();
    if (!context) return;
    try {
      resumeAudioContext(context);
      const now = context.currentTime + 0.025;
      let cursor = now;
      answerSound[type].forEach((note) => {
        playTone(context, {
          frequency: note.frequency,
          duration: note.duration,
          gain: note.gain * answerSoundVolume,
          startAt: cursor,
          type,
        });
        cursor += note.duration + 0.045;
      });
    } catch {
      // Effect sounds are optional; quiz flow should continue if audio is blocked.
    }
  }

  function playTone(context, note) {
    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(0.0001, note.startAt);
    masterGain.gain.exponentialRampToValueAtTime(Math.min(note.gain, 0.7), note.startAt + 0.02);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, note.startAt + note.duration);
    masterGain.connect(context.destination);

    [
      { ratio: 1, level: 1 },
      { ratio: 2, level: note.type === "correct" ? 0.34 : 0.18 },
    ].forEach((voice) => {
      const oscillator = context.createOscillator();
      oscillator.type = note.type === "correct" ? "triangle" : "square";
      oscillator.frequency.setValueAtTime(note.frequency * voice.ratio, note.startAt);
      const voiceGain = context.createGain();
      voiceGain.gain.setValueAtTime(voice.level, note.startAt);
      oscillator.connect(voiceGain);
      voiceGain.connect(masterGain);
      oscillator.start(note.startAt);
      oscillator.stop(note.startAt + note.duration + 0.04);
    });
  }

  function speak(text, lang) {
    if (!("speechSynthesis" in window)) {
      showToast("このブラウザでは音声読み上げを利用できません。");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang[lang];
    window.speechSynthesis.speak(utterance);
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
  }

  function loadJson(key, fallback) {
    try {
      return { ...fallback, ...JSON.parse(localStorage.getItem(key) || "{}") };
    } catch {
      return { ...fallback };
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeStats(value) {
    const base = defaultStats();
    const merged = { ...base, ...value };
    merged.byLanguage = { ...base.byLanguage, ...(value.byLanguage || {}) };
    languages.forEach((lang) => {
      merged.byLanguage[lang] = { correct: 0, total: 0, ...(merged.byLanguage[lang] || {}) };
    });
    merged.words = value.words || {};
    return merged;
  }

  function percent(correct, total) {
    return total ? `${Math.round((correct / total) * 100)}%` : "--";
  }

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function card(tag, html, className = "") {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.innerHTML = html;
    return el;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
