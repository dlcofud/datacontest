// URL에서 'name'과 'location' 파라미터 가져오기
const params = new URLSearchParams(window.location.search);
const exerciseName = params.get('name');
const userLocation = JSON.parse(decodeURIComponent(params.get('location'))); // 위치 정보 가져오기

// 운동 세부 정보 로드
const loadExerciseData = async () => {
    const response = await fetch('exercises.json');
    const exercisesData = await response.json();
    return exercisesData;
};


// 동호회 목록 표시
const loadClubList = async (userLocation, exercise) => {
    const response = await fetch('clublist1.json');
    const clubList = await response.json();

    const nearbyClubs = clubList.filter(club => {
        if (club.ITEM_NM.trim().toLowerCase() === exercise.name.trim().toLowerCase()) {
            const clubLocation = club.SIGNGU_NM;
            const [clubCity, clubDistrict] = clubLocation.split(' ').slice(0, 2);
            const isCityMatch = clubCity.includes(userLocation.city);
            const isDistrictMatch = clubDistrict && clubDistrict.includes(userLocation.district);
            return isCityMatch && (isDistrictMatch || userLocation.district === undefined);
        }
        return false;
    });

    const clubListDiv = document.getElementById('clubList');
    if (nearbyClubs.length > 0) {
        let clubsHTML = '<div class="club-list-container">';
        nearbyClubs.forEach(club => {
            clubsHTML += `
                <div class="club-card">
                    <h3>${club.CLUB_NM || "이름 없음"}</h3>
                    <p><strong>성별:</strong> ${club.SEXDSTN_FLAG_NM}</p>
                    <p><strong>나이 제한:</strong> ${club.ITEM_CL_NM}</p>
                </div>
            `;
        });
        clubsHTML += '</div>';
        clubListDiv.innerHTML = clubsHTML;
    } else {
        clubListDiv.innerHTML = '<p>근처에 관련 동호회가 없습니다.</p>';
    }
};

// 위치 정보와 운동 데이터를 병렬로 로드
Promise.all([loadExerciseData()])
    .then(([exercisesData]) => {
        const exercise = exercisesData.find(ex => ex.name === exerciseName);

        if (exercise) {
            const resultDiv = document.getElementById("exerciseDetails");
            resultDiv.innerHTML = `
                <h1 id="exerciseName">${exercise.name}</h1>
                <div>
                    <p><strong>난이도:</strong> ${'★'.repeat(exercise.difficulty)}</p>
                    <p><strong>강도:</strong> ${'★'.repeat(exercise.intensity)}</p>
                    <p><strong>주간 횟수:</strong> ${exercise.frequency}</p>
                    <p><strong>설명:</strong> ${exercise.description}</p>
                </div>
            `;

            // 위치 정보를 활용하여 동호회 목록을 필터링하여 표시
            loadClubList(userLocation, exercise);
        } else {
            resultDiv.innerHTML = '<h2>운동 정보를 찾을 수 없습니다.</h2>';
        }
    })
    .catch(error => {
        console.error(error);
        document.getElementById('exerciseDetails').innerHTML = '<p>운동 데이터를 불러올 수 없습니다.</p>';
    });
