
const InputJsonBuilder = ({handleJsonChange, jsonText, setJsonText, jsonError}) => {
  // const handleJsonChange = (e) => {
  //   const value = e.target.value;
  //   setJsonText(value);
  //   try {
  //     const parsed = JSON.parse(value);
  //     isUpdatingFromJson.current = true;
  //     setInputGroups(parsed);
  //     setJsonError(null);
  //   } catch (err) {
  //     setJsonError(err.message);
  //   }
  // };
    return(
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3>JSON Editor (inputGroups)</h3>
        <textarea
          value={jsonText}
          onChange={handleJsonChange}
          style={{
            flex: 1,
            width: '100%',
            minHeight: 0,
            fontFamily: 'monospace',
            fontSize: 14,
            border: jsonError ? '2px solid red' : '1px solid #ccc',
            borderRadius: 4,
            padding: 8
          }}
        />
        {jsonError && <div style={{ color: 'red', marginTop: 4 }}>Invalid JSON: {jsonError}</div>}
      </div>
    )

}

export default InputJsonBuilder
