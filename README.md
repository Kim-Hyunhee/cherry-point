# **Cherry-Point**  
> **기존 어플리케이션에 SNS 기능을 추가하여 사용자 간 상호작용을 증진시키고 커뮤니티 활성화를 목표로 한 프로젝트**

---

## **목차**
1. [실행 환경](#1-실행-환경)  
   1-1. [로컬 실행](#1-1-로컬-실행)  
   1-2. [환경 변수](#1-2-환경-변수)  
2. [기술 스택](#2-기술-스택)  
3. [디렉토리 구조](#3-디렉토리-구조)  
4. [기능 구현](#4-기능-구현)  
   4-1. [로그인](#4-1-로그인)  
   4-2. [게시글 CRUD](#4-2-게시글-crud)  
   4-3. [댓글 CRUD](#4-3-댓글-crud)  
   4-4. [게시글 및 댓글 좋아요/신고](#4-4-게시글-및-댓글-좋아요신고)  
   4-5. [광고 및 관리자 기능](#4-5-광고-및-관리자-기능)  

---

## **1. 실행 환경**
### **1-2. 환경 변수**  
- 아래 항목들이 `.env` 파일에 반드시 존재해야 합니다:
  - `DATABASE_URL`: 데이터베이스 연결 URL
  - `JWT_SECRET_KEY`: JWT 토큰 서명에 사용될 비밀 키

---

### 기술 스택
<img src="https://img.shields.io/badge/TypeScript-version 5-3178C6">&nbsp;
<img src="https://img.shields.io/badge/Nest.js-version 10-E0234E">&nbsp;
<img src="https://img.shields.io/badge/TypeORM-version 0.3-fcad03">&nbsp;
<img src="https://img.shields.io/badge/MySQL-version 8-00758F">&nbsp;
<img src="https://img.shields.io/badge/Prisma-4.0-2D3748">&nbsp;

</br>

---

## 디렉토리 구조

<details>
<summary><strong>디렉토리 구조</strong></summary>
<div markdown="1">
 
```bash
├─prisma
│      schema.prisma
│
├─src
│  │  app.controller.spec.ts
│  │  app.controller.ts
│  │  app.module.ts
│  │  app.service.ts
│  │  main.ts
│  │
│  ├─common
│  │      calculatePoint.ts
│  │      constants.ts
│  │      frequency.ts
│  │      helper.ts
│  │      pagination.ts
│  │      responseDto.ts
│  │      score.ts
│  │
│  ├─decorators
│  │      currentMember.decorator.ts
│  │
│  └─module
│      ├─admin
│      │      admin.controller.ts
│      │      admin.hot-posting.controller.ts
│      │      admin.member.controller.ts
│      │      admin.module.ts
│      │      admin.personally-ad.controller.ts
│      │      admin.report.contoller.ts
│      │      admin.repository.ts
│      │      admin.service.ts
│      │      dto.ts
│      │
│      ├─auth
│      │      admin.guard.ts
│      │      auth.controller.ts
│      │      auth.module.ts
│      │      auth.service.ts
│      │      dto.ts
│      │      jwt-auth.guard.ts
│      │      jwt.strategy.ts
│      │
│      ├─comment
│      │      comment.controller.ts
│      │      comment.module.ts
│      │      comment.repository.ts
│      │      comment.service.ts
│      │      dto.ts
│      │
│      ├─hot-posting
│      │      hot-posting.module.ts
│      │      hot-posting.repository.ts
│      │      hot-posting.service.ts
│      │
│      ├─member
│      │      dto.ts
│      │      member.controller.ts
│      │      member.module.ts
│      │      member.repository.ts
│      │      member.service.ts
│      │
│      ├─personally-ad
│      │      dto.ts
│      │      personally-ad.controller.ts
│      │      personally-ad.module.ts
│      │      personally-ad.repository.ts
│      │      personally-ad.service.ts
│      │
│      ├─point
│      │  │  dto.ts
│      │  │  point.controller.ts
│      │  │  point.module.ts
│      │  │  point.service.ts
│      │  │
│      │  └─repositorires
│      │          GreenpRepository.ts
│      │          memberPoint.repository.ts
│      │
│      ├─posting
│      │      dto.ts
│      │      posting.controller.ts
│      │      posting.module.ts
│      │      posting.repository.ts
│      │      posting.service.ts
│      │
│      ├─posting-score
│      │      posting-score.module.ts
│      │      posting-score.service.ts
│      │
│      ├─prisma
│      │      prisma.module.ts
│      │      prisma.service.ts
│      │
│      ├─report
│      │      dto.ts
│      │      report.controller.ts
│      │      report.module.ts
│      │      report.repository.ts
│      │      report.service.ts
│      │
│      └─upload
│              dto.ts
│              upload.controller.ts
│              upload.module.ts
│              upload.service.ts
│
└─test
        app.e2e-spec.ts
        jest-e2e.json
```
</div>
</details>

## **ERD**

<details>
<summary><strong>ERD 이미지 보기</strong></summary>
<div markdown="1">

![ERD 이미지](https://github.com/user-attachments/assets/83b5da67-fbdd-4bc8-b9af-8f4de322ed1f)

</div>
</details>

</br>

## 기능구현
### **4-1. 로그인** 
* 기존 서버에서 memberId를 받아 JWT 토큰을 생성합니다.

### **4-2. 게시글 CRUD**
* 로그인 후 게시글 작성, 수정, 삭제 기능 구현
* 페이지 수, 키워드, 작성자 검색 기능 구현

### **4-3. 댓글 CRUD**
* 로그인 후 게시글에 댓글 등록, 수정, 삭제 기능 구현
* 댓글 및 게시글 신고 시 10회 이상 쌓이면 자동 블라인드 처리

### **4-4. 게시글 및 댓글 좋아요/신고**
* 게시글 및 댓글에 좋아요 기능 구현 (중복 시 취소)

### **4-5. 광고 및 관리자 기능**
* 광고 CRUD 기능 구현 (등록, 수정, 삭제)
* 관리자 로그인 기능 (JWT 토큰 발급)
* 신고된 게시글 및 댓글 관리 기능
* 사용자 SNS 이용 정지 기능

 ---
 
 ## **Swagger 문서**
API 명세는 Swagger를 통해 확인할 수 있습니다. 아래 링크를 클릭하여 Swagger 문서로 이동하세요.

[Swagger 문서 보러 가기](https://github.com/user-attachments/assets/2e1bf821-d627-4e77-8bdc-23e6fa1da47f)

---
