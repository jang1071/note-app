// src/server.ts

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import notesRouter from './routes/notes'; 
import cors from 'cors'; 

// .env 파일에서 환경 변수 불러오기
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // 사용할 포트 번호
const mongoUri = process.env.MONGO_URI as string; // MongoDB URI 가져오기

// MongoDB 연결
mongoose.connect(mongoUri)
    .then(() => {
        console.log('MongoDB에 성공적으로 연결되었습니다.');
        
        // JSON 형태의 요청 본문을 파싱할 수 있도록 설정
        app.use(express.json()); 


        // 미들웨어 설정:
        // 1. CORS 허용 미들웨어:
        // 다른 출처(도메인, 포트 등)에서 오는 요청을 허용하도록 설정해요.
        // 기본 설정은 모든 출처(*)에서의 요청을 허용해요. 개발 단계에서는 편리하지만,
        // 실제 배포 시에는 보안을 위해 특정 출처만 허용하도록 설정하는 것이 좋아요.
        app.use(cors());

        // 2. JSON 요청 본문 파싱 미들웨어:
        // 클라이언트에서 POST나 PUT 요청을 보낼 때, 요청 본문에 JSON 형태로 데이터를 담아 보내면,
        // 이 미들웨어가 그 JSON 데이터를 파싱해서 req.body 객체에 넣어줘서 서버 코드에서 쉽게 접근할 수 있게 해줘요.
        app.use(express.json());

        // 라우트 설정:
        // '/api/notes' 경로로 들어오는 모든 요청은 우리가 만든 notesRouter에서 처리하도록 연결해요.
        // 이렇게 하면 notes.ts 파일에서는 '/api/notes'를 제외한 나머지 경로 부분만 신경 쓰면 돼요.
        app.use('/api/notes', notesRouter);

        // MongoDB 연결 성공 시에만 서버 시작
        app.listen(port, () => {
            console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
        });
    })
    .catch((err) => {
        console.error('MongoDB 연결 실패:', err);
        process.exit(1); // 연결 실패 시 프로세스 종료
    });

// 기본 라우트
app.get('/', (req, res) => {
    res.send('노트 앱 백엔드입니다.');
});
