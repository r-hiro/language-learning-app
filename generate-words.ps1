$ErrorActionPreference = "Stop"

$root = if ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { (Get-Location).Path }
$dataDir = Join-Path $root "data"
$outPath = Join-Path $dataDir "words.json"
$jsOutPath = Join-Path $dataDir "words.js"

New-Item -ItemType Directory -Force -Path $dataDir | Out-Null

$sources = @{
  noun = @'
今日|today|오늘
明日|tomorrow|내일
昨日|yesterday|어제
朝|morning|아침
昼|noon|낮
夜|night|밤
時間|time|시간
日|day|날
週|week|주
月|month|달
年|year|년
家|home|집
部屋|room|방
学校|school|학교
会社|company|회사
駅|station|역
店|store|가게
病院|hospital|병원
銀行|bank|은행
郵便局|post office|우체국
レストラン|restaurant|식당
カフェ|cafe|카페
公園|park|공원
道|road|길
車|car|자동차
電車|train|전철
バス|bus|버스
自転車|bicycle|자전거
空港|airport|공항
飛行機|airplane|비행기
水|water|물
お茶|tea|차
コーヒー|coffee|커피
ご飯|rice|밥
パン|bread|빵
朝食|breakfast|아침 식사
昼食|lunch|점심 식사
夕食|dinner|저녁 식사
果物|fruit|과일
野菜|vegetable|채소
肉|meat|고기
魚|fish|생선
卵|egg|달걀
牛乳|milk|우유
服|clothes|옷
靴|shoes|신발
バッグ|bag|가방
財布|wallet|지갑
鍵|key|열쇠
電話|phone|전화
スマホ|smartphone|스마트폰
パソコン|computer|컴퓨터
本|book|책
ノート|notebook|공책
ペン|pen|펜
机|desk|책상
椅子|chair|의자
窓|window|창문
ドア|door|문
風呂|bath|목욕
トイレ|toilet|화장실
台所|kitchen|부엌
家族|family|가족
友達|friend|친구
先生|teacher|선생님
学生|student|학생
子ども|child|아이
母|mother|어머니
父|father|아버지
兄|older brother|형
姉|older sister|언니
名前|name|이름
言葉|word|말
日本語|Japanese language|일본어
英語|English language|영어
韓国語|Korean language|한국어
天気|weather|날씨
雨|rain|비
雪|snow|눈
風|wind|바람
空|sky|하늘
海|sea|바다
山|mountain|산
川|river|강
花|flower|꽃
犬|dog|개
猫|cat|고양이
音楽|music|음악
映画|movie|영화
写真|photo|사진
お金|money|돈
仕事|work|일
勉強|study|공부
旅行|travel|여행
予定|plan|예정
問題|question|문제
答え|answer|답
薬|medicine|약
病気|illness|병
新聞|newspaper|신문
'@
  verb = @'
行く|go|가다
来る|come|오다
帰る|return|돌아가다
食べる|eat|먹다
飲む|drink|마시다
見る|see|보다
聞く|listen|듣다
話す|speak|말하다
読む|read|읽다
書く|write|쓰다
買う|buy|사다
売る|sell|팔다
使う|use|사용하다
作る|make|만들다
する|do|하다
勉強する|study|공부하다
働く|work|일하다
休む|rest|쉬다
寝る|sleep|자다
起きる|wake up|일어나다
座る|sit|앉다
立つ|stand|서다
歩く|walk|걷다
走る|run|달리다
待つ|wait|기다리다
会う|meet|만나다
教える|teach|가르치다
習う|learn|배우다
覚える|memorize|외우다
忘れる|forget|잊다
分かる|understand|알다
考える|think|생각하다
探す|search|찾다
見つける|find|찾아내다
開ける|open|열다
閉める|close|닫다
入る|enter|들어가다
出る|exit|나가다
持つ|hold|가지다
置く|put|놓다
送る|send|보내다
受け取る|receive|받다
始める|start|시작하다
終わる|finish|끝나다
選ぶ|choose|고르다
答える|answer|대답하다
質問する|ask|질문하다
助ける|help|돕다
呼ぶ|call|부르다
笑う|laugh|웃다
泣く|cry|울다
遊ぶ|play|놀다
洗う|wash|씻다
掃除する|clean|청소하다
料理する|cook|요리하다
運転する|drive|운전하다
乗る|ride|타다
降りる|get off|내리다
着る|wear|입다
脱ぐ|take off|벗다
払う|pay|내다
借りる|borrow|빌리다
貸す|lend|빌려주다
予約する|reserve|예약하다
確認する|check|확인하다
変える|change|바꾸다
直す|fix|고치다
開く|be open|열리다
閉まる|be closed|닫히다
消す|turn off|끄다
つける|turn on|켜다
入れる|put in|넣다
出す|take out|꺼내다
見せる|show|보여주다
決める|decide|정하다
知る|know|알다
住む|live|살다
動く|move|움직이다
止まる|stop|멈추다
遅れる|be late|늦다
間に合う|be on time|제시간에 도착하다
急ぐ|hurry|서두르다
続ける|continue|계속하다
比べる|compare|비교하다
練習する|practice|연습하다
復習する|review|복습하다
覚え直す|relearn|다시 외우다
調べる|look up|찾아보다
試す|try|시도하다
感じる|feel|느끼다
思う|think|생각하다
信じる|believe|믿다
楽しむ|enjoy|즐기다
喜ぶ|be glad|기뻐하다
困る|be troubled|곤란하다
疲れる|get tired|피곤해지다
晴れる|clear up|개다
降る|fall|내리다
生まれる|be born|태어나다
育つ|grow|자라다
'@
  adjective = @'
大きい|big|크다
小さい|small|작다
新しい|new|새롭다
古い|old|낡다
良い|good|좋다
悪い|bad|나쁘다
高い|expensive|비싸다
安い|cheap|싸다
長い|long|길다
短い|short|짧다
早い|early|이르다
遅い|late|늦다
速い|fast|빠르다
遅い|slow|느리다
暑い|hot|덥다
寒い|cold|춥다
暖かい|warm|따뜻하다
涼しい|cool|시원하다
熱い|hot to touch|뜨겁다
冷たい|cold to touch|차갑다
明るい|bright|밝다
暗い|dark|어둡다
広い|wide|넓다
狭い|narrow|좁다
重い|heavy|무겁다
軽い|light|가볍다
強い|strong|강하다
弱い|weak|약하다
難しい|difficult|어렵다
簡単な|easy|쉽다
楽しい|fun|즐겁다
つまらない|boring|지루하다
忙しい|busy|바쁘다
暇な|free|한가하다
きれいな|beautiful|예쁘다
かわいい|cute|귀엽다
かっこいい|cool|멋있다
親切な|kind|친절하다
便利な|convenient|편리하다
不便な|inconvenient|불편하다
有名な|famous|유명하다
静かな|quiet|조용하다
にぎやかな|lively|번화하다
安全な|safe|안전하다
危ない|dangerous|위험하다
正しい|correct|맞다
間違った|wrong|틀리다
近い|near|가깝다
遠い|far|멀다
多い|many|많다
少ない|few|적다
同じ|same|같다
違う|different|다르다
甘い|sweet|달다
辛い|spicy|맵다
苦い|bitter|쓰다
しょっぱい|salty|짜다
おいしい|delicious|맛있다
まずい|bad tasting|맛없다
やわらかい|soft|부드럽다
かたい|hard|딱딱하다
丸い|round|둥글다
四角い|square|네모나다
赤い|red|빨갛다
青い|blue|파랗다
白い|white|하얗다
黒い|black|검다
黄色い|yellow|노랗다
緑の|green|초록색의
元気な|healthy|건강하다
眠い|sleepy|졸리다
痛い|painful|아프다
若い|young|젊다
深い|deep|깊다
浅い|shallow|얕다
太い|thick|굵다
細い|thin|가늘다
高い|tall|키가 크다
低い|low|낮다
柔らかな|gentle|상냥하다
厳しい|strict|엄하다
大切な|important|중요하다
必要な|necessary|필요하다
自由な|free|자유롭다
自然な|natural|자연스럽다
特別な|special|특별하다
普通の|ordinary|보통의
本当の|real|진짜의
十分な|enough|충분하다
不足した|insufficient|부족하다
可能な|possible|가능하다
無理な|impossible|무리다
好きな|favorite|좋아하는
嫌いな|disliked|싫어하는
上手な|skillful|잘하다
下手な|unskillful|서툴다
眠たい|drowsy|졸립다
寂しい|lonely|외롭다
うれしい|happy|기쁘다
悲しい|sad|슬프다
'@
  adverb = @'
いつも|always|항상
よく|often|자주
時々|sometimes|가끔
たまに|occasionally|때때로
あまり|not very|별로
全然|not at all|전혀
すぐ|soon|곧
もう|already|이미
まだ|still|아직
これから|from now|이제부터
今|now|지금
後で|later|나중에
前に|before|전에
先に|first|먼저
次に|next|다음에
一緒に|together|함께
一人で|alone|혼자
ゆっくり|slowly|천천히
早く|early|일찍
速く|quickly|빨리
静かに|quietly|조용히
はっきり|clearly|분명히
しっかり|firmly|확실히
きちんと|properly|제대로
ちょうど|exactly|딱
だいたい|roughly|대략
少し|a little|조금
たくさん|a lot|많이
全部|all|전부
半分|half|반
もう一度|again|다시 한번
初めて|for the first time|처음으로
最近|recently|최근에
毎日|every day|매일
毎週|every week|매주
毎月|every month|매달
毎年|every year|매년
昨日|yesterday|어제
今日|today|오늘
明日|tomorrow|내일
朝に|in the morning|아침에
昼に|at noon|낮에
夜に|at night|밤에
ここで|here|여기서
そこで|there|거기서
あそこで|over there|저기서
どこで|where|어디서
家で|at home|집에서
外で|outside|밖에서
中で|inside|안에서
上に|above|위에
下に|below|아래에
前に|in front|앞에
後ろに|behind|뒤에
右に|to the right|오른쪽에
左に|to the left|왼쪽에
近くに|nearby|가까이에
遠くに|far away|멀리
本当に|really|정말로
多分|probably|아마
きっと|surely|분명
もちろん|of course|물론
たぶん|maybe|아마도
もし|if|만약
なぜ|why|왜
どうして|why|어째서
どうやって|how|어떻게
いくら|how much|얼마
もっと|more|더
一番|the most|가장
かなり|quite|꽤
とても|very|매우
すごく|very much|아주
少なくとも|at least|적어도
ほとんど|almost|거의
必ず|without fail|반드시
絶対に|absolutely|절대로
特に|especially|특히
例えば|for example|예를 들어
だから|therefore|그래서
でも|but|하지만
そして|and then|그리고
それから|after that|그다음에
まず|first|우선
最後に|finally|마지막으로
急に|suddenly|갑자기
だんだん|gradually|점점
別々に|separately|따로따로
同時に|at the same time|동시에
正しく|correctly|바르게
間違って|wrongly|잘못
簡単に|easily|쉽게
難しく|with difficulty|어렵게
楽しく|enjoyably|즐겁게
安全に|safely|안전하게
自由に|freely|자유롭게
自然に|naturally|자연스럽게
直接|directly|직접
間接的に|indirectly|간접적으로
毎回|every time|매번
'@
  expression = @'
おはよう|good morning|좋은 아침
こんにちは|hello|안녕하세요
こんばんは|good evening|안녕하세요
さようなら|goodbye|안녕히 가세요
またね|see you|또 봐요
ありがとう|thank you|고마워요
ありがとうございます|thank you very much|감사합니다
どういたしまして|you are welcome|천만에요
すみません|excuse me|죄송합니다
ごめんなさい|I am sorry|미안합니다
お願いします|please|부탁합니다
はい|yes|네
いいえ|no|아니요
大丈夫です|it is okay|괜찮아요
分かりました|I understand|알겠습니다
分かりません|I do not understand|모르겠습니다
もう一度お願いします|please say it again|다시 한번 말해 주세요
ゆっくりお願いします|please speak slowly|천천히 말해 주세요
これは何ですか|what is this|이것은 무엇인가요
いくらですか|how much is it|얼마예요
どこですか|where is it|어디예요
トイレはどこですか|where is the restroom|화장실은 어디예요
助けてください|please help me|도와주세요
名前は何ですか|what is your name|이름이 뭐예요
私の名前は|my name is|제 이름은
はじめまして|nice to meet you|처음 뵙겠습니다
よろしくお願いします|nice to meet you|잘 부탁드립니다
お元気ですか|how are you|잘 지내세요
元気です|I am fine|잘 지내요
お疲れさま|good work|수고했어요
いただきます|let us eat|잘 먹겠습니다
ごちそうさま|thank you for the meal|잘 먹었습니다
おめでとう|congratulations|축하해요
気をつけて|take care|조심하세요
行ってきます|I am leaving|다녀오겠습니다
行ってらっしゃい|see you later|다녀오세요
ただいま|I am home|다녀왔습니다
おかえり|welcome back|어서 와요
少し待ってください|please wait a moment|잠시만 기다려 주세요
もう大丈夫です|I am okay now|이제 괜찮아요
問題ありません|no problem|문제없어요
写真を撮ってもいいですか|may I take a photo|사진을 찍어도 될까요
予約しています|I have a reservation|예약했습니다
注文したいです|I would like to order|주문하고 싶어요
おすすめは何ですか|what do you recommend|추천은 무엇인가요
水をください|please give me water|물을 주세요
お会計お願いします|check please|계산해 주세요
袋はいりません|I do not need a bag|봉투는 필요 없어요
カードで払います|I will pay by card|카드로 낼게요
現金で払います|I will pay in cash|현금으로 낼게요
道に迷いました|I am lost|길을 잃었어요
駅まで行きたいです|I want to go to the station|역까지 가고 싶어요
右に曲がってください|please turn right|오른쪽으로 돌아 주세요
左に曲がってください|please turn left|왼쪽으로 돌아 주세요
まっすぐ行ってください|please go straight|똑바로 가 주세요
ここで降ります|I will get off here|여기서 내릴게요
切符をください|please give me a ticket|표를 주세요
何時ですか|what time is it|몇 시예요
今日は何日ですか|what date is it today|오늘은 며칠이에요
天気がいいですね|the weather is nice|날씨가 좋네요
暑いですね|it is hot|덥네요
寒いですね|it is cold|춥네요
楽しかったです|it was fun|즐거웠어요
おいしいです|it is delicious|맛있어요
忙しいです|I am busy|바빠요
疲れました|I am tired|피곤해요
眠いです|I am sleepy|졸려요
うれしいです|I am happy|기뻐요
悲しいです|I am sad|슬퍼요
難しいです|it is difficult|어려워요
簡単です|it is easy|쉬워요
もう一回|one more time|한 번 더
頑張ります|I will do my best|열심히 할게요
いいですね|that is nice|좋네요
そうですね|that is right|그렇네요
違います|that is different|달라요
合っています|that is correct|맞아요
間違えました|I made a mistake|틀렸어요
覚えました|I memorized it|외웠어요
忘れました|I forgot|잊어버렸어요
質問があります|I have a question|질문이 있어요
ゆっくり話します|I will speak slowly|천천히 말할게요
英語を話せますか|can you speak English|영어를 할 수 있어요
日本語を話せますか|can you speak Japanese|일본어를 할 수 있어요
韓国語を話せますか|can you speak Korean|한국어를 할 수 있어요
少しだけ話せます|I can speak a little|조금 할 수 있어요
勉強中です|I am studying|공부 중이에요
もう一度見ます|I will look again|다시 볼게요
答えを確認します|I will check the answer|답을 확인할게요
次の問題へ|go to the next question|다음 문제로
始めましょう|let us start|시작합시다
終わりましょう|let us finish|끝냅시다
休みましょう|let us rest|쉽시다
また勉強しましょう|let us study again|다시 공부합시다
失礼します|excuse me|실례합니다
お先に失礼します|I will leave first|먼저 실례하겠습니다
確認してください|please check|확인해 주세요
少々お待ちください|please wait a moment|잠시만 기다려 주세요
分かりましたか|did you understand|이해했나요
準備できました|I am ready|준비됐어요
'@
}

$categoryMeta = @{
  noun = @{ labelJa = "名詞"; code = "noun"; difficulty = 1 }
  verb = @{ labelJa = "動詞"; code = "verb"; difficulty = 1 }
  adjective = @{ labelJa = "形容詞"; code = "adjective"; difficulty = 1 }
  adverb = @{ labelJa = "副詞"; code = "adverb"; difficulty = 1 }
  expression = @{ labelJa = "日常表現"; code = "expression"; difficulty = 1 }
}

function New-Examples($category, $jp, $en, $ko) {
  switch ($category) {
    "noun" {
      return @{
        japanese = "今日は「$jp」について話します。"
        english = "Today I talk about ""$en""."
        korean = "오늘은 ""$ko""에 대해 이야기해요."
      }
    }
    "verb" {
      return @{
        japanese = "今日は「$jp」を練習します。"
        english = "Today I practice ""$en""."
        korean = "오늘은 ""$ko""를 연습해요."
      }
    }
    "adjective" {
      return @{
        japanese = "この言葉は「$jp」という意味です。"
        english = "This word means ""$en""."
        korean = "이 단어는 ""$ko""라는 뜻이에요."
      }
    }
    "adverb" {
      return @{
        japanese = "私は「$jp」を使って文を作ります。"
        english = "I make a sentence with ""$en""."
        korean = "저는 ""$ko""를 사용해서 문장을 만들어요."
      }
    }
    default {
      return @{
        japanese = "会話で「$jp」を使います。"
        english = "I use ""$en"" in conversation."
        korean = "대화에서 ""$ko""를 사용해요."
      }
    }
  }
}

$words = New-Object System.Collections.Generic.List[object]

foreach ($category in @("noun", "verb", "adjective", "adverb", "expression")) {
  $index = 1
  $lines = $sources[$category] -split "`r?`n" | Where-Object { $_.Trim().Length -gt 0 }
  foreach ($line in $lines) {
    $parts = $line -split "\|"
    if ($parts.Count -ne 3) {
      throw "Invalid line in ${category}: $line"
    }

    $jp = $parts[0].Trim()
    $en = $parts[1].Trim()
    $ko = $parts[2].Trim()
    $meta = $categoryMeta[$category]

    $words.Add([ordered]@{
      id = ("{0}_{1:000}" -f $meta.code, $index)
      category = $meta.code
      categoryJa = $meta.labelJa
      difficulty = $meta.difficulty
      japanese = $jp
      english = $en
      korean = $ko
      examples = New-Examples $category $jp $en $ko
    })

    $index++
  }
}

$dataset = [ordered]@{
  version = "1.0.0"
  generatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
  languages = @("japanese", "english", "korean")
  categories = @(
    @{ id = "noun"; labelJa = "名詞" },
    @{ id = "verb"; labelJa = "動詞" },
    @{ id = "adjective"; labelJa = "形容詞" },
    @{ id = "adverb"; labelJa = "副詞" },
    @{ id = "expression"; labelJa = "日常表現" }
  )
  wordCount = $words.Count
  words = $words
}

$json = $dataset | ConvertTo-Json -Depth 10
Set-Content -Path $outPath -Value $json -Encoding utf8
Set-Content -Path $jsOutPath -Value "window.WORD_DATA = $json;" -Encoding utf8

Write-Host "Generated $($words.Count) words -> $outPath"
Write-Host "Generated browser data -> $jsOutPath"
