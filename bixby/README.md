# 🎙️ Bixby Integration Guide (JARVIS)

본 문서는 **Bixby Capsule을 이용해 음성 명령을 수신하고,  
Webhook을 통해 Edge(JARVIS / MCP Client)로 전달하는 전체 흐름**을 설명한다.

---

## 🧩 Step 1. Bixby Capsule 생성

### 1️⃣ Bixby Developer Console 접속

- 🔗 [https://bixbydevelopers.com](https://bixbydevelopers.com)
- Capsule Type: **Private Capsule**

---

### 2️⃣ Capsule 디렉터리 구조

```text
capsule/
 ├─ models/
 │   ├─ actions/
 │   │   └─ ControlDevice.model.bxb
 │   └─ concepts/
 ├─ resources/
 │   └─ base/
 │       └─ endpoints.bxb
 └─ code/
     └─ ControlDevice.js
```

#### 디렉터리 역할

| 경로              | 설명                      |
| ----------------- | ------------------------- |
| `models/actions`  | Bixby Action 정의         |
| `models/concepts` | 데이터 타입(Concept) 정의 |
| `resources/base`  | Endpoint, Hint 등 리소스  |
| `code`            | Action 실행 로직 (JS)     |

---

## 🧠 Step 2. Action Model 정의

### `ControlDevice.model.bxb`

```bxb
action (ControlDevice) {
  description (스마트 홈 기기를 제어하는 액션)
  type (Search)

  collect {
    input (utterance) {
      type (Utterance)
      min (Required)
      max (One)
    }
  }

  output (ControlResult)
}
```

### Concept 정의

```bxb
text (Utterance) {
  description (사용자의 제어 명령)
}

text (ControlResult) {
  description (제어 결과 메시지)
}
```

---

## 🌐 Step 3. Webhook Endpoint 설정

### `endpoints.bxb`

```bxb
endpoints {
  action-endpoints {
    action-endpoint (ControlDevice) {
      accepted-inputs (utterance)
      remote-endpoint ("https://YOUR_SERVER/api/bixby") {
        method (POST)
      }
    }
  }
}
```

### 동작 방식

- Action 실행 시
- HTTPS POST 요청을 Webhook으로 전송
- Webhook 서버는 **JARVIS Edge (Raspberry Pi / Server)**

---

## ⚙️ Step 4. Action 실행 코드

### `ControlDevice.js`

```js
module.exports = function ControlDevice(utterance) {
  return {
    Result: `명령 수신: ${utterance}`,
  };
};
```

- Bixby → Webhook으로 전달되는 데이터는 JSON 형태
- Edge 서버는 이 값을 기반으로:
  - MCP Context 구성
  - LLM 호출
  - 실제 디바이스 제어 수행

---

## 📡 Step 5. Webhook 수신 예시 (Edge)

### Request Payload 예시

```json
{
  "utterance": "거실 불 꺼줘"
}
```

➡️ 이후 처리 흐름은 Bixby 외부에서 진행됨

---

## 🧪 Bixby 개발자 모드 활성화 (On-device Testing)

실제 스마트폰에서 **Private Capsule 테스트**를 위해
Bixby 개발자 모드를 활성화해야 한다.

---

### 🔓 개발자 옵션 활성화 방법

1. **Bixby 앱 실행**
2. **설정 → Bixby 정보(About Bixby)** 이동
3. **Bixby 버전 번호를 5회 연속 터치**
4. “개발자 옵션이 활성화되었습니다” 메시지 확인

---

### 🧪 On-device Testing 활성화

1. Bixby 설정으로 돌아가기
2. 새로 생성된 **개발자 옵션(Developer Options)** 메뉴 진입
3. **On-device testing** 선택
4. 테스트 가능한 Bixby 디바이스 선택

> QR 코드 테스트는 지원 기기에서만 가능

---

## 🔁 전체 처리 흐름 요약

```text
[사용자 음성]
   ↓
[Bixby STT + 기본 파싱]
   ↓
[ControlDevice Action]
   ↓
[Webhook (Edge / MCP)]
   ↓
[LLM 판단]
   ↓
[디바이스 제어]
```
