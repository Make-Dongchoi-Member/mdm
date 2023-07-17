# compose_test

+ `docker-compose`로 서비스 실행

+ 두 개의 컨테이너
	+ server : `NestJs` + `svelteKit`
	+ db : `postgreSQL`

#### 실행
``` bash
docker-compose up -d
```
+ 실행 후 빌드하기 때문에 시간이 좀걸림

### 접속
```
http://localhost:3000
```
+ `svelteKit` 기본 페이지

### DB TEST
+ DB test는 `Thunder Client`로 진행
##### POST
```
http://localhost:3000/user/create
```
```JSON
{
  "userId" : 1003,
  "userName" : "abc",
  "email" : "abc@student.42seoul.kr"
}
```
+ 유저생성 `POST`요청으로 HTTP Body에 유저 정보 넣어줘야됨 
##### GET
```
http://localhost:3000/user/info?user_id=1003
```
+ 유저조회 `GET`요청으로 Query Parameter로 조회할 `user_id`를 넣어줘야됨
##### DB조회
```bash
docker-compose exec db /bin/bash
```
+ 실행중인 db 컨테이너 접속

```bash
psql -U postgres -d mydatabase
```
+ postgres 사용자로 DB접속

```SQL
SELECT * FROM users;
```
+ `users` 테이블 조회

