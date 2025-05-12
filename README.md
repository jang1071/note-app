markdown


# 📝 Simple Note App - 풀스택 반응형 메모 웹 애플리케이션

**Simple Note App**은 Vite(React)와 Express.js, MongoDB를 활용하여 개발한 **풀스택 반응형 메모 애플리케이션**입니다.  
취업 포트폴리오 목적으로 개발되었으며, 사용자의 편의성을 고려한 직관적인 인터페이스로 메모의 **CRUD(생성, 조회, 수정, 삭제)** 기능을 제공합니다.

---

## 🎯 프로젝트 목적

Simple Note App은 **실무에 바로 적용 가능한 풀스택 개발 역량과 반응형 웹 구현 능력**을 보여주는 것을 목표로 기획되었습니다.  
프론트엔드(React), 백엔드(Express.js), 데이터베이스(MongoDB) 연동 및 API 설계, 그리고 다양한 기기에서 사용 가능한 반응형 웹 개발 역량을 집중적으로 담고 있습니다.

---

## 📁 프로젝트 구조

```text
simple-note-app/
├── backend/     # Express.js API 서버 (TypeScript)
├── frontend/    # React 프론트엔드 (Vite + TypeScript)
```
---

## 🚀 구현 기능
✅ 메모 생성: 새로운 메모를 작성하고 저장합니다.  
✅ 메모 조회: 작성된 메모 목록을 확인하고, 특정 메모의 상세 내용을 조회합니다.  
✅ 메모 수정: 기존 메모의 내용을 수정하고 반영합니다.  
✅ 메모 삭제: 더 이상 필요 없는 메모를 삭제합니다.  
✅ 반응형 디자인: 데스크탑, 태블릿, 모바일 등 다양한 화면 크기에서 최적화된 레이아웃을 제공합니다.  

---

## 🖥️ 프로젝트 화면 (예정)


---

## 🧩 기술 스택

📌 Frontend  
React (with Vite)  
TypeScript  
CSS  
Axios  
React Router  

📌 Backend
Node.js (Express.js)  
TypeScript  
MongoDB (Mongoose ORM)  

---

## 💻 개발 환경 및 사용 도구
IDE: VSCode  
데이터베이스 툴: MongoDB Compass 또는 Atlas  
API 테스트 툴: Postman 또는 Thunder Client  
버전 관리: Git + GitHub  

---

## 📌 향후 확장 예정 기능

사용자 인증 및 로그인 기능 추가 (개인별 메모 관리)  
메모 검색 기능 구현  
마크다운 에디터 도입  
메모 분류 기능 (태그 또는 폴더)  
CI/CD 파이프라인 구축 (GitHub Actions 등)  

---

## 📚 API Endpoints

GET /api/notes: 모든 메모 조회  
GET /api/notes/:id: 특정 메모 상세 조회  
POST /api/notes: 새로운 메모 생성  
PUT /api/notes/:id: 특정 메모 수정  
DELETE /api/notes/:id: 특정 메모 삭제  

---
