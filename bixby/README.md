# 🎙️ Bixby Integration

본 문서는 **Bixby Capsule을 이용한 음성 입력 처리 및 Webhook 연동 과정**을 설명한다.  
Bixby는 음성 인식(STT)과 기본 파싱을 담당하며, 처리된 명령은 Edge(MCP Client)로 전달된다.

---

## 🧩 Step 1. Bixby Capsule 생성

### 1️⃣ Bixby Developer Console

- 👉 [https://bixbydevelopers.com](https://bixbydevelopers.com)
- **Capsule Type**: `Private Capsule`

  > 스마트홈 서비스는 Private Capsule 사용이 필수

---

### 2️⃣ Capsule 디렉터리 구조

```text
capsule/
 ├─ models/
 │   └─ actions/
 │       └─ ControlDevice.model.bxb
 ├─ resources/
 │   └─ base/
 │       └─ endpoints.bxb
 └─ code/
     └─ ControlDevice.js
```

- `models/` : Action 및 데이터 모델 정의
- `resources/` : Endpoint 및 설정 리소스
- `code/` : Action 실행 로직

---

## 🧠 Step 2. Action Model 정의

### `ControlDevice.model.bxb`

```bxb
action ControlDevice {
  description (Control smart home device)
  type (Search)
  input {
    name (commandText)
    type (Text)
  }
  output {
    name (result)
    type (Text)
  }
}
```

### 🔍 핵심 포인트

- `commandText`
  - Bixby가 **STT 및 기본 파싱을 완료한 자연어 텍스트**
  - 예: `"거실 불 꺼줘"`

---

## 🌐 Step 3. Webhook Endpoint 설정

### `endpoints.bxb`

```bxb
endpoint {
  action-endpoints {
    ControlDevice {
      uri ("https://YOUR_PI_OR_SERVER/api/bixby")
      method (POST)
    }
  }
}
```

- Action 실행 시 지정된 HTTPS Webhook으로 요청 전송
- Endpoint는 Edge(Raspberry Pi) 서버를 가리킴

---

## 🧪 Step 4. Capsule 실행 코드

### `ControlDevice.js`

```js
module.exports = function ControlDevice(commandText) {
  return {
    command: commandText,
  };
};
```

- Action 호출 시
  - 입력된 `commandText`를
  - JSON 형태로 Webhook에 전달

---

## 📡 Step 5. Webhook 수신 예시 (Edge)

### Request Payload

```json
{
  "command": "거실 불 꺼줘"
}
```

### 이후 처리 흐름

- MCP Context 추가
- Cloud LLM 호출
- Device Controller 연동

> 이 단계부터는 **JARVIS Edge / Cloud 영역에서 처리**
