document.getElementById('survey-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 폼 제출 방지

    // 설문 응답 데이터 수집
    let depressionLevel = document.getElementById('depression-level').value;  // 우울감
    depressionLevel=5-depressionLevel;
    
    let stressLevel = document.getElementById('stress-level').value        // 스트레스
    stressLevel=5-stressLevel
    const positiveChange = document.getElementById('positive-change').value;    // 긍정적 변화

    let adaptability = document.getElementById('adaptability').value;         // 적응력
    adaptability=5-adaptability

    const preferredExercise = document.querySelector('input[name="preferred-exercise"]:checked').value; // 운동 유형
    const exerciseEnvironment1 = document.querySelector('input[name="exercise-environment1"]:checked') ? 
    document.querySelector('input[name="exercise-environment1"]:checked').value : 'none'; // 운동 환경 indoor (선택되지 않으면 'none'으로 처리)
    const exerciseEnvironment2 = document.querySelector('input[name="exercise-environment2"]:checked') ? 
        document.querySelector('input[name="exercise-environment2"]:checked').value : 'none'; // 운동 환경 group (선택되지 않으면 'none'으로 처리)
    
    const intensity = document.querySelector('input[name="intensity"]:checked').value; // 운동 강도

    // 운동 추천 로직
    let recommendedExercises = [];

    // 운동 정보 (유산소, 근력, 정적, 단체, 환경, 목표 점수)
    const exercises = [
        { name: '산책', categories: ['aerobic','static'], environment: ['outdoor', 'alone', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '조깅', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '자전거', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1 ,'stress':1} },
        { name: '요가', categories: ['static'], environment: ['indoor', 'group', 'alone'], score: { 'stress': 1 } },
        { name: '필라테스', categories: ['static', 'strength'], environment: ['indoor', 'group', 'alone'], score: { 'stress': 1 ,'energy':1} },
        { name: '배드민턴', categories: ['aerobic'], environment: ['indoor', 'outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '축구', categories: ['aerobic'], environment: ['outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '줄넘기', categories: ['aerobic'], environment: ['indoor', 'outdoor', 'alone'], score: { 'energy': 1 ,'stress':1} },
        { name: '산악', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone'], score: { 'stress': 1 } },
        { name: '암벽 등반', categories: ['strength'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1 } },
        { name: '수영', categories: ['aerobic', 'strength'], environment: ['indoor', 'alone', 'group'], score: { 'energy': 1,'stress':1 } },
        { name: '탁구', categories: ['aerobic', 'static'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '아이스하키', categories: ['aerobic'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '합기도', categories: ['strength', 'static'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '펜싱', categories: ['strength', 'aerobic'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '카누', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        
        { name: '핸드볼', categories: ['aerobic'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '택견', categories: ['strength', 'static'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '세팍타크로', categories: ['aerobic'], environment: ['outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '당구', categories: ['static'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '골프', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '태권도', categories: ['strength', 'static'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '치어리딩', categories: ['aerobic', 'static'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '궁도', categories: ['static', 'strength'], environment: ['outdoor', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '조정', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '킥복싱', categories: ['strength', 'aerobic'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '주짓수', categories: ['strength', 'static'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '카라테', categories: ['strength', 'static'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '볼링', categories: ['aerobic'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '야구소프트볼(야구)', categories: ['aerobic'], environment: ['outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '수상스키·웨이크스포츠', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '유도', categories: ['strength', 'static'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '소프트테니스', categories: ['aerobic'], environment: ['outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '수상스키·웨이크보드', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '파크골프', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '근대5종', categories: ['aerobic', 'strength'], environment: ['outdoor', 'group','alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '씨름', categories: ['strength'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        
        { name: '패러글라이딩', categories: ['aerobic'], environment: ['outdoor', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '바둑', categories: ['static'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '테니스', categories: ['aerobic', 'strength'], environment: ['outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '그라운드골프', categories: ['aerobic'], environment: ['outdoor', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '하키', categories: ['aerobic'], environment: ['outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '철인3종', categories: ['aerobic', 'strength'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '롤러', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone','indoor'], score: { 'energy': 1, 'stress': 1 } },
        { name: '레슬링', categories: ['strength'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '농구', categories: ['aerobic'], environment: ['outdoor', 'group','indoor'], score: { 'energy': 1, 'stress': 1 } },
        { name: '체스', categories: ['static'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '족구', categories: ['aerobic'], environment: ['outdoor', 'group','indoor'], score: { 'energy': 1, 'stress': 1 } },
        { name: '스쿼시', categories: ['aerobic', 'strength'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '복싱', categories: ['strength', 'aerobic'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '루지', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '스키', categories: ['aerobic', 'strength'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '배구', categories: ['aerobic'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '에어로빅힙합', categories: ['aerobic'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '보디빌딩', categories: ['strength'], environment: ['indoor', 'alone','group'], score: { 'energy': 1 } },
        { name: '빙상', categories: ['aerobic'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '야구소프트볼', categories: ['aerobic'], environment: ['outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '육상', categories: ['aerobic'], environment: ['outdoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '럭비', categories: ['aerobic'], environment: ['outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '댄스스포츠', categories: ['aerobic'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '게이트볼', categories: ['aerobic'], environment: ['outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '사격', categories: ['static'], environment: ['outdoor', 'alone','group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '컬링', categories: ['aerobic', 'static'], environment: ['indoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        
        { name: '역도', categories: ['strength'], environment: ['indoor', 'alone'], score: { 'energy': 1 } },
        { name: '체조', categories: ['strength', 'static'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '검도', categories: ['strength', 'static'], environment: ['indoor', 'group', 'alone'], score: { 'energy': 1, 'stress': 1 } },
        { name: '파워보트', categories: ['aerobic'], environment: ['outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } },
        { name: '요트', categories: ['aerobic'], environment: ['outdoor', 'group'], score: { 'energy': 1, 'stress': 1 } }
    ];
    

    // 사용자 조건 설정 (우울감, 스트레스 등 반영)
    const userConditions = {
        depression: depressionLevel,
        stress: stressLevel,
        positiveChange: positiveChange,
        adaptability: adaptability,

        preferredExercise: preferredExercise, // 운동 유형
        exerciseEnvironment1: exerciseEnvironment1, // 운동 환경
        exerciseEnvironment2: exerciseEnvironment2,
        intensity: intensity // 운동 강도
    };

    // 조건에 맞는 운동 필터링
    exercises.forEach(exercise => {
        let isValid = true;

        // 운동 유형 조건 체크
        if (userConditions.preferredExercise !== 'all' && !exercise.categories.includes(userConditions.preferredExercise)) {
            isValid = false;
        }

        // 운동 환경 조건 체크
        if (userConditions.exerciseEnvironment1 !== 'none' && !exercise.environment.includes(userConditions.exerciseEnvironment1)) {
            isValid = false;
        }
        if (userConditions.exerciseEnvironment2 !== 'none' && !exercise.environment.includes(userConditions.exerciseEnvironment2)) {
            isValid = false;
        }

        // 운동 강도 조건 체크
        if (userConditions.intensity === 'high' && !(exercise.categories.includes('aerobic') || exercise.categories.includes('strength'))) {
            isValid = false;
        }

        // 우울감이나 스트레스가 높은 경우 적합한 운동 추가
        if (userConditions.depression >=4 && exercise.score.energy > 0) {
            isValid = true;
        }
        if (userConditions.stress >=4 && exercise.score.stress > 0) {
            isValid = true;
        }

        // 조건에 맞는 운동을 추천 리스트에 추가
        if (isValid) {
            recommendedExercises.push(exercise.name);
        }
    });

    if (recommendedExercises.length > 0) {
        const exercisesParam = encodeURIComponent(JSON.stringify(recommendedExercises));
        window.location.href = `locations.html?exercises=${exercisesParam}`;
    } else {
        alert("추천 운동이 없습니다.");
    }
});
