# cherry-point
> 기존 어플리케이션에 SNS 기능을 추가하여 사용자 간의 상호작용을 증진 시키고 커뮤니티 활성화를 목표로 한 프로젝트입니다.

## 목차
##### [1-1. 실행 환경](#실행-환경)
##### [1-2. 기술 스택](#기술-스택)
#### 1. 디렉토리 구조
##### (#디렉토리 구조)
#### [2. 기능구현](#기능구현)
</br>

### 실행 환경
* .env 환경변수 파일 생성</br>
해당 프로젝트는 로컬 환경 실행이며, 아래 항목들이 환경변수 파일에 전부 존재해야 합니다.
```
DATABASE_URL

JWT_SECRET_KEY
```
* 로컬 실행시
```
npm run start
```

### Swagger 문서
https://github.com/user-attachments/assets/b5d3491c-08ad-400a-9767-2611ffd14721

### 기술 스택
<img src="https://img.shields.io/badge/TypeScript-version 5-3178C6">&nbsp;
<img src="https://img.shields.io/badge/Nest.js-version 10-E0234E">&nbsp;
<img src="https://img.shields.io/badge/TypeORM-version 0.3-fcad03">&nbsp;
<img src="https://img.shields.io/badge/MySQL-version 8-00758F">&nbsp;

</br>

## 디렉토리 구조

<details>
<summary><strong>디렉토리 구조</strong></summary>
<div markdown="1">
 
```bash
├─prisma
├─src
│  ├─common
│  ├─decorators
│  └─module
│      ├─admin
│      ├─auth
│      ├─comment
│      ├─hot-posting
│      ├─member
│      ├─personally-ad
│      ├─point
│      │  └─repositorires
│      ├─posting
│      ├─posting-score
│      ├─prisma
│      ├─report
│      └─upload
└─test
```
</div>
</details>

</br>

## 기능구현
### 로그인
* 원래 서버에서 로그인 후 memberId를 받아 토큰 생성

### 게시글 생성, 수정, 삭제
* 로그인 한 후 게시글 작성 및 본인 글 수정, 삭제 구현

### 게시글 목록
* 페이지 수, 키워드, 작성한 사람 검색 기능 구현

### 인기 게시글 목록
* 오늘의 인기 게시글 목록 구현

### 댓글 CRUD
* 로그인 후 게시글에 댓글 등록, 수정, 삭제 기능 구현

### 게시글, 댓글 좋아요
* 게시글과 댓글에 좋아요 할 수 있도록 구현, 한 번 더 누르면 좋아요 취소 구현

### 게시글, 댓글 신고
* 신고는 한 번만 가능하게 구현 => 10번 이상 쌓이면 자동 블라인드

### 광고 목록, 상세보기 구현

### 관리자 로그인
* userName, password 일치 시 JWT 토큰 인가

### 관리자 기능 신고된 게시글, 댓글 목록 구현
* 토큰으로 관리자를 확인해 신고 목록 구현

### 로그인
* 이메일, 패스워드 일치 여부 유효성 체크
* 로그인 시 JWT(Json Web Token) 발급 -> 모든 API 요청시 JWT 인가

### 광고 CRUD
* 광고 등록, 수정, 삭제 구현 및 화면에 보이기 구현

### 게시글, 댓글 블라인드 처리 
* 게시글, 댓글이 10번이상의 신고가 아니더라도 블라인드 처리 기능 구현
  
### 사용자 이용 정지
* 사용자 sns 이용 정지 기능 구현 

</br>
