# Make Dongchoi Member

이 저장소는 42서울 과제인 ft_transcendence를 위한 저장소입니다.

### 실행

기본적으로 development mode 로 `docker compose up` 실행 (평가 시 production을 기본으로 변경 예정).

```bash
make
```

아래는 다른 옵션들

```bash
make dev    # development mode
make prod   # production mode
make down   # development mode docker compose down
make pdown   # production mode docker compose down
```

- 실행 후 빌드하기 때문에 시간이 약 1분 정도 걸림

### 접속

- development mode: http://localhost:5173
- production mode: http://localhost:3000

### Docker Compose

- web : `NestJs` + `svelteKit`
- database : `postgreSQL`
