module.exports = function ControlDevice(utterance) {
  return {
    Result: `명령 수신: ${utterance}`
  };
};