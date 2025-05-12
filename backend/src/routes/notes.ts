// express와 우리가 정의한 Note 모델을 불러와요.
import express from 'express';
import Note from '../models/Note'; // Note 모델 경로는 src/models/Note.ts

// Express 라우터 인스턴스를 생성해요.
// 이 라우터 객체에 API 엔드포인트들을 정의할 거에요.
const router = express.Router();

// ==================== API 엔드포인트 정의 ====================

// 1. 모든 노트 조회 (GET /api/notes)
// 클라이언트에서 /api/notes 경로로 GET 요청을 보내면 이 코드가 실행돼요.
router.get('/', async (req, res) => {
    try {
        // Note 모델을 사용해서 데이터베이스의 'notes' 컬렉션에 있는 모든 문서를 찾아요.
        // .find()는 필터 없이 모든 데이터를 가져와요.
        // await는 비동기 작업인 데이터베이스 조회가 완료될 때까지 기다리겠다는 의미에요.
        const notes = await Note.find();
        // 찾은 노트 데이터 배열을 JSON 형태로 클라이언트에 응답해요.
        res.json(notes);
    } catch (err: any) {
        // 데이터베이스 조회 중 에러가 발생하면 catch 블록으로 와요.
        // 500 상태 코드 (Internal Server Error)와 함께 에러 메시지를 응답해요.
        res.status(500).json({ message: err.message });
    }
});

// 2. 특정 노트 조회 (GET /api/notes/:id)
// 클라이언트에서 /api/notes/뒤에 특정 노트 ID를 붙여서 GET 요청을 보내면 실행돼요.
// 예: GET /api/notes/60f7b3b3f3f3f3f3f3f3f3f3
router.get('/:id', async (req, res) => {
    try {
        // 요청 URL의 파라미터에서 ':id' 부분 값을 가져와서 특정 노트를 찾아요.
        // req.params.id로 URL에서 ID 값을 얻을 수 있어요.
        const note = await Note.findById(req.params.id);
        if (note == null) { // 만약 해당 ID를 가진 노트를 찾지 못했다면
            // 404 상태 코드 (Not Found)와 함께 메시지를 응답하고 함수를 종료해요.
            return res.status(404).json({ message: '노트를 찾을 수 없습니다.' });
        }
        // 찾은 단일 노트 데이터를 JSON 형태로 클라이언트에 응답해요.
        res.json(note);
    } catch (err: any) {
         // 데이터베이스 조회 중 에러가 발생하면 500 에러 응답
        res.status(500).json({ message: err.message });
    }
});

// 3. 새 노트 생성 (POST /api/notes)
// 클라이언트에서 /api/notes 경로로 POST 요청을 보내고, 요청 본문에 노트 데이터를 담아 보내면 실행돼요.
// (요청 본문 데이터는 나중에 server.ts에서 설정할 미들웨어가 파싱해서 req.body에 넣어줄 거에요.)
router.post('/', async (req, res) => {
    // 요청 본문(req.body)에서 제목과 내용을 가져와서 새로운 Note 모델 인스턴스를 생성해요.
    const note = new Note({
        title: req.body.title,
        content: req.body.content
        // createdAt, updatedAt은 Schema 정의에서 default 값이 있으니 자동으로 채워져요.
    });

    try {
        // 생성한 새 Note 인스턴스를 데이터베이스에 저장해요.
        const newNote = await note.save();
        // 저장이 성공하면 201 상태 코드 (Created)와 함께 데이터베이스에 저장된 새 노트를 응답해요.
        res.status(201).json(newNote);
    } catch (err: any) {
        // 데이터 저장 중 에러가 발생하면 (예: 필수 필드가 누락된 경우)
        // 400 상태 코드 (Bad Request)와 함께 에러 메시지를 응답해요.
        res.status(400).json({ message: err.message });
    }
});

// 4. 특정 노트 수정 (PUT /api/notes/:id)
// 클라이언트에서 /api/notes/뒤에 특정 노트 ID를 붙여서 PUT 요청을 보내고, 요청 본문에 수정할 데이터를 담아 보내면 실행돼요.
// 예: PUT /api/notes/60f7b3b3f3f3f3f3f3f3f3f3, 본문에 { "content": "수정된 내용" }
router.put('/:id', async (req, res) => {
    try {
        // 먼저 수정하려는 노트를 ID로 찾아요.
        const note = await Note.findById(req.params.id);
        if (note == null) { // 해당 ID의 노트를 찾지 못했다면
            return res.status(404).json({ message: '노트를 찾을 수 없습니다.' });
        }

        // 요청 본문(req.body)에 제목이 있다면 노트의 제목을 업데이트해요.
        if (req.body.title != null) {
            note.title = req.body.title;
        }
        // 요청 본문에 내용이 있다면 노트의 내용을 업데이트해요.
        if (req.body.content != null) {
            note.content = req.body.content;
        }
        // 수정 시간을 현재 시간으로 업데이트해요.
        note.updatedAt = new Date();

        // 변경된 내용을 데이터베이스에 저장해요.
        const updatedNote = await note.save();
        // 업데이트가 성공하면 업데이트된 노트 데이터를 JSON 형태로 응답해요.
        res.json(updatedNote);
    } catch (err: any) {
        // 업데이트 중 에러가 발생하면 400 에러 응답
        res.status(400).json({ message: err.message });
    }
});

// 5. 특정 노트 삭제 (DELETE /api/notes/:id)
// 클라이언트에서 /api/notes/뒤에 특정 노트 ID를 붙여서 DELETE 요청을 보내면 실행돼요.
// 예: DELETE /api/notes/60f7b3b3f3f3f3f3f3f3f3f3
router.delete('/:id', async (req, res) => {
    try {
        // 삭제하려는 노트를 ID로 찾아요.
        const note = await Note.findById(req.params.id);
        if (note == null) { // 해당 ID의 노트를 찾지 못했다면
            return res.status(404).json({ message: '노트를 찾을 수 없습니다.' });
        }

        // 해당 ID를 가진 노트를 데이터베이스에서 삭제해요.
        await Note.deleteOne({ _id: req.params.id });
        // 삭제가 성공하면 성공 메시지를 응답해요.
        res.json({ message: '노트가 삭제되었습니다.' });
    } catch (err: any) {
        // 삭제 중 에러가 발생하면 500 에러 응답
        res.status(500).json({ message: err.message });
    }
});

// 이 라우터 객체를 다른 파일(server.ts)에서 사용할 수 있도록 내보내기(export) 해요.
export default router;
