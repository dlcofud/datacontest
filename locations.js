const params = new URLSearchParams(window.location.search);
const recommendedExercises = JSON.parse(params.get('exercises')); // 'exercises' 파라미터에서 운동 데이터를 가져옵니다.

const loadExerciseData = async () => {
    const response = await fetch('exercises.json');
    const exercisesData = await response.json();
    return exercisesData;
};

// 사용자 위치를 가져와 주소 변환
const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

                    try {
                        const response = await fetch(url);
                        const data = await response.json();

                        if (data.address) {
                            const city = data.address.city || data.address.town || data.address.village;
                            const district = data.address.city_district || data.address.suburb;
                            resolve({ city, district });
                        } else {
                            reject("주소를 찾을 수 없습니다.");
                        }
                    } catch (error) {
                        reject("주소 변환에 실패했습니다.");
                    }
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        reject("위치 접근이 거부되었습니다.");
                    } else {
                        reject("위치 정보를 가져오지 못했습니다.");
                    }
                }
            );
        } else {
            reject("Geolocation을 지원하지 않는 브라우저입니다.");
        }
    });
};

// 위치 정보를 받아 URL에 추가
const requestUserLocation = async () => {
    try {
        const location = await getUserLocation();
        const locationParam = encodeURIComponent(JSON.stringify(location));

        // 추천 운동 목록 표시
        const resultDiv = document.getElementById("result");

        const exercisesData = await loadExerciseData();
        if (recommendedExercises && recommendedExercises.length > 0) {
            let exercisesList = '<h2>추천 운동</h2><ul>';

            recommendedExercises.forEach((exerciseName) => {
                // 운동 이름에 맞는 운동 정보를 찾기
                const exercise = exercisesData.find((ex) => ex.name === exerciseName);

                if (exercise) {
                    // 운동에 대한 상세 정보 표시
                    exercisesList += `
                        <li>
                            <h3>
                                <a href="exerciseDetail.html?name=${encodeURIComponent(
                                    exercise.name
                                )}&location=${locationParam}">${exercise.name}</a>
                            </h3>
                            <p><strong>난이도:</strong> ${'★'.repeat(exercise.difficulty)}</p>
                            <p><strong>강도:</strong> ${'★'.repeat(exercise.intensity)}</p>
                        </li>
                    `;
                }
            });

            exercisesList += '</ul>';
            resultDiv.innerHTML = exercisesList; // 추천 운동을 표시
        } else {
            resultDiv.innerHTML = `<h2>추천 운동이 없습니다. 조건을 변경해 보세요.</h2>`;
        }
    } catch (error) {
        console.error(error);

        // 위치 접근 요청 메시지 표시
        if (error === "위치 접근이 거부되었습니다.") {
            alert("위치 접근이 거부되었습니다. 브라우저 설정에서 위치 접근을 허용해주세요.");
        } else {
            alert("위치를 가져올 수 없습니다. 다시 시도해주세요.");
        }
    }
};

// 위치 요청 실행
requestUserLocation();
