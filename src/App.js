import logo from "./logo.svg";
import axios from "axios";

import "./App.css";

const API_URL =
  "https://cgyzpsvin6m6bbqnjc2574iknu0wzzev.lambda-url.eu-north-1.on.aws/";

function App() {
  const onUploadClick = async (e) => {
    let files = e.target.files;
    let split = files[0].name.split(".");
    let file_type = split[split.length - 1];
    console.log(file_type);

    let presigned = await getPresigned(file_type);
    console.log("presigned");
    console.log(presigned);

    const file = files[0];
    console.log("file");
    console.log(file);

    const formData = new FormData();

    Object.entries(presigned.fields).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append("file", file); // The file has be the last element
    console.log("formdata");

    const config = {
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(percentCompleted);
      },
    };

    const response = await axios.post(
      presigned.url,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
      config
    );

    console.log(response);
  };

  const getPresigned = async (file_type) => {
    const URL = API_URL + "?file=" + file_type;

    const { data, status } = await axios.get(URL);
    console.log("statusCode: ", status);
    console.log("Response body: ", data);

    return data;
  };

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" id="file" name="file" onChange={onUploadClick} />
      </header>
    </div>
  );
}

export default App;
