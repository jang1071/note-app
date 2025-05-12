// mongoose 라이브러리에서 필요한 모듈들을 불러와요.
import mongoose, { Document, Schema } from 'mongoose';

// TypeScript 인터페이스로 노트 문서의 타입을 정의해요.
// MongoDB에 저장될 노트 객체가 어떤 필드를 가지고 어떤 타입인지 명시해주는 거에요.
// 'extends Document'는 Mongoose 문서가 기본적으로 가지는 '_id' 같은 속성들도 포함하겠다는 의미에요.
interface INote extends Document {
    title: string; // 노트 제목은 문자열 타입
    content: string; // 노트 내용은 문자열 타입
    createdAt: Date; // 노트 생성일은 Date 타입
    updatedAt: Date; // 노트 수정일은 Date 타입
}

// Mongoose Schema를 정의해요.
// 실제 MongoDB 컬렉션에 저장될 데이터의 구조와 유효성 검사 등을 설정하는 부분이에요.
const NoteSchema: Schema = new Schema({
    title: { type: String, required: true }, // 'title' 필드: 문자열 타입이고, 반드시 값이 있어야 해요 (required: true)
    content: { type: String, required: true }, // 'content' 필드: 문자열 타입이고, 반드시 값이 있어야 해요
    createdAt: { type: Date, default: Date.now }, // 'createdAt' 필드: Date 타입이고, 기본값으로 현재 시간이 자동 저장돼요
    updatedAt: { type: Date, default: Date.now }  // 'updatedAt' 필드: Date 타입이고, 기본값으로 현재 시간이 자동 저장돼요
});

// 정의한 Schema를 바탕으로 'Note'라는 이름의 Mongoose 모델을 생성해요.
// 이 'Note' 모델 객체를 사용해서 실제 데이터베이스의 'notes' 컬렉션과 상호작용하게 될 거에요.
// '<INote>'는 모델이 TypeScript 인터페이스 INote 타입을 따른다는 것을 명시해주는 거에요.
const Note = mongoose.model<INote>('Note', NoteSchema);

// 다른 파일에서 이 Note 모델을 사용할 수 있도록 내보내기(export) 해요.
export default Note;
